/* ---------- Scryfall lookup (text only) ---------- */
var ACCEPT = 'application/json;q=0.9,*/*;q=0.8';
var DAY = 24 * 60 * 60 * 1000;
var lastCall = 0;
var memo = {};

export function parseInput(v) {
  v = (v || '').trim();
  var m = v.match(/scryfall\.com\/card\/([^\/?#]+)\/([^\/?#]+)(?:\/([a-z]{2,3})(?=\/[^\/?#]+))?/i);
  if (m) { return { set: m[1], num: decodeURIComponent(m[2]), lang: m[3] || '' }; }
  m = v.match(/^([a-z0-9]{2,6})[\s\/#]+(\S+)$/i);
  if (m) { return { set: m[1], num: m[2], lang: '' }; }
  return null;
}
export function cardUrl(p) {
  return 'https://api.scryfall.com/cards/' + encodeURIComponent(p.set.toLowerCase()) + '/' + encodeURIComponent(p.num) + (p.lang ? '/' + encodeURIComponent(p.lang) : '');
}
function cacheGet(url) {
  var hit = memo[url];
  if (!hit) { try { var raw = localStorage.getItem('sf:' + url); if (raw) { hit = JSON.parse(raw); } } catch (e) { hit = null; } }
  if (hit && Date.now() - hit.at < DAY) { memo[url] = hit; return hit.data; }
  return null;
}
function cachePut(url, data) {
  var rec = { at: Date.now(), data: data };
  memo[url] = rec;
  try { localStorage.setItem('sf:' + url, JSON.stringify(rec)); } catch (e) { /* storage may be unavailable */ }
}
export async function getCard(url) {
  var cached = cacheGet(url);
  if (cached) { return cached; }
  var wait = 100 - (Date.now() - lastCall);   // Scryfall asks for 50-100 ms between requests
  if (wait > 0) { await new Promise(function (r) { setTimeout(r, wait); }); }
  lastCall = Date.now();
  var r = await fetch(url, { headers: { Accept: ACCEPT } });
  var body = null;
  try { body = await r.json(); } catch (e) { body = null; }
  if (!r.ok) {
    var err = new Error((body && body.details) || ('HTTP ' + r.status));
    err.status = r.status;
    throw err;
  }
  cachePut(url, body);
  return body;
}
