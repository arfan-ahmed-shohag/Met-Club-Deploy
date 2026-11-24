
/* ============ CONFIG: edit for your platform ============ */
const CONFIG = {
  orgName: UI.orgName,
  orgNameEn: 'Save the Children',
  logoSrc: null,          // e.g. 'stc-logo-white.png' → official white logo in the red bar and on the certificate
  courseName: UI.courseName,
  programName: UI.programName,
  certTitle: UI.certTitle,
  certSub: UI.certSub,
  signatures: UI.signatures,  // only one signature on the certificate
  signatureSrc: null,     // optional: scanned signature image file (e.g. 'bmd-director-signature.png'), drawn above the signature line
  passMark: 80,
  certPrefix: 'STC-MET-AA',
  storageKey: 'stc_metclub_aa_ibf_v1'
};
/* ======================================================== */
const num = n => String(n).replace(/\d/g, d => NUM_DIGITS[d]);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');
const PREVIEW = location.hash === '#preview';
const CHC = {blue: 'var(--blue)', ochre: 'var(--ochre)', red: 'var(--stc)', green: 'var(--green)', navy: 'var(--navy)'};
const HZC = {cyclone: '#2f6fd0', flood: '#138a9a', landslide: '#8a5a2b', heatwave: '#d2541b'};
if (CONFIG.logoSrc) $('#logoSlot').outerHTML = `<img src="${CONFIG.logoSrc}" alt="${esc(CONFIG.orgNameEn)}">`;

/* ---------- storage + SCORM ---------- */
const SCORM = (() => {
  let api = null, v = 0;
  const find = w => { let n = 0; while (w && n < 12) { try { if (w.API_1484_11) { v = 2004; return w.API_1484_11; } if (w.API) { v = 12; return w.API; } } catch (e) { return null; } if (w.parent === w) break; w = w.parent; n++; } return null; };
  try { api = find(window) || (window.opener ? find(window.opener) : null); } catch (e) { api = null; }
  const call = (f12, f04, ...a) => { try { return v === 2004 ? api[f04](...a) : api[f12](...a); } catch (e) { return ''; } };
  if (api) call('LMSInitialize', 'Initialize', '');
  return {on: !!api, ver: () => v, get: k => api ? call('LMSGetValue', 'GetValue', k) : '',
    set: (k12, k04, val) => { if (api) call('LMSSetValue', 'SetValue', v === 2004 ? k04 : k12, String(val)); },
    commit: () => { if (api) call('LMSCommit', 'Commit', ''); }, finish: () => { if (api) call('LMSFinish', 'Terminate', ''); }};
})();
function loadState() {
  let s = null;
  if (SCORM.on) { try { s = JSON.parse(SCORM.get('cmi.suspend_data') || 'null'); } catch (e) {} }
  if (!s) { try { s = JSON.parse(localStorage.getItem(CONFIG.storageKey) || 'null'); } catch (e) {} }
  s = s || {}; s.p = s.p || null; s.c = s.c || {}; s.j = s.j || {}; s.snd = s.snd !== false;
  if (!s.p && SCORM.on) { const nm = SCORM.get(SCORM.ver() === 2004 ? 'cmi.learner_name' : 'cmi.core.student_name'); if (nm) s.lmsName = nm.includes(',') ? nm.split(',').reverse().map(x => x.trim()).join(' ') : nm; }
  return s;
}
let S = loadState();
function save() {
  try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(S)); } catch (e) {}
  if (SCORM.on) {
    // journal text can be long; SCORM 1.2 suspend_data is limited to 4096 chars, so trim answers there
    const lite = SCORM.ver() === 2004 ? S : {...S, j: Object.fromEntries(Object.entries(S.j).map(([k, v]) => [k, String(v).slice(0, 220)]))};
    SCORM.set('cmi.suspend_data', 'cmi.suspend_data', JSON.stringify(lite));
    const st = stats();
    SCORM.set('cmi.core.score.raw', 'cmi.score.raw', Math.round(st.avgAll));
    SCORM.set('cmi.core.score.min', 'cmi.score.min', 0); SCORM.set('cmi.core.score.max', 'cmi.score.max', 100);
    if (SCORM.ver() === 2004) {
      SCORM.set('', 'cmi.score.scaled', (st.avgAll / 100).toFixed(2));
      SCORM.set('', 'cmi.completion_status', st.done === COURSE.length ? 'completed' : 'incomplete');
      SCORM.set('', 'cmi.success_status', st.eligible ? 'passed' : (st.done === COURSE.length ? 'failed' : 'unknown'));
    } else SCORM.set('cmi.core.lesson_status', '', st.eligible ? 'passed' : (st.done === COURSE.length ? 'failed' : 'incomplete'));
    SCORM.commit();
  }
  renderXP();
}
addEventListener('beforeunload', () => SCORM.finish());
const chS = id => S.c[id] || (S.c[id] = {});
function unlocked(id) {
  if (PREVIEW || id === 1) return true;
  if (id === COURSE.length) return COURSE.slice(0, -1).every(c => S.c[c.id] && S.c[c.id].best != null);
  return !!(S.c[id - 1] && S.c[id - 1].best != null);
}
const openIds = () => COURSE.flatMap(c => [...c.cards.filter(k => k.t === 'think').map(k => k.id), ...c.quiz.filter(q => q.type === 'open').map(q => q.id)]);
function stats() {
  let done = 0, sum = 0, xp = 0;
  COURSE.forEach(c => { const s = S.c[c.id]; if (s && s.best != null) { done++; sum += s.best; xp += s.pts || 0; } });
  const avg = done ? sum / done : 0, avgAll = sum / COURSE.length;
  const ids = openIds(), answered = ids.filter(id => (S.j[id] || '').trim().length >= 15).length;
  return {done, avg, avgAll, xp, answered, totalOpen: ids.length, eligible: done === COURSE.length && avg >= CONFIG.passMark && answered === ids.length};
}
const stars = p => p >= 80 ? 3 : p >= 60 ? 2 : p > 0 ? 1 : 0;
function publishCourseStatus() {
  if (window.parent !== window) window.parent.postMessage({ type: 'met-club-course-status', xp: $('#xpVal').textContent, soundEnabled: S.snd }, location.origin);
}
function renderXP() { $('#xpChip').hidden = !S.p; $('#xpVal').textContent = num(Math.round(stats().xp * 10)); publishCourseStatus(); }

/* ---------- sound & confetti ---------- */
let AC = null;
function tone(seq) {
  if (!S.snd) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)(); let t = AC.currentTime;
    seq.forEach(([f, d, type = 'sine', f2]) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.16, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + .02); t += d * .85; });
  } catch (e) {}
}
const SFX = {ok: () => tone([[660, .12, 'triangle'], [880, .12, 'triangle'], [1320, .22, 'triangle']]), bad: () => tone([[320, .35, 'sawtooth', 90]]), click: () => tone([[520, .05, 'square']]), fan: () => tone([[523, .14, 'triangle'], [659, .14, 'triangle'], [784, .14, 'triangle'], [1047, .4, 'triangle']])};
function renderSound() {
  $('#soundBtn').innerHTML = S.snd ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>' : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
  publishCourseStatus();
}
$('#soundBtn').onclick = () => { S.snd = !S.snd; save(); renderSound(); SFX.click(); };
$('#homeBtn').onclick = () => { if (S.p) go('map'); };
function confetti(n = 90) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = $('#confetti'), cx = cv.getContext('2d'); cv.width = innerWidth; cv.height = innerHeight;
  const cols = ['#da291c', '#ffc72c', '#138a6b', '#1c8fd6', '#ffffff'];
  const ps = Array.from({length: n}, () => ({x: innerWidth / 2 + (Math.random() - .5) * 220, y: innerHeight * .35, vx: (Math.random() - .5) * 12, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 4, c: cols[Math.random() * 5 | 0], a: Math.random() * 6}));
  let f = 0;
  (function step() { cx.clearRect(0, 0, cv.width, cv.height); ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .35; p.a += .2; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); cx.restore(); }); if (++f < 110) requestAnimationFrame(step); else cx.clearRect(0, 0, cv.width, cv.height); })();
}
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2800); }

