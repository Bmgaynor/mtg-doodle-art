/* ---------- doodle art: drawn here, never traced from card art ---------- */
var PAL = {
  W: { bg: '#F5EBC8', a: '#F2C14E', b: '#FFFFFF' },
  U: { bg: '#CFE0F2', a: '#6FA8DC', b: '#BFE3F5' },
  B: { bg: '#CDBFD3', a: '#6B5B7B', b: '#9A8AA6' },
  R: { bg: '#F4C9B4', a: '#E0573A', b: '#F7A126' },
  G: { bg: '#CDE5C5', a: '#5FA85A', b: '#A8D5A0' },
  C: { bg: '#DDD9D0', a: '#9AA0A6', b: '#C9CDD2' }
};
function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) {
  return function () {
    seed = (seed + 0x6D2B79F5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function P(d, fill, extra) { return '<path d="' + d + '" fill="' + fill + '"' + (extra || '') + '/>'; }
function E(cx, cy, rx, ry, fill) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"/>'; }
function C(cx, cy, r, fill) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"/>'; }
function sparkle(x, y, s) { return '<path d="M' + x + ' ' + (y - s) + ' L' + x + ' ' + (y + s) + ' M' + (x - s) + ' ' + y + ' L' + (x + s) + ' ' + y + '" stroke-width="4"/>'; }
function star(cx, cy, ro, ri, n, fill) {
  var pts = [];
  for (var i = 0; i < n * 2; i++) { var r = i % 2 ? ri : ro, a = (Math.PI * i) / n - Math.PI / 2; pts.push((cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1)); }
  return '<path d="M' + pts.join(' L') + ' Z" fill="' + fill + '"/>';
}
function ground(fill) { return P('M0 340 C100 326 340 326 440 340 L440 380 L0 380 Z', fill, ' stroke-width="4"'); }

function creature(r, c1, c2, sub) {
  var o = '';
  var has = function (w) { return sub.indexOf(w) >= 0; };
  var cy = 215, rx = 88 + r() * 24, ry = 78 + r() * 22;
  if (has('dragon') || has('drake') || has('wyvern')) {
    o += P('M150 200 C90 140 60 130 40 90 C80 100 110 100 140 140 Z', c2) + P('M290 200 C350 140 380 130 400 90 C360 100 330 100 300 140 Z', c2);
    o += P('M300 290 C350 300 380 280 400 250 C380 300 340 330 290 320 Z', c1);
  }
  if (has('angel') || has('spirit') || has('bird') || has('phoenix') || has('sphinx')) {
    o += P('M150 190 C80 150 50 160 30 110 C80 120 120 130 160 170 Z', '#FFFFFF') + P('M290 190 C360 150 390 160 410 110 C360 120 320 130 280 170 Z', '#FFFFFF');
  }
  o += E(180, 330, 28, 14, c1) + E(260, 330, 28, 14, c1);
  o += E(220, cy, rx, ry, c1);
  o += E(220, cy + 24, rx * 0.62, ry * 0.58, c2);
  o += P('M140 210 C110 230 100 260 110 285', 'none', ' stroke-width="14" stroke="' + c1 + '"') + P('M140 210 C110 230 100 260 110 285', 'none');
  o += P('M300 210 C330 230 340 260 330 285', 'none', ' stroke-width="14" stroke="' + c1 + '"') + P('M300 210 C330 230 340 260 330 285', 'none');
  if (has('wizard') || has('shaman') || has('mage') || has('warlock') || has('cleric')) {
    o += P('M165 150 L222 40 L280 150 Z', PAL.U.a) + P('M140 154 C190 170 250 170 300 154', 'none', ' stroke-width="9"') + C(222, 40, 7, '#F7E04A');
  } else if (has('goblin') || has('elf') || has('orc') || has('imp') || has('faerie')) {
    o += P('M150 170 L96 130 L146 205 Z', c1) + P('M290 170 L344 130 L294 205 Z', c1);
  } else if (has('cat') || has('wolf') || has('beast') || has('fox') || has('dog') || has('bear')) {
    o += P('M158 150 L150 96 L196 128 Z', c1) + P('M282 150 L290 96 L244 128 Z', c1);
  } else if (has('angel') || has('cleric') || has('knight') === false && has('avatar')) {
    o += '<ellipse cx="220" cy="104" rx="40" ry="11" fill="none" stroke="#F2C14E" stroke-width="7"/>';
  } else if (r() < 0.55) {
    o += P('M170 150 C160 120 165 100 180 88 C182 110 192 120 196 140 Z', c2) + P('M270 150 C280 120 275 100 260 88 C258 110 248 120 244 140 Z', c2);
  }
  var eyes = r();
  if (eyes < 0.2) {
    o += C(220, 190, 24, '#FFFFFF') + C(220 + (r() * 8 - 4), 192, 9, '#1F2430');
  } else {
    o += C(188, 190, 17, '#FFFFFF') + C(252, 190, 17, '#FFFFFF') + C(192, 192, 7, '#1F2430') + C(248, 192, 7, '#1F2430');
  }
  if (r() < 0.5) { o += P('M190 238 C205 256 235 256 250 238', 'none'); }
  else { o += P('M186 240 L200 252 L212 240 L226 252 L240 240 L254 252', 'none'); }
  return o;
}
function spell(r, col, instant, c1, c2) {
  var o = C(220, 190, 120, c2);
  if (col === 'R') {
    o += P('M220 40 C260 100 330 130 320 220 C312 290 262 330 220 330 C170 330 120 290 124 220 C128 170 170 150 182 100 C200 124 206 90 220 40 Z', c1) + P('M220 170 C244 210 276 220 266 262 C258 296 238 306 220 306 C198 306 176 290 180 260 C184 230 208 216 220 170 Z', c2);
  } else if (col === 'U') {
    o += P('M220 190 C220 150 280 150 280 195 C280 250 200 260 190 190 C182 120 290 100 320 190 C345 270 250 320 180 270', 'none', ' stroke-width="10"');
    o += P('M90 110 C100 130 104 140 90 150 C76 140 80 130 90 110 Z', c1) + P('M350 270 C360 290 364 300 350 310 C336 300 340 290 350 270 Z', c1);
  } else if (col === 'G') {
    o += P('M220 330 C220 270 224 220 226 150', 'none', ' stroke-width="10"');
    o += P('M226 220 C160 220 120 180 118 130 C180 130 226 160 226 220 Z', c1) + P('M226 180 C290 180 330 140 332 90 C270 90 226 120 226 180 Z', c1);
  } else if (col === 'W') {
    var rays = '';
    for (var i = 0; i < 12; i++) { var a = (Math.PI * 2 * i) / 12; rays += '<path d="M' + (220 + 98 * Math.cos(a)).toFixed(1) + ' ' + (190 + 98 * Math.sin(a)).toFixed(1) + ' L' + (220 + 150 * Math.cos(a)).toFixed(1) + ' ' + (190 + 150 * Math.sin(a)).toFixed(1) + '" stroke-width="9"/>'; }
    o += rays + C(220, 190, 78, c1);
  } else if (col === 'B') {
    o += P('M130 200 C120 110 320 110 310 200 C310 240 290 250 280 262 L280 296 L160 296 L160 262 C150 250 130 240 130 200 Z', '#F2EFE6') + C(180, 205, 22, '#1F2430') + C(260, 205, 22, '#1F2430') + P('M220 232 L206 260 L234 260 Z', '#1F2430') + P('M184 296 L184 270 M208 296 L208 270 M232 296 L232 270 M256 296 L256 270', 'none', ' stroke-width="4"');
  } else {
    o += P('M250 40 L150 210 L215 210 L180 340 L300 160 L232 160 Z', '#F7E04A');
  }
  if (instant) { o += '<path d="M60 150 L110 150 M44 190 L100 190 M60 230 L110 230 M330 150 L380 150 M340 190 L396 190 M330 230 L380 230" stroke-width="5"/>'; }
  o += sparkle(86 + r() * 20, 70 + r() * 20, 12) + sparkle(350 + r() * 20, 60 + r() * 20, 14) + sparkle(100 + r() * 20, 300, 10) + sparkle(340, 290 + r() * 20, 10);
  return o;
}
function artifactArt(r, equipment, c1, c2) {
  if (equipment) {
    return P('M214 40 L238 40 L244 250 L208 250 Z', '#E6E9EE') + P('M170 250 L282 250 L282 276 L170 276 Z', c1) + P('M212 276 L240 276 L240 336 L212 336 Z', c2) + C(226, 346, 16, c1) + sparkle(120, 90, 12) + sparkle(330, 130, 12);
  }
  var teeth = '', n = 8;
  for (var i = 0; i < n; i++) { var a = (Math.PI * 2 * i) / n; teeth += '<rect x="198" y="46" width="44" height="52" rx="6" fill="' + c1 + '" transform="rotate(' + (a * 180 / Math.PI).toFixed(1) + ' 220 190)"/>'; }
  return teeth + C(220, 190, 108, c1) + C(220, 190, 44, c2) + C(220, 190, 14, '#FFFFFF') + sparkle(80, 80, 12) + sparkle(360, 300, 12);
}
function enchantmentArt(r, c1, c2) {
  return C(220, 190, 140, c2) + '<circle cx="220" cy="190" r="112" fill="none" stroke-width="5" stroke-dasharray="4 14"/>' + star(220, 190, 96, 42, 5 + Math.floor(r() * 3), c1) + C(220, 190, 18, '#FFFFFF') + sparkle(70, 80, 12) + sparkle(370, 90, 12) + sparkle(90, 300, 10) + sparkle(356, 300, 12);
}
function landArt(r, t, col, c1, c2) {
  var o = '';
  if (t.indexOf('island') >= 0 || col === 'U') {
    o += C(330, 90, 36, '#F7E04A') + '<path d="M0 230 C40 200 80 260 120 230 C160 200 200 260 240 230 C280 200 320 260 360 230 C400 200 420 240 440 230 L440 380 L0 380 Z" fill="' + c1 + '"/><path d="M0 290 C40 260 80 320 120 290 C160 260 200 320 240 290 C280 260 320 320 360 290 C400 260 420 300 440 290" fill="none"/>';
  } else if (t.indexOf('swamp') >= 0 || col === 'B') {
    o += C(330, 90, 40, '#E9E4D2') + ground(c1) + P('M200 340 L206 190 L190 120 M206 190 L250 150 L262 100 M206 230 L160 190', 'none', ' stroke-width="9"');
  } else if (t.indexOf('mountain') >= 0 || col === 'R') {
    o += C(90, 90, 36, '#F7E04A') + P('M0 340 L110 150 L190 260 L270 100 L440 340 Z', c1) + P('M250 140 L270 100 L292 140 L270 130 Z', '#FFFFFF');
  } else if (t.indexOf('forest') >= 0 || col === 'G') {
    o += ground(c2) + P('M120 330 L120 260 M120 270 L80 270 L120 190 L160 270 Z', c1) + P('M240 330 L240 240 M240 250 L190 250 L240 130 L290 250 Z', c1) + P('M340 330 L340 270 M340 280 L304 280 L340 210 L376 280 Z', c1);
  } else if (t.indexOf('plains') >= 0 || col === 'W') {
    var rays = '';
    for (var i = 0; i < 10; i++) { var a = Math.PI + (Math.PI * i) / 9; rays += '<path d="M' + (220 + 70 * Math.cos(a)).toFixed(1) + ' ' + (260 + 70 * Math.sin(a)).toFixed(1) + ' L' + (220 + 120 * Math.cos(a)).toFixed(1) + ' ' + (260 + 120 * Math.sin(a)).toFixed(1) + '" stroke-width="8"/>'; }
    o += rays + P('M150 260 A70 70 0 0 1 290 260 Z', c1) + ground(c2);
  } else {
    o += C(330, 90, 34, '#F7E04A') + P('M0 340 L100 200 L170 280 L250 160 L340 270 L440 340 Z', c1) + ground(c2);
  }
  return o;
}
function walkerArt(r, c1, c2) {
  return C(220, 90, 36, '#F2D3A8') + P('M220 130 C150 150 110 250 100 340 L340 340 C330 250 290 150 220 130 Z', c1) + P('M220 150 L220 340', 'none') + C(330, 210, 26, c2) + sparkle(330, 210, 40) + sparkle(110, 120, 12) + sparkle(110, 250, 10);
}
function shieldArt(r, c1, c2) {
  return P('M110 70 L330 70 L330 210 C330 280 270 320 220 342 C170 320 110 280 110 210 Z', c1) + P('M220 70 L220 342 M110 190 L330 190', 'none', ' stroke-width="6"') + star(220, 150, 40, 18, 5, c2) + sparkle(70, 90, 12) + sparkle(370, 280, 12);
}
function pickColors(c) {
  var cols = (c.colors && c.colors.length ? c.colors : (c.card_faces && c.card_faces[0] && c.card_faces[0].colors) || c.color_identity || []).slice();
  if (!cols.length) { cols = []; }
  var first = cols[0] || 'C', second = cols[1] || first;
  return { cols: cols, first: first, bg: cols.length > 1 ? '#E8D9A8' : PAL[first].bg, c1: PAL[first].a, c2: PAL[second].b };
}
export function drawArt(c, v, bump, face) {
  var cc = pickColors(c);
  var r = rng(hash(String(c.id || v.name) + ':' + (face || 0)) + bump * 7919);
  var t = (v.type || '').toLowerCase();
  var sub = t.indexOf('\u2014') >= 0 ? t.split('\u2014')[1] : '';
  var body;
  if (t.indexOf('creature') >= 0) { body = creature(r, cc.c1, cc.c2, sub); }
  else if (t.indexOf('instant') >= 0 || t.indexOf('sorcery') >= 0) { body = spell(r, cc.first, t.indexOf('instant') >= 0, cc.c1, cc.c2); }
  else if (t.indexOf('planeswalker') >= 0) { body = walkerArt(r, cc.c1, cc.c2); }
  else if (t.indexOf('land') >= 0) { body = landArt(r, t, cc.cols.length === 1 ? cc.first : '', cc.c1, cc.c2); }
  else if (t.indexOf('artifact') >= 0) { body = artifactArt(r, t.indexOf('equipment') >= 0, cc.c1, cc.c2); }
  else if (t.indexOf('enchantment') >= 0) { body = enchantmentArt(r, cc.c1, cc.c2); }
  else { body = shieldArt(r, cc.c1, cc.c2); }
  var seed = 1 + Math.floor(r() * 90);
  return '<svg viewBox="0 0 440 380" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#1F2430" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Doodle for ' + String(v.name).replace(/[<>&"]/g, '') + '">' +
    '<defs><filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="' + seed + '" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter></defs>' +
    '<rect x="-10" y="-10" width="460" height="400" fill="' + cc.bg + '" stroke="none"/><g filter="url(#wob)">' + body + '</g></svg>';
}
