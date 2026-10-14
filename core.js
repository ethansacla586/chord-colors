/* Chord Colors core: music theory, chord shapes, sound engine and diagrams. */
(function () {
'use strict';

/* ---------- theory ---------- */
var LETTERS = ['C','D','E','F','G','A','B'], LPC = [0,2,4,5,7,9,11];
var IV = {'1':[0,0],'b3':[3,2],'3':[4,2],'4':[5,3],'b5':[6,4],'5':[7,4],'6':[9,5],'b7':[10,6],'7':[11,6],'9':[2,1],'11':[5,3],'13':[9,5]};
var ROOTS = [[0,0],[1,1],[1,2],[2,3],[2,4],[3,5],[3,6],[4,7],[5,8],[5,9],[6,10],[6,11]].map(function (a) { return {l:a[0], pc:a[1]}; });
var MAJ = [0,2,4,5,7,9,11];
var FIFTHS = [0,7,2,9,4,11,6,1,8,3,10,5]; // circle of fifths order as root indexes
function accOf(n) { var a = ((n.pc - LPC[n.l]) + 18) % 12 - 6; return a === 0 ? '' : a === 1 ? '♯' : a === -1 ? '♭' : a === 2 ? '♯♯' : '♭♭'; }
function nm(n) { return LETTERS[n.l] + accOf(n); }
function up(r, lab) { var v = IV[lab]; return {l:(r.l + v[1]) % 7, pc:(r.pc + v[0]) % 12}; }
function fmt(lab) { return String(lab).replace('b','♭'); }
function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function rnd(n) { return Math.floor(Math.random() * n); }
function pick(a) { return a[rnd(a.length)]; }

var TYPES = {
 maj:{name:'Major',sym:'',level:1,formula:['1','3','5'],piano:[['1',0],['1',12],['3',16],['5',19]],lh:1,
  gE:[0,2,2,1,0,0],gA:[null,0,2,2,2,0],gD:[null,null,0,2,3,2],
  sounds:'Bright, settled, home.',listen:'The middle note sits high and lifted.',lives:'The 1, 4 and 5 of a major key.',
  tip:function(){return 'The 3rd decides it. A major 3rd sits 4 half steps above the root.';}},
 min:{name:'Minor',sym:'m',level:1,formula:['1','b3','5'],piano:[['1',0],['1',12],['b3',15],['5',19]],lh:1,
  gE:[0,2,2,0,0,0],gA:[null,0,2,2,1,0],gD:[null,null,0,2,3,1],
  sounds:'Darker and inward. Moody without being sour.',listen:'The middle note drops a half step and everything shades over.',lives:'The 2, 3 and 6 of a major key. Home base of a minor key.',
  tip:function(){return 'Take the major chord and drop the 3rd a half step.';}},
 maj7:{name:'Major 7',sym:'maj7',level:2,formula:['1','3','5','7'],piano:[['1',0],['1',12],['3',16],['5',19],['7',23]],lh:1,
  gE:[0,null,1,1,0,null],gA:[null,0,2,1,2,0],gD:[null,null,0,2,2,2],
  sounds:'Dreamy and floaty with a bittersweet edge. Late night Rhodes.',listen:'A top note that rubs a half step under the root.',lives:'The 1 and the 4. The 4 maj7 is a neo soul favorite.',
  tip:function(r){return nm(up(r,'3'))+'m triad with '+nm(r)+' in the bass.';}},
 min7:{name:'Minor 7',sym:'m7',level:2,formula:['1','b3','5','b7'],piano:[['1',0],['1',12],['b3',15],['5',19],['b7',22]],lh:1,
  gE:[0,null,0,0,0,null],gA:[null,0,2,0,1,0],gD:[null,null,0,2,1,1],
  sounds:'Mellow and smooth. Minor without the heavy sadness.',listen:'A soft flat 7 on top that blurs the minor mood.',lives:'The 2, 3 and 6. The default chord in R&B.',
  tip:function(r){return nm(up(r,'b3'))+' major triad with '+nm(r)+' in the bass.';}},
 dom7:{name:'Dominant 7',sym:'7',level:2,formula:['1','3','5','b7'],piano:[['1',0],['1',12],['3',16],['5',19],['b7',22]],lh:1,
  gE:[0,null,0,1,0,null],gA:[null,0,2,0,2,0],gD:[null,null,0,2,1,2],
  sounds:'Bluesy tension. It wants to move somewhere.',listen:'The flat 7 clashing with the major 3rd.',lives:'The 5 chord. It pulls hard back to the 1.',
  tip:function(r){return 'Major triad plus '+nm(up(r,'b7'))+', a whole step under the root.';}},
 add9:{name:'Add 9',sym:'add9',level:3,formula:['1','3','5','9'],piano:[['1',0],['5',7],['9',14],['3',16],['5',19]],lh:2,
  gE:[0,null,2,1,0,2],gA:[null,0,2,4,2,0],gD:[null,null,0,-1,-2,0],
  sounds:'Major with sparkle on top. Open and clean, no jazz yet.',listen:'A note just above the root adds shimmer, and there is no 7th.',lives:'Anywhere a plain major chord lives: 1, 4, 5.',
  tip:function(r){return 'Major triad plus '+nm(up(r,'9'))+', a whole step above the root.';}},
 maj9:{name:'Major 9',sym:'maj9',level:3,formula:['1','3','5','7','9'],piano:[['1',0],['7',11],['9',14],['3',16],['5',19]],lh:1,
  gE:[0,null,1,1,0,2],gA:[null,0,-1,1,0,null],gD:[null,null,0,-1,2,0],
  sounds:'Lush and expensive. Peak neo soul major.',listen:'The maj7 dream plus air up top, like a high shelf boost.',lives:'The 1 and the 4, when you want it lush.',
  tip:function(r){return nm(up(r,'3'))+'m7 with '+nm(r)+' in the bass.';}},
 min9:{name:'Minor 9',sym:'m9',level:3,formula:['1','b3','5','b7','9'],piano:[['1',0],['b7',10],['9',14],['b3',15],['5',19]],lh:1,
  gE:[0,null,0,0,0,2],gA:[null,0,-2,0,0,null],gD:[null,null,0,-2,1,0],
  sounds:'Warm, smoky, rich. Minor that feels like velvet.',listen:'The m7 warmth plus a 9th that adds gloss.',lives:'The 2 and the 6. Smooth 2 5 1s start here.',
  tip:function(r){return nm(up(r,'b3'))+'maj7 with '+nm(r)+' in the bass.';}},
 dom9:{name:'Dominant 9',sym:'9',level:3,formula:['1','3','5','b7','9'],piano:[['1',0],['b7',10],['9',14],['3',16],['5',19]],lh:1,
  gE:[0,null,0,1,0,2],gA:[null,0,-1,0,0,0],gD:[null,null,0,-1,1,0],
  sounds:'Funky and soulful. Tension, but rounder than a plain 7.',listen:'The bluesy 7 sound with the harsh edge smoothed out.',lives:'The 5 chord, funkier. Also the 1 and 4 in a funk vamp.',
  tip:function(r){return 'Play '+nm(r)+'7 and add '+nm(up(r,'9'))+' on top.';}},
 dom13:{name:'Dominant 13',sym:'13',level:3,formula:['1','3','5','b7','9','13'],piano:[['1',0],['b7',10],['9',14],['3',16],['13',21]],lh:1,
  gE:[0,null,0,1,2,null],gA:[null,0,-1,0,0,2],gD:[null,null,0,4,1,2],
  sounds:'Big, bright and churchy. Tension with a sweet note on top.',listen:'A sweet 6th sitting on top of the 7 chord tension.',lives:'The 5 chord in gospel and jazz turnarounds.',
  tip:function(r){return 'Shell it with '+nm(r)+', '+nm(up(r,'b7'))+' and '+nm(up(r,'3'))+', then put '+nm(up(r,'13'))+' on top.';}},
 min11:{name:'Minor 11',sym:'m11',level:3,formula:['1','b3','5','b7','9','11'],piano:[['1',0],['5',7],['b7',10],['b3',15],['11',17]],lh:2,
  gE:[0,0,0,0,0,0],gA:[null,0,0,0,1,0],gD:[null,null,0,0,1,1],
  sounds:'Wide open and airy. A minor chord with room to breathe.',listen:'Stacked fourths. The 11th makes it sound open and modern.',lives:'The 2, 3 and 6. Great for long one chord vamps.',
  tip:function(r){return 'Stack fourths up from the root: '+[r,up(r,'11'),up(r,'b7'),up(r,'b3')].map(nm).join(', ')+'.';}},
 sus9:{name:'9sus4',sym:'9sus4',level:3,formula:['1','4','5','b7','9'],piano:[['1',0],['b7',10],['9',14],['4',17]],lh:1,
  gE:[0,null,0,-1,-2,null],gA:[null,0,0,0,0,0],gD:[null,null,0,0,1,0],
  sounds:'Floating and unresolved. No 3rd, so it never picks happy or sad.',listen:'No 3rd anywhere. It hangs instead of landing.',lives:'The 5 chord right before it lands on the 1. Gospel lift.',
  tip:function(r){return nm(up(r,'b7'))+' major triad with '+nm(r)+' in the bass.';}},
 m7b5:{name:'Half diminished',sym:'m7♭5',level:3,formula:['1','b3','b5','b7'],piano:[['1',0],['1',12],['b3',15],['b5',18],['b7',22]],lh:1,
  gE:[0,null,0,0,-1,null],gA:[null,0,1,0,1,null],gD:[null,null,0,1,1,1],
  sounds:'Shadowy and unstable. Mysterious, wants to fall somewhere.',listen:'The flat 5. A minor chord gone slightly off.',lives:'The 7 in a major key. The 2 in a minor key 2 5 1.',
  tip:function(r){return nm(up(r,'b3'))+'m triad with '+nm(r)+' in the bass.';}},
 dim:{name:'Diminished',sym:'dim',level:0,formula:['1','b3','b5'],piano:[['1',0],['1',12],['b3',15],['b5',18]],lh:1}
};
var ORDER = ['maj','min','maj7','min7','dom7','add9','maj9','min9','dom9','dom13','min11','sus9','m7b5'];
// Open position chords in the easy keys, keyed by root pitch class
var OPENS = {
 maj:{0:[null,3,2,0,1,0],2:[null,null,0,2,3,2],4:[0,2,2,1,0,0],7:[3,2,0,0,0,3],9:[null,0,2,2,2,0]},
 min:{2:[null,null,0,2,3,1],4:[0,2,2,0,0,0],9:[null,0,2,2,1,0]},
 maj7:{0:[null,3,2,0,0,0],2:[null,null,0,2,2,2],4:[0,2,1,1,0,0],5:[null,null,3,2,1,0],7:[3,2,0,0,0,2],9:[null,0,2,1,2,0]},
 min7:{2:[null,null,0,2,1,1],4:[0,2,0,0,0,0],9:[null,0,2,0,1,0]},
 dom7:{0:[null,3,2,3,1,0],2:[null,null,0,2,1,2],4:[0,2,0,1,0,0],7:[3,2,0,0,0,1],9:[null,0,2,0,2,0],11:[null,2,1,2,0,2]},
 add9:{0:[null,3,2,0,3,0],4:[0,2,4,1,0,0],7:[3,2,0,2,0,3]},
 maj9:{0:[null,3,0,0,0,0],7:[3,null,0,2,0,2]},
 min9:{4:[0,2,0,0,0,2]},
 dom9:{4:[0,2,0,1,3,2]},
 dom13:{4:[0,null,0,1,2,0]},
 min11:{9:[null,0,0,0,1,0]}
};
var OPEN = [40,45,50,55,59,64];       // guitar E A D G B e
var OPENB = [28,33,38,43];            // bass E A D G
var SHAPES = [['E',0,'Root on 6th string'],['A',1,'Root on 5th string'],['D',2,'Root on 4th string']];

function rootMidi(pc) { return pc <= 6 ? 48 + pc : 36 + pc; }
function chordName(id, r) { return nm(r) + TYPES[id].sym; }
function shortSym(id) { return id === 'maj' ? 'major' : id === 'min' ? 'minor' : TYPES[id].sym; }
function labelFor(T, semi) { for (var i = 0; i < T.formula.length; i++) { if (IV[T.formula[i]][0] % 12 === semi) return T.formula[i]; } return '?'; }
function guitarPos(shape, rs, pc) {
  var f0 = ((pc - OPEN[rs]) % 12 + 12) % 12, mn = Infinity;
  shape.forEach(function (o) { if (o !== null && o < mn) mn = o; });
  if (f0 + mn < 0) f0 += 12;
  return {root:f0, frets:shape.map(function (o) { return o === null ? null : f0 + o; })};
}
// all guitar voicings for a chord: movable E, A, D shapes plus an open one when it differs
function guitarVoicings(id, pc) {
  var T = TYPES[id], out = [];
  if (!T.gE) return out;
  SHAPES.forEach(function (s) {
    var g = guitarPos(T['g' + s[0]], s[1], pc);
    out.push({key:s[0], frets:g.frets, label:s[2] + ', fret ' + g.root});
  });
  var o = OPENS[id] && OPENS[id][pc];
  if (o) {
    var dup = out.some(function (v) { return v.frets.join() === o.join(); });
    if (!dup) out.push({key:'O', frets:o.slice(), label:'Open position'});
  }
  return out;
}
function voicingMidis(frets) { var out = []; frets.forEach(function (f, s) { if (f !== null) out.push(OPEN[s] + f); }); return out; }
function lowestVoicing(id, pc) {
  var vs = guitarVoicings(id, pc), best = null, bf = 99;
  vs.forEach(function (v) { var mx = Math.max.apply(null, v.frets.filter(function (f) { return f !== null; })); if (mx < bf) { bf = mx; best = v; } });
  return best;
}
// bass: chord tones in a 5 fret box, root on E string (or A string when the E string root sits high)
function bassBox(id, pc) {
  var T = TYPES[id], fE = ((pc - 4) % 12 + 12) % 12, fA = ((pc - 9) % 12 + 12) % 12;
  var rs = fE <= 5 ? 0 : 1, rf = rs === 0 ? fE : fA;
  var start = Math.max(0, rf - 1), end = start + 4;
  var sem = {};
  T.formula.forEach(function (l) { sem[IV[l][0] % 12] = l; });
  var dots = [];
  for (var s = 0; s < 4; s++) for (var f = start; f <= end; f++) {
    var semi = ((OPENB[s] + f - pc) % 12 + 12) % 12;
    if (sem[semi] !== undefined) dots.push({s:s, f:f, lab:sem[semi], root:semi === 0, main:s === rs && f === rf});
  }
  return {rs:rs, rf:rf, start:start, end:end, dots:dots};
}
function bassArp(id, pc) {
  var b = bassBox(id, pc), base = OPENB[b.rs] + b.rf, T = TYPES[id];
  var core = T.formula.filter(function (l) { return ['9','11','13'].indexOf(l) < 0 || id === 'add9' || id === 'sus9'; });
  var semis = core.map(function (l) { return IV[l][0] + (['9','11','13'].indexOf(l) >= 0 ? 12 : 0); }).sort(function (a, c) { return a - c; });
  var seq = semis.map(function (x) { return base + x; });
  seq.push(base + 12);
  return seq;
}
function pianoMidis(id, pc) { var rm = rootMidi(pc); return TYPES[id].piano.map(function (p) { return rm + p[1]; }); }

// varied voicings for harder ear tests. tier 0 = card voicing, 1 = inversions and octaves, 2 = spread and other bass notes
function variedVoicing(id, pc, tier) {
  var rm = rootMidi(pc);
  if (!tier) return pianoMidis(id, pc);
  var T = TYPES[id];
  var tones = []; T.formula.forEach(function (l) { var x = IV[l][0] % 12; if (tones.indexOf(x) < 0) tones.push(x); });
  var upper = tones.filter(function (x) { return x !== 0; });
  if (upper.length < 3) upper = tones.slice();
  var rot = rnd(upper.length);
  upper = upper.slice(rot).concat(upper.slice(0, rot));
  var notes = [], prev = rm + 8;
  upper.forEach(function (x) { var m = rm + x; while (m <= prev) m += 12; notes.push(m); prev = m; });
  if (tier >= 2 && notes.length >= 4) { var i2 = notes.length - 2; notes[i2] -= 12; notes.sort(function (a, b) { return a - b; }); }
  var bass = rm;
  if (tier >= 2 && Math.random() < 0.35) {
    var alt = tones.filter(function (x) { return x === 3 || x === 4 || x === 7; });
    if (alt.length) { bass = rm + pick(alt); if (bass > rm + 6) bass -= 12; }
  }
  var all = [bass].concat(notes.filter(function (m) { return m > bass; }));
  var shifts = [-12, 0, 12].filter(function (s) { return Math.min.apply(null, all) + s >= 33 && Math.max.apply(null, all) + s <= 86; });
  var sh = shifts.length ? pick(shifts) : 0;
  return all.map(function (m) { return m + sh; });
}
// scale degree helpers
function degreeRoot(keyIdx, deg) { var key = ROOTS[keyIdx], i = deg - 1; return {l:(key.l + i) % 7, pc:(key.pc + MAJ[i]) % 12}; }
var DIATONIC = {
  triad:['maj','min','min','maj','maj','min','dim'],
  seventh:['maj7','min7','min7','maj7','dom7','min7','m7b5'],
  neo:['maj9','min9','min11','maj9','dom13','min9','m7b5']
};
// minor key chords: degree label -> semitones and chord types
var MINOR = {'1':{s:0,t:['min','min7']},'2':{s:2,t:['dim','m7b5']},'b3':{s:3,t:['maj','maj7']},'4':{s:5,t:['min','min7']},
  '5':{s:7,t:['maj','dom7']},'b6':{s:8,t:['maj','maj7']},'b7':{s:10,t:['maj','dom7']}};
function chordTones(id) { var out = []; TYPES[id].formula.forEach(function (l) { var x = IV[l][0] % 12; if (out.indexOf(x) < 0) out.push(x); }); return out; }
// voice lead chords: keep the upper notes close to the previous chord
function voiceLead(chords, opts) {
  opts = opts || {};
  var prev = null, out = [];
  chords.forEach(function (c) {
    var pcs = chordTones(c.type).map(function (x) { return (c.pc + x) % 12; });
    var lo = 55, hi = 79, best = null, bestCost = Infinity;
    for (var inv = 0; inv < pcs.length; inv++) {
      for (var oct = 0; oct < 2; oct++) {
        var order = pcs.slice(inv).concat(pcs.slice(0, inv)), notes = [], p = lo - 1 + oct * 5;
        order.forEach(function (x) { var m = p + 1; while ((m % 12 + 12) % 12 !== x) m++; notes.push(m); p = m; });
        if (notes[notes.length - 1] > hi) continue;
        var cost = 0;
        if (prev) notes.forEach(function (m, i) { cost += Math.abs(m - (prev[i] !== undefined ? prev[i] : prev[prev.length - 1])); });
        else cost = Math.abs(notes[0] - 62);
        if (opts.random) cost += Math.random() * 6;
        if (cost < bestCost) { bestCost = cost; best = notes; }
      }
    }
    prev = best;
    var bass = 36 + c.pc; if (bass > 45) bass -= 12;
    out.push([bass].concat(best));
  });
  return out;
}

/* ---------- sound ---------- */
var A = null, bus = null, timers = [], ksCache = {}, settings = {sound:'rhodes', volume:0.8};
function ac() {
  if (!A) {
    var C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    var ctx = new C();
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = 0.004; comp.release.value = 0.2;
    var master = ctx.createGain(); master.gain.value = settings.volume; comp.connect(master); master.connect(ctx.destination);
    var conv = ctx.createConvolver(); conv.buffer = impulse(ctx, 1.6, 2.8);
    var vg = ctx.createGain(); vg.gain.value = 0.2; conv.connect(vg); vg.connect(comp);
    A = {ctx:ctx, comp:comp, conv:conv, master:master};
  }
  if (A.ctx.state === 'suspended') { try { A.ctx.resume(); } catch (e) {} }
  return A;
}
function setVolume(v) { settings.volume = v; if (A) A.master.gain.setTargetAtTime(v, A.ctx.currentTime, 0.02); }
function setSound(s) { settings.sound = s; }
function impulse(ctx, sec, decay) {
  var len = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, len, ctx.sampleRate);
  for (var c = 0; c < 2; c++) { var d = b.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
  return b;
}
function stopAll(onClear) {
  timers.forEach(clearTimeout); timers = [];
  if (onClear) onClear();
  if (bus && A) {
    var t = A.ctx.currentTime, old = bus;
    try { old.gain.cancelScheduledValues(t); old.gain.setValueAtTime(old.gain.value, t); old.gain.linearRampToValueAtTime(0, t + 0.12); } catch (e) {}
    setTimeout(function () { try { old.disconnect(); } catch (e) {} }, 500);
  }
  bus = null;
}
function newBus(onClear) {
  var a = ac(); if (!a) return null; stopAll(onClear);
  var g = a.ctx.createGain(); g.gain.value = 1; g.connect(a.comp); g.connect(a.conv); bus = g; return g;
}
function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
function now() { return A ? A.ctx.currentTime + 0.04 : 0; }
function rhodes(g, midi, t, dur, vel) {
  var ctx = A.ctx, f = mtof(midi);
  var car = ctx.createOscillator(); car.frequency.value = f;
  var mod = ctx.createOscillator(); mod.frequency.value = f;
  var mg = ctx.createGain(); mg.gain.setValueAtTime(f * 1.5 * vel, t); mg.gain.exponentialRampToValueAtTime(f * 0.1 + 1, t + 1.0);
  mod.connect(mg); mg.connect(car.frequency);
  var bell = ctx.createOscillator(); bell.frequency.value = f * 7;
  var bg = ctx.createGain(); bg.gain.setValueAtTime(0.0001, t); bg.gain.exponentialRampToValueAtTime(0.025 * vel, t + 0.004); bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.2); bell.connect(bg);
  var amp = ctx.createGain(), pk = 0.12 * vel * (midi < 50 ? 1.2 : 1);
  amp.gain.setValueAtTime(0.0001, t); amp.gain.exponentialRampToValueAtTime(pk, t + 0.006); amp.gain.exponentialRampToValueAtTime(pk * 0.4, t + 0.5); amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = Math.min(9000, f * 10);
  car.connect(amp); bg.connect(amp); amp.connect(lp); lp.connect(g);
  var end = t + dur + 0.05; [car, mod, bell].forEach(function (o) { o.start(t); o.stop(end); });
}
var noiseBuf = null;
function grand(g, midi, t, dur, vel) {
  var ctx = A.ctx, f = mtof(midi), B = 0.00035, out = ctx.createGain();
  var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.4;
  lp.frequency.setValueAtTime(Math.min(14000, f * 16), t); lp.frequency.exponentialRampToValueAtTime(Math.max(700, f * 3.5), t + 1.6);
  var low = midi < 48 ? 1.5 : midi < 60 ? 1.2 : 1;
  for (var n = 1; n <= 8; n++) {
    var fn = f * n * Math.sqrt(1 + B * n * n); if (fn > 15000) break;
    var o = ctx.createOscillator(); o.frequency.value = fn * (n % 2 ? 1.0007 : 0.9993);
    var pg = ctx.createGain(), a = vel * 0.075 / Math.pow(n, 1.15) * low, dec = Math.max(0.35, dur * low / (1 + 0.55 * (n - 1)));
    pg.gain.setValueAtTime(0.0001, t); pg.gain.exponentialRampToValueAtTime(a, t + 0.003);
    pg.gain.exponentialRampToValueAtTime(a * 0.35, t + 0.09 + 0.3 / n); pg.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    o.connect(pg); pg.connect(lp); o.start(t); o.stop(t + dec + 0.05);
  }
  if (!noiseBuf) { var len = Math.floor(ctx.sampleRate * 0.04); noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate); var d = noiseBuf.getChannelData(0); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len); }
  var ns = ctx.createBufferSource(); ns.buffer = noiseBuf;
  var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = Math.min(6000, f * 4); bp.Q.value = 1.2;
  var ng = ctx.createGain(); ng.gain.value = 0.05 * vel;
  ns.connect(bp); bp.connect(ng); ng.connect(lp); ns.start(t);
  lp.connect(out); out.connect(g);
}
function keyNote(g, midi, t, dur, vel) { (settings.sound === 'piano' ? grand : rhodes)(g, midi, t, dur, vel); }
function ksBuf(midi) {
  if (ksCache[midi]) return ksCache[midi];
  var ctx = A.ctx, sr = ctx.sampleRate, f = mtof(midi), len = Math.floor(sr * (midi < 45 ? 3.5 : 3));
  var buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
  var N = Math.max(2, Math.round(sr / f - 0.5)), prev = 0, i;
  var smooth = midi < 45 ? 0.75 : 0.45;
  for (i = 0; i < N; i++) { prev = prev * smooth + (Math.random() * 2 - 1) * (1 - smooth); d[i] = prev; }
  var rho = midi < 45 ? 0.9992 : midi < 50 ? 0.9985 : midi < 60 ? 0.997 : 0.995;
  for (i = N; i < len; i++) d[i] = rho * 0.5 * (d[i - N] + (i - N - 1 >= 0 ? d[i - N - 1] : 0));
  var mx = 0; for (i = 0; i < len; i++) { var v = Math.abs(d[i]); if (v > mx) mx = v; }
  if (mx > 0) for (i = 0; i < len; i++) d[i] /= mx;
  var fade = Math.floor(sr * 0.3); for (i = 0; i < fade; i++) d[len - 1 - i] *= i / fade;
  ksCache[midi] = buf; return buf;
}
function pluck(g, midi, t, vel, cutoff) {
  var ctx = A.ctx, s = ctx.createBufferSource(); s.buffer = ksBuf(midi);
  var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cutoff || 4200;
  var amp = ctx.createGain(); amp.gain.value = 0.17 * vel * (midi < 45 ? 1.6 : 1);
  s.connect(lp); lp.connect(amp); amp.connect(g); s.start(t);
}
function bassNote(g, midi, t, vel) { pluck(g, midi, t, vel || 1, 1500); }
function drone(g, midi, t, dur) {
  var ctx = A.ctx;
  [[0, 0.07], [7, 0.045], [12, 0.03]].forEach(function (p) {
    var o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = mtof(midi + p[0]);
    var gg = ctx.createGain(); gg.gain.setValueAtTime(0.0001, t); gg.gain.exponentialRampToValueAtTime(p[1], t + 0.35);
    gg.gain.setValueAtTime(p[1], t + dur - 0.5); gg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    o.connect(lp); lp.connect(gg); gg.connect(g); o.start(t); o.stop(t + dur + 0.05);
  });
}
function block(g, midis, t, dur, roll) { midis.forEach(function (m, i) { keyNote(g, m, t + i * (roll || 0.012), dur || 2.4, i === 0 ? 0.95 : 0.8); }); }
function arp(g, midis, t, step) { midis.forEach(function (m, i) { keyNote(g, m, t + i * (step || 0.17), 2.8, 0.85); }); return midis.length * (step || 0.17) + 2.4; }
function strum(g, midis, t) { midis.forEach(function (m, i) { pluck(g, m, t + i * 0.028, 0.9); }); }