/* ---------- characters (original flat illustrations) ---------- */
const AV = {
  megla: `<svg viewBox="0 0 120 120" aria-label="${CAST.megla.name}"><circle cx="60" cy="60" r="58" fill="#fde7e4"/><path d="M22 120c2-26 16-40 38-40s36 14 38 40z" fill="#f4f1ea"/><path d="M48 84l12 14 12-14" fill="#da291c"/><path d="M30 60c0-30 60-30 60 0v28c-6-10-10-14-30-14S36 78 30 88z" fill="#2b2320"/><ellipse cx="60" cy="58" rx="21" ry="24" fill="#c98b5f"/><path d="M38 52c4-18 40-20 44 0-8-8-34-8-44 0z" fill="#2b2320"/><circle cx="52" cy="58" r="2.8" fill="#1a1210"/><circle cx="68" cy="58" r="2.8" fill="#1a1210"/><path d="M52 69q8 6 16 0" stroke="#7a2a1a" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="60" cy="47" r="2.2" fill="#da291c"/><rect x="74" y="92" width="18" height="14" rx="3" fill="#1c8fd6"/><path d="M78 96h10M78 100h7" stroke="#fff" stroke-width="2"/></svg>`,
  mitu: `<svg viewBox="0 0 120 120" aria-label="${CAST.mitu.name}"><circle cx="60" cy="60" r="58" fill="#dff3f4"/><path d="M24 120c2-26 16-38 36-38s34 12 36 38z" fill="#e2508f"/><path d="M40 86q20 14 40 0" stroke="#fff" stroke-width="5" fill="none"/><path d="M34 58c0-28 52-28 52 0l2 22c-4-6-6-8-8-8V56H40v16c-2 0-4 2-8 8z" fill="#2b1d16"/><ellipse cx="60" cy="58" rx="20" ry="23" fill="#b9794d"/><path d="M40 50c4-16 36-16 40 0-6-6-12-8-20-8s-14 2-20 8z" fill="#2b1d16"/><path d="M84 62c8 8 8 26 2 36" stroke="#2b1d16" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="85" cy="100" r="4" fill="#ffc72c"/><circle cx="52" cy="58" r="2.8" fill="#140c08"/><circle cx="68" cy="58" r="2.8" fill="#140c08"/><path d="M52 68q8 7 16 0" stroke="#6b2414" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`,
  rafi: `<svg viewBox="0 0 120 120" aria-label="${CAST.rafi.name}"><circle cx="60" cy="60" r="58" fill="#e3ecfb"/><path d="M22 120c2-26 16-38 38-38s36 12 38 38z" fill="#f28c28"/><path d="M38 90h44v30H38z" fill="#2f6fd0" opacity=".9"/><path d="M48 96h24" stroke="#fff" stroke-width="3"/><ellipse cx="60" cy="60" rx="20" ry="23" fill="#a86a43"/><path d="M38 52c0-22 44-22 44 0z" fill="#da291c"/><path d="M36 52h52" stroke="#a81f14" stroke-width="5" stroke-linecap="round"/><circle cx="52" cy="62" r="2.8" fill="#140c08"/><circle cx="68" cy="62" r="2.8" fill="#140c08"/><path d="M50 72q10 7 20 0" stroke="#5a2414" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M52 78q8 3 16 0" stroke="#2b1d16" stroke-width="2" fill="none" opacity=".5"/></svg>`,
  usha: `<svg viewBox="0 0 120 120" aria-label="${CAST.usha.name}"><circle cx="60" cy="60" r="58" fill="#f6ead9"/><path d="M24 120c2-24 16-36 36-36s34 12 36 36z" fill="#3b2a6b"/><path d="M28 104h64M26 112h68" stroke="#ffc72c" stroke-width="3"/><path d="M30 108h60" stroke="#da291c" stroke-width="2.5" stroke-dasharray="6 4"/><path d="M36 60c0-28 48-28 48 0v14H36z" fill="#1d1410"/><ellipse cx="60" cy="60" rx="19" ry="22" fill="#d9a77a"/><path d="M41 52c4-14 34-14 38 0-8-6-30-6-38 0z" fill="#1d1410"/><circle cx="60" cy="36" r="8" fill="#1d1410"/><circle cx="66" cy="34" r="2.5" fill="#da291c"/><path d="M51 60q2-2 5 0M64 60q2-2 5 0" stroke="#140c08" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M52 70q8 6 16 0" stroke="#7a2a1a" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`
};
const PC = {megla: 'var(--stc)', mitu: '#138a9a', rafi: '#2f6fd0', usha: '#8a5a2b'};

/* ---------- icons ---------- */
const I = p => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICON = {
  bolt: I('<path d="M13 2L5 13h6l-2 9 9-12h-6l1-8z"/>'), bulb: I('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 3z"/>'),
  map: I('<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>'), flask: I('<path d="M9 3h6M10 3v6L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-10V3"/><path d="M7 15h10"/>'),
  bell: I('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>'), sat: I('<path d="M4 20l4-4M14 4l6 6-4 4-6-6zM10 8l6 6M6 12l6 6-3 3-6-6z"/>'),
  shield: I('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'), rocket: I('<path d="M5 15c-2 2-2 5-2 5s3 0 5-2M9 15l-3-3c2-6 7-9 13-9 0 6-3 11-9 13z"/><circle cx="15" cy="9" r="1.5"/>'),
  trophy: I('<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a4 4 0 0 0 4 5M16 6h4a4 4 0 0 1-4 5M10 15h4v4h-4zM7 21h10"/>'), star: I('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'),
  chart: I('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'), clip: I('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 10h8M8 14h8M8 18h5"/>'), coin: I('<circle cx="12" cy="12" r="9"/><path d="M15 9h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9M12 6v2M12 16v2"/>'),
  pen: I('<path d="M4 20l4-1 11-11-3-3L5 16z"/>'), book: I('<path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4zM20 4h-6"/>')
};
const HZ_ICON = {
  cyclone: I('<path d="M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/><path d="M20 8c-2-4-8-6-12-3M4 16c2 4 8 6 12 3M16 4c4 2 5 8 3 11M8 20c-4-2-5-8-3-11"/>'),
  flood: I('<path d="M2 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M2 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M6 12V7l6-4 6 4v5"/>'),
  landslide: I('<path d="M2 20l7-12 4 6 3-3 6 9z"/><circle cx="15" cy="17" r="1.3"/><circle cx="18" cy="15" r="1"/>'),
  heatwave: I('<circle cx="12" cy="9" r="4"/><path d="M12 1v2M4.2 4.2l1.4 1.4M1 9h2M21 9h2M18.4 5.6l1.4-1.4M3 18q3-2 6 0t6 0 6 0M3 22q3-2 6 0t6 0 6 0"/>')
};
const CH_ICON = {1: 'star', 2: 'chart', 3: 'flask', 4: 'sat', 5: 'trophy'};

/* ---------- illustrated scenes ---------- */
function scene(kind) {
  const W = 900, H = 300;
  let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">`;
  const cloud = (x, y, k, c) => `<g transform="translate(${x} ${y}) scale(${k})" fill="${c}"><ellipse cx="0" cy="0" rx="50" ry="24"/><ellipse cx="38" cy="-16" rx="36" ry="28"/><ellipse cx="78" cy="0" rx="44" ry="22"/><rect x="-34" y="0" width="150" height="22" rx="11"/></g>`;
  const rain = (n, c) => { let t = `<g stroke="${c}" stroke-width="2.4" stroke-linecap="round" opacity=".75">`; for (let i = 0; i < n; i++) { const x = (i * 97) % 920, y = (i * 53) % 260; t += `<path d="M${x} ${y}l-6 16"/>`; } return t + '</g>'; };
  if (kind === 'call') {
    s += `<rect width="900" height="300" fill="#da291c"/>` + cloud(120, 70, 1, '#e94b3f') + cloud(640, 60, .9, '#e94b3f') + `<circle cx="820" cy="70" r="40" fill="#ffc72c"/>`;
    s += `<path d="M0 270q450-40 900 0v30H0z" fill="#3fae4f"/></svg><div class="tiles4">${['megla', 'mitu', 'rafi', 'usha'].map(k => `<div>${AV[k]}<b>${CAST[k].name}</b></div>`).join('')}</div>`;
    return s;
  } else if (kind === 'coast') {
    s += `<rect width="900" height="300" fill="#6d84a8"/>` + cloud(80, 60, 1.2, '#4b5d7e') + cloud(420, 40, 1.3, '#43546f') + cloud(700, 70, 1.1, '#4b5d7e') + rain(60, '#d6e2ff');
    s += `<path d="M0 220q120-30 240 0t240 0 240 0 180-10v90H0z" fill="#2e6aa5"/><path d="M520 200h380v100H520z" fill="#7a6a4a"/><path d="M520 200q30-12 60 0h320" fill="#5f8f45"/>`;
    s += `<g><rect x="600" y="150" width="90" height="56" fill="#c9a77a"/><path d="M590 152l55-36 55 36z" fill="#9aa3ad"/><rect x="636" y="172" width="18" height="34" fill="#5a3a20"/></g>`;
    s += `<g><rect x="740" y="140" width="120" height="66" fill="#e6e1d3"/><path d="M732 142h136v-12H732z" fill="#b9b19b"/><rect x="760" y="156" width="22" height="18" fill="#8fb3e0"/><rect x="818" y="156" width="22" height="18" fill="#8fb3e0"/></g>`;
    s += `<g><path d="M200 230q-6-60 8-110" stroke="#3b2a1a" stroke-width="7" fill="none"/><path d="M208 120q40-6 70 26-40-12-70-26zM208 120q30-32 72-20-40 4-72 20z" fill="#2f5d2a"/></g><g transform="translate(380 214)"><path d="M0 0h90l-14 16H12z" fill="#7a3b1a"/><path d="M44 0v-40l24 30z" fill="#fff"/></g>`;
    s += `<path d="M560 92h0" /><g transform="translate(540 96)"><path d="M0 0v70" stroke="#5a3a20" stroke-width="4"/><path d="M2 2h34l-8 10 8 10H2z" fill="#da291c"/><rect x="12" y="7" width="7" height="7" fill="#1f1d1c"/></g>`;
  } else if (kind === 'char') {
    s += `<rect width="900" height="300" fill="#b9d8ef"/>` + cloud(120, 60, .9, '#fff') + cloud(560, 50, 1, '#e9f3fb') + `<circle cx="790" cy="70" r="36" fill="#ffd166"/>`;
    s += `<path d="M0 180q200-20 450 0t450-6v126H0z" fill="#6aa9c9"/><path d="M180 196q120-26 260 0 30 6 30 14H160q0-8 20-14z" fill="#e8d6a5"/>`;
    s += `<g transform="translate(250 130)"><rect x="0" y="20" width="80" height="50" fill="#d8b98a"/><path d="M-10 22l50-34 50 34z" fill="#8a5a2b"/><rect x="32" y="40" width="16" height="30" fill="#5a3a20"/><path d="M-14 70h108v8H-14z" fill="#7a5a3a"/><path d="M-6 78v20M86 78v20" stroke="#7a5a3a" stroke-width="5"/></g>`;
    s += `<g transform="translate(560 230)"><path d="M0 0h110l-16 18H14z" fill="#8a4b20"/><path d="M50 0v-34" stroke="#5a3a20" stroke-width="3"/></g><g transform="translate(400 150)"><ellipse cx="0" cy="0" rx="26" ry="14" fill="#f2f2f2"/><circle cx="24" cy="-8" r="9" fill="#f2f2f2"/><path d="M-14 12v12M12 12v12" stroke="#555" stroke-width="3"/></g>`;
    s += `<g stroke="#fff" stroke-width="3" fill="none" opacity=".7"><path d="M40 240q20-8 40 0M300 260q20-8 40 0M700 250q20-8 40 0"/></g>`;
  } else if (kind === 'hill') {
    s += `<rect width="900" height="300" fill="#a9c3d6"/>` + cloud(200, 50, 1, '#8ea3b8') + cloud(560, 40, 1.1, '#8597ad') + rain(40, '#eef4ff');
    s += `<path d="M0 300L180 80l120 100 120-140 200 260z" fill="#4f8a3e"/><path d="M360 300l180-210 160 120 200-80v170z" fill="#3e7232"/>`;
    s += `<path d="M420 140l40 160h-70z" fill="#8a6440"/><circle cx="440" cy="250" r="12" fill="#6b4a2b"/><circle cx="470" cy="276" r="9" fill="#6b4a2b"/>`;
    s += `<g transform="translate(250 196)"><path d="M0 30h70v40H0z" fill="#d9b78a"/><path d="M-8 32l43-26 43 26z" fill="#9aa3ad"/><path d="M-6 70h82" stroke="#7a5a3a" stroke-width="5"/><path d="M4 70v20M64 70v20" stroke="#7a5a3a" stroke-width="5"/></g>`;
    s += `<g transform="translate(640 160)"><rect x="0" y="0" width="16" height="70" fill="#ccc"/><rect x="-4" y="70" width="24" height="8" fill="#999"/><path d="M-6 0h28" stroke="#888" stroke-width="3"/><text x="8" y="-8" text-anchor="middle" font-size="13" font-family="Hind Siliguri, sans-serif" fill="#1f1d1c">${UI.rainGauge}</text></g>`;
  }
  return s + '</svg>';
}
const LAND = `<svg class="land" viewBox="0 0 900 230" aria-hidden="true"><path d="M0 110q220-80 470-10t430-30v160H0z" fill="#2f9a52"/><path d="M0 150q260-60 520 0t380-20v100H0z" fill="#46b555"/><path d="M380 230c20-80 50-120 70-140 20 30 40 80 50 140z" fill="#7fc6e8"/><g transform="translate(110 120)"><rect x="0" y="22" width="70" height="56" fill="#fff4dc"/><path d="M-8 24l43-32 43 32z" fill="#1f2a3a"/></g><g transform="translate(210 132)"><rect x="0" y="20" width="62" height="48" fill="#fff4dc"/><path d="M-8 22l39-28 39 28z" fill="#f4a020"/></g><g transform="translate(640 96)"><path d="M0 0v96" stroke="#5a3a20" stroke-width="6"/><path d="M3 2h66l-14 16 14 16H3z" fill="#fff"/><rect x="24" y="11" width="13" height="13" fill="#1f2a3a"/></g><g transform="translate(590 150)"><circle cx="0" cy="0" r="14" fill="#f4d3b0"/><rect x="-12" y="16" width="24" height="40" rx="10" fill="#1c8fd6"/></g></svg>`;

