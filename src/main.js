import './style.css';
import { drawArt } from './art.js';
import { parseInput, cardUrl, getCard } from './scryfall.js';

var $ = function (id) { return document.getElementById(id); };
var PIPS = { W: '#F4EBC8', U: '#9CCFEA', B: '#B9A9B8', R: '#F0A58A', G: '#A8D5A0' };
var card = null, face = 0, busy = false, redraw = 0;

function symbols(el, text) {
  el.textContent = '';
  String(text).split(/(\{[^}]+\})/).forEach(function (part) {
    if (!part) { return; }
    var m = part.match(/^\{([^}]+)\}$/);
    if (m) {
      var s = document.createElement('span');
      s.className = 'sym'; s.textContent = m[1];
      s.style.background = PIPS[m[1].charAt(0).toUpperCase()] || '#E0DCD0';
      el.appendChild(s);
    } else {
      el.appendChild(document.createTextNode(part));
    }
  });
}
function view() {
  var multi = card.card_faces && card.card_faces.length > 1;
  var sep = multi && card.image_uris;      // adventure, split, flip: one card, two texts
  var back = multi && !card.image_uris;    // transform, modal: separate faces
  var f = back ? card.card_faces[face] : card;
  var text = f.oracle_text || '';
  if (sep) { text = card.card_faces.map(function (x) { return x.oracle_text || ''; }).join('\n\n'); }
  var pt = '';
  if (f.power !== undefined && f.toughness !== undefined) { pt = f.power + '/' + f.toughness; }
  else if (f.loyalty !== undefined) { pt = f.loyalty; }
  else if (f.defense !== undefined) { pt = f.defense; }
  return { name: f.name, mana: f.mana_cost || '', type: f.type_line || '', text: text, pt: pt };
}
function setBusy(on) {
  busy = on;
  $('make').disabled = on; $('make').classList.toggle('busy', on);
  $('cardSkel').hidden = !on;
  $('progress').classList.toggle('on', on);
}
function show() {
  var v = view();
  $('cName').textContent = v.name;
  symbols($('cCost'), v.mana);
  $('cType').textContent = v.type;
  symbols($('cRules'), v.text);
  $('cPt').hidden = v.pt === ''; $('cPt').textContent = v.pt;
  $('cArt').innerHTML = drawArt(card, v, redraw, face);
  $('flip').hidden = !(card.card_faces && card.card_faces.length > 1 && !card.image_uris);
  $('reroll').disabled = false;
}
function showFallback(url) {
  $('fallback').hidden = false;
  $('fbLink').href = url;
  $('fbLink').textContent = 'Open ' + url;
}
$('fbUse').addEventListener('click', function () {
  var st = $('status');
  try {
    var c = JSON.parse($('fbText').value);
    if (!c || c.object !== 'card') { throw new Error('not a card'); }
    card = c; face = 0; redraw = 0; show();
    st.textContent = 'Loaded ' + card.name + ' (' + String(card.set).toUpperCase() + ' #' + card.collector_number + ') from the pasted Scryfall data.';
  } catch (e) {
    st.textContent = 'That is not Scryfall card data. Copy the whole page of text from the link above.';
  }
});
async function make() {
  if (busy) { return; }
  var st = $('status');
  var p = parseInput($('link').value);
  if (!p) { st.textContent = 'That does not look like a Scryfall link or a set and number.'; return; }
  var url = cardUrl(p);
  setBusy(true); st.textContent = 'Asking Scryfall...';
  try {
    card = await getCard(url); face = 0; redraw = 0;
    show();
    st.textContent = 'Loaded ' + card.name + ' (' + String(card.set).toUpperCase() + ' #' + card.collector_number + ') from Scryfall.';
  } catch (e) {
    if (e && e.status === 404) { st.textContent = 'Scryfall has no card for set "' + p.set + '" number "' + p.num + '". ' + (e.message || ''); }
    else if (e && e.status === 429) { st.textContent = 'Scryfall says slow down (too many requests). Wait a few seconds and try again.'; }
    else if (e && e.status) { st.textContent = 'Scryfall returned an error (' + e.status + '): ' + e.message; }
    else { showFallback(url); st.textContent = 'The request never reached Scryfall (' + (e && e.message ? e.message : 'blocked') + ').'; }
  } finally {
    setBusy(false);
  }
}
$('make').addEventListener('click', make);
$('link').addEventListener('keydown', function (e) { if (e.key === 'Enter') { make(); } });
$('flip').addEventListener('click', function () {
  if (!card) { return; }
  face = (face + 1) % card.card_faces.length; redraw = 0; show();
});
$('reroll').addEventListener('click', function () { if (card) { redraw++; show(); } });
$('bw').addEventListener('change', function () { $('card').classList.toggle('filtered', $('bw').checked); });
window.__doodle = { drawArt: drawArt };