/* ---------- diagrams ---------- */
var WHITE = {0:1,2:1,4:1,5:1,7:1,9:1,11:1};
function pianoSVG(id, pc) {
  var T = TYPES[id], rm = rootMidi(pc), on = {};
  T.piano.forEach(function (p, i) { on[rm + p[1]] = {lab:p[0], lh:i < T.lh}; });
  var back = pc >= 5 ? pc - 5 : pc, start = rm - back, W = 20, H = 92, BW = 12, BH = 58, wi = 0, wh = [], bl = [];
  for (var m = start; m < start + 32; m++) { var k = m % 12; if (WHITE[k]) { wh.push({m:m, x:wi * W}); wi++; } else bl.push({m:m, x:wi * W - BW / 2}); }
  var s = '<svg viewBox="0 0 ' + (wi * W + 1) + ' ' + (H + 1) + '" aria-hidden="true">';
  wh.forEach(function (w) { var o = on[w.m]; s += '<rect class="wk' + (o ? (o.lh ? ' lh' : ' on') : '') + '" x="' + (w.x + 0.5) + '" y="0.5" width="' + W + '" height="' + H + '" rx="2"/>'; if (o) s += '<text class="kl" x="' + (w.x + W / 2 + 0.5) + '" y="' + (H - 9) + '">' + fmt(o.lab) + '</text>'; });
  bl.forEach(function (b) { var o = on[b.m]; s += '<rect class="bk' + (o ? (o.lh ? ' lh' : ' on') : '') + '" x="' + (b.x + 0.5) + '" y="0.5" width="' + BW + '" height="' + BH + '" rx="1.5"/>'; if (o) s += '<text class="kl" x="' + (b.x + BW / 2 + 0.5) + '" y="' + (BH - 8) + '" style="font-size:7.5px">' + fmt(o.lab) + '</text>'; });
  return s + '</svg>';
}
function guitarSVG(id, pc, frets) {
  var T = TYPES[id], x0 = 28, sx = 13, top = 24, fh = 19, maxF = 0, minF = 99;
  frets.forEach(function (f) { if (f !== null) { if (f > maxF) maxF = f; if (f > 0 && f < minF) minF = f; } });
  var base = maxF <= 4 ? 1 : minF;
  var s = '<svg viewBox="0 0 104 126" aria-hidden="true">', i;
  for (i = 0; i <= 5; i++) s += '<line class="g-fret" x1="' + x0 + '" x2="' + (x0 + 5 * sx) + '" y1="' + (top + i * fh) + '" y2="' + (top + i * fh) + '"/>';
  if (base === 1) s += '<line class="g-nut" x1="' + (x0 - 0.5) + '" x2="' + (x0 + 5 * sx + 0.5) + '" y1="' + top + '" y2="' + top + '"/>';
  else s += '<text class="g-fr" x="' + (x0 - 9) + '" y="' + (top + fh * 0.5 + 3) + '">' + base + 'fr</text>';
  for (i = 0; i < 6; i++) s += '<line class="g-str" x1="' + (x0 + i * sx) + '" x2="' + (x0 + i * sx) + '" y1="' + top + '" y2="' + (top + 5 * fh) + '"/>';
  frets.forEach(function (f, st) {
    var x = x0 + st * sx;
    if (f === null) { s += '<text class="g-x" x="' + x + '" y="' + (top - 7) + '">✕</text>'; return; }
    var semi = ((OPEN[st] + f - pc) % 12 + 12) % 12, lab = labelFor(T, semi);
    if (f === 0) { s += '<circle class="g-mark' + (semi === 0 ? ' root' : '') + '" cx="' + x + '" cy="' + (top - 10) + '" r="3.4"/>'; return; }
    var y = top + (f - base + 0.5) * fh;
    s += '<circle class="g-dot' + (semi === 0 ? ' root' : '') + '" cx="' + x + '" cy="' + y + '" r="6.3"/><text class="g-lab" x="' + x + '" y="' + (y + 2.3) + '">' + fmt(lab) + '</text>';
  });
  return s + '</svg>';
}
function bassSVG(id, pc) {
  var b = bassBox(id, pc), open = b.start === 0, first = open ? 1 : b.start, cols = b.end - first + 1;
  var x0 = open ? 44 : 30, fw = 44, y0 = 14, sy = 16, W = x0 + cols * fw + 10, H = y0 + 3 * sy + 26;
  var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">', i;
  for (i = 0; i <= cols; i++) { var x = x0 + i * fw; s += '<line class="' + (open && i === 0 ? 'g-nut' : 'g-fret') + '" x1="' + x + '" x2="' + x + '" y1="' + y0 + '" y2="' + (y0 + 3 * sy) + '"/>'; }
  var names = ['E','A','D','G'];
  for (i = 0; i < 4; i++) { var y = y0 + (3 - i) * sy; s += '<line class="g-str" x1="' + x0 + '" x2="' + (x0 + cols * fw) + '" y1="' + y + '" y2="' + y + '" style="stroke-width:' + (1.8 - i * 0.3) + '"/><text class="g-fr" x="' + (open ? 16 : x0 - 8) + '" y="' + (y + 3) + '">' + names[i] + '</text>'; }
  for (i = 0; i < cols; i++) s += '<text class="g-num" x="' + (x0 + i * fw + fw / 2) + '" y="' + (y0 + 3 * sy + 18) + '">' + (first + i) + '</text>';
  b.dots.forEach(function (d) {
    var y = y0 + (3 - d.s) * sy, x = d.f === 0 ? x0 - 14 : x0 + (d.f - first + 0.5) * fw;
    s += '<circle class="g-dot' + (d.root ? ' root' : '') + (d.main ? ' main' : '') + '" cx="' + x + '" cy="' + y + '" r="6.6"/><text class="g-lab" x="' + x + '" y="' + (y + 2.4) + '">' + fmt(d.lab) + '</text>';
  });
  return s + '</svg>';
}