/* ---------- router ---------- */
let VIEW = null;
function go(v, arg) { VIEW = {v, arg}; app.innerHTML = ''; scrollTo({top: 0}); ({welcome: vWelcome, map: vMap, lesson: vLesson, quiz: vQuiz, cert: vCert, journal: vJournal}[v])(arg); renderXP(); }
const setC = col => document.documentElement.style.setProperty('--c', CHC[col] || 'var(--stc)');

/* ---------- welcome ---------- */
function vWelcome() {
  setC('red');
  const p = S.p || {};
  app.innerHTML = `<section class="stack">
    <div class="hero" role="img" aria-label="${UI.heroAlt}"><div class="hero-in"><span class="tag">${UI.heroTag}</span><h1>${esc(CONFIG.courseName).replace(/(\S+-\S+)/g, '<span style="white-space:nowrap">$1</span>')}</h1>
    <p>${UI.heroLine}</p>
    <span class="age">${UI.heroAge}</span></div></div>
    <div><h2 style="font-size:22px;margin-bottom:10px">${UI.hazardsTitle}</h2><div class="hzgrid">
      ${HZ_KEYS.map(h => `<div class="hzcard" style="--hc:${HZC[h]}"><span class="hi">${HZ_ICON[h]}</span><b>${HZ[h].name}</b><span>${HZ[h].area}</span></div>`).join('')}
    </div></div>
    <div class="card"><div class="row" style="align-items:flex-start;flex-wrap:nowrap"><div style="width:72px;flex:none">${AV.megla}</div><div><b style="font-family:var(--f-display);font-size:18px">${UI.meteoSays}</b><p>${UI.meteoQuote}</p></div></div></div>
    <form class="card stack" id="reg" novalidate><div><h2 style="font-size:24px">${S.p ? UI.yourInfo : UI.joinCourse}</h2><p class="muted" style="font-size:15px">${UI.nameNote}</p></div>
      <div class="form">
        <label class="full" for="f-name">${UI.fName}<input id="f-name" name="name" autocomplete="name" value="${esc(p.name || S.lmsName || '')}" placeholder="${UI.fNamePh}"></label>
        <label for="f-school">${UI.fSchool}<input id="f-school" name="school" value="${esc(p.school || '')}" placeholder="${UI.fSchoolPh}"></label>
        <label for="f-class">${UI.fClass}<select id="f-class" name="cls">${UI.classes.map(c => `<option ${p.cls === c ? 'selected' : ''} value="${c}">${c || UI.choose}</option>`).join('')}</select></label>
        <label class="full" for="f-dist">${UI.fDist}<input id="f-dist" name="dist" value="${esc(p.dist || '')}" placeholder="${UI.fDistPh}"></label>
      </div><p class="err" id="regErr" hidden>${UI.nameErr}</p>
      <div class="row"><button class="btn btn-red" type="submit">${S.p ? UI.save : UI.letsStart} ➜</button>${S.p ? `<button class="btn btn-ghost" type="button" id="backMap">${UI.backToMap}</button>` : ''}</div></form>
    <p class="foot">${esc(CONFIG.orgName)} · ${esc(UI.platform(CONFIG.programName))}</p>
  </section>`;
  $('#reg').onsubmit = e => {
    e.preventDefault(); const f = new FormData(e.target), name = (f.get('name') || '').trim();
    if (!name) { $('#regErr').hidden = false; $('#f-name').focus(); return; }
    S.p = {name, school: f.get('school').trim(), cls: f.get('cls'), dist: f.get('dist').trim()}; save(); SFX.fan(); go('map');
  };
  const b = $('#backMap'); if (b) b.onclick = () => go('map');
}

/* ---------- map ---------- */
function vMap() {
  setC('red');
  const st = stats(), N = COURSE.length;
  const next = COURSE.find(c => !(S.c[c.id] && S.c[c.id].best != null));
  const avgTxt = st.done ? num(Math.round(st.avg)) + '%' : '—';
  let h = `<section class="dash">
    <div class="card stack"><div><div class="eyebrow">${UI.welcome}</div><h1 style="font-size:clamp(24px,4vw,32px)">${UI.hello(esc(S.p.name))}</h1>
      <p class="muted" style="font-size:15px">${next ? `${UI.nextStep} <b>${UI.chapter(num(next.id))}: ${esc(next.title)}</b>` : UI.allDone}</p></div>
      <div><div class="row" style="justify-content:space-between;font-weight:600;font-size:15px"><span>${UI.progress}</span><span>${num(st.done)} / ${num(N)}</span></div><div class="meter" style="margin-top:4px"><i style="width:${st.done / N * 100}%"></i></div></div>
      <div class="row">${next ? `<button class="btn btn-red" id="cont">${st.done ? UI.continue : UI.startFirst} ➜</button>` : ''}<button class="btn btn-ghost" id="jr">${UI.journal}</button><button class="btn btn-ghost" id="editP">${UI.myInfo}</button></div>
      ${PREVIEW ? `<p class="note">${UI.previewNote}</p>` : ''}</div>
    <div class="card stack"><div class="row" style="justify-content:space-between"><h2 style="font-size:20px">${UI.certReq}</h2><span class="pill ${st.eligible ? 'g' : 'y'}">${st.eligible ? UI.achieved : UI.ongoing}</span></div>
      <div class="req ${st.done === N ? 'ok' : ''}"><span class="tick">${st.done === N ? '✓' : num(1)}</span><span>${UI.req1} <b>(${num(st.done)}/${num(N)})</b></span></div>
      <div class="req ${st.done && st.avg >= CONFIG.passMark ? 'ok' : ''}"><span class="tick">${st.done && st.avg >= CONFIG.passMark ? '✓' : num(2)}</span><span>${UI.req2(num(CONFIG.passMark))} <b>(${UI.now(avgTxt)})</b></span></div>
      <div class="req ${st.answered === st.totalOpen ? 'ok' : ''}"><span class="tick">${st.answered === st.totalOpen ? '✓' : num(3)}</span><span>${UI.req3} <b>(${num(st.answered)}/${num(st.totalOpen)})</b></span></div>
      <p class="note">${UI.retryNote}</p>
      <button class="btn ${st.eligible ? 'btn-sun' : 'btn-ghost'}" id="certBtn">${st.eligible ? UI.viewCert : UI.certLocked}</button>
      ${PREVIEW ? `<button class="btn btn-ghost" id="certDemo">${UI.certDemo}</button>` : ''}</div>
  </section><section class="path">`;
  COURSE.forEach(c => {
    const cs = S.c[c.id] || {}, done = cs.best != null, open = unlocked(c.id);
    const stx = done ? `<span class="stars">${'★'.repeat(stars(cs.best))}${'☆'.repeat(3 - stars(cs.best))}</span><span class="pill ${cs.best >= CONFIG.passMark ? 'g' : 'y'}">${UI.best} ${num(Math.round(cs.best))}%</span>`
      : open ? `<span class="pill y">${cs.lessonDone ? UI.quizLeft : cs.pos ? UI.reading : UI.startCh}</span>` : `<span class="muted">🔒 ${c.id === N ? UI.finishAll : UI.finishPrev}</span>`;
    h += `<button class="ch ${open ? '' : 'lock'}" style="--c:${CHC[c.color]}" data-id="${c.id}"><span class="badge">${c.id === N ? ICON.trophy : `<b>${num(c.id)}</b>`}</span><span><span class="eyebrow">${c.id === N ? UI.finalMission : UI.chapter(num(c.id))}</span><h3>${esc(c.title)}</h3><p>${esc(c.sub)}</p></span><span class="st">${stx}</span></button>`;
  });
  h += `</section><p class="foot">${UI.mantraFoot} · ${esc(CONFIG.orgName)}</p>`;
  app.innerHTML = h;
  app.querySelectorAll('.ch').forEach(b => b.onclick = () => {
    const id = +b.dataset.id; if (!unlocked(id)) { SFX.bad(); toast(UI.lockedToast); return; }
    SFX.click(); const cs = S.c[id] || {}; go('lesson', {id, i: cs.lessonDone ? 0 : (cs.pos || 0)});
  });
  const c = $('#cont'); if (c) c.onclick = () => go('lesson', {id: next.id, i: (S.c[next.id] || {}).pos || 0});
  $('#editP').onclick = () => go('welcome'); $('#jr').onclick = () => go('journal');
  $('#certBtn').onclick = () => { const s = stats(); if (s.eligible) go('cert'); else { SFX.bad(); toast(UI.certToast); } };
  const d = $('#certDemo'); if (d) d.onclick = () => go('cert', {demo: true});
}

