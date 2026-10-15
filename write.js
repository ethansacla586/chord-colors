/* Chord Colors songwriting room: song builder, pro moves and MIDI export.
   Chords are tokens like "4maj7/5:2" (degree on the major scale of the tonic, quality, optional slash bass, beats). */
(function () {
'use strict';
var C = window.CC, AU = C.audio, TYPES = C.TYPES, ROOTS = C.ROOTS, nm = C.nm;
var DATA = window.SONG_DATA || {styles:{}, lessons:[], subs:{}, roles:{major:{}, minor:{}}};
var $ = function (id) { return document.getElementById(id); };
function A() { return window.CCAPP; }
function S() { return A().S(); }
function esc(s) { return A().esc(s); }
function rnd(n) { return Math.floor(Math.random() * n); }
function pick(a) { return a[rnd(a.length)]; }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function reduced() { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }

var SECTIONS = ['intro','verse','pre','chorus','bridge','outro'];
var SEC_NAME = {intro:'Intro', verse:'Verse', pre:'Pre chorus', chorus:'Chorus', bridge:'Bridge', outro:'Outro'};
var TARGET_BARS = {intro:4, verse:8, pre:4, chorus:8, bridge:8, outro:4};
var STYLE_KEYS = ['neosoul','gospel','pop','motown'];
var STYLE_SHORT = {neosoul:'Neo soul', gospel:'Gospel', pop:'Indie and pop', motown:'Motown'};
var MAJ = [0,2,4,5,7,9,11], SCALE = {major:[0,2,4,5,7,9,11], minor:[0,2,3,5,7,8,10]};
var FAMILY = {maj:'maj', maj7:'maj', maj9:'maj', add9:'maj', six9:'maj', maj6:'maj', sus2:'maj', sus4:'maj',
  min:'min', min7:'min', min9:'min', min11:'min', min6:'min', dom7:'dom', dom9:'dom', dom13:'dom', dom7b9:'dom', sus9:'dom',
  dim:'dim', dim7:'dim', m7b5:'half'};
var COLORS = {maj:['maj','add9','maj7','maj9','six9','maj6','sus2','sus4'], min:['min','min7','min9','min11','min6'],
  dom:['dom7','dom9','dom13','dom7b9','sus9'], dim:['dim','dim7','m7b5'], half:['m7b5','dim7','dim']};
var LENS = [1,2,4,8];

/* ---------- chord tokens ---------- */
var TOK = /^(b|#)?([1-7])([a-z0-9]+)(?:\/(b|#)?([1-7]))?(?::(\d+))?$/;
function parse(tok) {
  var m = TOK.exec(String(tok || ''));
  if (!m || !TYPES[m[3]]) return null;
  var beats = m[6] ? +m[6] : 4;
  return {acc:m[1] || '', deg:+m[2], type:m[3], bacc:m[4] || '', bdeg:m[5] ? +m[5] : 0, beats:beats > 0 && beats <= 16 ? beats : 4};
}
function tokOf(p) { return p.acc + p.deg + p.type + (p.bdeg ? '/' + p.bacc + p.bdeg : '') + (p.beats !== 4 ? ':' + p.beats : ''); }
function accVal(a) { return a === 'b' ? -1 : a === '#' ? 1 : 0; }
function semiOf(acc, deg) { return ((MAJ[deg - 1] + accVal(acc)) % 12 + 12) % 12; }
function degNote(key, deg, acc) { return {l:(key.l + deg - 1) % 7, pc:((key.pc + MAJ[deg - 1] + accVal(acc)) % 12 + 12) % 12}; }
// a chord whose root sits `semi` above the tonic, spelled on scale step `deg`
function tokFor(deg, semi, type) {
  var d = ((semi - MAJ[deg - 1]) % 12 + 12) % 12; if (d > 6) d -= 12;
  if (d < -1 || d > 1) return null;
  return {acc:d === -1 ? 'b' : d === 1 ? '#' : '', deg:deg, type:type, bacc:'', bdeg:0, beats:4};
}
function dispNum(acc, deg, mode) {
  var d = semiOf(acc, deg) - SCALE[mode][deg - 1]; if (d > 6) d -= 12; if (d < -6) d += 12;
  return (d === -1 ? '♭' : d === 1 ? '♯' : d === -2 ? '♭♭' : d === 2 ? '♯♯' : '') + deg;
}
function modeOf(song) { return song && song.mode === 'minor' ? 'minor' : 'major'; }
function songKey(song, shift) { return A().keyRootFor((((song.key || 0) + (shift || 0)) % 12 + 12) % 12, modeOf(song)); }
function keyLabel(song, shift) { return nm(songKey(song, shift)) + ' ' + modeOf(song); }
function chordOf(p, key, mode) {
  var root = degNote(key, p.deg, p.acc), bass = p.bdeg ? degNote(key, p.bdeg, p.bacc) : null;
  if (bass && bass.pc === root.pc) bass = null;
  return {p:p, root:root, bass:bass, type:p.type, beats:p.beats,
    name:C.chordName(p.type, root) + (bass ? '/' + nm(bass) : ''),
    num:dispNum(p.acc, p.deg, mode) + (bass ? '/' + dispNum(p.bacc, p.bdeg, mode) : '')};
}
function asciiName(s) { return String(s).replace(/♭/g, 'b').replace(/♯/g, '#').replace(/[^\x20-\x7E]/g, ''); }
function beatsLabel(b) { return b === 4 ? '1 bar' : b === 8 ? '2 bars' : b === 2 ? 'half bar' : b + (b === 1 ? ' beat' : ' beats'); }

/* ---------- songs in state ---------- */
var ui = {edit:null, dia:null, more:null, undo:[], delArm:0, playing:false};
function songs() { return (S().songs || []).filter(function (s) { return s && !s.del && s.sections; }); }
function cur() {
  var id = S().songId, l = songs();
  for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
  return l[0] || null;
}
function snap(song) { ui.undo.push({id:song.id, data:clone(song)}); if (ui.undo.length > 40) ui.undo.shift(); }
function touch(song) { song.u = Date.now(); A().save(); }
function secTokens(sec) { return JSON.stringify(sec.chords); }
// sections that share the exact same chords and type move together (verse 1 and verse 2)
function linked(song, i) {
  var me = song.sections[i], t = secTokens(me), out = [];
  song.sections.forEach(function (s, k) { if (s.type === me.type && secTokens(s) === t) out.push(k); });
  return out;
}
function editChords(song, i, fn) {
  var group = linked(song, i), before = secTokens(song.sections[i]);
  snap(song);
  var toks = song.sections[i].chords.slice(), res = fn(toks);
  group.forEach(function (k) { song.sections[k].chords = toks.slice(); song.sections[k].edited = true; });
  touch(song);
  if (group.length > 1 && secTokens(song.sections[i]) !== before) A().toast('Updated every ' + SEC_NAME[song.sections[i].type].toLowerCase() + ' with these chords.');
  return res;
}

/* ---------- the writer ---------- */
function bank(style, type, mode) { var st = DATA.styles[style]; return st && st.banks && st.banks[type] ? st.banks[type].filter(function (e) { return e.mode === mode; }) : []; }
function firstSemi(chords) { var p = parse(chords[0]); return p ? semiOf(p.acc, p.deg) : -1; }
function pickEntry(style, type, mode, ok, notName) {
  var list = bank(style, type, mode); if (!list.length) list = bank(style, type, mode === 'major' ? 'minor' : 'major');
  var good = list.filter(function (e) { return (!ok || ok(e)) && e.name !== notName; });
  if (!good.length) good = list.filter(function (e) { return e.name !== notName; });
  return good.length ? pick(good) : list[0];
}
function loopBeats(chords) { return chords.reduce(function (s, t) { var p = parse(t); return s + (p ? p.beats : 0); }, 0); }
function repsFor(type, chords) { var bars = loopBeats(chords) / 4; return Math.max(1, Math.round((TARGET_BARS[type] || 4) / Math.max(1, bars))); }
function makeSection(type, e) { return {type:type, chords:e.chords.slice(), reps:repsFor(type, e.chords), name:e.name, why:e.why, shift:0}; }
function newId() { return 's' + Date.now().toString(36) + rnd(46656).toString(36); }
function writeSong() {
  var W = S().write, style = DATA.styles[W.style] ? W.style : 'neosoul', st = DATA.styles[style], mode = W.mode === 'minor' ? 'minor' : 'major';
  var struct = pick(st.structures), p = {};
  p.verse = pickEntry(style, 'verse', mode);
  var vf = firstSemi(p.verse.chords);
  p.chorus = pickEntry(style, 'chorus', mode, function (e) { return firstSemi(e.chords) !== vf; });
  p.pre = pickEntry(style, 'pre', mode);
  p.bridge = pickEntry(style, 'bridge', mode, function (e) { var f = firstSemi(e.chords); return f !== vf && f !== firstSemi(p.chorus.chords); });
  p.intro = Math.random() < 0.3 ? {name:'Chorus tease', why:'Opens on the chorus chords so the hook already feels familiar when it lands.', chords:p.chorus.chords} : pickEntry(style, 'intro', mode);
  p.outro = pickEntry(style, 'outro', mode);
  var old = cur(), lo = (st.bpm || [80, 100])[0], hi = (st.bpm || [80, 100])[1];
  var song = {id:newId(), title:'Song idea ' + (songs().length + 1), style:style, key:old ? old.key : S().root, mode:mode,
    bpm:2 * Math.round((lo + Math.random() * (hi - lo)) / 2), structure:struct.name,
    sections:struct.sections.map(function (t) { return makeSection(t, p[t] || pickEntry(style, t, mode)); }), u:Date.now()};
  var choruses = [];
  song.sections.forEach(function (s, i) { if (s.type === 'chorus') choruses.push(i); });
  if (st.lift && W.lift !== false && choruses.length >= 2) {
    for (var i = choruses[choruses.length - 1]; i < song.sections.length; i++) song.sections[i].shift = 1;
  }
  return song;
}

/* ---------- timeline, voicing and playback ---------- */
function timeline(song, only, once) {
  var items = [];
  song.sections.forEach(function (sec, i) {
    if (only !== undefined && only !== null && only !== i) return;
    var key = songKey(song, sec.shift), list = [];
    sec.chords.forEach(function (t, j) { var p = parse(t); if (p) list.push({p:p, j:j}); });
    var reps = once ? 1 : Math.max(1, sec.reps || 1);
    for (var r = 0; r < reps; r++) list.forEach(function (x) { items.push({i:i, j:x.j, r:r, c:chordOf(x.p, key, modeOf(song))}); });
  });
  var voiced = items.length ? C.voiceLead(items.map(function (it) { return {pc:it.c.root.pc, type:it.c.type, bass:it.c.bass ? it.c.bass.pc : null}; })) : [];
  items.forEach(function (it, k) { it.v = voiced[k]; });
  return items;
}
function clearMarks() {
  document.querySelectorAll('.wchip.now,.wsec.playing,#p-write .pcard.playing').forEach(function (x) { x.classList.remove('now'); x.classList.remove('playing'); });
}
function stopped() { ui.playing = false; clearMarks(); var b = document.querySelector('[data-wplay="song"]'); if (b) b.textContent = 'Play song'; }
function mark(it, follow, chipId) {
  clearMarks();
  var chip = $(chipId || ('wc-' + it.i + '-' + it.j)); if (chip) chip.classList.add('now');
  var sec = $('wsec-' + it.i);
  if (sec) {
    sec.classList.add('playing');
    if (follow && (it.j === 0 && it.r === 0)) {
      var r = sec.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) sec.scrollIntoView({block:'nearest', behavior:reduced() ? 'auto' : 'smooth'});
    }
  }
  var card = $('wpc-' + it.i + '-' + it.j), row = card && card.parentNode;
  if (card) {
    card.classList.add('playing');
    if (row && (card.offsetLeft < row.scrollLeft || card.offsetLeft + card.offsetWidth > row.scrollLeft + row.clientWidth)) row.scrollTo({left:Math.max(0, card.offsetLeft - 4), behavior:reduced() ? 'auto' : 'smooth'});
  }
}
function playItems(items, bpm, opts) {
  opts = opts || {};
  var g = AU.newBus(stopped); if (!g || !items.length) return;
  var spb = 60 / (bpm || 84), t0 = AU.now() + 0.05, acc = 0;
  ui.playing = !!opts.song;
  items.forEach(function (it) {
    var dur = it.c.beats * spb, at = t0 + acc * spb;
    AU.block(g, it.v.slice(1), at, dur * 1.04 + 0.2, 0.006);
    AU.bassNote(g, it.v[0], at, 0.95, Math.max(0.25, dur * 0.95));
    AU.later(function () { mark(it, opts.follow, opts.chip ? opts.chip(it) : null); }, (acc * spb + 0.05) * 1000);
    acc += it.c.beats;
  });
  AU.later(stopped, (acc * spb + 0.7) * 1000);
}
function playChordAt(song, i, j) {
  var items = timeline(song, i, true).filter(function (x) { return x.j === j; }).slice(0, 1);
  if (!items.length) return;
  var g = AU.newBus(stopped); if (!g) return;
  var it = items[0], t = AU.now();
  AU.block(g, it.v.slice(1), t, 2.4, 0.01); AU.bassNote(g, it.v[0], t, 0.95, 2);
  mark(it); AU.later(stopped, 1800);
}

/* ---------- MIDI export ---------- */
function vlq(n) { var b = [n & 0x7F]; n = Math.floor(n / 128); while (n > 0) { b.unshift((n & 0x7F) | 0x80); n = Math.floor(n / 128); } return b; }
function ascii(s) { return asciiName(s).split('').map(function (ch) { return ch.charCodeAt(0); }); }
function meta(type, text) { var b = ascii(text).slice(0, 120); return [0xFF, type].concat(vlq(b.length), b); }
function trackBytes(events) {
  events.sort(function (a, b) { return a.t - b.t || a.o - b.o; });
  var out = [], last = 0;
  events.forEach(function (e) { Array.prototype.push.apply(out, vlq(e.t - last)); Array.prototype.push.apply(out, e.d); last = e.t; });
  out.push(0, 0xFF, 0x2F, 0);
  var n = out.length;
  return ascii('MTrk').concat([(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255], out);
}
function midiFor(song, only) {
  var items = timeline(song, only), PPQ = 480, us = Math.round(60000000 / (song.bpm || 84));
  var t0 = [{t:0, o:0, d:meta(0x03, song.title || 'Song')}, {t:0, o:1, d:[0xFF, 0x51, 0x03, (us >> 16) & 255, (us >> 8) & 255, us & 255]}, {t:0, o:2, d:[0xFF, 0x58, 0x04, 4, 2, 24, 8]}];
  var ch = [{t:0, o:0, d:meta(0x03, 'Chords')}, {t:0, o:1, d:[0xC0, 4]}], bs = [{t:0, o:0, d:meta(0x03, 'Bass')}, {t:0, o:1, d:[0xC1, 33]}];
  var tick = 0, lastSec = -1;
  items.forEach(function (it) {
    var len = Math.round(it.c.beats * PPQ), off = tick + len - 8;
    if (it.i !== lastSec) { var sec = song.sections[it.i]; t0.push({t:tick, o:3, d:meta(0x06, SEC_NAME[sec.type] + (sec.shift ? ' (key up)' : ''))}); lastSec = it.i; }
    var notes = [it.v[0] + 12].concat(it.v.slice(1)).filter(function (m, k, a) { return a.indexOf(m) === k; });
    notes.forEach(function (m) { ch.push({t:tick, o:2, d:[0x90, m, 84]}); ch.push({t:off, o:1, d:[0x80, m, 0]}); });
    bs.push({t:tick, o:2, d:[0x91, it.v[0], 100]}); bs.push({t:tick + Math.round(len * 0.92), o:1, d:[0x81, it.v[0], 0]});
    tick += len;
  });
  var head = ascii('MThd').concat([0, 0, 0, 6, 0, 1, 0, 3, (PPQ >> 8) & 255, PPQ & 255]);
  return new Uint8Array(head.concat(trackBytes(t0), trackBytes(ch), trackBytes(bs)));
}
function exportMidi(song, only) {
  var bytes = midiFor(song, only), part = only !== undefined && only !== null ? ' ' + SEC_NAME[song.sections[only].type] : '';
  var name = (asciiName(song.title || 'Song').replace(/[\\/:*?"<>|]/g, '').trim() || 'Song') + part + ' ' + asciiName(keyLabel(song, only != null ? song.sections[only].shift : 0)) + ' ' + song.bpm + 'bpm.mid';
  var file = null; try { file = new File([bytes], name, {type:'audio/midi'}); } catch (e) {}
  var touchScreen = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
  if (touchScreen && file && navigator.canShare && navigator.canShare({files:[file]})) {
    navigator.share({files:[file], title:name}).catch(function () {});
    return;
  }
  var url = URL.createObjectURL(new Blob([bytes], {type:'audio/midi'})), a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 4000);
  A().toast('Saved ' + name + '. Drag it into your DAW. Chords and bass are on separate tracks.');
}

/* ---------- expert help: roles, swaps and lead ins ---------- */
function roleFor(p, mode) {
  var R = (DATA.roles || {})[mode] || {}, fam = FAMILY[p.type], plain = !p.acc, special = null;
  if (mode === 'major') {
    if (plain && fam === 'min' && p.deg === 4) special = '4min';
    else if (plain && fam === 'dom' && [1, 2, 3, 6].indexOf(p.deg) >= 0) special = p.deg + 'dom';
  } else {
    if (plain && fam === 'dom' && p.deg === 5) special = '5dom';
    else if (plain && fam === 'dom' && p.deg === 4) special = '4dom';
    else if (plain && fam === 'maj' && p.deg === 1) special = '1maj';
  }
  var txt = (special && R[special]) || R[p.acc + p.deg] || 'A color from outside the key. Use it as a quick surprise, then come back home.';
  if (p.bdeg) txt += ' The bass plays the ' + dispNum(p.bacc, p.bdeg, mode) + ' instead of the root, so the bass line moves smoother.';
  return txt;
}
function subsFor(p, mode) { return ((DATA.subs || {})[mode + '|' + p.acc + p.deg + ':' + FAMILY[p.type]] || []).filter(function (s) { return parse(s.to); }); }
function leadIns(p) {
  var semi = semiOf(p.acc, p.deg), out = [];
  var sec = tokFor(((p.deg - 1 + 4) % 7) + 1, (semi + 7) % 12, 'dom7');
  if (sec && !(FAMILY[p.type] === 'dom' && p.deg === 5)) out.push({kind:'sec', p:sec, why:'The 5 of this chord. It borrows a leading tone so this chord sounds like a mini home for a second.'});
  var dim = tokFor(((p.deg - 2 + 7) % 7) + 1, (semi + 11) % 12, 'dim7');
  if (dim) out.push({kind:'dim', p:dim, why:'Passing diminished. The bass climbs a half step into this chord, pure gospel.'});
  var two = tokFor(((p.deg - 1 + 1) % 7) + 1, (semi + 2) % 12, 'min7');
  if (two && sec) out.push({kind:'two', p:two, p2:sec, why:'A 2 5 into this chord. Two quick chords that make the landing feel earned.'});
  return out;
}
function halves(b) { return b >= 8 ? [b / 2, b / 2] : b === 6 ? [3, 3] : b === 4 ? [2, 2] : b === 3 ? [2, 1] : b === 2 ? [1, 1] : null; }

/* ---------- rendering ---------- */
function render() {
  if (!$('p-write')) return;
  var W = S().write, pane = W.pane === 'moves' ? 'moves' : 'build';
  $('w-pane').innerHTML = [['build','Song builder'],['moves','Pro moves']].map(function (o) { return '<button type="button" data-wpane="' + o[0] + '" aria-pressed="' + (pane === o[0]) + '">' + o[1] + '</button>'; }).join('');
  $('w-build').hidden = pane !== 'build'; $('w-moves').hidden = pane !== 'moves';
  if (pane === 'build') renderBuild(); else renderMoves();
}
function seg(attr, list, val, label) {
  return '<div class="seg" aria-label="' + label + '">' + list.map(function (o) { return '<button type="button" data-' + attr + '="' + o[0] + '" aria-pressed="' + (val === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>';
}
function songMinutes(song) {
  var beats = 0; song.sections.forEach(function (s) { beats += loopBeats(s.chords) * Math.max(1, s.reps || 1); });
  var sec = Math.round(beats * 60 / (song.bpm || 84)); return {bars:Math.round(beats / 4), time:Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2)};
}
function renderBuild() {
  var W = S().write, st = DATA.styles[W.style] || DATA.styles.neosoul, song = cur(), h = '';
  h += '<div class="box wgen"><div class="wgen-top"><div style="display:grid;gap:4px;min-width:0"><h3>Write a new song</h3><p class="muted small">' + esc(st.blurb || '') + '</p></div></div>' +
    '<div class="row">' + seg('wstyle', STYLE_KEYS.map(function (k) { return [k, STYLE_SHORT[k]]; }), DATA.styles[W.style] ? W.style : 'neosoul', 'Style') +
    seg('wmode', [['major','Major'],['minor','Minor']], W.mode === 'minor' ? 'minor' : 'major', 'Major or minor') + '</div>' +
    (st.lift ? '<label class="check-row small"><input type="checkbox" id="w-lift"' + (W.lift !== false ? ' checked' : '') + '> Key change up on the last chorus</label>' : '') +
    '<div class="row"><button type="button" class="btn primary big" data-wnew="1">Write me a song</button>' +
    (songs().length ? '<label class="wsongs"><span class="eyebrow">My songs</span><select id="w-songs">' + songs().slice().sort(function (a, b) { return (b.u || 0) - (a.u || 0); }).map(function (s) { return '<option value="' + s.id + '"' + (song && s.id === song.id ? ' selected' : '') + '>' + esc(s.title || 'Untitled') + '</option>'; }).join('') + '</select></label>' : '') + '</div></div>';
  if (!song) {
    h += '<div class="box wempty"><b>No song yet.</b><p class="muted">Pick a style and tap Write me a song. You get a full song laid out, intro to outro, with chords for every section and the reason each one works. Then make it yours: swap chords, add passing chords, rewrite sections and export the MIDI.</p></div>';
    $('w-build').innerHTML = h; return;
  }
  var mode = modeOf(song), len = songMinutes(song), canUndo = ui.undo.some(function (u) { return u.id === song.id; });
  h += '<div class="box whead">' +
    '<div class="field"><label for="w-title">Song title</label><input id="w-title" type="text" value="' + esc(song.title || '') + '" autocomplete="off"></div>' +
    '<p class="muted small" id="w-meta">' + esc((DATA.styles[song.style] || {}).name || '') + (song.structure ? ', ' + esc(song.structure) + ' structure' : '') + '. ' + len.bars + ' bars, about ' + len.time + '.</p>' +
    '<div class="row wctl"><label class="wkey"><span class="eyebrow">Key</span><select id="w-key">' + ROOTS.map(function (r, i) { return '<option value="' + i + '"' + (i === song.key ? ' selected' : '') + '>' + nm(A().keyRootFor(i, mode)) + ' ' + mode + '</option>'; }).join('') + '</select></label>' +
    '<div class="wbpm"><span class="eyebrow">Tempo</span><div class="stepper"><button type="button" class="btn" data-wbpm="-2" aria-label="Slower">−</button><b>' + song.bpm + '</b><button type="button" class="btn" data-wbpm="2" aria-label="Faster">+</button></div></div></div>' +
    '<div class="row"><button type="button" class="btn primary" data-wplay="song">' + (ui.playing ? 'Stop' : 'Play song') + '</button><button type="button" class="btn" data-wmidi="song">Export MIDI</button>' +
    (canUndo ? '<button type="button" class="btn" data-wundo="1">Undo</button>' : '') +
    '<button type="button" class="btn ghost" data-wdel="1">' + (Date.now() - ui.delArm < 3000 ? 'Tap again to delete' : 'Delete song') + '</button></div></div>';
  h += '<div class="wsecs">' + song.sections.map(function (sec, i) { return secHTML(song, sec, i); }).join('') + '</div>';
  h += '<div class="box wadd"><span class="eyebrow">Add a section</span><div class="row">' + SECTIONS.map(function (t) { return '<button type="button" class="btn" data-wadd="' + t + '">+ ' + SEC_NAME[t] + '</button>'; }).join('') + '</div></div>';
  $('w-build').innerHTML = h;
}
function chipHTML(id, c, data, sel) {
  return '<button type="button" class="wchip' + (sel ? ' sel' : '') + '" id="' + id + '" ' + data + ' style="--chord:var(--c-' + c.type + ');flex:' + c.beats + ' 1 ' + (c.beats * 21 + 34) + 'px">' +
    '<span class="wnum">' + c.num + '</span><span class="wnm">' + esc(c.name) + '</span><span class="wlen">' + beatsLabel(c.beats) + '</span></button>';
}
function secHTML(song, sec, i) {
  var key = songKey(song, sec.shift), mode = modeOf(song), beats = loopBeats(sec.chords), reps = Math.max(1, sec.reps || 1);
  var chips = sec.chords.map(function (t, j) { var p = parse(t); if (!p) return ''; return chipHTML('wc-' + i + '-' + j, chordOf(p, key, mode), 'data-wc="' + i + ':' + j + '"', ui.edit && ui.edit.i === i && ui.edit.j === j); }).join('');
  var h = '<section class="wsec" id="wsec-' + i + '" data-type="' + sec.type + '">' +
    '<div class="wsec-head"><select data-wtype="' + i + '" aria-label="Section type">' + SECTIONS.map(function (t) { return '<option value="' + t + '"' + (t === sec.type ? ' selected' : '') + '>' + SEC_NAME[t] + '</option>'; }).join('') + '</select>' +
    '<span class="wsec-name">' + esc((sec.name || '') + (sec.edited ? ', edited' : '')) + '</span><span class="pill">' + (beats / 4) + ' bar' + (beats === 4 ? '' : 's') + (reps > 1 ? ' × ' + reps : '') + '</span>' +
    (sec.shift ? '<span class="pill lift">Key up to ' + esc(nm(key)) + '</span>' : '') + '</div>' +
    '<div class="wchips">' + chips + '</div>';
  if (ui.edit && ui.edit.i === i) h += editorHTML(song, i, ui.edit.j);
  if (sec.why) h += '<p class="why"><b>' + (sec.edited ? 'Why the original idea works.' : 'Why it works.') + '</b> ' + esc(sec.why) + '</p>';
  h += '<div class="wsec-actions"><button type="button" class="btn" data-wplay="' + i + '">Play</button><button type="button" class="btn" data-wre="' + i + '">Rewrite</button>' +
    '<button type="button" class="btn" data-wdia="' + i + '" aria-pressed="' + (ui.dia === i) + '">' + (ui.dia === i ? 'Hide chords' : 'Chord shapes') + '</button>' +
    '<button type="button" class="btn ghost" data-wmore="' + i + '" aria-pressed="' + (ui.more === i) + '">' + (ui.more === i ? 'Less' : 'More') + '</button>' + (ui.more !== i ? '</div>' : '<div class="wmore-body">' +
    '<div class="wreps"><span class="small muted">Plays</span><button type="button" class="btn" data-wreps="' + i + ':-1" aria-label="Fewer times">−</button><b>' + reps + '×</b><button type="button" class="btn" data-wreps="' + i + ':1" aria-label="More times">+</button></div>' +
    '<button type="button" class="btn" data-wshift="' + i + '">' + (sec.shift === 1 ? 'Key change: up a whole step' : sec.shift === 2 ? 'No key change' : 'Key change: up a half step') + '</button>' +
    '<button type="button" class="btn" data-wmove="' + i + ':-1"' + (i === 0 ? ' disabled' : '') + '>Move up</button><button type="button" class="btn" data-wmove="' + i + ':1"' + (i === song.sections.length - 1 ? ' disabled' : '') + '>Move down</button>' +
    '<button type="button" class="btn" data-wmidi="' + i + '">MIDI of this part</button><button type="button" class="btn ghost" data-wrm="' + i + '">Remove section</button></div></div>');
  if (ui.dia === i) h += diagramsHTML(song, i);
  return h + '</section>';
}
function editorHTML(song, i, j) {
  var sec = song.sections[i], p = parse(sec.chords[j]); if (!p) return '';
  var mode = modeOf(song), key = songKey(song, sec.shift), c = chordOf(p, key, mode), T = TYPES[p.type], fam = FAMILY[p.type];
  var subs = subsFor(p, mode), cols = (COLORS[fam] || []).filter(function (t) { return t !== p.type; });
  var h = '<div class="wedit" style="--chord:var(--c-' + p.type + ')"><div class="wedit-head"><span class="pnum">' + c.num + '</span><div style="min-width:0"><b class="pname">' + esc(c.name) + '</b><span class="tname">' + T.name + ', ' + beatsLabel(p.beats) + '</span></div>' +
    '<button type="button" class="btn" data-wclose="1">Done</button></div>' +
    '<p class="small">' + esc(roleFor(p, mode)) + '</p>';
  if (subs.length) h += '<span class="eyebrow">Swap it for</span><div class="wopts">' + subs.map(function (s, k) { var q = parse(s.to); q.beats = p.beats; var qc = chordOf(q, key, mode); return '<button type="button" class="wopt" data-wsub="' + i + ':' + j + ':' + k + '" style="--chord:var(--c-' + q.type + ')"><b><span class="dot"></span>' + qc.num + ' ' + esc(qc.name) + '</b><small>' + esc(s.why) + '</small></button>'; }).join('') + '</div>';
  if (cols.length) h += '<span class="eyebrow">Change the color</span><div class="wcols">' + cols.map(function (t) { var q = clone(p); q.type = t; var qc = chordOf(q, key, mode); return '<button type="button" class="chip" data-wcol="' + i + ':' + j + ':' + t + '" style="--chord:var(--c-' + t + ')"><span class="dot"></span>' + esc(qc.name) + '</button>'; }).join('') + '</div>';
  var li = leadIns(p);
  if (li.length) h += '<span class="eyebrow">Lead into it</span><div class="wopts">' + li.map(function (x) {
    var a = chordOf(x.p, key, mode), label = x.kind === 'two' ? a.name + ' ' + chordOf(x.p2, key, mode).name : a.name;
    return '<button type="button" class="wopt" data-wins="' + i + ':' + j + ':' + x.kind + '" style="--chord:var(--c-' + x.p.type + ')"><b><span class="dot"></span>' + esc(label) + ' into ' + esc(c.name) + '</b><small>' + esc(x.why) + '</small></button>';
  }).join('') + '</div>';
  h += '<span class="eyebrow">Length</span><div class="row">' + seg('wlen', LENS.map(function (b) { return [i + ':' + j + ':' + b, beatsLabel(b)]; }), i + ':' + j + ':' + p.beats, 'Length') + '</div>' +
    '<div class="row"><button type="button" class="btn" data-wplayc="' + i + ':' + j + '">Hear it</button>' + (sec.chords.length > 1 ? '<button type="button" class="btn ghost" data-wrmc="' + i + ':' + j + '">Remove chord</button>' : '') + '</div></div>';
  return h;
}
function fretPos(frets) { var f = frets.filter(function (x) { return x !== null; }); return f.reduce(function (a, b) { return a + b; }, 0) / (f.length || 1); }
function diagramsHTML(song, i) {
  var items = timeline(song, i, true), v = S().write.view || 'all';
  if (!items.length) return '';
  var lo = Infinity, hi = -Infinity;
  items.forEach(function (it) { it.v.slice(1).forEach(function (m) { if (m < lo) lo = m; if (m > hi) hi = m; }); });
  var start = lo; while (start % 12 !== 0 && start % 12 !== 5) start--;
  var end = Math.max(hi, start + 23); while (end % 12 !== 4 && end % 12 !== 11) end++;
  var prev = null;
  var cards = items.map(function (it) {
    var c = it.c, T = TYPES[c.type], on = {}, id = i + '-' + it.j;
    var vs = C.guitarVoicings(c.type, c.root.pc), g = null, bc = Infinity;
    if (vs.length) {
      if (prev === null) g = C.lowestVoicing(c.type, c.root.pc);
      else vs.forEach(function (x) { var cost = Math.abs(fretPos(x.frets) - prev) + fretPos(x.frets) * 0.05; if (cost < bc) { bc = cost; g = x; } });
      prev = fretPos(g.frets);
    }
    it.v.slice(1).forEach(function (m) { on[m] = {lab:C.labelFor(T, ((m - c.root.pc) % 12 + 12) % 12), lh:false}; });
    var b = C.bassBox(c.type, c.root.pc, c.bass ? c.bass.pc : null), low = c.bass || c.root;
    var h = '<article class="pcard" id="wpc-' + id + '" style="--chord:var(--c-' + c.type + ')"><div class="pcard-head"><span class="pnum' + (c.num.length > 3 ? ' sm' : '') + '">' + c.num + '</span><div style="min-width:0"><b class="pname">' + esc(c.name) + '</b><span class="tname">' + T.name + ', ' + beatsLabel(c.beats) + '</span></div></div>';
    if (v === 'all' || v === 'piano') h += '<div class="inst">' + (v === 'all' ? '<span class="eyebrow">Piano</span>' : '') + '<button type="button" class="dia" data-wpc="' + id + '" data-winst="keys" aria-label="Play ' + esc(c.name) + ' on piano">' + C.svg.keys(on, start, end - start + 1) + '<small><span class="lh-dot"></span>Left hand: ' + esc(nm(low)) + ' down low. Right hand: the colored keys.</small></button></div>';
    if ((v === 'all' || v === 'guitar') && g) h += '<div class="inst">' + (v === 'all' ? '<span class="eyebrow">Guitar</span>' : '') + '<button type="button" class="dia gtr-one" data-wpc="' + id + '" data-winst="guitar" aria-label="Strum ' + esc(c.name) + '">' + C.svg.guitar(c.type, c.root.pc, g.frets) + '<small>' + g.label + (c.bass ? '. The bass player takes the ' + esc(nm(c.bass)) + '.' : '') + '</small></button></div>';
    if (v === 'all' || v === 'bass') h += '<div class="inst">' + (v === 'all' ? '<span class="eyebrow">Bass</span>' : '') + '<button type="button" class="dia bass-dia" data-wpc="' + id + '" data-winst="bass" aria-label="Play ' + esc(c.name) + ' on bass">' + C.svg.bass(c.type, c.root.pc, c.bass ? c.bass.pc : null) + '<small>' + (c.bass ? 'Bass note ' + esc(nm(c.bass)) : 'Root') + ' on the ' + (b.rs === 0 ? 'E' : 'A') + ' string, fret ' + b.rf + '. Outlined dot is where to start.</small></button></div>';
    return h + '</article>';
  }).join('');
  return '<div class="wdia"><div class="row">' + seg('wview', [['all','All'],['piano','Piano'],['guitar','Guitar'],['bass','Bass']], v, 'Instrument') + '</div><div class="cards-row">' + cards + '</div></div>';
}
function lessonKey(l) { var song = cur(); return {song:{key:song ? song.key : S().root, mode:l.mode === 'minor' ? 'minor' : 'major'}}; }
function renderMoves() {
  var W = S().write, f = W.moveStyle && (W.moveStyle === 'all' || DATA.styles[W.moveStyle]) ? W.moveStyle : 'all', song = cur();
  var list = (DATA.lessons || []).map(function (l, k) { return {l:l, k:k}; }).filter(function (x) { return f === 'all' || (x.l.styles || []).indexOf(f) >= 0; });
  var h = '<div class="moves-head"><p class="muted" style="max-width:62ch">The moves that make progressions sound expensive. Hear the plain version, then the pro version, in ' + esc(nm(A().keyRootFor(song ? song.key : S().root, 'major'))) + '. Tap Add to my song to drop the pro version in as a new section.</p>' +
    seg('lstyle', [['all','All']].concat(STYLE_KEYS.map(function (k) { return [k, STYLE_SHORT[k]]; })), f, 'Style') + '</div><div class="lessons">';
  h += list.map(function (x) {
    var l = x.l, k = x.k, fake = lessonKey(l).song, key = songKey(fake, 0), mode = modeOf(fake);
    var row = function (which) {
      return '<div class="ab-row"><div class="ab-label"><span class="eyebrow">' + (which === 'plain' ? 'Plain' : 'Pro') + '</span><button type="button" class="btn' + (which === 'pro' ? ' primary' : '') + '" data-lplay="' + k + ':' + which + '">Hear it</button></div><div class="wchips">' +
        (l[which] || []).map(function (t, j) { var p = parse(t); return p ? chipHTML('lc-' + k + '-' + which + '-' + j, chordOf(p, key, mode), 'data-lc="' + k + ':' + which + ':' + j + '"', false) : ''; }).join('') + '</div></div>';
    };
    return '<article class="lesson box" id="les-' + k + '"><div class="lesson-head"><h3>' + esc(l.title) + '</h3><span class="muted small">' + (l.styles || []).map(function (s) { return STYLE_SHORT[s] || s; }).join(', ') + (mode === 'minor' ? ', in ' + esc(nm(key)) + ' minor' : '') + '</span></div>' +
      '<p>' + esc(l.what) + '</p>' + row('plain') + row('pro') +
      '<div class="row"><button type="button" class="btn" data-lab="' + k + '">Plain, then pro</button><button type="button" class="btn ghost" data-ladd="' + k + '">Add to my song</button></div>' +
      '<details class="lwhy"><summary>Why it works</summary><p>' + esc(l.why) + '</p><p><b>Where to use it.</b> ' + esc(l.how) + '</p><p><b>Listen for.</b> ' + esc(l.ear) + '</p></details></article>';
  }).join('');
  $('w-moves').innerHTML = h + '</div>';
}
function lessonItems(l, which) {
  var fake = lessonKey(l).song, key = songKey(fake, 0), mode = modeOf(fake), items = [];
  (l[which] || []).forEach(function (t, j) { var p = parse(t); if (p) items.push({i:-1, j:j, r:0, which:which, c:chordOf(p, key, mode)}); });
  var voiced = C.voiceLead(items.map(function (it) { return {pc:it.c.root.pc, type:it.c.type, bass:it.c.bass ? it.c.bass.pc : null}; }));
  items.forEach(function (it, n) { it.v = voiced[n]; });
  return items;
}

/* ---------- events ---------- */
function ensureSong() {
  var song = cur();
  if (!song) { song = writeSong(); S().songs.push(song); S().songId = song.id; touch(song); }
  return song;
}
function ints(s) { return String(s).split(':').map(function (x) { return isNaN(+x) ? x : +x; }); }
document.addEventListener('click', function (e) {
  var b = e.target.closest('button'); if (!b || b.disabled || !b.closest('#p-write')) return;
  var d = b.dataset, song = cur(), st = S();
  if (d.wpane) { st.write.pane = d.wpane; A().save('settings'); AU.stopAll(stopped); render(); window.scrollTo(0, 0); return; }
  if (d.wstyle) { st.write.style = d.wstyle; A().save('settings'); render(); return; }
  if (d.wmode) { st.write.mode = d.wmode; A().save('settings'); render(); return; }
  if (d.wnew) {
    AU.stopAll(stopped);
    var ns = writeSong(); st.songs.push(ns); st.songId = ns.id; ui.edit = null; ui.dia = null; ui.more = null; touch(ns); render();
    A().toast('Wrote ' + ns.title + ' in ' + keyLabel(ns) + ' at ' + ns.bpm + ' BPM. Tap any chord to tweak it.');
    playItems(timeline(ns, 0), ns.bpm, {follow:false});
    return;
  }
  if (d.lstyle) { st.write.moveStyle = d.lstyle; A().save('settings'); render(); return; }
  if (d.lplay || d.lab || d.lc) {
    var lk = +(d.lplay || d.lab || d.lc).split(':')[0], les = DATA.lessons[lk]; if (!les) return;
    var chipFn = function (it) { return 'lc-' + lk + '-' + it.which + '-' + it.j; };
    if (d.lc) { var q = ints(d.lc), one = lessonItems(les, q[1]).filter(function (it) { return it.j === q[2]; }); playItems(one, 60, {chip:chipFn}); return; }
    var items = d.lab ? lessonItems(les, 'plain').concat(lessonItems(les, 'pro')) : lessonItems(les, d.lplay.split(':')[1]);
    playItems(items, song ? song.bpm : 84, {chip:chipFn});
    return;
  }
  if (d.ladd) {
    var l2 = DATA.lessons[+d.ladd]; if (!l2) return;
    var s2 = ensureSong(); snap(s2);
    s2.sections.push({type:'bridge', chords:l2.pro.slice(), reps:1, name:l2.title, why:l2.why, shift:0}); touch(s2);
    A().toast('Added ' + l2.title + ' as a new bridge at the end of ' + (s2.title || 'your song') + '. Move it or change its type in the builder.');
    return;
  }
  if (!song) return;
  if (d.wplay) {
    if (d.wplay === 'song') {
      if (ui.playing) { AU.stopAll(stopped); return; }
      playItems(timeline(song), song.bpm, {song:true, follow:true}); b.textContent = 'Stop'; return;
    }
    playItems(timeline(song, +d.wplay), song.bpm, {}); return;
  }
  if (d.wmidi) { exportMidi(song, d.wmidi === 'song' ? null : +d.wmidi); return; }
  if (d.wundo) {
    for (var u = ui.undo.length - 1; u >= 0; u--) if (ui.undo[u].id === song.id) {
      var back = ui.undo.splice(u, 1)[0].data, idx = st.songs.indexOf(song);
      back.u = Date.now(); st.songs[idx] = back; A().save(); ui.edit = null; render(); A().toast('Undone.'); return;
    }
    return;
  }
  if (d.wdel) {
    if (Date.now() - ui.delArm > 3000) { ui.delArm = Date.now(); b.textContent = 'Tap again to delete'; return; }
    ui.delArm = 0; song.del = true; touch(song); var rest = songs(); st.songId = rest.length ? rest[0].id : ''; ui.edit = null; ui.dia = null; render(); A().toast('Song deleted.'); return;
  }
  if (d.wbpm) { song.bpm = Math.max(50, Math.min(180, (song.bpm || 84) + (+d.wbpm))); touch(song); render(); return; }
  if (d.wc) {
    var wc = ints(d.wc);
    ui.edit = ui.edit && ui.edit.i === wc[0] && ui.edit.j === wc[1] ? null : {i:wc[0], j:wc[1]};
    render(); playChordAt(song, wc[0], wc[1]);
    var ed = document.querySelector('#wsec-' + wc[0] + ' .wedit'); if (ed) { var rr = ed.getBoundingClientRect(); if (rr.bottom > window.innerHeight) ed.scrollIntoView({block:'nearest', behavior:reduced() ? 'auto' : 'smooth'}); }
    return;
  }
  if (d.wclose) { ui.edit = null; render(); return; }
  if (d.wplayc) { var pc2 = ints(d.wplayc); playChordAt(song, pc2[0], pc2[1]); return; }
  if (d.wsub || d.wcol || d.wlen) {
    var a = ints(d.wsub || d.wcol || d.wlen), sec = song.sections[a[0]], p = parse(sec.chords[a[1]]); if (!p) return;
    var np;
    if (d.wsub) { var sub = subsFor(p, modeOf(song))[a[2]]; if (!sub) return; np = parse(sub.to); np.beats = p.beats; }
    else if (d.wcol) { np = clone(p); np.type = a[2]; }
    else { np = clone(p); np.beats = a[2]; }
    editChords(song, a[0], function (t) { t[a[1]] = tokOf(np); });
    render(); playChordAt(song, a[0], a[1]); return;
  }
  if (d.wins) {
    var w = ints(d.wins), sx = song.sections[w[0]], target = parse(sx.chords[w[1]]); if (!target) return;
    var li = leadIns(target).filter(function (x) { return x.kind === w[2]; })[0]; if (!li) return;
    var j0 = w[1], donorIdx = j0 > 0 ? j0 - 1 : j0, donor = parse(sx.chords[donorIdx]), parts = donor && halves(donor.beats);
    if (!parts) { A().toast('Not enough room before this chord. Make the chord before it longer first.'); return; }
    var room = j0 > 0 ? parts[1] : parts[0], ins;
    if (li.kind === 'two') { var hh = halves(room); ins = hh ? [clone(li.p), clone(li.p2)] : [clone(li.p2)]; if (hh) { ins[0].beats = hh[0]; ins[1].beats = hh[1]; } else ins[0].beats = room; }
    else { ins = [clone(li.p)]; ins[0].beats = room; }
    donor.beats = j0 > 0 ? parts[0] : parts[1];
    var newJ = editChords(song, w[0], function (t) { t[donorIdx] = tokOf(donor); t.splice.apply(t, [j0, 0].concat(ins.map(tokOf))); return j0 + ins.length; });
    ui.edit = {i:w[0], j:newJ}; render();
    playItems(timeline(song, w[0], true).filter(function (it) { return it.j >= Math.max(0, j0 - 1) && it.j <= newJ; }), song.bpm, {});
    return;
  }
  if (d.wrmc) {
    var rm = ints(d.wrmc);
    editChords(song, rm[0], function (t) { if (t.length > 1) t.splice(rm[1], 1); });
    ui.edit = null; render(); return;
  }
  if (d.wre) {
    var ri = +d.wre, rsec = song.sections[ri], group = linked(song, ri);
    var entry = pickEntry(song.style, rsec.type, modeOf(song), null, rsec.name);
    if (!entry) return;
    snap(song);
    group.forEach(function (k) { var s = song.sections[k]; s.chords = entry.chords.slice(); s.name = entry.name; s.why = entry.why; s.edited = false; s.reps = repsFor(s.type, entry.chords); });
    touch(song); ui.edit = null; render();
    playItems(timeline(song, ri, true), song.bpm, {});
    if (group.length > 1) A().toast('Rewrote every ' + SEC_NAME[rsec.type].toLowerCase() + ' so they still match.');
    return;
  }
  if (d.wmore) { var mo = +d.wmore; ui.more = ui.more === mo ? null : mo; render(); return; }
  if (d.wdia) { var di = +d.wdia; ui.dia = ui.dia === di ? null : di; render(); return; }
  if (d.wview) { st.write.view = d.wview; A().save('settings'); render(); return; }
  if (d.wreps) { var rp = ints(d.wreps), s3 = song.sections[rp[0]]; snap(song); s3.reps = Math.max(1, Math.min(8, (s3.reps || 1) + rp[1])); touch(song); render(); return; }
  if (d.wshift) { var s4 = song.sections[+d.wshift]; snap(song); s4.shift = ((s4.shift || 0) + 1) % 3; touch(song); render(); return; }
  if (d.wmove) {
    var mv = ints(d.wmove), from2 = mv[0], to2 = from2 + mv[1];
    if (to2 < 0 || to2 >= song.sections.length) return;
    snap(song); var moving = song.sections.splice(from2, 1)[0]; song.sections.splice(to2, 0, moving); touch(song); ui.edit = null; ui.dia = null; ui.more = to2; render();
    var el = $('wsec-' + to2); if (el) el.scrollIntoView({block:'nearest'}); return;
  }
  if (d.wrm) { if (song.sections.length <= 1) return; snap(song); song.sections.splice(+d.wrm, 1); touch(song); ui.edit = null; ui.dia = null; ui.more = null; render(); A().toast('Section removed. Undo brings it back.'); return; }
  if (d.wadd) {
    var t5 = d.wadd, same = song.sections.filter(function (s) { return s.type === t5; })[0];
    var add = same ? clone(same) : makeSection(t5, pickEntry(song.style, t5, modeOf(song)));
    if (same) add.shift = 0;
    snap(song); song.sections.push(add); touch(song); render();
    var el2 = $('wsec-' + (song.sections.length - 1)); if (el2) el2.scrollIntoView({block:'center', behavior:reduced() ? 'auto' : 'smooth'});
    return;
  }
  if (d.wpc && d.winst) {
    var pp = ints(d.wpc), its = timeline(song, pp[0], true).filter(function (x) { return x.j === pp[1]; }); if (!its.length) return;
    var gg = AU.newBus(stopped); if (!gg) return; var it = its[0], tt = AU.now();
    if (d.winst === 'guitar') { var gv = C.lowestVoicing(it.c.type, it.c.root.pc); if (gv) AU.strum(gg, C.voicingMidis(gv.frets), tt); }
    else if (d.winst === 'bass') { var bb = C.bassBox(it.c.type, it.c.root.pc, it.c.bass ? it.c.bass.pc : null), base = C.OPENB[bb.rs] + bb.rf; [0, 7, 12].forEach(function (x, n) { AU.bassNote(gg, base + x, tt + n * 0.32); }); }
    else AU.block(gg, it.v, tt, 2.4, 0.01);
    mark(it); AU.later(stopped, 2000); return;
  }
});
document.addEventListener('change', function (e) {
  var t = e.target; if (!t.closest || !t.closest('#p-write')) return;
  var song = cur(), st = S();
  if (t.id === 'w-lift') { st.write.lift = t.checked; A().save('settings'); return; }
  if (t.id === 'w-songs') { st.songId = t.value; ui.edit = null; ui.dia = null; ui.more = null; AU.stopAll(stopped); A().save(); render(); return; }
  if (!song) return;
  if (t.id === 'w-key') { snap(song); song.key = +t.value; touch(song); render(); playItems(timeline(song, 0, true).slice(0, 4), song.bpm, {}); return; }
  if (t.dataset.wtype !== undefined) { var s = song.sections[+t.dataset.wtype]; snap(song); s.type = t.value; touch(song); render(); return; }
});
document.addEventListener('input', function (e) {
  var t = e.target; if (t.id !== 'w-title') return;
  var song = cur(); if (!song) return;
  song.title = t.value.slice(0, 80); song.u = Date.now(); A().save('soft');
  var opt = document.querySelector('#w-songs option[value="' + song.id + '"]'); if (opt) opt.textContent = song.title || 'Untitled';
});

window.CCWrite = {render:function () { var ae = document.activeElement; if (ae && ae.closest && ae.closest('#p-write') && /INPUT|SELECT|TEXTAREA/.test(ae.tagName)) return; render(); }, parse:parse, tokOf:tokOf, chordOf:chordOf, writeSong:writeSong, timeline:timeline, midiFor:midiFor, leadIns:leadIns, subsFor:subsFor, roleFor:roleFor, dispNum:dispNum,
  stop:function () { AU.stopAll(stopped); }, ui:ui};
})();