window.CC = {
  LETTERS:LETTERS, IV:IV, ROOTS:ROOTS, MAJ:MAJ, FIFTHS:FIFTHS, TYPES:TYPES, ORDER:ORDER, OPENS:OPENS, OPEN:OPEN, OPENB:OPENB,
  DIATONIC:DIATONIC, MINOR:MINOR,
  nm:nm, up:up, fmt:fmt, mtof:mtof, rnd:rnd, pick:pick, rootMidi:rootMidi, chordName:chordName, shortSym:shortSym, labelFor:labelFor,
  guitarPos:guitarPos, guitarVoicings:guitarVoicings, voicingMidis:voicingMidis, lowestVoicing:lowestVoicing,
  bassBox:bassBox, bassArp:bassArp, pianoMidis:pianoMidis, variedVoicing:variedVoicing, degreeRoot:degreeRoot, chordTones:chordTones, voiceLead:voiceLead,
  audio:{ac:ac, newBus:newBus, stopAll:stopAll, later:later, now:now, block:block, arp:arp, strum:strum, bassNote:bassNote, drone:drone, keyNote:keyNote, setVolume:setVolume, setSound:setSound, ctx:function () { return A && A.ctx; }},
  svg:{piano:pianoSVG, guitar:guitarSVG, bass:bassSVG}
};
})();