/* ---------- lesson player ---------- */
function lhead(c, i, total, quiz) {
  return `<div class="lhead"><div class="crumb"><span class="chnum">${c.id === COURSE.length ? UI.finalMission : UI.chapter(num(c.id))}</span><span class="muted" style="font-size:14px">${quiz ? UI.quiz : UI.cardOf(num(i + 1), num(total))}</span></div><h1>${esc(c.title)}</h1>
  <div class="prog">${Array.from({length: total + 1}, (_, k) => `<i class="${quiz || k <= i ? 'on' : ''}"></i>`).join('')}</div></div>`;
}
function srcLinks(src) { const a = [].concat(src); return '<p class="src">' + UI.source + ' ' + a.map(k => `<a href="${SOURCES[k][1]}" target="_blank" rel="noopener">${esc(SOURCES[k][0])}</a>`).join(' · ') + '</p>'; }
function boxNote(n) { return n ? `<div class="box ${n[0]}"><span>${n[0] === 'warn' ? '⚠️' : '💡'}</span><p>${n[1]}</p></div>` : ''; }
const SUN_AV = `<span class="sunav"><svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="#ffc72c"/><g stroke="#f39c24" stroke-width="2" stroke-linecap="round"><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></g></svg></span>`;
function hzHead(k) { const w = HZ[k].who; return `<div class="hh">${w ? AV[w].replace('<svg', '<svg class="av"') : SUN_AV}<span><b>${HZ[k].name}</b><small>${w ? CAST[w].name + ' · ' : ''}${HZ[k].place}</small></span></div>`; }

