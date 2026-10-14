/* Chord Colors app: state, tabs, ear training, practice tracking, key of the week and GitHub sync. */
(function () {
'use strict';
var C = window.CC, TYPES = C.TYPES, ORDER = C.ORDER, ROOTS = C.ROOTS, AU = C.audio, nm = C.nm;
var $ = function (id) { return document.getElementById(id); };
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function pad(n) { return (n < 10 ? '0' : '') + n; }
function clone(o) { return JSON.parse(JSON.stringify(o)); }

/* ---------- dates ---------- */
function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function parseDay(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function addDays(k, n) { var d = parseDay(k); d.setDate(d.getDate() + n); return dayKey(d); }
function daysBetween(a, b) { return Math.round((parseDay(b) - parseDay(a)) / 86400000); }
var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function fmtDay(k) { var d = parseDay(k); return MONTHS[d.getMonth()] + ' ' + d.getDate(); }

/* ---------- state ---------- */
var KEY = 'chordColors.app.v1';
var DEFAULT = {
  v:1, u:0,
  root:0, rootWeek:-1, autoRoot:true,
  tab:'library', view:'all',
  sound:'rhodes', guitarSound:'eguitar', bassSound:'bass', volume:0.8, goal:45,
  checks:{},
  ear:{mode:'colors', pool:[1,2], qroot:'any', qsound:'block', levels:{numbers:1, home:1, key:1, intervals:1}},
  stats:{colors:{}, numbers:{}, home:{}, key:{}, intervals:{}},
  recent:{colors:[], numbers:[], home:[], key:[], intervals:[]},
  diff:{colors:0, numbers:0, home:0, key:0, intervals:0},
  log:{},
  weeks:{start:'2026-10-12', stays:[], skips:[], u:0, notes:{}},
  ab:{a:'maj7', b:'dom7'}, keyRow:'7', keyMode:'major',
  progSel:'0', customProg:[], progView:'all',
  sync:{token:'', gist:'', last:0, err:''}
};
function fill(def, val) {
  if (val === undefined || val === null) return clone(def);
  if (Array.isArray(def)) return Array.isArray(val) ? val : clone(def);
  if (typeof def === 'object') {
    var out = {}, k;
    if (typeof val !== 'object') return clone(def);
    for (k in val) out[k] = val[k];
    for (k in def) out[k] = fill(def[k], val[k]);
    return out;
  }
  return typeof val === typeof def ? val : def;
}
var S;
try { S = fill(DEFAULT, JSON.parse(localStorage.getItem(KEY) || 'null')); } catch (e) { S = clone(DEFAULT); }
if (!(S.root >= 0 && S.root < 12)) S.root = 0;
var DEVICE;
try { DEVICE = localStorage.getItem('chordColors.device'); if (!DEVICE) { DEVICE = 'd' + Math.random().toString(36).slice(2, 9); localStorage.setItem('chordColors.device', DEVICE); } } catch (e) { DEVICE = 'd0'; }
applySound();

function saveLocal() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function save(kind) {
  if (kind === 'settings') S.u = Date.now();
  saveLocal();
  if (S.sync.token && S.sync.gist) schedulePush(kind === 'soft' ? 60000 : 4000);
}

function applySound() {
  AU.setVolume(S.volume); AU.setSound(S.sound); AU.setGuitar(S.guitarSound); AU.setBass(S.bassSound);
  AU.preload([S.sound, S.guitarSound, S.bassSound]).then(function () { if (S.tab === 'settings') renderSettings(); });
}
function testSound(which) {
  var g = AU.newBus(); if (!g) return;
  var pc = ROOTS[S.root].pc, t = AU.now();
  if (which === 'guitar') AU.strum(g, C.voicingMidis(C.lowestVoicing('maj9', pc).frets), t);
  else if (which === 'bass') C.bassArp('min7', pc).forEach(function (m, i) { AU.bassNote(g, m, t + i * 0.3); });
  else AU.arp(g, C.pianoMidis('maj9', pc), t);
}

/* ---------- toast ---------- */
var toastT = 0;
function toast(msg) { var el = $('toast'); el.textContent = msg; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2800); }

/* ---------- key of the week ---------- */
function weekInfo() {
  var today = dayKey(), d = daysBetween(S.weeks.start, today);
  var raw = Math.max(0, Math.floor(d / 7));
  var idx = raw - S.weeks.stays.filter(function (x) { return x < raw; }).length + S.weeks.skips.filter(function (x) { return x <= raw; }).length;
  idx = Math.max(0, idx);
  var startK = addDays(S.weeks.start, raw * 7);
  var daysIn = Math.max(0, daysBetween(startK, today));
  return {idx:idx, raw:raw, keyIdx:C.FIFTHS[idx % 12], round:Math.floor(idx / 12) + 1, start:startK, end:addDays(startK, 6), daysLeft:Math.max(1, 7 - daysIn), before:d < 0};
}
function applyWeekRoot() {
  var w = weekInfo();
  if (S.autoRoot && S.rootWeek !== w.idx) { S.root = w.keyIdx; S.rootWeek = w.idx; saveLocal(); }
}

/* ---------- practice log ---------- */
var INSTR = [['guitar','Guitar','--c-dom7'],['bass','Bass','--c-min7'],['piano','Piano','--c-maj'],['drums','Drums','--c-min'],['voice','Voice','--c-maj7'],['ear','Ear (other)','--c-maj9']];
function dayEntry(k, create) {
  var e = S.log[k];
  if (!e && create) { e = S.log[k] = {m:{}, u:0, app:{}}; }
  if (e) { e.m = e.m || {}; e.app = e.app || {}; }
  return e;
}
function appMinutes(e) { var s = 0; if (e && e.app) for (var d in e.app) s += e.app[d] || 0; return Math.round(s / 60); }
function dayTotal(k) {
  var e = S.log[k]; if (!e) return 0;
  var t = 0; for (var i in e.m) t += e.m[i] || 0;
  return t + appMinutes(e);
}
var STREAK_MIN = 10;
function streaks() {
  var today = dayKey(), cur = 0, k = dayTotal(today) >= STREAK_MIN ? today : addDays(today, -1);
  while (dayTotal(k) >= STREAK_MIN) { cur++; k = addDays(k, -1); }
  var days = Object.keys(S.log).filter(function (d) { return dayTotal(d) >= STREAK_MIN; }).sort(), best = 0, run = 0, prev = null;
  days.forEach(function (d) { run = prev && daysBetween(prev, d) === 1 ? run + 1 : 1; if (run > best) best = run; prev = d; });
  return {cur:cur, best:Math.max(best, cur)};
}
var lastInteract = 0, tickAt = Date.now();
['pointerdown','keydown'].forEach(function (ev) { document.addEventListener(ev, function () { lastInteract = Date.now(); }, true); });
setInterval(function () {
  var nowT = Date.now(), dt = Math.min(15, Math.round((nowT - tickAt) / 1000)); tickAt = nowT;
  if (S.tab === 'ear' && document.visibilityState === 'visible' && nowT - lastInteract < 90000) {
    var e = dayEntry(dayKey(), true); e.app[DEVICE] = (e.app[DEVICE] || 0) + dt;
    save('soft');
  }
}, 5000);

/* ---------- sync (private GitHub gist) ---------- */
var SYNC_FILE = 'chord-colors-sync.json', pushT = 0, syncing = false, dirty = false, lastPull = 0;
function newer(a, b) { return (b && (b.u || 0) > ((a && a.u) || 0)) ? b : a; }
function mergeState(local, remote) {
  var out = clone(local);
  if (!remote || typeof remote !== 'object') return out;
  if ((remote.u || 0) > (local.u || 0)) {
    ['root','rootWeek','autoRoot','view','sound','guitarSound','bassSound','volume','goal','ab','keyRow','keyMode','progSel','customProg','progView'].forEach(function (k) { if (remote[k] !== undefined) out[k] = clone(remote[k]); });
    if (remote.ear) out.ear = fill(DEFAULT.ear, clone(remote.ear));
    out.u = remote.u;
  }
  var rc = remote.checks || {}; Object.keys(rc).forEach(function (id) { out.checks[id] = clone(newer(out.checks[id], rc[id])); });
  var rs = remote.stats || {};
  Object.keys(rs).forEach(function (mode) {
    out.stats[mode] = out.stats[mode] || {};
    Object.keys(rs[mode] || {}).forEach(function (item) { var a = out.stats[mode][item], b = rs[mode][item]; if (!a || (b && b.t > a.t)) out.stats[mode][item] = clone(b); });
  });
  var rd = remote.diff || {}; Object.keys(rd).forEach(function (m) { out.diff[m] = Math.max(out.diff[m] || 0, rd[m] || 0); });
  var rl = remote.log || {};
  Object.keys(rl).forEach(function (day) {
    var a = out.log[day], b = rl[day]; if (!b) return;
    if (!a) { out.log[day] = clone(b); return; }
    var m = (b.u || 0) > (a.u || 0) ? clone(b.m || {}) : a.m;
    var app = clone(a.app || {}); Object.keys(b.app || {}).forEach(function (dv) { app[dv] = Math.max(app[dv] || 0, b.app[dv] || 0); });
    out.log[day] = {m:m, u:Math.max(a.u || 0, b.u || 0), app:app};
  });
  var rw = remote.weeks;
  if (rw) {
    if ((rw.u || 0) > (out.weeks.u || 0)) { out.weeks.start = rw.start; out.weeks.stays = clone(rw.stays || []); out.weeks.skips = clone(rw.skips || []); out.weeks.u = rw.u; }
    Object.keys(rw.notes || {}).forEach(function (i) { out.weeks.notes[i] = clone(newer(out.weeks.notes[i], rw.notes[i])); });
  }
  return out;
}
function payload() { var o = clone(S); delete o.sync; delete o.tab; delete o.recent; o.savedAt = Date.now(); return JSON.stringify(o); }
function gh(path, opts) {
  opts = opts || {};
  var h = {'Authorization':'Bearer ' + S.sync.token, 'Accept':'application/vnd.github+json'};
  if (opts.body) h['Content-Type'] = 'application/json';
  var ctl = window.AbortController ? new AbortController() : null, to = ctl ? setTimeout(function () { ctl.abort(); }, 15000) : 0;
  return fetch('https://api.github.com' + path, {method:opts.method || 'GET', headers:h, body:opts.body ? JSON.stringify(opts.body) : undefined, cache:'no-store', keepalive:!!opts.keepalive, signal:ctl ? ctl.signal : undefined})
    .then(function (r) { clearTimeout(to); if (!r.ok) { var e = new Error('HTTP ' + r.status); e.status = r.status; throw e; } return r.json(); },
          function (err) { clearTimeout(to); throw err; });
}
function syncError(e) {
  S.sync.err = e && e.status === 401 ? 'GitHub turned down the token. Make a new one with the gist box ticked and paste it again.'
    : e && e.status === 404 ? 'The sync file is gone. Tap Connect to make a new one.'
    : navigator.onLine === false ? 'Offline. Your progress will sync when you are back online.'
    : 'Sync did not go through. It will try again soon.';
  saveLocal(); renderSync();
}
function applyRemote(content) {
  var remote; try { remote = JSON.parse(content); } catch (e) { return; }
  var keep = {sync:S.sync, tab:S.tab, recent:S.recent};
  var merged = mergeState(S, remote);
  S = fill(DEFAULT, merged); S.sync = keep.sync; S.tab = keep.tab; S.recent = keep.recent;
  applySound();
  saveLocal();
}
function syncPull() {
  if (!S.sync.token || !S.sync.gist || syncing) return Promise.resolve();
  syncing = true; lastPull = Date.now();
  return gh('/gists/' + S.sync.gist).then(function (g) {
    var f = g.files && g.files[SYNC_FILE];
    if (!f) { var e = new Error('missing'); e.status = 404; throw e; }
    var before = payloadCore();
    applyRemote(f.content);
    syncing = false;
    if (payloadCore() !== f.content.replace(/"savedAt":\d+,?/, '')) dirty = true;
    S.sync.err = ''; S.sync.last = Date.now(); saveLocal();
    if (before !== payloadCore()) renderAll();
    renderSync();
    if (dirty) return syncPush();
  }).catch(function (e) { syncing = false; syncError(e); });
}
function payloadCore() { return payload().replace(/"savedAt":\d+,?/, ''); }
function syncPush(keepalive) {
  if (!S.sync.token || !S.sync.gist) return Promise.resolve();
  if (syncing && !keepalive) { dirty = true; return Promise.resolve(); }
  syncing = true; dirty = false;
  var body = {files:{}}; body.files[SYNC_FILE] = {content:payload()};
  return gh('/gists/' + S.sync.gist, {method:'PATCH', body:body, keepalive:keepalive}).then(function () {
    syncing = false; S.sync.err = ''; S.sync.last = Date.now(); saveLocal(); renderSync();
    if (dirty) schedulePush(4000);
  }).catch(function (e) { syncing = false; dirty = true; syncError(e); });
}
function schedulePush(ms) {
  dirty = true; clearTimeout(pushT);
  pushT = setTimeout(function () { syncPush(); }, ms);
}
function syncConnect(token) {
  S.sync.token = token.trim(); S.sync.err = ''; saveLocal();
  $('sync-msg').textContent = 'Connecting…';
  return gh('/gists?per_page=100').then(function (list) {
    var found = (list || []).filter(function (g) { return g.files && g.files[SYNC_FILE]; })[0];
    if (found) { S.sync.gist = found.id; saveLocal(); return syncPull().then(function () { toast('Synced. Your progress from the other device is here.'); }); }
    var body = {description:'Chord Colors sync', public:false, files:{}}; body.files[SYNC_FILE] = {content:payload()};
    return gh('/gists', {method:'POST', body:body}).then(function (g) { S.sync.gist = g.id; S.sync.last = Date.now(); saveLocal(); renderSync(); toast('Sync is on. Paste the same token on your other device.'); });
  }).catch(function (e) { syncError(e); });
}
document.addEventListener('visibilitychange', function () {
  if (!S.sync.token || !S.sync.gist) return;
  if (document.visibilityState === 'hidden') { if (dirty) { clearTimeout(pushT); syncPush(true); } }
  else if (Date.now() - lastPull > 30000) syncPull();
});
window.addEventListener('online', function () { if (S.sync.token && S.sync.gist) syncPull(); });

/* ---------- rendering: shell ---------- */
var TABS = ['library','ear','key','practice','settings'];
function setTab(t, push) {
  if (TABS.indexOf(t) < 0) t = 'library';
  if (S.tab !== t) AU.stopAll(clearPlaying);
  S.tab = t; saveLocal();
  document.body.setAttribute('data-tab', t);
  TABS.forEach(function (x) { $('p-' + x).hidden = x !== t; var b = $('tab-' + x); b.setAttribute('aria-selected', String(x === t)); b.tabIndex = x === t ? 0 : -1; });
  if (t === 'practice') renderPractice();
  if (t === 'key') renderKey();
  if (push) { try { history.replaceState(null, '', '#' + t); } catch (e) {} window.scrollTo(0, 0); }
}
function renderRoots() {
  var w = weekInfo();
  $('roots').innerHTML = ROOTS.map(function (r, i) { return '<button type="button" data-root="' + i + '" aria-pressed="' + (i === S.root) + '">' + nm(r) + '</button>'; }).join('');
  $('root-hint').textContent = S.root === w.keyIdx ? 'Set to your key of the week, ' + nm(ROOTS[w.keyIdx]) + ' major.' : 'Your key of the week is ' + nm(ROOTS[w.keyIdx]) + '. Tap it to switch back.';
}
function renderPalette() {
  var r = ROOTS[S.root];
  $('palette').innerHTML = ORDER.map(function (id) { return '<button type="button" class="chip" data-palette="' + id + '" style="--chord:var(--c-' + id + ')" aria-label="Play ' + esc(C.chordName(id, r)) + '"><span class="dot"></span>' + esc(C.chordName(id, r)) + '</button>'; }).join('');
}
function clearPlaying() {
  document.querySelectorAll('.card.playing').forEach(function (c) { c.classList.remove('playing'); });
  document.querySelectorAll('.cell.now').forEach(function (c) { c.classList.remove('now'); });
  document.querySelectorAll('.pcard.playing').forEach(function (c) { c.classList.remove('playing'); });
}
function markCard(id, ms) {
  var el = $('card-' + id); if (!el) return;
  el.classList.add('playing'); AU.later(function () { el.classList.remove('playing'); }, ms || 2200);
}

/* ---------- library ---------- */
var LEVELS = [
  {n:1, title:'Level 1: Triads', desc:'Three notes. Learn to hear bright vs dark before anything else.'},
  {n:2, title:'Level 2: Sevenths', desc:'A fourth note gives the chord attitude. These three cover most of R&B.'},
  {n:3, title:'Level 3: Neo soul colors', desc:'Extensions and suspensions. The lush stuff all over neo soul and alt R&B.'}
];
var CHECKS = [['piano','piano'],['guitar','guitar'],['bass','bass'],['ear','hear it']];
function chk(id, k) { return !!(S.checks[id] && S.checks[id][k]); }
function cardHTML(id) {
  var T = TYPES[id], r = ROOTS[S.root], cn = C.chordName(id, r), v = S.view;
  var notes = T.formula.map(function (l) { return nm(C.up(r, l)); }).join(' ');
  var h = '<article class="card" id="card-' + id + '" data-id="' + id + '" style="--chord:var(--c-' + id + ')">' +
    '<div class="card-head"><span class="dot"></span><div style="min-width:0"><h3 class="sym">' + esc(cn) + '</h3><p class="tname">' + T.name + '</p></div>' +
    '<div class="formula" aria-label="Formula">' + T.formula.map(function (l) { return '<span>' + C.fmt(l) + '</span>'; }).join('') + '</div></div>' +
    '<p class="sounds">' + T.sounds + '</p>' +
    '<dl class="facts"><div><dt>Notes</dt><dd class="notes">' + notes + '</dd></div><div><dt>Listen for</dt><dd>' + T.listen + '</dd></div>' +
    '<div><dt>Where it lives</dt><dd>' + T.lives + '</dd></div><div><dt>Shortcut</dt><dd>' + esc(T.tip(r)) + '</dd></div></dl>';
  if (v === 'all' || v === 'piano') h += '<div class="inst"><span class="eyebrow">Piano</span><button type="button" class="dia" data-act="piano" aria-label="Play ' + esc(cn) + ' on piano">' + C.svg.piano(id, r.pc) + '<small>Left hand gray, right hand color</small></button></div>';
  if (v === 'all' || v === 'guitar') {
    h += '<div class="inst"><span class="eyebrow">Guitar</span><div class="gtr-row">' + C.guitarVoicings(id, r.pc).map(function (g) {
      return '<button type="button" class="dia" data-act="strum" data-v="' + g.key + '" aria-label="Strum ' + esc(cn) + ', ' + g.label + '">' + C.svg.guitar(id, r.pc, g.frets) + '<small>' + g.label + '</small></button>';
    }).join('') + '</div></div>';
  }
  if (v === 'all' || v === 'bass') {
    var b = C.bassBox(id, r.pc);
    h += '<div class="inst"><span class="eyebrow">Bass</span><button type="button" class="dia bass-dia" data-act="bass" aria-label="Play ' + esc(cn) + ' arpeggio on bass">' + C.svg.bass(id, r.pc) + '<small>Chord tones near the ' + (b.rs === 0 ? 'E string' : 'A string') + ' root at fret ' + b.rf + '. Outlined dot is where to start.</small></button></div>';
  }
  h += '<div class="actions"><button type="button" class="btn primary" data-act="piano">Play</button><button type="button" class="btn" data-act="arp">Arpeggio</button><button type="button" class="btn" data-act="strum">Strum</button><button type="button" class="btn" data-act="bass">Bass line</button></div>' +
    '<div class="checks"><span>I can</span>' + CHECKS.map(function (c) { return '<button type="button" class="chk" data-chk="' + c[0] + '" aria-pressed="' + chk(id, c[0]) + '">' + (c[0] === 'ear' ? '' : 'play it on ') + c[1] + '</button>'; }).join('') + '</div></article>';
  return h;
}
function levelProgress(n) {
  var ids = ORDER.filter(function (id) { return TYPES[id].level === n; }), done = 0;
  ids.forEach(function (id) { CHECKS.forEach(function (c) { if (chk(id, c[0])) done++; }); });
  return {done:done, total:ids.length * CHECKS.length};
}
function meterHTML(p) { return '<b><i style="width:' + (100 * p.done / p.total) + '%"></i></b>' + p.done + ' of ' + p.total + ' checked'; }
function renderLibrary() {
  $('view').innerHTML = [['all','All'],['piano','Piano'],['guitar','Guitar'],['bass','Bass']].map(function (o) { return '<button type="button" data-view="' + o[0] + '" aria-pressed="' + (S.view === o[0]) + '">' + o[1] + '</button>'; }).join('');
  $('levels').innerHTML = LEVELS.map(function (L) {
    var ids = ORDER.filter(function (id) { return TYPES[id].level === L.n; });
    return '<section class="level" id="level-' + L.n + '"><div class="level-head"><div><h2>' + L.title + '</h2><p>' + L.desc + '</p></div>' +
      '<div class="level-meta"><span class="meter" data-meter="' + L.n + '">' + meterHTML(levelProgress(L.n)) + '</span>' +
      '<button type="button" class="btn" data-playlevel="' + L.n + '">Hear the whole level</button></div></div>' +
      '<div class="grid">' + ids.map(cardHTML).join('') + '</div></section>';
  }).join('');
}
function updateMeters() { LEVELS.forEach(function (L) { var el = document.querySelector('[data-meter="' + L.n + '"]'); if (el) el.innerHTML = meterHTML(levelProgress(L.n)); }); }
function playCard(id, act, v) {
  var pc = ROOTS[S.root].pc, g = AU.newBus(clearPlaying); if (!g) return;
  var t = AU.now();
  if (act === 'piano') AU.block(g, C.pianoMidis(id, pc), t);
  else if (act === 'arp') AU.arp(g, C.pianoMidis(id, pc), t);
  else if (act === 'strum') {
    var vs = C.guitarVoicings(id, pc), voi = v ? vs.filter(function (x) { return x.key === v; })[0] : C.lowestVoicing(id, pc);
    AU.strum(g, C.voicingMidis(voi.frets), t);
  } else if (act === 'bass') C.bassArp(id, pc).forEach(function (m, i) { AU.bassNote(g, m, t + i * 0.32); });
  markCard(id, act === 'bass' ? 1800 : 2200);
}
function playLevel(n) {
  var ids = ORDER.filter(function (id) { return TYPES[id].level === n; }), g = AU.newBus(clearPlaying); if (!g) return;
  var t = AU.now(), pc = ROOTS[S.root].pc, step = 1.9;
  ids.forEach(function (id, i) { AU.block(g, C.pianoMidis(id, pc), t + i * step, 1.8);
    AU.later(function () { clearPlaying(); var el = $('card-' + id); if (el) el.classList.add('playing'); }, i * step * 1000); });
  AU.later(clearPlaying, ids.length * step * 1000);
}

/* ---------- ear training ---------- */
var TIER = ['Easy','Medium','Hard'];
var INTERVALS = {1:['m2','Minor 2nd'],2:['M2','Major 2nd'],3:['m3','Minor 3rd'],4:['M3','Major 3rd'],5:['P4','Perfect 4th'],6:['TT','Tritone'],7:['P5','Perfect 5th'],8:['m6','Minor 6th'],9:['M6','Major 6th'],10:['m7','Minor 7th'],11:['M7','Major 7th'],12:['P8','Octave']};
var INT_HINT = {1:'That is the rub inside a maj7 chord, from the 7 up to the root.',2:'Root up to the 9th.',3:'Root up to the 3rd of a minor chord.',4:'Root up to the 3rd of a major chord.',5:'Root up to the 4th. The sus sound.',6:'Root up to the flat 5 of a half diminished chord.',7:'Root up to the 5th of almost any chord.',8:'Root up to the flat 6.',9:'Root up to the 13th, the sweet top of a 13 chord.',10:'Root up to the flat 7 of m7 and 7 chords.',11:'Root up to the 7 of a maj7 chord.',12:'Root to root.'};
var DEG_SEMI = {'1':0,'2':2,'3':4,'4':5,'5':7,'6':9,'7':11,'b3':3,'b6':8,'b7':10};
var DEG_COLOR = {'1':'maj7','2':'min7','3':'min9','4':'maj9','5':'dom7','6':'min','7':'m7b5','b3':'dom9','b6':'dom13','b7':'sus9'};
var KEY_ITEMS = {major:'Major key', minor:'Minor key', none:'No change', half:'Up a half step', whole:'Up a whole step', rel:'Relative major or minor'};
var MAJOR_PROGS = [[1,4,5,1],[1,6,4,5,1],[1,5,6,4,1],[1,4,1,5,1],[1,2,5,1],[1,6,2,5,1]];
var MINOR_PROGS = [['1','4','5','1'],['1','b6','b7','1'],['1','b6','b3','b7','1'],['1','2','5','1'],['1','b7','b6','5','1'],['1','4','b7','b3','1']];
var Q = null, sess = {};
function S_level(m) { return S.ear.levels[m] || 1; }
function tier(m) { return S.diff[m] || 0; }
function sessOf(m) { return sess[m] || (sess[m] = {r:0, t:0, streak:0, best:0}); }
function keyChord(keyPc, deg, mode, t) {
  if (mode === 'minor') { var mi = C.MINOR[deg]; return {pc:(keyPc + mi.s) % 12, type:mi.t[t ? 1 : 0], deg:deg}; }
  var i = +deg - 1; return {pc:(keyPc + C.MAJ[i]) % 12, type:(t ? C.DIATONIC.seventh : C.DIATONIC.triad)[i], deg:deg};
}
function record(m, item, ok) {
  var st = S.stats[m][item] || {r:0, t:0}; st.t++; if (ok) st.r++; S.stats[m][item] = st;
}
function finish(m, ok) {
  var s = sessOf(m); s.t++; if (ok) { s.r++; s.streak++; if (s.streak > s.best) s.best = s.streak; } else s.streak = 0;
  var rec = S.recent[m] = (S.recent[m] || []).concat([ok ? 1 : 0]).slice(-30);
  var acc = rec.reduce(function (a, b) { return a + b; }, 0) / rec.length;
  if (rec.length >= 20 && acc >= 0.85 && tier(m) < 2) { S.diff[m] = tier(m) + 1; S.recent[m] = []; toast('Nice. ' + MODES[m].title + ' just moved up to ' + TIER[S.diff[m]] + '.'); }
  else if (rec.length >= 10 && acc < 0.5 && tier(m) > 0) { S.diff[m] = tier(m) - 1; S.recent[m] = []; toast(MODES[m].title + ' eased back to ' + TIER[S.diff[m]] + '. You will level up again.'); }
  save();
}

var MODES = {
 colors:{
  title:'Chord colors', short:'Colors',
  desc:function () { return 'A chord plays. Name its color.'; },
  tiers:['Same voicing as the cards','New inversions and octaves','Spread voicings and other bass notes'],
  opts:function () {
    return '<div class="opt-row"><span class="eyebrow">Levels</span><div class="seg">' + [1,2,3].map(function (n) { return '<button type="button" data-pool="' + n + '" aria-pressed="' + (S.ear.pool.indexOf(n) >= 0) + '">Level ' + n + '</button>'; }).join('') + '</div></div>' +
      '<div class="opt-row"><span class="eyebrow">Root</span><div class="seg">' + [['any','Any root'],['key','My root only']].map(function (o) { return '<button type="button" data-qroot="' + o[0] + '" aria-pressed="' + (S.ear.qroot === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="opt-row"><span class="eyebrow">Sound</span><div class="seg">' + [['block','Keys'],['arp','Arpeggio'],['strum','Guitar']].map(function (o) { return '<button type="button" data-qsound="' + o[0] + '" aria-pressed="' + (S.ear.qsound === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div></div>';
  },
  pool:function () { return ORDER.filter(function (id) { return S.ear.pool.indexOf(TYPES[id].level) >= 0; }); },
  newQ:function () {
    var pool = this.pool(), type, tries = 0;
    do { type = C.pick(pool); tries++; } while (Q && Q.mode === 'colors' && type === Q.type && tries < 4);
    var pc = S.ear.qroot === 'key' ? ROOTS[S.root].pc : C.rnd(12), tr = tier('colors');
    var vs = C.guitarVoicings(type, pc);
    return {type:type, pc:pc, midis:C.variedVoicing(type, pc, tr), frets:(tr ? C.pick(vs) : C.lowestVoicing(type, pc)).frets};
  },
  play:function (g, t, how) {
    var m = how || S.ear.qsound;
    if (m === 'strum') AU.strum(g, C.voicingMidis(Q.frets), t);
    else if (m === 'arp') AU.arp(g, Q.midis, t);
    else AU.block(g, Q.midis, t);
  },
  answers:function () {
    return '<div class="answers">' + this.pool().map(function (id) {
      var cls = Q && Q.done ? (id === Q.type ? ' right' : id === Q.pick ? ' wrong' : ' dim') : '';
      return '<button type="button" class="ans' + cls + '" data-ans="' + id + '" style="--chord:var(--c-' + id + ')"' + (!Q || Q.done ? ' disabled' : '') + '><span class="dot"></span><span class="t"><b>' + TYPES[id].name + '</b><small>' + (id === 'maj' ? 'triad' : TYPES[id].sym) + '</small></span></button>';
    }).join('') + '</div>';
  },
  answer:function (id) { Q.pick = id; var ok = id === Q.type; record('colors', Q.type, ok); Q.ok = ok; return true; },
  feedback:function () {
    var r = ROOTS[Q.pc], ans = C.chordName(Q.type, r);
    if (Q.ok) return '<span><b>Yes.</b> That was ' + esc(ans) + '. ' + esc(TYPES[Q.type].listen) + '</span>';
    return '<span>That was <b>' + esc(ans) + '</b>. You picked ' + esc(C.chordName(Q.pick, r)) + '. Flip between them and listen for the difference.</span>' +
      '<div class="row"><button type="button" class="btn" data-q="yours">Hear yours</button><button type="button" class="btn" data-q="answer">Hear the answer</button></div>';
  },
  statItems:function () { return ORDER.map(function (id) { return {key:id, label:C.shortSym(id), color:id}; }); }
 },
 numbers:{
  title:'Name the numbers', short:'Numbers',
  desc:function () { return 'You hear the key first, then four chords. Tap the number of each chord in order.'; },
  tiers:['Triads in your key, starting on the 1','7th chords in any key','Any key, any starting chord, moving voicings'],
  levels:['Level 1: 1, 4, 5','Level 2: adds 2 and 6','Level 3: all seven'],
  pool:function () { return [[1,4,5],[1,2,4,5,6],[1,2,3,4,5,6,7]][S_level('numbers') - 1]; },
  newQ:function () {
    var pool = this.pool(), tr = tier('numbers'), keyPc = tr ? C.rnd(12) : ROOTS[S.root].pc, seq = [], prev = null;
    for (var i = 0; i < 4; i++) {
      var opts = pool.filter(function (d) { return d !== prev; });
      var d = i === 0 && tr < 2 ? 1 : C.pick(opts); seq.push(d); prev = d;
    }
    var chords = seq.map(function (d) { return keyChord(keyPc, String(d), 'major', tr); });
    var cad = [1,4,5,1].map(function (d) { return keyChord(keyPc, String(d), 'major', 0); });
    return {keyPc:keyPc, seq:seq, chords:chords, voiced:C.voiceLead(chords, {random:tr >= 2}), cad:C.voiceLead(cad), input:[]};
  },
  play:function (g, t, how) {
    var off = 0;
    if (how !== 'prog') { Q.cad.forEach(function (v, i) { AU.block(g, v, t + i * 0.5, 0.6, 0.004); }); off = 2.6; }
    if (how === 'key') return;
    Q.voiced.forEach(function (v, i) { AU.block(g, v, t + off + i * 1.15, 1.2, 0.006); });
  },
  answers:function () {
    var pool = this.pool(), h = '<div class="slots">';
    for (var i = 0; i < 4; i++) {
      var v = Q ? Q.input[i] : undefined, cls = '';
      if (Q && Q.done) cls = Q.input[i] === Q.seq[i] ? ' ok' : ' no';
      else if (Q && i === Q.input.length) cls = ' cur';
      h += '<div class="slot' + cls + '"><span>' + (v === undefined ? (Q && Q.done ? '' : '?') : v) + (Q && Q.done && Q.input[i] !== Q.seq[i] ? '<small>it was ' + Q.seq[i] + '</small>' : '') + '</span></div>';
    }
    h += '</div><div class="answers nums">';
    for (var d = 1; d <= 7; d++) h += '<button type="button" class="ans center" data-num="' + d + '"' + (!Q || Q.done || pool.indexOf(d) < 0 ? ' disabled' : '') + (pool.indexOf(d) < 0 ? ' style="opacity:.3"' : '') + '>' + d + '</button>';
    h += '<button type="button" class="ans center" data-num="undo" style="font-size:15px"' + (!Q || Q.done || !Q.input.length ? ' disabled' : '') + '>Undo</button></div>';
    return h;
  },
  answer:function (v) {
    if (v === 'undo') { Q.input.pop(); return false; }
    Q.input.push(+v);
    if (Q.input.length < 4) return false;
    var ok = true;
    Q.seq.forEach(function (d, i) { var hit = Q.input[i] === d; record('numbers', String(d), hit); if (!hit) ok = false; });
    Q.ok = ok; return true;
  },
  feedback:function () {
    var names = Q.chords.map(function (c) { return C.chordName(c.type, nameFor(Q.keyPc, c)); });
    return '<span>' + (Q.ok ? '<b>Nailed it.</b> ' : '') + 'In ' + esc(nm(keyRootObj(Q.keyPc))) + ' major that was ' + Q.seq.join(' ') + ': ' + esc(names.join(', ')) + '.</span>' +
      '<div class="row"><button type="button" class="btn" data-q="prog">Hear it again</button></div>';
  },
  statItems:function () { return [1,2,3,4,5,6,7].map(function (d) { return {key:String(d), label:'The ' + d, color:DEG_COLOR[d]}; }); }
 },
 home:{
  title:'Find home', short:'Home',
  desc:function () { return 'Home plays and keeps humming underneath. Then a bass note plays. Name its number.'; },
  tiers:['Your key','Any key','Any key, any octave'],
  levels:['Level 1: 1, 4, 5','Level 2: all seven','Level 3: adds ♭3, ♭6, ♭7'],
  pool:function () { return [['1','4','5'],['1','2','3','4','5','6','7'],['1','2','3','4','5','6','7','b3','b6','b7']][S_level('home') - 1]; },
  newQ:function () {
    var tr = tier('home'), keyPc = tr ? C.rnd(12) : ROOTS[S.root].pc, pool = this.pool(), deg, tries = 0;
    do { deg = C.pick(pool); tries++; } while (Q && Q.mode === 'home' && deg === Q.deg && tries < 4);
    var kb = 28 + ((keyPc - 4) % 12 + 12) % 12, note = kb + DEG_SEMI[deg];
    if (tr >= 2 && note + 12 <= 52 && Math.random() < 0.5) note += 12;
    return {keyPc:keyPc, deg:deg, kb:kb, note:note, tonic:C.voiceLead([{pc:keyPc, type:'maj'}])[0]};
  },
  play:function (g, t, how) {
    AU.block(g, Q.tonic, t, 1.6, 0.006);
    AU.drone(g, Q.kb + 12, t, how === 'home' ? 2.2 : 4.4);
    if (how !== 'home') AU.bassNote(g, Q.note, t + 1.4, 1, 2.6);
  },
  answers:function () {
    return '<div class="answers nums">' + this.pool().map(function (d) {
      var cls = Q && Q.done ? (d === Q.deg ? ' right' : d === Q.pick ? ' wrong' : ' dim') : '';
      return '<button type="button" class="ans center' + cls + '" data-ans="' + d + '"' + (!Q || Q.done ? ' disabled' : '') + '>' + C.fmt(d) + '</button>';
    }).join('') + '</div>';
  },
  answer:function (d) { Q.pick = d; Q.ok = d === Q.deg; record('home', Q.deg, Q.ok); return true; },
  feedback:function () {
    var key = keyRootObj(Q.keyPc), noteName = nm(degNote(key, Q.deg));
    return '<span>' + (Q.ok ? '<b>Yes.</b> ' : '') + 'That was the ' + C.fmt(Q.deg) + '. In ' + esc(nm(key)) + ' that is ' + esc(noteName) + '.' + (Q.ok ? '' : ' You said ' + C.fmt(Q.pick) + '.') + '</span>' +
      '<div class="row"><button type="button" class="btn" data-q="again">Hear it with home again</button><button type="button" class="btn" data-q="home">Just home</button></div>';
  },
  statItems:function () { return ['1','2','3','4','5','6','7','b3','b6','b7'].map(function (d) { return {key:d, label:'The ' + C.fmt(d), color:DEG_COLOR[d]}; }); }
 },
 key:{
  title:'Major or minor', short:'Key',
  desc:function () { return S_level('key') === 1 ? 'A short progression plays. Is the key major or minor?' : 'Two phrases play. Did the key change, and how?'; },
  tiers:['Triads in your key','7th chords in any key','Moving voicings in any key'],
  levels:['Level 1: major or minor','Level 2: key changes','Level 3: key changes, mixed'],
  phrase:function (keyPc, mode, tr) {
    var prog = C.pick(mode === 'minor' ? MINOR_PROGS : MAJOR_PROGS);
    return C.voiceLead(prog.map(function (d) { return keyChord(keyPc, String(d), mode, tr); }), {random:tr >= 2});
  },
  newQ:function () {
    var lv = S_level('key'), tr = tier('key'), keyPc = tr ? C.rnd(12) : ROOTS[S.root].pc;
    if (lv === 1) { var mode = Math.random() < 0.5 ? 'major' : 'minor'; return {lv:1, item:mode, keyPc:keyPc, a:this.phrase(keyPc, mode, tr)}; }
    var modeA = lv === 3 && Math.random() < 0.5 ? 'minor' : 'major', ch = C.pick(['none','half','whole','rel']);
    var keyB = keyPc, modeB = modeA;
    if (ch === 'half') keyB = (keyPc + 1) % 12;
    if (ch === 'whole') keyB = (keyPc + 2) % 12;
    if (ch === 'rel') { modeB = modeA === 'major' ? 'minor' : 'major'; keyB = modeA === 'major' ? (keyPc + 9) % 12 : (keyPc + 3) % 12; }
    return {lv:lv, item:ch, keyPc:keyPc, modeA:modeA, keyB:keyB, modeB:modeB, a:this.phrase(keyPc, modeA, tr), b:this.phrase(keyB, modeB, tr)};
  },
  play:function (g, t) {
    Q.a.forEach(function (v, i) { AU.block(g, v, t + i * 0.9, 1.0, 0.006); });
    if (Q.b) { var off = Q.a.length * 0.9 + 0.8; Q.b.forEach(function (v, i) { AU.block(g, v, t + off + i * 0.9, 1.0, 0.006); }); }
  },
  items:function () { return S_level('key') === 1 ? ['major','minor'] : ['none','half','whole','rel']; },
  answers:function () {
    return '<div class="answers">' + this.items().map(function (it) {
      var cls = Q && Q.done ? (it === Q.item ? ' right' : it === Q.pick ? ' wrong' : ' dim') : '';
      return '<button type="button" class="ans' + cls + '" data-ans="' + it + '"' + (!Q || Q.done ? ' disabled' : '') + '><span class="t"><b>' + KEY_ITEMS[it] + '</b></span></button>';
    }).join('') + '</div>';
  },
  answer:function (it) { Q.pick = it; Q.ok = it === Q.item; record('key', Q.item, Q.ok); return true; },
  feedback:function () {
    var k = nm(keyRootObj(Q.keyPc));
    var txt = Q.lv === 1 ? 'It was in ' + k + ' ' + Q.item + '.'
      : Q.item === 'none' ? 'It stayed in ' + k + ' ' + Q.modeA + '.'
      : 'It went from ' + k + ' ' + Q.modeA + ' to ' + nm(keyRootObj(Q.keyB)) + ' ' + Q.modeB + '.';
    var tip = Q.lv === 1 ? (Q.item === 'minor' ? ' Hum home. In minor, the chord on home sounds shaded.' : ' Hum home. In major, the chord on home sounds bright and settled.')
      : Q.item === 'rel' ? ' Same notes, but home moved. That is the relative key.' : '';
    return '<span>' + (Q.ok ? '<b>Yes.</b> ' : '') + esc(txt) + tip + '</span>';
  },
  statItems:function () { return Object.keys(KEY_ITEMS).map(function (k) { return {key:k, label:KEY_ITEMS[k].replace('Relative major or minor','Relative').replace(' key',''), color:k === 'minor' ? 'min' : k === 'major' ? 'maj' : 'sus9'}; }); }
 },
 intervals:{
  title:'Intervals', short:'Intervals',
  desc:function () { return 'Two notes play. Name the distance between them.'; },
  tiers:['Middle of the keyboard','Wider range','Wide range, all directions'],
  levels:['Level 1: M3, P4, P5, octave','Level 2: all twelve, going up','Level 3: up, down and together'],
  pool:function () { return S_level('intervals') === 1 ? [4,5,7,12] : [1,2,3,4,5,6,7,8,9,10,11,12]; },
  newQ:function () {
    var tr = tier('intervals'), s, tries = 0, pool = this.pool();
    do { s = C.pick(pool); tries++; } while (Q && Q.mode === 'intervals' && s === Q.s && tries < 4);
    var low = tr === 0 ? 55 + C.rnd(8) : 45 + C.rnd(tr === 1 ? 16 : 22);
    var dir = S_level('intervals') === 3 || tr === 2 ? C.pick(['up','down','together']) : 'up';
    return {s:s, low:low, dir:dir};
  },
  play:function (g, t) {
    var a = Q.low, b = Q.low + Q.s;
    if (Q.dir === 'together') { AU.keyNote(g, a, t, 2.2, 0.85); AU.keyNote(g, b, t, 2.2, 0.85); return; }
    var first = Q.dir === 'down' ? b : a, second = Q.dir === 'down' ? a : b;
    AU.keyNote(g, first, t, 1.6, 0.85); AU.keyNote(g, second, t + 0.75, 2.0, 0.85);
  },
  answers:function () {
    return '<div class="answers">' + this.pool().map(function (s) {
      var cls = Q && Q.done ? (s === Q.s ? ' right' : s === Q.pick ? ' wrong' : ' dim') : '';
      return '<button type="button" class="ans' + cls + '" data-ans="' + s + '"' + (!Q || Q.done ? ' disabled' : '') + '><span class="t"><b>' + INTERVALS[s][1] + '</b><small>' + INTERVALS[s][0] + '</small></span></button>';
    }).join('') + '</div>';
  },
  answer:function (s) { Q.pick = +s; Q.ok = +s === Q.s; record('intervals', String(Q.s), Q.ok); return true; },
  feedback:function () {
    return '<span>' + (Q.ok ? '<b>Yes.</b> ' : '') + 'That was a ' + INTERVALS[Q.s][1].toLowerCase() + (Q.dir === 'up' ? '' : Q.dir === 'down' ? ', going down' : ', played together') + '. ' + INT_HINT[Q.s] + '</span>';
  },
  statItems:function () { return Object.keys(INTERVALS).map(function (s) { return {key:s, label:INTERVALS[s][0], color:'maj9'}; }); }
 }
};
var MODE_ORDER = ['colors','numbers','home','key','intervals'];
function keyRootObj(pc) { return ROOTS[pc]; }
function nameFor(keyPc, c) {
  if (c.deg && /^\d$/.test(String(c.deg))) { var key = ROOTS[keyPc], i = +c.deg - 1; return {l:(key.l + i) % 7, pc:c.pc}; }
  return ROOTS[c.pc];
}
function degNote(key, deg) {
  var map = {'1':'1','2':'9','3':'3','4':'4','5':'5','6':'13','7':'7','b3':'b3','b6':'b5','b7':'b7'};
  if (deg === 'b6') return {l:(key.l + 5) % 7, pc:(key.pc + 8) % 12};
  if (deg === '6') return {l:(key.l + 5) % 7, pc:(key.pc + 9) % 12};
  return C.up(key, map[deg]);
}
function curMode() { return MODES[S.ear.mode] ? S.ear.mode : 'colors'; }
function renderModes() {
  $('modes').innerHTML = MODE_ORDER.map(function (m) { return '<button type="button" data-mode="' + m + '" aria-pressed="' + (curMode() === m) + '">' + MODES[m].title + '</button>'; }).join('');
}
function renderEar() {
  var m = curMode(), M = MODES[m], tr = tier(m), s = sessOf(m);
  var h = '<div class="ear-top"><h2>' + M.title + '</h2><span class="pill" title="' + esc(M.tiers[tr]) + '">' + TIER[tr] + ': ' + esc(M.tiers[tr].toLowerCase()) + '</span></div>' +
    '<p class="muted small">' + M.desc() + ' Difficulty goes up on its own at 85 percent over 20 answers.</p>';
  if (M.opts) h += '<div class="opts">' + M.opts() + '</div>';
  if (M.levels) h += '<div class="opts"><div class="opt-row"><span class="eyebrow">Level</span><div class="seg">' + M.levels.map(function (l, i) { return '<button type="button" data-level="' + (i + 1) + '" aria-pressed="' + (S_level(m) === i + 1) + '">Level ' + (i + 1) + '</button>'; }).join('') + '</div></div><p class="lvl-note">' + esc(M.levels[S_level(m) - 1].replace(/^Level \d: /, '')) + '</p></div>';
  var active = Q && Q.mode === m;
  h += '<div class="stage">' + (active ? '<button type="button" class="btn primary" data-q="replay">Replay</button>' +
      (m === 'colors' ? '<button type="button" class="btn" data-q="arp">Arpeggio</button>' : '') +
      (m === 'numbers' ? '<button type="button" class="btn" data-q="prog">Chords only</button><button type="button" class="btn" data-q="key">Just the key</button>' : '') +
      (m === 'home' ? '<button type="button" class="btn" data-q="home">Just home</button>' : '') +
      '<button type="button" class="btn" data-q="next">Next</button>'
    : '<button type="button" class="btn primary big" data-q="start">Start</button>') + '</div>';
  var saveQ = Q; if (!active) Q = null;
  h += '<div id="ear-answers">' + M.answers() + '</div>';
  Q = saveQ;
  h += '<div class="feedback' + (active && Q.done ? (Q.ok ? ' ok' : ' no') : '') + '" id="feedback"' + (active && Q.done ? '' : ' hidden') + '>' + (active && Q.done ? M.feedback() + '<div class="row"><button type="button" class="btn primary" data-q="next">Next</button></div>' : '') + '</div>';
  h += '<div class="score"><span><b>' + s.r + '/' + s.t + '</b>this session' + (s.t ? ' (' + Math.round(100 * s.r / s.t) + '%)' : '') + '</span><span><b>' + s.streak + '</b>streak</span><span><b>' + s.best + '</b>best</span></div>' +
    '<p class="keys-hint">Keys: <kbd>R</kbd> replay, <kbd>N</kbd> next.</p>';
  $('ear-main').innerHTML = h;
  renderEarSide();
}
function renderEarSide() {
  var m = curMode(), M = MODES[m], side = '';
  if (m === 'colors') {
    var r = ROOTS[S.root], opts = function (sel) { return ORDER.map(function (id) { return '<option value="' + id + '"' + (id === sel ? ' selected' : '') + '>' + esc(C.chordName(id, r)) + ' (' + TYPES[id].name + ')</option>'; }).join(''); };
    side += '<div class="box"><div style="display:grid;gap:4px"><h3>A/B compare</h3><p class="muted small">Same root, two colors. Flip between them like you would check a mix change.</p></div>' +
      '<div class="ab-sel"><label for="ab-a">A<select id="ab-a">' + opts(S.ab.a) + '</select></label><label for="ab-b">B<select id="ab-b">' + opts(S.ab.b) + '</select></label></div>' +
      '<div class="stage"><button type="button" class="btn" data-ab="a" id="ab-play-a">Play A</button><button type="button" class="btn" data-ab="b" id="ab-play-b">Play B</button><button type="button" class="btn primary" data-ab="flip">A B A B</button></div>' +
      '<div style="display:grid;gap:6px"><span class="eyebrow">Pairs worth learning</span><div class="pairs">' + PAIRS.map(function (p, i) { return '<button type="button" data-pair="' + i + '">' + C.shortSym(p[0]) + ' vs ' + C.shortSym(p[1]) + '</button>'; }).join('') + '</div></div></div>';
  }
  var items = M.statItems(), R = 0, N = 0;
  items.forEach(function (it) { var st = S.stats[m][it.key]; if (st) { R += st.r; N += st.t; } });
  var pct = N ? Math.round(100 * R / N) : 0;
  side += '<div class="box"><div class="ear-top"><h3>Your ear: ' + M.title.toLowerCase() + '</h3><span class="pill' + (N >= 30 && pct >= 80 ? ' go' : '') + '">' + (N ? pct + '% over ' + N : 'No answers yet') + '</span></div><div class="stats">' +
    items.map(function (it) { var st = S.stats[m][it.key] || {r:0, t:0}, p = st.t ? Math.round(100 * st.r / st.t) : 0;
      return '<div class="stat" style="--chord:var(--c-' + it.color + ')"><span class="nm">' + esc(it.label) + '</span><span class="bar"><i style="width:' + p + '%"></i></span><span class="n">' + (st.t ? p + '% of ' + st.t : 'none yet') + '</span></div>'; }).join('') + '</div></div>';
  $('ear-side').innerHTML = side;
}
var PAIRS = [['maj','min'],['maj7','dom7'],['min7','dom7'],['maj','add9'],['maj7','maj9'],['min7','min9'],['min9','min11'],['dom7','sus9'],['dom9','dom13'],['min7','m7b5']];
function earPlay(how) {
  if (!Q) return;
  var g = AU.newBus(); if (!g) return;
  MODES[Q.mode].play(g, AU.now(), how);
}
function earNew() {
  var m = curMode(), M = MODES[m];
  if (m === 'colors' && M.pool().length < 2) { toast('Pick at least one more level.'); return; }
  Q = M.newQ(); Q.mode = m; Q.done = false;
  renderEar(); earPlay();
}
function earAnswer(v) {
  if (!Q || Q.done) return;
  var M = MODES[Q.mode];
  var complete = M.answer(v);
  if (complete) { Q.done = true; finish(Q.mode, Q.ok); }
  renderEar();
  if (complete) { var nb = document.querySelector('#feedback [data-q="next"]'); if (nb) nb.focus({preventScroll:true}); }
}
function flipAB() {
  var g = AU.newBus(); if (!g) return;
  var t = AU.now(), pc = ROOTS[S.root].pc, seq = [S.ab.a, S.ab.b, S.ab.a, S.ab.b];
  seq.forEach(function (id, i) {
    AU.block(g, C.pianoMidis(id, pc), t + i * 1.7, 1.7);
    AU.later(function () { var a = $('ab-play-a'), b = $('ab-play-b'); if (a && b) { a.classList.toggle('primary', i % 2 === 0); b.classList.toggle('primary', i % 2 === 1); } }, i * 1700);
  });
  AU.later(function () { var a = $('ab-play-a'), b = $('ab-play-b'); if (a && b) { a.classList.remove('primary'); b.classList.remove('primary'); } }, seq.length * 1700);
}

/* ---------- key tab ---------- */
var ROWS = {'3':{label:'Triads'}, '7':{label:'7ths'}, 'n':{label:'Neo soul'}};
var ROW_TYPES = {
  major:{'3':C.DIATONIC.triad, '7':C.DIATONIC.seventh, 'n':C.DIATONIC.neo},
  minor:{'3':['min','dim','maj','min','maj','maj','maj'], '7':['min7','m7b5','maj7','min7','dom7','maj7','dom7'], 'n':['min9','m7b5','maj9','min11','dom7','maj9','dom9']}
};
var THREE = {'3':'maj', '7':'dom7', 'n':'dom7'};
var ROMANS = {major:['I','ii','iii','IV','V','vi','vii°'], minor:['i','ii°','III','iv','V','VI','VII']};
var SCALES = {major:[0,2,4,5,7,9,11], minor:[0,2,3,5,7,8,10]};
function keyMode() { return S.keyMode === 'minor' ? 'minor' : 'major'; }
// minor keys read better as C sharp and G sharp than D flat and A flat
function keyRootFor(idx, mode) { var r = ROOTS[idx]; if (mode === 'minor') { if (r.pc === 1) return {l:0, pc:1}; if (r.pc === 8) return {l:4, pc:8}; } return r; }
function keyName() { return nm(keyRootFor(S.root, keyMode())) + ' ' + keyMode(); }
var PROGS = [{seq:[1,6,4,5], note:'The 1 6 4 5. Doo wop and classic Motown run on this.'},
  {seq:[2,5,1], note:'The 2 5 1. The backbone of jazz, gospel and R&B. Hear how the 5 pulls home.'},
  {seq:[1,5,6,4], note:'The 1 5 6 4. Half of all pop songs. Learn it so you can spot it instantly.'},
  {seq:[6,4,1,5], note:'The 6 4 1 5. Same chords as above, starting on the 6, so it feels minor.'},
  {seq:[4,'3x',6], note:'The 4 3 6. The 3 turns into a dominant 7 instead of minor. That borrowed color is all over neo soul.'}];
function degChord(deg, rowKey) {
  var mode = keyMode(), i = (deg === '3x' ? 3 : deg) - 1, key = keyRootFor(S.root, mode);
  var root = {l:(key.l + i) % 7, pc:(key.pc + SCALES[mode][i]) % 12};
  var type = deg === '3x' ? THREE[rowKey] : ROW_TYPES[mode][rowKey][i];
  return {root:root, type:type, name:C.chordName(type, root), deg:deg === '3x' ? 3 : deg};
}
function renderWeek() {
  var w = weekInfo(), key = ROOTS[w.keyIdx], note = S.weeks.notes[w.idx] || {song:'', notes:'', done:false};
  var wheel = C.FIFTHS.map(function (ri, i) { var cyc = w.idx % 12, done = i < cyc || (w.idx >= 12); return '<span class="' + (i === cyc ? 'now' : done && i !== cyc ? 'done' : '') + '">' + nm(ROOTS[ri]) + '</span>'; }).join('');
  var past = [];
  for (var i = w.idx - 1; i >= 0 && past.length < 6; i--) { var n = S.weeks.notes[i]; past.push('<div><span>' + nm(ROOTS[C.FIFTHS[i % 12]]) + ' major</span><span class="muted">' + (n && n.song ? esc(n.song) + (n.done ? ' ✓' : '') : 'No song logged') + '</span></div>'); }
  $('week').innerHTML =
    '<div class="box"><div class="ear-top"><span class="eyebrow">Key of the week ' + (w.idx + 1) + (w.round > 1 ? ', round ' + w.round : '') + '</span><span class="pill">' + w.daysLeft + ' day' + (w.daysLeft === 1 ? '' : 's') + ' left</span></div>' +
    '<div class="week-key">' + nm(key) + ' major</div><p class="muted small">' + fmtDay(w.start) + ' to ' + fmtDay(w.end) + '. Next up: ' + nm(ROOTS[C.FIFTHS[(w.idx + 1) % 12]]) + ' major.</p>' +
    '<div class="wheel" aria-label="Circle of fifths progress">' + wheel + '</div>' +
    '<div class="row">' + (S.root !== w.keyIdx ? '<button type="button" class="btn primary" data-week="use">Practice in ' + nm(key) + '</button>' : '') + '<button type="button" class="btn" data-week="stay">Stay another week</button><button type="button" class="btn ghost" data-week="skip">Skip ahead</button></div></div>' +
    '<div class="box"><h3>This week\'s song</h3>' +
    '<div class="field"><label for="w-song">Song title</label><input id="w-song" type="text" placeholder="Working title" value="' + esc(note.song) + '" autocomplete="off"></div>' +
    '<div class="field"><label for="w-notes">Notes</label><textarea id="w-notes" placeholder="Progression, BPM, ideas, where the hook goes">' + esc(note.notes) + '</textarea></div>' +
    '<label class="check-row"><input type="checkbox" id="w-done"' + (note.done ? ' checked' : '') + '> Finished the song</label>' +
    (past.length ? '<div class="song-list"><span class="eyebrow">Past weeks</span>' + past.join('') + '</div>' : '') + '</div>';
}
function renderKey() {
  var ae = document.activeElement;
  if (!(ae && $('week').contains(ae) && /INPUT|TEXTAREA/.test(ae.tagName))) renderWeek();
  var mode = keyMode(), ROMAN = ROMANS[mode];
  $('key-title').textContent = 'Key of ' + keyName();
  $('key-pick').innerHTML = '<div class="seg" aria-label="Major or minor">' + [['major','Major'],['minor','Minor']].map(function (o) { return '<button type="button" data-kmode="' + o[0] + '" aria-pressed="' + (mode === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>' +
    '<div class="roots" role="group" aria-label="Key">' + ROOTS.map(function (r, i) { return '<button type="button" data-kkey="' + i + '" aria-pressed="' + (i === S.root) + '">' + nm(keyRootFor(i, mode)) + '</button>'; }).join('') + '</div>';
  $('key-row-pick').innerHTML = Object.keys(ROWS).map(function (k) { return '<button type="button" data-krow="' + k + '" aria-pressed="' + (S.keyRow === k) + '">' + ROWS[k].label + '</button>'; }).join('');
  var cellH = function (d, k) { var c = degChord(d, k); return '<td><button type="button" class="cell" data-cell="' + k + '-' + d + '" style="--chord:var(--c-' + c.type + ')"><span class="dot"></span>' + esc(c.name) + '</button></td>'; };
  var tall = window.matchMedia('(max-width: 640px)').matches, h, d;
  if (tall) {
    h = '<thead><tr><th scope="col"></th>' + Object.keys(ROWS).map(function (k) { return '<th scope="col">' + ROWS[k].label + '</th>'; }).join('') + '</tr></thead><tbody>';
    for (d = 1; d <= 7; d++) h += '<tr><th scope="row">' + d + '<small>' + ROMAN[d - 1] + '</small></th>' + Object.keys(ROWS).map(function (k) { return cellH(d, k); }).join('') + '</tr>';
  } else {
    h = '<thead><tr><th scope="col"></th>' + [1,2,3,4,5,6,7].map(function (x, i) { return '<th scope="col">' + x + '<small>' + ROMAN[i] + '</small></th>'; }).join('') + '</tr></thead><tbody>';
    Object.keys(ROWS).forEach(function (k) { h += '<tr><th scope="row">' + ROWS[k].label + '</th>'; for (var x = 1; x <= 7; x++) h += cellH(x, k); h += '</tr>'; });
  }
  $('deg').className = 'deg' + (tall ? ' tall' : '');
  $('deg').innerHTML = h + '</tbody>';
  var sel = progSel();
  $('progs').innerHTML = PROGS.map(function (p, i) { if (mode === 'minor' && p.seq.indexOf('3x') >= 0) return ''; return '<button type="button" class="btn" data-prog="' + i + '" aria-pressed="' + (sel === String(i)) + '">' + p.seq.map(function (x) { return x === '3x' ? '3' : x; }).join(' ') + '</button>'; }).join('') +
    '<button type="button" class="btn build" data-prog="custom" aria-pressed="' + (sel === 'custom') + '">Build your own</button>';
  renderSheet();
}
function showNow(c, extra) { $('now').innerHTML = '<span class="num">' + c.deg + '</span><span class="nm">' + esc(c.name) + '</span><span class="muted small">' + esc(extra || TYPES[c.type].name) + '</span>'; }
/* ---------- progression chord sheet: piano, guitar and bass for every chord ---------- */
var MAX_CUSTOM = 8, SHEET = null;
function progSel() {
  var s = String(S.progSel);
  if (s === 'custom') return s;
  var p = PROGS[+s];
  if (!p || (keyMode() === 'minor' && p.seq.indexOf('3x') >= 0)) return '0';
  return s;
}
function progItems(sel) {
  if (sel === 'custom') return S.customProg.filter(function (x) { return x && x.d >= 1 && x.d <= 7 && ROWS[x.r]; }).map(function (x) { return {deg:x.d, row:x.r}; });
  return PROGS[+sel].seq.map(function (d) { return {deg:d, row:S.keyRow}; });
}
function fretPos(frets) { var f = frets.filter(function (x) { return x !== null; }); return f.reduce(function (a, b) { return a + b; }, 0) / (f.length || 1); }
// one voicing path through the progression: voice led keys, and guitar shapes that stay near the last one
function sheetData() {
  var sel = progSel(), items = progItems(sel);
  var chords = items.map(function (it) { var c = degChord(it.deg, it.row); c.borrowed = it.deg === '3x'; c.row = it.row; return c; });
  var voiced = chords.length ? C.voiceLead(chords.map(function (c) { return {pc:c.root.pc, type:c.type}; })) : [];
  var prev = null, gtr = chords.map(function (c) {
    var vs = C.guitarVoicings(c.type, c.root.pc), best = null, bc = Infinity;
    if (!vs.length) return null;
    if (prev === null) best = C.lowestVoicing(c.type, c.root.pc);
    else vs.forEach(function (v) { var cost = Math.abs(fretPos(v.frets) - prev) + fretPos(v.frets) * 0.05; if (cost < bc) { bc = cost; best = v; } });
    prev = fretPos(best.frets);
    return best;
  });
  // one shared keyboard window for the right hand, so you can watch how little the hand moves
  var lo = 60, hi = 60;
  if (voiced.length) { lo = Infinity; hi = -Infinity; }
  voiced.forEach(function (v) { v.slice(1).forEach(function (m) { if (m < lo) lo = m; if (m > hi) hi = m; }); });
  var start = lo, end;
  while (start % 12 !== 0 && start % 12 !== 5) start--;
  end = Math.max(hi, start + 23);
  while (end % 12 !== 4 && end % 12 !== 11) end++;
  return {sel:sel, items:items, chords:chords, voiced:voiced, gtr:gtr, kStart:start, kLen:end - start + 1};
}
function romanFor(c) { return c.borrowed ? 'III7' : ROMANS[keyMode()][c.deg - 1]; }
function progTitle(D) {
  var nums = D.items.map(function (it) { return it.deg === '3x' ? '3' : it.deg; }).join(' ');
  return D.sel === 'custom' ? (D.items.length ? 'Your ' + nums : 'Your progression') : 'The ' + nums;
}
function progNote(D) {
  if (D.sel === 'custom') return D.items.length ? 'Your own progression in ' + keyName() + '. Tap more chords in the table to add them, up to ' + MAX_CUSTOM + '.' : '';
  var p = PROGS[+D.sel];
  return keyMode() === 'minor'
    ? 'The ' + p.seq.join(' ') + ' in ' + keyName() + ': ' + p.seq.map(function (d) { return ROMANS.minor[d - 1]; }).join(' ') + '. Same numbers, counted from the minor home chord.'
    : p.note;
}
function pcardHTML(D, j) {
  var c = D.chords[j], T = TYPES[c.type], v = S.progView, cn = esc(c.name), h = '', on = {};
  D.voiced[j].slice(1).forEach(function (m) { on[m] = {lab:C.labelFor(T, ((m - c.root.pc) % 12 + 12) % 12), lh:false}; });
  h += '<article class="pcard" id="pcard-' + j + '" style="--chord:var(--c-' + c.type + ')">' +
    '<div class="pcard-head"><span class="pnum">' + c.deg + '</span><div style="min-width:0"><b class="pname">' + cn + '</b><span class="tname">' + romanFor(c) + ' · ' + (c.borrowed ? 'Borrowed dominant' : T.name) + '</span></div></div>';
  if (v === 'all' || v === 'piano') h += '<div class="inst">' + (v === 'all' ? '<span class="eyebrow">Piano</span>' : '') + '<button type="button" class="dia" data-pc="' + j + '" data-pinst="keys" aria-label="Play ' + cn + ' on piano">' + C.svg.keys(on, D.kStart, D.kLen) +
    '<small><span class="lh-dot"></span>Left hand: ' + esc(nm(c.root)) + ' down low. Right hand: the colored keys.</small></button></div>';
  if ((v === 'all' || v === 'guitar') && D.gtr[j]) h += '<div class="inst">' + (v === 'all' ? '<span class="eyebrow">Guitar</span>' : '') + '<button type="button" class="dia gtr-one" data-pc="' + j + '" data-pinst="guitar" aria-label="Strum ' + cn + '">' + C.svg.guitar(c.type, c.root.pc, D.gtr[j].frets) + '<small>' + D.gtr[j].label + '</small></button></div>';
  if (v === 'all' || v === 'bass') {
    var b = C.bassBox(c.type, c.root.pc);
    h += '<div class="inst">' + (v === 'all' ? '<span class="eyebrow">Bass</span>' : '') + '<button type="button" class="dia bass-dia" data-pc="' + j + '" data-pinst="bass" aria-label="Play ' + cn + ' on bass">' + C.svg.bass(c.type, c.root.pc) + '<small>Root on the ' + (b.rs === 0 ? 'E' : 'A') + ' string, fret ' + b.rf + '. Outlined dot is where to start.</small></button></div>';
  }
  return h + '</article>';
}
function renderSheet() {
  var D = SHEET = sheetData(), mode = keyMode();
  var bh = '';
  if (D.sel === 'custom') {
    bh = '<div class="builder"><div style="display:grid;gap:4px"><b>Build your own</b><span class="muted small">Tap chords in the table above to add them in order, up to ' + MAX_CUSTOM + '. Mix triads, 7ths and neo soul colors.</span></div>' +
      (D.chords.length ? '<div class="bchips">' + D.chords.map(function (c) { return '<span class="bchip" style="--chord:var(--c-' + c.type + ')"><span class="dot"></span><b>' + c.deg + '</b> ' + esc(c.name) + '</span>'; }).join('') + '</div>' : '') +
      '<div class="row"><button type="button" class="btn" data-bundo="1"' + (D.chords.length ? '' : ' disabled') + '>Undo</button><button type="button" class="btn ghost" data-bclear="1"' + (D.chords.length ? '' : ' disabled') + '>Clear</button></div></div>';
  }
  $('builder').innerHTML = bh;
  $('prog-note').textContent = progNote(D);
  if (!D.chords.length) { $('sheet').innerHTML = ''; return; }
  $('sheet').innerHTML =
    '<div class="sheet-head"><div style="display:grid;gap:2px;min-width:0"><h3>' + esc(progTitle(D)) + ' in ' + esc(keyName()) + '</h3><span class="muted small">' + D.chords.map(romanFor).join(' ') + '. Swipe through the chords, tap any diagram to hear it.</span></div>' +
    '<div class="row"><div class="seg" aria-label="Instrument">' + [['all','All'],['piano','Piano'],['guitar','Guitar'],['bass','Bass']].map(function (o) { return '<button type="button" data-pview="' + o[0] + '" aria-pressed="' + (S.progView === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>' +
    '<button type="button" class="btn primary" data-sheetplay="1">Play and follow along</button></div></div>' +
    '<div class="cards-row" id="cards-row">' + D.chords.map(function (c, j) { return pcardHTML(D, j); }).join('') + '</div>';
}
function markSheet(j) {
  var D = SHEET, c = D.chords[j];
  document.querySelectorAll('.cell.now,.pcard.playing').forEach(function (x) { x.classList.remove('now'); x.classList.remove('playing'); });
  var cell = document.querySelector('[data-cell="' + c.row + '-' + c.deg + '"]'); if (cell && !c.borrowed) cell.classList.add('now');
  var card = $('pcard-' + j), row = $('cards-row');
  if (card) {
    card.classList.add('playing');
    if (row && (card.offsetLeft < row.scrollLeft || card.offsetLeft + card.offsetWidth > row.scrollLeft + row.clientWidth)) {
      row.scrollTo({left:Math.max(0, card.offsetLeft - 4), behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    }
  }
  showNow(c, c.borrowed ? 'Borrowed: the 3 played as a dominant 7' : null);
}
function bassRoot(c) { var b = C.bassBox(c.type, c.root.pc); return C.OPENB[b.rs] + b.rf; }
// play chord j of the sheet on the chosen instrument view at time t
function sheetChord(g, j, t, view) {
  var D = SHEET, c = D.chords[j];
  if (view === 'guitar' && D.gtr[j]) AU.strum(g, C.voicingMidis(D.gtr[j].frets), t);
  else if (view === 'bass') {
    var m = bassRoot(c), tones = C.chordTones(c.type), nx = tones.indexOf(7) >= 0 ? 7 : tones.indexOf(6) >= 0 ? 6 : 12;
    AU.block(g, D.voiced[j].slice(1), t, 1.4, 0.008);
    AU.bassNote(g, m, t, 1, 0.6); AU.bassNote(g, m + nx, t + 0.65, 0.85, 0.55);
  } else AU.block(g, D.voiced[j], t, 1.4, 0.008);
}
function playSheet() {
  var D = SHEET; if (!D || !D.chords.length) return;
  var g = AU.newBus(clearPlaying); if (!g) return;
  var n = D.chords.length, reps = n <= 4 ? 2 : 1, step = 1.3, t = AU.now(), view = S.progView;
  for (var r = 0; r < reps; r++) D.chords.forEach(function (c, j) {
    var k = r * n + j;
    sheetChord(g, j, t + k * step, view);
    AU.later(function () { markSheet(j); }, k * step * 1000);
  });
  AU.later(clearPlaying, reps * n * step * 1000 + 600);
}
function playProg(sel) {
  S.progSel = String(sel); save('settings');
  renderKey();
  if (SHEET.chords.length) playSheet();
}

/* ---------- practice tab ---------- */
var logDay = dayKey();
function renderPractice() {
  var today = dayKey(), st = streaks(), tot = dayTotal(today), goal = S.goal;
  var e = S.log[today];
  var segs = INSTR.map(function (x) { var v = e && e.m[x[0]] || 0; return v ? '<i style="width:' + Math.min(100, 100 * v / Math.max(goal, tot)) + '%;background:var(' + x[2] + ')"></i>' : ''; }).join('');
  var am = appMinutes(e); if (am) segs += '<i style="width:' + Math.min(100, 100 * am / Math.max(goal, tot)) + '%;background:var(--c-min9)"></i>';
  $('today').innerHTML = '<div class="ear-top"><h2>Today</h2><span class="pill' + (tot >= goal ? ' go' : '') + '">' + (tot >= goal ? 'Goal hit' : (goal - tot) + ' min to your goal') + '</span></div>' +
    '<div class="big-stats"><div><b>' + tot + '</b><span>minutes today</span></div><div><b>' + st.cur + '</b><span>day streak</span></div><div><b>' + st.best + '</b><span>best streak</span></div></div>' +
    '<div class="goalbar" aria-label="' + tot + ' of ' + goal + ' minutes">' + segs + '</div>' +
    '<p class="muted small">A day counts toward your streak at ' + STREAK_MIN + ' minutes. Daily goal: ' + goal + ' minutes.</p>';
  var le = S.log[logDay] || {m:{}, app:{}};
  var rows = INSTR.map(function (x) {
    var v = le.m && le.m[x[0]] || 0;
    return '<div class="logrow"><span class="nm"><i class="dot" style="--chord:var(' + x[2] + ');width:12px;height:12px"></i>' + x[1] + '</span><span class="val">' + v + ' min</span>' +
      '<button type="button" class="btn" data-log="' + x[0] + '" data-amt="-5" aria-label="Remove 5 minutes of ' + x[1] + '">−5</button>' +
      '<button type="button" class="btn" data-log="' + x[0] + '" data-amt="5" aria-label="Add 5 minutes of ' + x[1] + '">+5</button>' +
      '<button type="button" class="btn" data-log="' + x[0] + '" data-amt="15" aria-label="Add 15 minutes of ' + x[1] + '">+15</button></div>';
  }).join('');
  rows += '<div class="logrow auto"><span class="nm"><i class="dot" style="--chord:var(--c-min9);width:12px;height:12px"></i>Ear training in the app</span><span class="val">' + appMinutes(le) + ' min</span><span></span><span></span><span class="muted small">auto</span></div>';
  var isToday = logDay === today;
  $('logbox').innerHTML = '<div class="daynav"><button type="button" class="btn" data-day="-1" aria-label="Previous day">‹</button><b>' + (isToday ? 'Today' : logDay === addDays(today, -1) ? 'Yesterday' : WD[parseDay(logDay).getDay()] + ', ' + fmtDay(logDay)) + '</b><button type="button" class="btn" data-day="1" aria-label="Next day"' + (isToday ? ' disabled style="opacity:.35"' : '') + '>›</button></div>' +
    '<div class="logrows">' + rows + '</div>';
  var days = [], max = goal, i;
  for (i = 6; i >= 0; i--) { var k = addDays(today, -i); days.push(k); max = Math.max(max, dayTotal(k)); }
  $('weekchart').innerHTML = '<h3>Last 7 days</h3><div class="chart">' + days.map(function (k) {
    var en = S.log[k], parts = '';
    if (en) { INSTR.forEach(function (x) { var v = en.m[x[0]] || 0; if (v) parts += '<i style="height:' + (100 * v / max) + '%;background:var(' + x[2] + ')"></i>'; }); var a = appMinutes(en); if (a) parts += '<i style="height:' + (100 * a / max) + '%;background:var(--c-min9)"></i>'; }
    return '<div class="col' + (k === today ? ' today' : '') + '"><div class="stack">' + parts + '<span class="goal-line" style="bottom:' + (100 * goal / max) + '%"></span></div><span>' + dayTotal(k) + '</span><span>' + WD[parseDay(k).getDay()] + '</span></div>';
  }).join('') + '</div><div class="keys-legend">' + INSTR.map(function (x) { return '<span><i style="background:var(' + x[2] + ')"></i>' + x[1].replace(' (other)', '') + '</span>'; }).join('') + '<span><i style="background:var(--c-min9)"></i>App</span><span><i style="border-top:1.5px dashed var(--muted);border-radius:0;height:0;width:12px"></i>Goal</span></div>';
}

/* ---------- settings tab ---------- */
function renderSettings() {
  var seg = function (key, opts) { return '<div class="seg">' + opts.map(function (o) { return '<button type="button" data-snd="' + key + ':' + o[0] + '" aria-pressed="' + (S[key] === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>'; };
  var stat = function (name) { return AU.SETS[name] ? (AU.isReady(name) ? '' : AU.isLoading(name) ? ' <span class="muted small">loading…</span>' : '') : ''; };
  $('set-sound').innerHTML = '<h3>Sound</h3>' +
    '<div class="field"><span class="lab">Keys' + stat(S.sound) + '</span>' + seg('sound', [['piano','Grand piano'],['rhodes','Rhodes'],['synth','Classic synth']]) + '</div>' +
    '<div class="field"><span class="lab">Guitar' + stat(S.guitarSound) + '</span>' + seg('guitarSound', [['eguitar','Clean electric'],['aguitar','Acoustic'],['synth','Synth pluck']]) + '</div>' +
    '<div class="field"><span class="lab">Bass' + stat(S.bassSound) + '</span>' + seg('bassSound', [['bass','Electric bass'],['synth','Synth bass']]) + '</div>' +
    '<div class="field"><label for="vol">Volume</label><input type="range" id="vol" min="0.1" max="1" step="0.05" value="' + S.volume + '"></div>' +
    '<div class="row"><button type="button" class="btn" data-test="keys">Test keys</button><button type="button" class="btn" data-test="guitar">Test guitar</button><button type="button" class="btn" data-test="bass">Test bass</button></div>' +
    '<p class="help muted small">The real instrument sounds download the first time you use them, then work offline.</p>';
  var w = weekInfo();
  $('set-practice').innerHTML = '<h3>Practice</h3>' +
    '<div class="field"><span class="lab">Daily goal</span><div class="stepper"><button type="button" class="btn" data-goal="-5" aria-label="Lower goal">−5</button><b>' + S.goal + '</b><button type="button" class="btn" data-goal="5" aria-label="Raise goal">+5</button><span class="muted small">minutes</span></div></div>' +
    '<label class="check-row"><input type="checkbox" id="auto-root"' + (S.autoRoot ? ' checked' : '') + '> Set the root to my key of the week each Monday</label>' +
    '<p class="help muted small">The tracker started on ' + fmtDay(S.weeks.start) + ' in C and moves around the circle of fifths. This week is ' + nm(ROOTS[w.keyIdx]) + ' major.</p>';
  renderSync();
  $('set-data').innerHTML = '<h3>Reset</h3><p class="muted small">These cannot be undone. If sync is on, the reset spreads to your other devices.</p>' +
    '<div class="row"><button type="button" class="btn" data-reset="stats">Reset ear stats</button><button type="button" class="btn" data-reset="checks">Clear the I can checks</button></div>' +
    '<p class="muted small">Chord Colors 2.1</p>' +
    '<details class="credits"><summary class="small">Sound credits</summary><p class="muted small">Grand piano: <a href="https://archive.org/details/SalamanderGrandPianoV3" target="_blank" rel="noopener">Salamander Grand Piano V3</a> by Alexander Holm, licensed <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener">CC BY 3.0</a>. Trimmed and converted to MP3.</p>' +
    '<p class="muted small">Rhodes, guitars and bass: rendered from the MuseScore General SoundFont by S. Christian Collins, built on Fluid R3 by Frank Wen. MIT license. Full license text is in samples/CREDITS.txt.</p></details>';
}
function renderSync() {
  var el = $('set-sync'); if (!el) return;
  var on = !!(S.sync.token && S.sync.gist), err = S.sync.err;
  var status = on ? (err ? 'err' : 'on') : '';
  var when = S.sync.last ? new Date(S.sync.last).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'}) : '';
  el.innerHTML = '<h3>Sync with your Mac</h3>' +
    '<div class="sync-status ' + status + '"><i></i><span id="sync-msg">' + (on ? (err ? esc(err) : 'On. Last synced ' + when + '.') : 'Off. Progress lives on this device only.') + '</span></div>' +
    (on ? '<div class="row"><button type="button" class="btn primary" data-sync="now">Sync now</button><button type="button" class="btn" data-sync="off">Turn off on this device</button></div>'
      : '<ol class="howto"><li>On GitHub, open Settings, then Developer settings, then Personal access tokens, then Tokens (classic).</li><li>Generate a new classic token named Chord Colors. Tick only the <b>gist</b> box and pick an expiration.</li><li>Copy the token, paste it here, and tap Connect. Do the same on your Mac.</li></ol>' +
        '<div class="field"><label for="tok">GitHub token</label><input id="tok" type="password" placeholder="ghp_…" autocomplete="off" autocapitalize="off" spellcheck="false"></div>' +
        '<div><button type="button" class="btn primary" data-sync="connect">Connect</button></div>' +
        '<p class="help muted small">Your progress is saved to one private gist on your GitHub account. The token stays on this device and can only touch gists.</p>');
}

/* ---------- render all ---------- */
function renderAll() {
  applyWeekRoot();
  renderRoots(); renderPalette(); renderLibrary(); renderModes(); renderEar(); renderKey(); renderSettings();
  if (S.tab === 'practice') renderPractice();
}

/* ---------- events ---------- */
document.addEventListener('click', function (e) {
  var b = e.target.closest('button'); if (!b || b.disabled) return;
  var d = b.dataset;
  if (d.tab) { setTab(d.tab, true); return; }
  if (d.root !== undefined) { S.root = +d.root; save('settings'); AU.stopAll(clearPlaying); renderRoots(); renderPalette(); renderLibrary(); renderKey(); if (curMode() === 'colors') renderEarSide(); return; }
  if (d.palette) { playCard(d.palette, 'piano'); var el = $('card-' + d.palette); if (el) el.scrollIntoView({block:'nearest', behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); return; }
  if (d.view) { S.view = d.view; save('settings'); renderLibrary(); return; }
  if (d.act) { var card = b.closest('.card'); if (card) playCard(card.dataset.id, d.act, d.v); return; }
  if (d.chk) { var id = b.closest('.card').dataset.id, c = S.checks[id] = S.checks[id] || {}; c[d.chk] = !c[d.chk]; c.u = Date.now(); save(); b.setAttribute('aria-pressed', String(!!c[d.chk])); updateMeters(); return; }
  if (d.playlevel) { playLevel(+d.playlevel); return; }
  if (d.mode) { S.ear.mode = d.mode; save('settings'); AU.stopAll(); renderModes(); renderEar(); return; }
  if (d.pool) { var n = +d.pool, i = S.ear.pool.indexOf(n); if (i >= 0) { if (S.ear.pool.length > 1) S.ear.pool.splice(i, 1); } else S.ear.pool.push(n); S.ear.pool.sort(); save('settings'); if (Q && Q.mode === 'colors') Q = null; renderEar(); return; }
  if (d.qroot) { S.ear.qroot = d.qroot; save('settings'); renderEar(); return; }
  if (d.qsound) { S.ear.qsound = d.qsound; save('settings'); renderEar(); return; }
  if (d.level) { S.ear.levels[curMode()] = +d.level; save('settings'); if (Q && Q.mode === curMode()) Q = null; renderEar(); return; }
  if (d.ans !== undefined) { earAnswer(d.ans); return; }
  if (d.num !== undefined) { earAnswer(d.num); return; }
  if (d.q) {
    if (d.q === 'start' || d.q === 'next') earNew();
    else if (d.q === 'replay') earPlay();
    else if (d.q === 'arp') earPlay('arp');
    else if (d.q === 'prog') earPlay('prog');
    else if (d.q === 'key') earPlay('key');
    else if (d.q === 'home') earPlay('home');
    else if (d.q === 'again') earPlay();
    else if (d.q === 'yours' || d.q === 'answer') {
      var g = AU.newBus(); if (!g) return; var tid = d.q === 'yours' ? Q.pick : Q.type;
      if (S.ear.qsound === 'strum') AU.strum(g, C.voicingMidis(C.lowestVoicing(tid, Q.pc).frets), AU.now());
      else AU.block(g, C.variedVoicing(tid, Q.pc, 0), AU.now());
    }
    return;
  }
  if (d.ab) { if (d.ab === 'flip') flipAB(); else { var gg = AU.newBus(); if (gg) AU.block(gg, C.pianoMidis(d.ab === 'a' ? S.ab.a : S.ab.b, ROOTS[S.root].pc), AU.now()); } return; }
  if (d.pair !== undefined) { var p = PAIRS[+d.pair]; S.ab.a = p[0]; S.ab.b = p[1]; save('settings'); renderEarSide(); flipAB(); return; }
  if (d.krow) { S.keyRow = d.krow; save('settings'); renderKey(); return; }
  if (d.kkey !== undefined) {
    S.root = +d.kkey; save('settings'); AU.stopAll(clearPlaying);
    renderRoots(); renderPalette(); renderLibrary(); renderKey(); if (curMode() === 'colors') renderEarSide();
    var home = degChord(1, S.keyRow), gk = AU.newBus(clearPlaying); if (gk) AU.block(gk, C.pianoMidis(home.type, home.root.pc), AU.now());
    showNow(home); return;
  }
  if (d.kmode) { S.keyMode = d.kmode; save('settings'); AU.stopAll(clearPlaying); renderKey(); var hm = degChord(1, S.keyRow), gm = AU.newBus(clearPlaying); if (gm) AU.block(gm, C.pianoMidis(hm.type, hm.root.pc), AU.now()); showNow(hm); return; }
  if (d.cell) {
    var parts = d.cell.split('-'), cc = degChord(+parts[1], parts[0]);
    if (progSel() === 'custom') {
      if (S.customProg.length >= MAX_CUSTOM) toast('That is ' + MAX_CUSTOM + ' chords. Undo one to add another.');
      else { S.customProg.push({d:+parts[1], r:parts[0]}); save('settings'); renderSheet(); toast('Added ' + cc.deg + ' ' + cc.name + '. That is ' + S.customProg.length + ' chord' + (S.customProg.length === 1 ? '' : 's') + '.'); }
    }
    var g2 = AU.newBus(clearPlaying); if (!g2) return; AU.block(g2, C.pianoMidis(cc.type, cc.root.pc), AU.now());
    var cellNow = document.querySelector('[data-cell="' + d.cell + '"]'); if (cellNow) { cellNow.classList.add('now'); AU.later(function () { cellNow.classList.remove('now'); }, 1600); }
    showNow(cc); return;
  }
  if (d.prog !== undefined) { playProg(d.prog); return; }
  if (d.bundo) { S.customProg.pop(); save('settings'); AU.stopAll(clearPlaying); renderSheet(); return; }
  if (d.bclear) { S.customProg = []; save('settings'); AU.stopAll(clearPlaying); renderSheet(); return; }
  if (d.pview) { S.progView = d.pview; save('settings'); renderSheet(); return; }
  if (d.sheetplay) { playSheet(); return; }
  if (d.pinst && SHEET && SHEET.chords[+d.pc]) {
    var pj = +d.pc, pcd = SHEET.chords[pj], gp = AU.newBus(clearPlaying); if (!gp) return;
    var tp = AU.now();
    if (d.pinst === 'guitar') sheetChord(gp, pj, tp, 'guitar');
    else if (d.pinst === 'bass') C.bassArp(pcd.type, pcd.root.pc).forEach(function (m, i) { AU.bassNote(gp, m, tp + i * 0.32); });
    else AU.block(gp, SHEET.voiced[pj], tp, 2.4, 0.008);
    markSheet(pj); AU.later(clearPlaying, 2000); return;
  }
  if (d.week) {
    var w = weekInfo();
    if (d.week === 'use') { S.root = w.keyIdx; S.rootWeek = w.idx; save('settings'); renderAll(); return; }
    if (d.week === 'stay') { S.weeks.stays.push(w.raw); S.weeks.u = Date.now(); toast('Next week stays on ' + nm(ROOTS[w.keyIdx]) + ' major.'); }
    if (d.week === 'skip') { S.weeks.skips.push(w.raw); S.weeks.u = Date.now(); toast('Moved ahead to ' + nm(ROOTS[C.FIFTHS[(w.idx + 1) % 12]]) + ' major.'); }
    save(); S.rootWeek = -1; renderAll(); return;
  }
  if (d.log) { var en = dayEntry(logDay, true); en.m[d.log] = Math.max(0, (en.m[d.log] || 0) + (+d.amt)); en.u = Date.now(); save(); renderPractice(); return; }
  if (d.day) { var nd = addDays(logDay, +d.day); if (daysBetween(nd, dayKey()) >= 0) { logDay = nd; renderPractice(); } return; }
  if (d.snd) { AU.ac(); var kv = d.snd.split(':'); S[kv[0]] = kv[1]; save('settings'); applySound(); renderSettings(); AU.loadSet(kv[1]).then(function () { renderSettings(); testSound(kv[0] === 'sound' ? 'keys' : kv[0] === 'guitarSound' ? 'guitar' : 'bass'); }); return; }
  if (d.test) { AU.ac(); testSound(d.test); return; }
  if (d.goal) { S.goal = Math.max(10, Math.min(240, S.goal + (+d.goal))); save('settings'); renderSettings(); return; }
  if (d.sync) {
    if (d.sync === 'connect') { var tok = $('tok').value; if (!tok.trim()) { toast('Paste your GitHub token first.'); return; } syncConnect(tok); }
    else if (d.sync === 'now') { $('sync-msg').textContent = 'Syncing…'; syncPull().then(function () { if (!S.sync.err) toast('Synced.'); }); }
    else if (d.sync === 'off') { S.sync = {token:'', gist:'', last:0, err:''}; saveLocal(); renderSync(); toast('Sync is off on this device. Your gist stays on GitHub.'); }
    return;
  }
  if (d.reset) {
    if (b.dataset.armed && Date.now() - (+b.dataset.armed) < 4000) {
      if (d.reset === 'stats') { S.stats = clone(DEFAULT.stats); S.recent = clone(DEFAULT.recent); S.diff = clone(DEFAULT.diff); }
      if (d.reset === 'checks') { ORDER.forEach(function (id) { S.checks[id] = {u:Date.now()}; }); }
      save(); renderAll(); toast('Done.');
    } else { b.dataset.armed = String(Date.now()); b.textContent = 'Tap again to confirm'; }
    return;
  }
});
document.addEventListener('input', function (e) {
  var t = e.target;
  if (t.id === 'vol') { S.volume = +t.value; AU.setVolume(S.volume); save('settings'); }
  if (t.id === 'w-song' || t.id === 'w-notes') {
    var w = weekInfo(), n = S.weeks.notes[w.idx] = S.weeks.notes[w.idx] || {song:'', notes:'', done:false};
    if (t.id === 'w-song') n.song = t.value; else n.notes = t.value;
    n.u = Date.now(); save();
  }
});
document.addEventListener('change', function (e) {
  var t = e.target;
  if (t.id === 'ab-a') { S.ab.a = t.value; save('settings'); }
  if (t.id === 'ab-b') { S.ab.b = t.value; save('settings'); }
  if (t.id === 'w-done') { var w = weekInfo(), n = S.weeks.notes[w.idx] = S.weeks.notes[w.idx] || {song:'', notes:'', done:false}; n.done = t.checked; n.u = Date.now(); save(); if (t.checked) toast('Song done. That is ' + nm(ROOTS[w.keyIdx]) + ' in the bag.'); }
  if (t.id === 'auto-root') { S.autoRoot = t.checked; save('settings'); }
});
document.querySelector('.tabs').addEventListener('keydown', function (e) {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  var i = TABS.indexOf(S.tab) + (e.key === 'ArrowRight' ? 1 : -1); i = (i + TABS.length) % TABS.length; setTab(TABS[i], true); $('tab-' + TABS[i]).focus();
});
document.addEventListener('keydown', function (e) {
  if (S.tab !== 'ear' || e.metaKey || e.ctrlKey || e.altKey) return;
  var tg = e.target.tagName; if (tg === 'SELECT' || tg === 'INPUT' || tg === 'TEXTAREA') return;
  var k = e.key.toLowerCase();
  if (k === 'r') { if (Q) earPlay(); e.preventDefault(); }
  else if (k === 'n') { earNew(); e.preventDefault(); }
});
window.addEventListener('hashchange', function () { var h = location.hash.slice(1); if (TABS.indexOf(h) >= 0) setTab(h, false); });
try { var mq = window.matchMedia('(max-width: 640px)'); var onMq = function () { renderKey(); }; if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq); } catch (e) {}
if ('serviceWorker' in navigator && location.protocol !== 'file:') window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });

var h0 = location.hash.slice(1);
renderAll();
setTab(TABS.indexOf(h0) >= 0 ? h0 : S.tab, false);
if (S.sync.token && S.sync.gist) syncPull();
window.__app = {S:function () { return S; }, mergeState:mergeState, streaks:streaks, dayTotal:dayTotal, weekInfo:weekInfo, MODES:MODES, setS:function (o) { S = fill(DEFAULT, o); }, dayKey:dayKey, addDays:addDays, degChord:degChord, nameFor:nameFor, degNote:degNote};
})();