function vLesson({id, i}) {
  const c = COURSE[id - 1], cards = c.cards; setC(c.color);
  i = Math.max(0, Math.min(i, cards.length - 1));
  const cs = chS(id); cs.pos = i; save();
  const k = cards[i];
  let gate = null; // function returning true when the card allows "next"
  let inner = '', band = '', icon = ICON[k.icon] || ICON.book;
  const title = k.title || UI.cardTitles[k.t] || '';
  if (k.t === 'story') {
    inner = `<div class="scene">${scene(k.scene)}</div><div class="dialog" id="dlg"></div>`;
  } else if (k.t === 'concept') {
    inner = (k.equation ? `<div class="eq"><span class="t">${k.equation[0]}</span><span class="op">+</span><span class="t">${k.equation[1]}</span><span class="op">=</span><span class="t res">${k.equation[2]}</span></div>` : '')
      + (k.body || []).map(p => `<p>${p}</p>`).join('')
      + (k.list ? `<ul class="ticks">${k.list.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '')
      + (k.steps ? `<div class="three">${k.steps.map((s, n) => `<div><span class="n">${num(n + 1)}</span><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join('')}</div>` : '')
      + boxNote(k.note);
  } else if (k.t === 'compare') {
    inner = `<div class="two"><div class="cmp old"><h3>😟 ${esc(k.left[0])}</h3><p>${esc(k.left[1])}</p></div><div class="cmp new"><h3>😀 ${esc(k.right[0])}</h3><p>${esc(k.right[1])}</p></div></div>`;
  } else if (k.t === 'real') {
    icon = ICON.star;
    inner = `<span class="real-tag">${UI.realTag} · ${HZ[k.hz].name}</span><p>${esc(k.body)}</p><div class="stats">${k.stats.map(s => `<div class="stat"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join('')}</div>${k.foot ? `<p class="note">${esc(k.foot)}</p>` : ''}${srcLinks(k.src)}`;
  } else if (k.t === 'hazards') {
    inner = `<p>${esc(k.intro)}</p><div class="hz3">${HZ_KEYS.map(h => `<div class="hzc hz-${h}">${hzHead(h)}${k.ibf
      ? `<div class="msg old"><b>${UI.oldMsg}</b>${esc(k.items[h][0].replace(UI.oldPrefix, ''))}</div><div class="msg new"><b>${UI.ibfMsg}</b>${esc(k.items[h][1].replace(UI.ibfPrefix, ''))}</div>`
      : `<ul>${k.items[h].map(x => { const m = x.match(/^([^:]{2,16}):\s*(.*)$/); return `<li><span>${m ? `<b>${esc(m[1])}:</b> ${esc(m[2])}` : esc(x)}</span></li>`; }).join('')}</ul>`}</div>`).join('')}</div>`;
  } else if (k.t === 'formula') {
    icon = ICON.chart;
    inner = UI.formulaHtml;
  } else if (k.t === 'datalists') {
    icon = ICON.clip;
    inner = `<p>${esc(k.intro)}</p><div class="hz3">${k.groups.map((g, n) => `<div class="hzc" style="--hc:${['#da291c', '#f4a020', '#1c8fd6'][n]}"><div class="hh"><span><b>${esc(g[0])}</b></span></div><ul>${g[1].map(x => `<li><span>${esc(x)}</span></li>`).join('')}</ul></div>`).join('')}</div>`;
  } else if (k.t === 'glossary') {
    icon = ICON.book;
    inner = `<div class="tblwrap"><table class="gloss">${k.rows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</table></div>`;
  } else if (k.t === 'widget') {
    icon = {window: ICON.bell, pillars: ICON.clip, formula: ICON.chart, cascade: ICON.map, matrix: ICON.flask, coloractions: ICON.star, signals: ICON.bell, datacard: ICON.clip, journey: ICON.rocket}[k.w];
    inner = `<p>${esc(k.intro)}</p><div id="wg"></div>`;
  } else if (k.t === 'check') {
    icon = ICON.bulb;
    inner = `<div id="chk"></div>`;
  } else if (k.t === 'think') {
    icon = ICON.pen;
    const prev = S.j[k.id] || '';
    inner = `<div class="think"><span class="tag">${UI.thinkTag}</span><p style="font-weight:600">${esc(k.prompt)}</p><textarea id="ta" placeholder="${UI.thinkPh}">${esc(prev)}</textarea><div class="row"><button class="btn btn-c" id="saveT" ${prev.trim().length >= 15 ? '' : 'disabled'}>${UI.submit}</button><span class="note" id="tnote">${prev ? UI.thinkSaved : UI.thinkHint}</span></div><div id="model" ${prev ? '' : 'hidden'}><div class="model"><h4>${UI.thinkModel}</h4><ul class="ticks">${k.model.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div></div>`;
  }
  const isLast = i === cards.length - 1;
  app.innerHTML = lhead(c, i, cards.length) + `<article class="lcard"><div class="lband"><span class="ico">${icon}</span><h2>${esc(title)}</h2></div><div class="lbody">${inner}</div></article>
    <div class="lnav"><button class="btn btn-ghost" id="prev" ${i === 0 ? 'disabled' : ''}>◂ ${UI.prev}</button><button class="btn btn-ghost" id="toMap">${UI.map}</button><button class="btn btn-c" id="next">${isLast ? UI.toQuiz : UI.next}</button></div>`;
  const nextBtn = $('#next');
  const setGate = ok => { nextBtn.disabled = !ok; };
  // card behaviours
  if (k.t === 'story') {
    const dlg = $('#dlg'); let shown = 0;
    const one = () => { const [w, t] = k.lines[shown++]; const right = w === 'mitu' || w === 'usha'; const el = document.createElement('div'); el.className = `line ${w} ${right ? 'right' : ''}`; el.style.setProperty('--pc', PC[w]); el.innerHTML = `<div class="av">${AV[w]}</div><div class="bub"><span class="who">${CAST[w].name}</span>${esc(t)}</div>`; dlg.appendChild(el); };
    one();
    const more = document.createElement('div'); more.className = 'row'; more.style.justifyContent = 'flex-end'; more.innerHTML = `<button class="btn btn-ghost" id="allL">${UI.allLines}</button><button class="btn btn-c" id="moreL">${UI.nextLine}</button>`; dlg.after(more); more.style.padding = '0 16px 16px';
    const upd = () => { if (shown >= k.lines.length) { more.remove(); setGate(true); } };
    $('#moreL').onclick = () => { one(); SFX.click(); upd(); dlg.lastChild.scrollIntoView({block: 'nearest', behavior: 'smooth'}); };
    $('#allL').onclick = () => { while (shown < k.lines.length) one(); upd(); };
    setGate(k.lines.length <= 1 || !!cs.lessonDone);
  }
  if (k.t === 'widget') WIDGETS[k.w]($('#wg'));
  if (k.t === 'check') {
    setGate(false);
    renderQuestion($('#chk'), k.q, (score) => { setGate(true); }, {inline: true});
  }
  if (k.t === 'think') {
    const ta = $('#ta'), sv = $('#saveT');
    setGate((S.j[k.id] || '').trim().length >= 15);
    ta.oninput = () => { sv.disabled = ta.value.trim().length < 15; };
    sv.onclick = () => { S.j[k.id] = ta.value.trim(); save(); $('#model').hidden = false; $('#tnote').textContent = UI.thinkDone; SFX.ok(); setGate(true); };
  }
  $('#prev').onclick = () => go('lesson', {id, i: i - 1});
  $('#toMap').onclick = () => go('map');
  nextBtn.onclick = () => {
    if (isLast) { cs.lessonDone = 1; cs.pos = 0; save(); go('quiz', {id}); }
    else go('lesson', {id, i: i + 1});
  };
}

/* ---------- interactive widgets ---------- */
const MATRIX = [['Y', 'O', 'R', 'R'], ['G', 'Y', 'O', 'R'], ['G', 'G', 'Y', 'O'], ['G', 'G', 'G', 'Y']]; // rows: likelihood খুব বেশি→খুব কম; cols: impact খুব কম→খুব বেশি
const SIGC = {G: '#8fd1a8', Y: '#f6d365', O: '#f39c24', R: '#e0302a', P: '#b48ad8'};
function hzTabs(el, cur, on) {
  el.innerHTML = HZ_KEYS.map(h => `<button data-h="${h}" class="${h === cur ? 'on' : ''}" style="--hc:${HZC[h]}">${HZ[h].name}</button>`).join('');
  el.querySelectorAll('button').forEach(b => b.onclick = () => { SFX.click(); on(b.dataset.h); });
}
const flagSvg = n => `<svg viewBox="0 0 ${20 + 46} ${30 + n * 30}"><path d="M8 4v${n * 30 + 22}" stroke="#5a3a20" stroke-width="4"/>${Array.from({length: n}, (_, k) => `<path d="M10 ${6 + k * 30}h46l-10 11 10 11H10z" fill="#da291c"/><rect x="22" y="${13 + k * 30}" width="9" height="9" fill="#1f1d1c"/>`).join('')}</svg>`;
const WIDGETS = {
  window(el) {
    let h = 'cyclone', d = 3;
    const draw = () => {
      const W = WINDOW[h], stage = d >= 5 ? 5 : d >= 3 ? 3 : d >= 1 ? 1 : 0;
      el.innerHTML = `<div class="tabs" id="tb"></div><p class="note" style="margin-top:8px">${esc(W.note)}</p>
        <div class="timeline"><div class="track"></div><div class="ends"><span>📡 ${UI.forecast}</span><span>🌀 ${UI.disaster}</span></div>
        <label for="dr" style="display:block;margin-top:8px;font-weight:600">${UI.daysLeft} <b style="color:var(--c);font-family:var(--f-display);font-size:20px">${d === 0 ? UI.today : UI.days(num(d))}</b></label>
        <input type="range" id="dr" min="0" max="5" step="1" value="${5 - d}" aria-label="${UI.daysAria}"></div>
        <div class="actbox ${stage === 0 ? 'late' : ''}"><h4>${stage === 0 ? UI.windowClosed : UI.doNow(HZ[h].name)}</h4><ul class="ticks">${W.s[stage].map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <p class="note">${stage === 0 ? UI.windowLate : UI.windowHint}</p>`;
      hzTabs($('#tb', el), h, x => { h = x; draw(); });
      $('#dr', el).oninput = e => { d = 5 - +e.target.value; draw(); $('#dr', el).focus(); };
    };
    draw();
  },
  pillars(el) {
    let h = 'flood';
    const draw = () => {
      el.innerHTML = `<div class="tabs" id="tb"></div><div class="pillars" style="margin-top:12px">${PILLARS.map(p => `<div class="pillar" style="--pc:${p.c}"><span class="pi">${ICON[p.i]}</span><h3>${p.n}</h3><span class="muted" style="font-size:14px">(${p.en}) · ${p.q}</span><p class="ex">${esc(p.ex[h])}</p></div>`).join('')}</div>
      <div class="box fact"><p>${UI.pillarsExample}</p></div>`;
      hzTabs($('#tb', el), h, x => { h = x; draw(); });
    };
    draw();
  },
  formula(el) {
    const v = {h: 3, vu: 2, e: 2};
    const presets = RISK_PRESETS;
    const draw = () => {
      const r = v.h * v.vu * v.e, lvl = RISK_BANDS[r === 0 ? 0 : r <= 4 ? 1 : r <= 9 ? 2 : r <= 18 ? 3 : 4];
      el.innerHTML = `<div class="presets">${presets.map((p, n) => `<button data-n="${n}">${esc(p[0])}</button>`).join('')}</div>
      <div class="sliders" style="margin-top:12px">${[['h', '🌀 ' + UI.hazard], ['vu', '🏚️ ' + UI.vulnerability], ['e', '👨‍👩‍👧 ' + UI.exposure]].map(([k, n]) => `<div class="sl"><b>${n}</b><input type="range" min="0" max="3" step="1" value="${v[k]}" data-k="${k}" aria-label="${n}"><span>${RISK_LEVELS[v[k]]}</span></div>`).join('')}</div>
      <div class="riskout" style="background:${lvl[1]};color:${r > 9 ? '#fff' : '#1f1d1c'}"><b>${lvl[0]}</b><span>${num(v.h)} × ${num(v.vu)} × ${num(v.e)} = ${num(r)} · ${lvl[2]}</span></div>
      <p class="note">${UI.formulaNote}</p>`;
      el.querySelectorAll('input').forEach(i => i.oninput = e => { v[e.target.dataset.k] = +e.target.value; draw(); el.querySelector(`input[data-k="${e.target.dataset.k}"]`).focus(); });
      el.querySelectorAll('.presets button').forEach(b => b.onclick = () => { const p = presets[+b.dataset.n]; v.h = p[1]; v.vu = p[2]; v.e = p[3]; SFX.click(); draw(); });
    };
    draw();
  },
  cascade(el) {
    let h = 'flood';
    const draw = () => {
      const C = CASCADE[h];
      el.innerHTML = `<div class="tabs" id="tb"></div><div class="tree" style="--hc:${HZC[h]};margin-top:14px"><span class="root">${esc(C.root)}</span><span aria-hidden="true">⬇️</span><div class="br">${C.br.map(b => `<div class="node"><b>${esc(b[0])}</b><ul>${b[1].map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div></div>
      <div class="box tip"><p>${UI.cascadeWhy}</p></div>`;
      hzTabs($('#tb', el), h, x => { h = x; draw(); });
    };
    draw();
  },
  matrix(el) {
    let sel = [1, 3];
    const draw = () => {
      const col = MATRIX[sel[0]][sel[1]], C = COLORS[col];
      el.innerHTML = `<div class="tblwrap"><div class="matrix" role="grid" aria-label="${UI.matrixAria}"><div class="ax">${UI.matrixAxes}</div>${LVL4.map(l => `<div class="ax">${l}</div>`).join('')}
        ${MATRIX.map((row, r) => `<div class="ax">${LVL4[3 - r]}</div>${row.map((c, k) => `<button class="cell c${c} ${sel[0] === r && sel[1] === k ? 'sel' : ''}" data-r="${r}" data-k="${k}" aria-label="${UI.cellAria(LVL4[3 - r], LVL4[k], COLORS[c][0])}"></button>`).join('')}`).join('')}</div></div>
        <div class="box" style="background:color-mix(in srgb,${C[1]} 30%,var(--card))"><span class="dot" style="background:${C[1]};margin-top:7px"></span><p><b>${UI.cellResult(LVL4[3 - sel[0]], LVL4[sel[1]], C[0])}</b><br>${C[2]}</p></div>
        <div class="legend4">${Object.entries(COLORS).map(([k, c]) => `<div style="border-color:${c[1]}"><b><span class="dot" style="background:${c[1]}"></span>${c[0]}</b>${c[2]}</div>`).join('')}</div>
        <p class="note">${UI.matrixNote}</p>`;
      el.querySelectorAll('.cell').forEach(b => b.onclick = () => { sel = [+b.dataset.r, +b.dataset.k]; SFX.click(); draw(); el.querySelector(`.cell[data-r="${sel[0]}"][data-k="${sel[1]}"]`).focus(); });
    };
    draw();
  },
  coloractions(el) {
    let h = 'cyclone';
    const draw = () => {
      el.innerHTML = `<div class="tabs" id="tb"></div><div class="legend4" style="margin-top:12px">${Object.entries(COLORS).map(([k, c]) => `<div style="border-color:${c[1]}"><b><span class="dot" style="background:${c[1]}"></span>${c[0]}</b><ul class="ticks" style="font-size:14px;margin-top:4px">${COLACT[h][k].map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>`;
      hzTabs($('#tb', el), h, x => { h = x; draw(); });
    };
    draw();
  },
  signals(el) {
    let sel = 7;
    const draw = () => {
      const s = SIGNALS[sel - 1];
      el.innerHTML = `<div class="siglist">${SIGNALS.map(x => `<button style="background:${SIGC[x[1]]}" class="${x[0] === sel ? 'sel' : ''}" data-n="${x[0]}" aria-label="${UI.signalAria(num(x[0]))}">${num(x[0])}</button>`).join('')}</div>
        <div class="box" style="background:color-mix(in srgb,${SIGC[s[1]]} 28%,var(--card))"><p><b style="font-family:var(--f-display);font-size:18px">${UI.signalNo(num(s[0]))}: ${esc(s[2])}</b><br>${esc(s[3])}</p></div>
        <div class="box fact" style="flex-direction:column"><p>${UI.flagsNote}</p>
        <div class="flags">${UI.flags.map((t, n) => `<div>${flagSvg(n + 1)}${t}</div>`).join('')}</div></div>`;
      el.querySelectorAll('.siglist button').forEach(b => b.onclick = () => { sel = +b.dataset.n; SFX.click(); draw(); el.querySelector(`.siglist button[data-n="${sel}"]`).focus(); });
    };
    draw();
  },
  datacard(el) {
    const Q = DATACARD_Q;
    let h = 'flood'; const a = {};
    const draw = () => {
      const filled = Object.keys(a).length, score = Object.values(a).reduce((x, y) => x + y, 0);
      const col = score <= 3 ? 'G' : score <= 6 ? 'Y' : score <= 9 ? 'O' : 'R';
      el.innerHTML = `<div class="tabs" id="tb"></div><p class="note" style="margin-top:6px">${UI.mainHazard} <b>${HZ[h].name}</b></p><div class="dc">${Q.map((q, n) => `<div class="q"><span>${num(n + 1)}. ${esc(q[0])}</span><span class="opts3">${q[1].map((o, v) => o ? `<button data-n="${n}" data-v="${v}" class="${a[n] === v ? 'on' : ''}">${esc(o)}</button>` : '').join('')}</span></div>`).join('')}</div>
      ${filled === Q.length ? `<div class="box" style="background:color-mix(in srgb,${COLORS[col][1]} 32%,var(--card))"><span class="dot" style="background:${COLORS[col][1]};margin-top:7px"></span><div><p><b style="font-family:var(--f-display);font-size:18px">${UI.homeColor} ${COLORS[col][0]}</b> (${UI.points} ${num(score)}/${num(13)})</p><p>${UI.familyTodo}</p><ul class="ticks">${COLACT[h][col === 'G' ? 'Y' : col].map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div>` : `<p class="note">${UI.answerAll(num(filled), num(Q.length))}</p>`}
      <p class="note">🔐 ${UI.privacyNote}</p>`;
      hzTabs($('#tb', el), h, x => { h = x; draw(); });
      el.querySelectorAll('.opts3 button').forEach(b => b.onclick = () => { a[+b.dataset.n] = +b.dataset.v; SFX.click(); draw(); });
    };
    draw();
  },
  journey(el) {
    const ST = JOURNEY_STEPS;
    let n = 1;
    const draw = () => {
      el.innerHTML = `<div class="steps5">${ST.map((s, k) => `<div class="st5 ${k < n ? 'on' : ''}" style="--sc:${s[2]}"><span class="n">${num(k + 1)}</span><span><b>${esc(s[0])}</b><span>${esc(s[1])}</span></span></div>`).join('')}</div>
      <div class="row">${n < ST.length ? `<button class="btn btn-c" id="jn">${UI.nextStepBtn}</button>` : `<p class="box tip" style="margin:0"><span>🌟</span><span>${UI.journeyDone}</span></p>`}</div>`;
      const b = $('#jn', el); if (b) b.onclick = () => { n++; SFX.click(); draw(); if (n === ST.length) SFX.ok(); };
    };
    draw();
  }
};

/* ---------- question renderer (shared by quiz and inline checks) ---------- */
function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; }
const HOUSE = (q, i) => { // small picture for the "which house" question
  const kinds = [['#c9a77a', '#9aa3ad', true, true], ['#e6e1d3', '#8a3b2a', false, false], ['#d8d8d8', '#9aa3ad', false, false]][i];
  return `<svg viewBox="0 0 120 70" style="width:100%;max-width:160px;height:auto"><rect width="120" height="70" rx="8" fill="#dbeaf7"/>${kinds[2] ? '<path d="M0 54q30-8 60 0t60 0v16H0z" fill="#6aa9c9"/>' : '<path d="M0 50h120v20H0z" fill="#6bb35a"/><path d="M0 50q60-10 120 0" fill="#7a6a4a"/>'}<rect x="38" y="${kinds[2] ? 26 : 22}" width="44" height="28" fill="${kinds[0]}"/><path d="M32 ${kinds[2] ? 28 : 24}l28-18 28 18z" fill="${kinds[1]}"/><rect x="55" y="${kinds[2] ? 38 : 34}" width="10" height="${kinds[2] ? 16 : 20}" fill="#5a3a20"/></svg>`;
};
function renderQuestion(host, q, done, opts = {}) {
  host.innerHTML = `<div class="qtype">${QTYPE[q.type === 'choice' ? q.style : q.type] || UI.question}</div><div id="qb"></div><div id="fb"></div><div class="qfoot" id="qf"></div>`;
  const B = $('#qb', host), F = $('#fb', host), foot = $('#qf', host);
  const txt = t => esc(t).replace(/_{3,}/, '<span class="blank" id="blank">&nbsp;?&nbsp;</span>');
  const fin = (score, msg) => {
    const good = score >= .999;
    if (good) { SFX.ok(); confetti(50); } else { SFX.bad(); host.closest('.qcard,.lbody')?.classList.add('shake'); }
    F.innerHTML = `<div class="feedback ${good ? 'good' : 'bad'}"><b>${good ? UI.correct : score > 0 ? UI.partly : UI.wrong}</b>${msg ? `<p style="font-size:15.5px">${msg}</p>` : ''}</div>`;
    foot.innerHTML = ''; done(score);
  };
  if (q.type === 'choice') {
    const order = q.style === 'tf' ? q.options.map((_, i) => i) : shuffle(q.options.map((_, i) => i));
    const sw = q.style === 'matrix' ? Object.fromEntries(Object.values(COLORS).map(([name, hex]) => [name, hex])) : null;
    const house = q.style === 'hotspot';
    B.innerHTML = `<p class="qtext">${txt(q.text)}</p><div class="opts ${q.style === 'tf' ? 'tf' : ''}" id="opts">${order.map((oi, k) => {
      const o = q.options[oi][0];
      const lead = q.style === 'tf' ? `<span class="lt">${k === 0 ? '✓' : '✗'}</span>` : sw && sw[o] ? `<span class="sw" style="background:${sw[o]}"></span>` : house ? `<span style="width:120px;flex:none">${HOUSE(q, oi)}</span>` : `<span class="lt">${LET[k]}</span>`;
      return `<button class="opt" data-i="${oi}">${lead}<span><span>${esc(o)}</span><span class="why" hidden>${esc(q.options[oi][1] || '')}</span></span></button>`;
    }).join('')}</div>`;
    B.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      const i = +b.dataset.i, ok = i === q.answer; $('#opts', host).classList.add('locked');
      B.querySelectorAll('.opt').forEach(x => { const xi = +x.dataset.i; if (xi === q.answer) { x.classList.add('right'); x.querySelector('.why').hidden = false; } if (x === b && !ok) { x.classList.add('wrong'); x.querySelector('.why').hidden = false; } });
      const bl = $('#blank', host); if (bl) { bl.textContent = q.options[q.answer][0]; }
      fin(ok ? 1 : 0, ok ? '' : UI.seeGreen);
    });
  } else if (q.type === 'sort' || q.type === 'match') {
    const items = q.type === 'sort' ? q.items : q.left, targets = q.type === 'sort' ? q.buckets : q.right;
    const tOrder = q.type === 'sort' ? targets.map((_, i) => i) : shuffle(targets.map((_, i) => i)), iOrder = shuffle(items.map((_, i) => i)); const sel = {};
    B.innerHTML = `<p class="qtext">${txt(q.text)}</p><p class="muted" style="font-size:14px;margin:-8px 0 12px">${q.type === 'sort' ? UI.pickBox : UI.pickPair}</p><div class="assign">${iOrder.map(ii => `<div class="item" data-i="${ii}"><p>${q.type === 'sort' ? '📌 ' : '🔗 '}${esc(items[ii])}</p><div class="targets">${tOrder.map(ti => `<button class="t" data-t="${ti}">${esc(targets[ti])}</button>`).join('')}</div></div>`).join('')}</div>`;
    foot.innerHTML = `<button class="btn btn-c" id="chkb" disabled>${UI.check}</button>`;
    B.querySelectorAll('.item').forEach(it => it.querySelectorAll('.t').forEach(t => t.onclick = () => { it.querySelectorAll('.t').forEach(x => x.classList.remove('sel')); t.classList.add('sel'); SFX.click(); sel[it.dataset.i] = +t.dataset.t; $('#chkb', host).disabled = Object.keys(sel).length < items.length; }));
    $('#chkb', host).onclick = () => {
      let ok = 0;
      B.querySelectorAll('.item').forEach(it => { const i = +it.dataset.i, r = q.answer[i]; if (sel[i] === r) { ok++; it.classList.add('ok'); } else { it.classList.add('no'); it.insertAdjacentHTML('beforeend', `<div class="fix">${UI.rightAnswer} ${esc(targets[r])}</div>`); } it.querySelectorAll('.t').forEach(t => t.disabled = true); });
      fin(ok / items.length, ok === items.length ? '' : UI.someRight(num(ok), num(items.length)));
    };
  } else if (q.type === 'seq') {
    const pool = shuffle(q.items.map((_, i) => i)); if (pool.every((v, k) => v === q.answer[k])) pool.reverse(); const placed = [];
    const draw = () => {
      B.innerHTML = `<p class="qtext">${txt(q.text)}</p><div class="seq"><div><h4>${UI.shuffled}</h4>${pool.filter(i => !placed.includes(i)).map(i => `<button class="card-p" data-i="${i}">${esc(q.items[i])}</button>`).join('') || `<p class="muted" style="font-size:14px">${UI.allPlaced}</p>`}</div>
      <div><h4>${UI.rightOrder}</h4>${q.items.map((_, k) => `<button class="slot ${placed[k] != null ? 'full' : ''}" data-k="${k}"><span class="n">${num(k + 1)}</span><span>${placed[k] != null ? esc(q.items[placed[k]]) : ''}</span></button>`).join('')}</div></div>`;
      B.querySelectorAll('.card-p').forEach(b => b.onclick = () => { placed.push(+b.dataset.i); SFX.click(); draw(); });
      B.querySelectorAll('.slot').forEach(s => s.onclick = () => { const k = +s.dataset.k; if (placed[k] == null) return; placed.splice(k, 1); draw(); });
      foot.innerHTML = `<button class="btn btn-c" id="chkb" ${placed.length < q.items.length ? 'disabled' : ''}>${UI.check}</button>`;
      $('#chkb', host).onclick = () => {
        let ok = 0; B.querySelectorAll('.slot').forEach((s, k) => { s.onclick = null; if (placed[k] === q.answer[k]) { ok++; s.classList.add('ok'); } else s.classList.add('no'); });
        B.querySelectorAll('.card-p').forEach(b => b.onclick = null);
        fin(ok / q.items.length, ok === q.items.length ? '' : UI.rightOrder + ': ' + q.answer.map((i, k) => `<br><b>${num(k + 1)}.</b> ${esc(q.items[i])}`).join(''));
      };
    };
    draw();
  } else if (q.type === 'open') {
    const prev = S.j[q.id] || '';
    B.innerHTML = `<p class="qtext">${esc(q.text)}</p><textarea id="ota" placeholder="${UI.openPh}">${esc(prev)}</textarea><p class="note">${UI.openNote}</p>`;
    foot.innerHTML = `<button class="btn btn-c" id="osv" ${prev.trim().length >= 15 ? '' : 'disabled'}>${UI.submit}</button>`;
    const ta = $('#ota', host); ta.oninput = () => { $('#osv', host).disabled = ta.value.trim().length < 15; };
    $('#osv', host).onclick = () => {
      S.j[q.id] = ta.value.trim(); save(); ta.readOnly = true; SFX.ok();
      F.innerHTML = `<div class="model" style="margin-top:14px"><h4>${UI.openModel}</h4><ul class="ticks">${q.model.map(x => `<li>${esc(x)}</li>`).join('')}</ul><p class="note">${UI.openCompare}</p></div>`;
      foot.innerHTML = ''; done(null);
    };
  }
}

/* ---------- quiz ---------- */
const pick = a => a[Math.random() * a.length | 0];
function vQuiz({id}) {
  const c = COURSE[id - 1], qs = c.quiz, scored = qs.filter(q => q.type !== 'open').length; setC(c.color);
  const Q = {i: 0, pts: 0}; let lastLvl = -1;
  const frame = () => {
    const q = qs[Q.i], lv = LEVELS[q.lvl] || LEVELS[0];
    app.innerHTML = lhead(c, 0, 1, true) + `<div class="qtop"><span class="level-badge ${lv.cls}">${lv.tag}: ${lv.name}</span><div class="energy"><div class="lbl"><span>${UI.radar}</span><span>${UI.questionOf(num(Q.i + 1), num(qs.length))}</span></div><div class="meter"><i id="en" style="width:${Q.pts / scored * 100}%"></i></div></div></div>
      <div class="qgrid"><div class="guide">${AV.megla}<div class="say" id="say">${q.type === 'open' ? UI.sayOpen : q.style === 'scenario' ? UI.sayScenario : UI.sayDefault}</div></div><div class="qcard" id="qc"></div></div>`;
    renderQuestion($('#qc'), q, score => {
      if (score != null) { Q.pts += score; $('#en').style.width = (Q.pts / scored * 100) + '%'; $('#say').textContent = score >= .999 ? pick(PRAISE) : pick(OOPS); }
      else $('#say').textContent = UI.saySaved;
      $('#qf').innerHTML = `<button class="btn btn-c" id="nq">${Q.i + 1 < qs.length ? UI.nextQ : UI.seeResult}</button>`;
      $('#nq').onclick = next; $('#nq').focus({preventScroll: true}); $('#fb').scrollIntoView({block: 'nearest', behavior: 'smooth'});
    });
  };
  const next = () => { Q.i++; if (Q.i >= qs.length) return finish(); if (qs[Q.i].lvl !== lastLvl) return splash(qs[Q.i].lvl); frame(); };
  const splash = lvl => {
    lastLvl = lvl; const lv = LEVELS[lvl], cnt = qs.filter(q => q.lvl === lvl).length;
    app.innerHTML = lhead(c, 0, 1, true) + `<div class="card splash"><span class="lvbig ${lv.cls}">${lv.tag}</span><h2>${lv.name}</h2><p class="muted" style="margin:8px 0 18px">${UI.nQuestions(num(cnt))} · ${UI.levelIntro[lvl]}</p><div style="width:110px;margin:0 auto 16px">${AV.megla}</div><button class="btn btn-c" id="lvgo">${UI.letsPlay}</button></div>`;
    if (lvl > 0) SFX.fan(); $('#lvgo').onclick = frame; $('#lvgo').focus();
  };
  const finish = () => {
    const pct = Math.round(Q.pts / scored * 1000) / 10, cs = chS(id), prev = cs.best;
    cs.last = pct; cs.tries = (cs.tries || 0) + 1; cs.lessonDone = 1;
    if (prev == null || pct > prev) { cs.best = pct; cs.pts = Q.pts; }
    save();
    const stn = stars(pct), st = stats(), circ = 2 * Math.PI * 70, N = COURSE.length;
    SFX.fan(); if (pct >= CONFIG.passMark) confetti(140);
    const nextC = id < N && unlocked(id + 1) ? id + 1 : null;
    app.innerHTML = lhead(c, 0, 1, true) + `<section class="card result"><div class="eyebrow">${UI.completed(id === N ? UI.finalMission : UI.chapter(num(id)))}</div>
      <svg class="ring-score" viewBox="0 0 170 170"><circle cx="85" cy="85" r="70" fill="none" stroke="var(--line)" stroke-width="14"/><circle cx="85" cy="85" r="70" fill="none" stroke="${pct >= CONFIG.passMark ? 'var(--good)' : 'var(--sun)'}" stroke-width="14" stroke-linecap="round" stroke-dasharray="${circ * pct / 100} ${circ}" transform="rotate(-90 85 85)"/><text x="85" y="95" text-anchor="middle" font-family="Baloo Da 2, sans-serif" font-weight="800" font-size="36" fill="var(--ink)">${num(Math.round(pct))}%</text></svg>
      <div class="bigstars">${'★'.repeat(stn)}<span class="off">${'★'.repeat(3 - stn)}</span></div>
      <h2 style="font-size:26px">${pct >= 90 ? UI.result[0] : pct >= CONFIG.passMark ? UI.result[1] : pct >= 60 ? UI.result[2] : UI.result[3]}</h2>
      <div class="statrow"><span class="chip">${UI.points} ${num(Math.round(Q.pts * 10) / 10)} / ${num(scored)}</span><span class="chip">${UI.best} ${num(Math.round(cs.best))}%</span><span class="chip">${UI.overallAvg} ${num(Math.round(st.avg))}%</span></div>
      ${pct < CONFIG.passMark ? `<p class="note" style="max-width:52ch">${UI.passNote(num(CONFIG.passMark))}</p>` : ''}
      <div class="row" style="justify-content:center">${st.eligible ? `<button class="btn btn-sun" id="toCert">🎓 ${UI.getCert}</button>` : nextC ? `<button class="btn btn-c" id="nextM">${UI.nextChapter}</button>` : ''}<button class="btn btn-ghost" id="retry">${UI.retry}</button><button class="btn btn-ghost" id="toMap">${UI.backToMap}</button></div></section>`;
    const nm = $('#nextM'); if (nm) nm.onclick = () => go('lesson', {id: nextC, i: 0});
    const tc = $('#toCert'); if (tc) tc.onclick = () => go('cert');
    $('#retry').onclick = () => go('quiz', {id}); $('#toMap').onclick = () => go('map');
  };
  splash(qs[0].lvl);
}

/* ---------- journal ---------- */
function journalItems() {
  const out = [];
  COURSE.forEach(c => { c.cards.filter(k => k.t === 'think').forEach(k => out.push([c, k.prompt, S.j[k.id]])); c.quiz.filter(q => q.type === 'open').forEach(q => out.push([c, q.text, S.j[q.id]])); });
  return out;
}
function vJournal() {
  setC('red');
  const items = journalItems();
  app.innerHTML = `<section class="stack"><div><div class="eyebrow">${UI.journal}</div><h1 style="font-size:clamp(24px,4.5vw,32px)">${UI.journalTitle}</h1><p class="muted">${UI.journalIntro}</p></div>
    <div class="journal">${items.map(([c, p, a]) => `<div class="je" style="--c:${CHC[c.color]}"><b>${c.id === COURSE.length ? UI.finalMission : UI.chapter(num(c.id))} · ${esc(p)}</b><p>${a ? esc(a) : `<span class="muted">${UI.notWritten}</span>`}</p></div>`).join('')}</div>
    <div class="row"><button class="btn btn-red" id="dlj">${UI.downloadJournal}</button><button class="btn btn-ghost" id="bk">${UI.backToMap}</button></div></section>`;
  $('#bk').onclick = () => go('map');
  $('#dlj').onclick = () => {
    const t = `${CONFIG.courseName} — ${UI.journal}\n${S.p.name}${S.p.school ? ', ' + S.p.school : ''}\n\n` + items.map(([c, p, a], n) => `${n + 1}. ${p}\n${a || UI.notWrittenTxt}\n`).join('\n');
    saveFile(new Blob([t], {type: 'text/plain'}), 'MET-Club-journal', 'txt');
  };
}
async function saveFile(blob, base, ext) {
  const fname = base + '-' + (S.p?.name || 'student').replace(/[\\/:*?"<>|]+/g, '').trim().replace(/\s+/g, '-') + '.' + ext;
  try { const dl = window.claude?.use ? await window.claude.use('downloads') : null; if (dl) { await dl.save({filename: fname, data: blob}); return; } } catch (e) { if (e && e.code === 'declined') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fname; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}

/* ---------- certificate ---------- */
function certId() {
  if (S.cert && S.cert.id) return S.cert.id;
  let h = 2166136261; for (const ch of S.p.name + '|' + S.p.school + '|' + Date.now()) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  S.cert = {id: `${CONFIG.certPrefix}-${new Date().getFullYear()}-${h.toString(36).toUpperCase().slice(0, 6).padStart(6, '0')}`, date: Date.now()}; save(); return S.cert.id;
}
const fmtDate = t => { const d = new Date(t); return UI.date(num(d.getDate()), MONTHS[d.getMonth()], num(d.getFullYear())); };
function loadImg(src) { return new Promise(r => { if (!src) return r(null); const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; }); }
async function drawCert(demo) {
  const W = 2000, H = 1414, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d');
  try { await Promise.all(['800 90px "Baloo Da 2"', '700 40px "Baloo Da 2"', '500 36px "Hind Siliguri"', '600 36px "Hind Siliguri"', '700 40px "Cabin"'].map(f => document.fonts.load(f, 'অআ Save'))); } catch (e) {}
  const logo = await loadImg(CONFIG.logoSrc);
  const st = stats(), name = demo ? (S.p?.name || UI.studentName) : S.p.name, id = demo ? `${CONFIG.certPrefix}-${UI.sample}` : certId(), date = demo ? Date.now() : S.cert.date, avg = demo ? 92 : Math.round(st.avg);
  x.fillStyle = '#fffaf3'; x.fillRect(0, 0, W, H); x.save(); x.beginPath(); x.rect(40, 40, W - 80, H - 80); x.clip();
  // red brand band with sun, clouds and hills (echoes the print module cover)
  x.fillStyle = '#da291c'; x.fillRect(0, 0, W, 300);
  x.fillStyle = 'rgba(255,255,255,.14)'; [[260, 150, 1], [1460, 120, 1.1]].forEach(([cx, cy, k]) => { x.beginPath(); x.ellipse(cx, cy, 120 * k, 50 * k, 0, 0, 7); x.ellipse(cx + 110 * k, cy + 12, 110 * k, 44 * k, 0, 0, 7); x.fill(); });
  x.fillStyle = '#ffc72c'; x.beginPath(); x.arc(1800, 120, 70, 0, 7); x.fill();
  x.strokeStyle = '#ffc72c'; x.lineWidth = 12; x.lineCap = 'round'; [[1800, 20, 1800, 40], [1690, 60, 1705, 75], [1910, 60, 1895, 75], [1940, 140, 1915, 140]].forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); });
  x.fillStyle = '#2f9a52'; x.beginPath(); x.moveTo(0, 300); x.quadraticCurveTo(500, 220, 1000, 290); x.quadraticCurveTo(1500, 350, 2000, 270); x.lineTo(2000, 330); x.lineTo(0, 330); x.fill();
  x.fillStyle = '#fffaf3'; x.beginPath(); x.moveTo(0, 330); x.quadraticCurveTo(1000, 290, 2000, 330); x.lineTo(2000, 360); x.lineTo(0, 360); x.fill();
  x.restore(); x.textAlign = 'left'; x.fillStyle = '#fff';
  if (logo) { const lh = 90, lw = logo.width * lh / logo.height; x.drawImage(logo, 90, 70, lw, lh); }
  else { x.font = '700 64px "Cabin", "Gill Sans", sans-serif'; x.fillText(CONFIG.orgNameEn, 90, 135); }
  x.font = '700 40px "Baloo Da 2", sans-serif'; x.fillText(CONFIG.programName + ' · ' + UI.eLearning, 92, 200);
  // frame
  x.strokeStyle = '#f4a020'; x.lineWidth = 12; x.strokeRect(40, 40, W - 80, H - 80);
  x.strokeStyle = '#1c8fd6'; x.lineWidth = 4; x.strokeRect(80, 380, W - 160, H - 440);
  x.textAlign = 'center';
  x.fillStyle = '#da291c'; x.font = '800 110px "Baloo Da 2", sans-serif'; x.fillText(UI.congrats, W / 2, 500);
  x.fillStyle = '#1f1d1c'; x.font = '700 54px "Baloo Da 2", sans-serif'; x.fillText(`${UI.certificate} · ${CONFIG.certTitle}`, W / 2, 580);
  x.fillStyle = '#5b5550'; x.font = '500 36px "Hind Siliguri", sans-serif'; x.fillText(UI.certifies, W / 2, 650);
  let fs = 96; x.font = `800 ${fs}px "Baloo Da 2", sans-serif`; while (x.measureText(name).width > 1500 && fs > 50) { fs -= 4; x.font = `800 ${fs}px "Baloo Da 2", sans-serif`; }
  x.fillStyle = '#1f1d1c'; x.fillText(name, W / 2, 765);
  x.strokeStyle = '#f4a020'; x.lineWidth = 4; x.setLineDash([16, 10]); x.beginPath(); x.moveTo(W / 2 - 520, 795); x.lineTo(W / 2 + 520, 795); x.stroke(); x.setLineDash([]);
  const p = S.p || {}, sub = [p.cls, p.school, p.dist ? UI.district(p.dist) : ''].filter(Boolean).join(', ');
  x.fillStyle = '#5b5550'; x.font = '500 34px "Hind Siliguri", sans-serif'; if (sub) x.fillText(sub, W / 2, 850);
  x.fillStyle = '#1f1d1c'; x.font = '500 38px "Hind Siliguri", sans-serif';
  { let f2 = 38; x.font = `500 ${f2}px "Hind Siliguri", sans-serif`; const l1 = UI.certLine1(CONFIG.courseName); while (x.measureText(l1).width > 1700 && f2 > 26) { f2 -= 2; x.font = `500 ${f2}px "Hind Siliguri", sans-serif`; } x.fillText(l1, W / 2, 930); }
  x.font = '500 38px "Hind Siliguri", sans-serif'; x.fillText(UI.certLine2(num(avg)), W / 2, 985);
  x.fillStyle = '#138a6b'; x.font = '700 46px "Baloo Da 2", sans-serif'; x.fillText(CONFIG.certSub + UI.fullStop, W / 2, 1048);
  // seal
  const bx = W / 2, by = 1170; x.fillStyle = '#ffc72c'; x.beginPath(); for (let i = 0; i < 28; i++) { const a = i * Math.PI / 14, r = i % 2 ? 84 : 98; x.lineTo(bx + r * Math.cos(a), by + r * Math.sin(a)); } x.closePath(); x.fill();
  x.fillStyle = '#da291c'; x.beginPath(); x.arc(bx, by, 72, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 4; x.beginPath(); x.arc(bx, by, 60, 0, 7); x.stroke();
  x.fillStyle = '#fff'; x.font = '800 40px "Baloo Da 2", sans-serif'; x.fillText(num(avg) + '%', bx, by + 4); x.font = '600 22px "Baloo Da 2", sans-serif'; x.fillText(CONFIG.programName, bx, by + 36);
  x.fillStyle = '#1f1d1c'; x.strokeStyle = '#1f1d1c'; x.lineWidth = 2;
  x.textAlign = 'center'; x.font = '500 28px "Hind Siliguri", sans-serif'; x.fillStyle = '#5b5550';
  x.fillText(`${UI.dateLabel} ${fmtDate(date)}`, 460, 1160); x.fillText(`${UI.certNo} ${id}`, 460, 1205);
  { const sx = W - 460, sig = await loadImg(CONFIG.signatureSrc);
    if (sig) { const sh = 90, sw = Math.min(380, sig.width * sh / sig.height); x.drawImage(sig, sx - sw / 2, 1180 - sh, sw, sh); }
    x.strokeStyle = '#1f1d1c'; x.lineWidth = 2; x.beginPath(); x.moveTo(sx - 220, 1190); x.lineTo(sx + 220, 1190); x.stroke();
    const parts = String(CONFIG.signatures[0] || '').split(/,\s*/); x.fillStyle = '#1f1d1c'; x.font = '600 32px "Hind Siliguri", sans-serif';
    parts.forEach((t, n) => { x.font = n === 0 ? '700 32px "Hind Siliguri", sans-serif' : '500 28px "Hind Siliguri", sans-serif'; x.fillText(t, sx, 1232 + n * 36); }); }
  x.fillStyle = '#1c6fd6'; x.font = '700 34px "Baloo Da 2", sans-serif'; x.fillText(UI.mantraQuote, W / 2, 1300);
  x.fillStyle = '#5b5550'; x.font = '500 24px "Hind Siliguri", sans-serif'; x.fillText(`${CONFIG.orgName} · ${UI.platform(CONFIG.programName)}`, W / 2, 1336);
  if (demo) { x.save(); x.translate(W / 2, H / 2 + 80); x.rotate(-.35); x.globalAlpha = .1; x.fillStyle = '#da291c'; x.font = '800 300px "Baloo Da 2", sans-serif'; x.fillText(UI.sample, 0, 80); x.restore(); }
  return cv;
}
function vCert(arg) {
  setC('red');
  const demo = !!(arg && arg.demo), st = stats();
  if (!demo && !st.eligible) { go('map'); return; }
  app.innerHTML = `<section class="stack"><div><div class="eyebrow">${demo ? UI.preview : UI.congrats}</div><h1 style="font-size:clamp(26px,5vw,38px)">${demo ? UI.sampleCert : UI.youAreNow(esc(CONFIG.certTitle))}</h1>
    <p class="muted">${demo ? UI.sampleCertNote : UI.certDoneNote(num(Math.round(st.avg)))}</p></div>
    <div class="certbox"><p class="muted" style="padding:40px;text-align:center">${UI.certMaking}</p></div>
    <div class="row"><button class="btn btn-red" id="dlPng" disabled>${UI.dlPng}</button><button class="btn btn-sun" id="dlPdf" disabled>${UI.dlPdf}</button><button class="btn btn-ghost" id="bk">${UI.backToMap}</button></div>
    <p class="note">${UI.certHelp}</p></section>`;
  $('#bk').onclick = () => go('map');
  if (!demo) { SFX.fan(); confetti(160); }
  drawCert(demo).then(cv => {
    $('.certbox').innerHTML = `<img src="${cv.toDataURL('image/png')}" alt="${esc(UI.certAlt(CONFIG.certTitle))}">`;
    $('#dlPng').disabled = false; $('#dlPdf').disabled = !window.jspdf;
    $('#dlPng').onclick = () => cv.toBlob(b => saveFile(b, 'Junior-Meteorologist', 'png'), 'image/png');
    $('#dlPdf').onclick = () => { const {jsPDF} = window.jspdf, pdf = new jsPDF({orientation: 'landscape', unit: 'mm', format: 'a4'}); pdf.addImage(cv.toDataURL('image/jpeg', .92), 'JPEG', 0, 0, 297, 210); saveFile(pdf.output('blob'), 'Junior-Meteorologist', 'pdf'); };
  });
}

app.innerHTML = `<div class="course-wait" role="status">${UI.loading}</div>`;
window.addEventListener('message', event => {
  if (event.source !== window.parent || event.origin !== window.location.origin) return;
  const message = event.data;
  if (!message) return;
  if (message.type === 'met-club-course-toggle-sound') {
    S.snd = !S.snd;
    save();
    renderSound();
    SFX.click();
    return;
  }
  if (message.type !== 'met-club-course-auth' || !message.user) return;
  const user = message.user;
  if (typeof user.id !== 'string' || typeof user.fullName !== 'string' || !user.fullName.trim()) return;
  CONFIG.storageKey = `${CONFIG.storageKey}_${user.id.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
  S = loadState();
  S.p = {
    ...(S.p || {}),
    name: user.fullName.trim(),
    school: user.institution || S.p?.school || '',
    cls: S.p?.cls || (user.class ? String(user.class) : ''),
    dist: user.district || S.p?.dist || ''
  };
  save();
  renderSound();
  go('map');
  // tell the host page the course is on screen so it can drop its skeleton
  if (window.parent !== window) window.parent.postMessage({ type: 'met-club-course-ready' }, location.origin);
});
