// Drehbares 3D-Modell der beiden Varianten (Maße in Metern, wie im Konzept).
// A: feste Kiste (Fünfeck), Deckel in zwei Hälften, Stirnklappe am Kopfende
// B: Auszug, Kopfteil 1,25 m, Fußteil mit eigenem Satteldach schiebt hinein;
//    gedichtet axial in den Endlagen (innen Kniehebel, außen Sicherungsschrauben)
// Solarmodule liegen auf beiden Dachseiten (Entscheidung Frage 27).
import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';

const B = 0.78, TR = 0.46, FI = 0.68, T = 0.045;   // Traufe und First über Unterkante Box
const BODEN = 0.40;            // Unterkante Schlafbox über Grund
// Fußteil-Querschnitt (Fünfeck, y über Unterkante Box): halbe Breite, Traufe, First.
// So bleibt am Ring ringsum ca. 4 cm Dichtfläche für den Innenflansch.
const FUSS = { hb: 0.285, unten: T + 0.04, traufe: 0.43, first: 0.55 };   // 4 cm über dem Boden: Dichtfläche auch unten
const LOCH = { hb: FUSS.hb + 0.01, unten: T + 0.03, traufe: FUSS.traufe + 0.01, first: FUSS.first + 0.01 };
const STIRN = { hb: FUSS.hb + 0.06, unten: 0.005, traufe: FUSS.traufe + 0.05, first: FUSS.first + 0.065 };
const FUSS_INNEN = { hb: FUSS.hb - T, unten: FUSS.unten + T, traufe: FUSS.traufe - T, first: FUSS.first - 0.05 };
const FLANSCH = 0.02;
// Länge so, dass ausgezogen (Innenflansch am Ring) genau 2,09 m herauskommen.
const L_KOPF = 1.25, L_A = 2.09, L_FUSS = L_A - L_KOPF + 0.045 + FLANSCH;
const KLAPPE_B = 0.45, KLAPPE_H = 0.48;

const flaeche = document.getElementById('d3-flaeche');
const status = document.getElementById('d3-status');

const dunkelSystem = matchMedia('(prefers-color-scheme: dark)');
function farben() {
  const t = document.documentElement.dataset.theme;
  const dunkel = t ? t === 'dark' : dunkelSystem.matches;
  return {
    hg: dunkel ? 0x1f2226 : 0xffffff,
    huelle: 0xd9cbb8, dach: 0x9a3b12, rahmen: 0x4a4f57, rad: 0x222222,
    klappe: 0xc8783f, fuss: 0xbfae98, dichtung: 0x2f6f8f, griff: 0xe0b020,
    modul: 0x1b2a4a, knie: 0xc0392b, mensch: 0x3d7a5a, boden: dunkel ? 0x2a2e33 : 0xeeeae2,
  };
}

let F = farben();
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true });
} catch (e) {
  document.getElementById('d3-hinweis').textContent =
    'Dein Browser kann kein WebGL darstellen. Die Schnittmuster unten gehen trotzdem.';
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
flaeche.appendChild(renderer.domElement);
renderer.domElement.setAttribute('role', 'img');
renderer.domElement.setAttribute('aria-label',
  'Drehbares 3D-Modell des Schlafanhängers. Drehen mit Maus, Finger oder Pfeiltasten, wenn ausgewählt.');
renderer.domElement.tabIndex = 0;

const szene = new THREE.Scene();
szene.background = new THREE.Color(F.hg);
const kamera = new THREE.PerspectiveCamera(35, 1, 0.05, 50);
kamera.position.set(3.2, 2.0, 2.6);
const steuerung = new OrbitControls(kamera, renderer.domElement);
steuerung.target.set(0, 0.55, 0);
steuerung.enableDamping = true;
steuerung.minDistance = 1.5;
steuerung.maxDistance = 8;
steuerung.maxPolarAngle = Math.PI * 0.49;
steuerung.listenToKeyEvents(renderer.domElement);   // Pfeiltasten verschieben die Ansicht

szene.add(new THREE.HemisphereLight(0xffffff, 0x777766, 1.6));
const sonne = new THREE.DirectionalLight(0xffffff, 1.6);
sonne.position.set(3, 5, 2);
szene.add(sonne);
const grund = new THREE.Mesh(new THREE.CircleGeometry(4, 48),
  new THREE.MeshStandardMaterial({ color: F.boden }));
grund.rotation.x = -Math.PI / 2;
szene.add(grund);

const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, ...o });

// Fünfeck als Umriss (Shape) oder Loch (Path), Maße wie FUSS/LOCH/STIRN
function fuenfeck(f, alsLoch = false) {
  const p = alsLoch ? new THREE.Path() : new THREE.Shape();
  p.moveTo(-f.hb, f.unten); p.lineTo(f.hb, f.unten); p.lineTo(f.hb, f.traufe);
  p.lineTo(0, f.first); p.lineTo(-f.hb, f.traufe); p.closePath();
  return p;
}

// Zwei Solarmodule auf den Dachflächen von (±hb, traufe) zum First (0, first);
// Koordinaten wie die Dachfläche, auf der sie liegen
function module(hb, traufe, first, laenge, xVersatz = 0) {
  const g = new THREE.Group();
  const breite = Math.hypot(hb, first - traufe), winkel = Math.atan2(first - traufe, hb);
  const geo = new THREE.BoxGeometry(breite * 0.82, 0.008, laenge * 0.88);
  for (const seite of [-1, 1]) {
    const m = new THREE.Mesh(geo, mat(F.modul, { roughness: 0.35, metalness: 0.3 }));
    m.position.set(xVersatz + seite * hb / 2, (traufe + first) / 2 + 0.006, 0);
    m.rotation.z = -seite * winkel;
    g.add(m);
  }
  return g;
}

// Unterteil der Schlafbox (Wanne bis zur Traufe) und Deckel getrennt
function wanne(laenge) {
  const g = new THREE.Group();
  const s = new THREE.Shape();
  s.moveTo(-B / 2, 0); s.lineTo(B / 2, 0); s.lineTo(B / 2, TR);
  s.lineTo(B / 2 - T, TR); s.lineTo(B / 2 - T, T); s.lineTo(-B / 2 + T, T);
  s.lineTo(-B / 2 + T, TR); s.lineTo(-B / 2, TR); s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: laenge, bevelEnabled: false });
  geo.translate(0, BODEN, -laenge / 2);
  g.add(new THREE.Mesh(geo, mat(F.huelle)));
  return g;
}

// Giebel, optional mit Öffnung: [Breite, Höhe] (Rechteck unten mittig) oder Fünfeck-Maße
function giebel(z, loch) {
  const s = new THREE.Shape();
  s.moveTo(-B / 2, 0); s.lineTo(B / 2, 0); s.lineTo(B / 2, TR);
  s.lineTo(0, FI); s.lineTo(-B / 2, TR); s.closePath();
  if (Array.isArray(loch)) {
    const [lb, lh] = loch;
    const h = new THREE.Path();
    h.moveTo(-lb / 2, T); h.lineTo(lb / 2, T); h.lineTo(lb / 2, T + lh); h.lineTo(-lb / 2, T + lh);
    h.closePath();
    s.holes.push(h);
  } else if (loch) {
    s.holes.push(fuenfeck(loch, true));
  }
  const geo = new THREE.ExtrudeGeometry(s, { depth: T, bevelEnabled: false });
  geo.translate(0, BODEN, z - T / 2);
  return new THREE.Mesh(geo, mat(F.huelle));
}

// Deckelhälfte: Satteldach von Traufe zu Traufe, Gelenk an der rechten Traufe
function deckel(laenge, zMitte) {
  const s = new THREE.Shape();
  s.moveTo(-B / 2, 0); s.lineTo(0, FI - TR); s.lineTo(B / 2, 0);
  s.lineTo(B / 2 - T, 0); s.lineTo(0, FI - TR - T); s.lineTo(-B / 2 + T, 0); s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: laenge - 0.01, bevelEnabled: false });
  geo.translate(-B / 2, 0, -(laenge - 0.01) / 2);     // Gelenk im Ursprung
  const m = new THREE.Mesh(geo, mat(F.dach));
  const gelenk = new THREE.Group();
  gelenk.position.set(B / 2, BODEN + TR, zMitte);
  gelenk.add(m, module(B / 2, 0, FI - TR, laenge, -B / 2));   // Module klappen mit
  return gelenk;
}

// Stirnklappe (untere Hälfte des Lochs, Gelenk unten, klappt nach außen)
function klappe(z, richtung) {
  const geo = new THREE.BoxGeometry(KLAPPE_B - 0.01, KLAPPE_H - 0.01, T);
  geo.translate(0, KLAPPE_H / 2, 0);
  const g = new THREE.Group();
  g.position.set(0, BODEN + T, z);
  g.add(new THREE.Mesh(geo, mat(F.klappe)));
  g.userData.richtung = richtung;
  return g;
}

// Rahmen, Räder, Fach, Stützfüße und Deichsel; mittig um z = 0 der Gruppe
function fahrwerk(laenge, zDeichsel) {
  const g = new THREE.Group();
  const rad = new THREE.CylinderGeometry(0.203, 0.203, 0.05, 32);
  rad.rotateZ(Math.PI / 2);
  for (const x of [-0.30, 0.30]) {
    const r = new THREE.Mesh(rad, mat(F.rad));
    r.position.set(x, 0.203, 0.05);
    g.add(r);
  }
  const fach = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.28, Math.min(1.6, laenge - 0.2)), mat(F.rahmen));
  fach.position.set(0, 0.25, 0.0);
  g.add(fach);
  const rahmen = new THREE.Mesh(new THREE.BoxGeometry(B - 0.02, 0.04, laenge - 0.1), mat(F.rahmen));
  rahmen.position.set(0, BODEN - 0.02, 0);
  g.add(rahmen);
  for (const x of [-B / 2 + 0.04, B / 2 - 0.04]) for (const z of [-laenge / 2 + 0.1, laenge / 2 - 0.1]) {
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, BODEN - 0.04, 12), mat(F.rahmen));
    f.position.set(x, (BODEN - 0.04) / 2, z);
    g.add(f);
  }
  const deichsel = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 1.0), mat(F.rahmen));
  deichsel.position.set(0, BODEN - 0.05, zDeichsel);
  g.add(deichsel);
  g.userData.deichsel = deichsel;
  return g;
}

function mensch(zKopf, richtung) {
  const g = new THREE.Group();
  const m = mat(F.mensch);
  const koerper = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 1.2, 6, 16), m);
  koerper.rotation.x = Math.PI / 2;
  koerper.scale.set(1, 1, 0.6);
  koerper.position.set(0, 0, richtung * 0.9);
  const kopf = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 16), m);
  kopf.position.set(0, 0.02, 0);
  menschen.push(g);
  g.add(koerper, kopf);
  g.position.set(0, BODEN + T + 0.14, zKopf);
  return g;
}

// --- Varianten ---------------------------------------------------------------
const varianten = {};
const menschen = [];

(function variante_a() {
  const g = new THREE.Group();
  const zKopf = -L_A / 2, zFuss = L_A / 2;
  g.add(wanne(L_A - 2 * T));
  g.add(giebel(zKopf + T / 2, [KLAPPE_B, KLAPPE_H]), giebel(zFuss - T / 2));
  const dk = deckel(L_A / 2, -L_A / 4), df = deckel(L_A / 2, L_A / 4);
  const kl = klappe(zKopf - 0.001, -1);
  g.add(dk, df, kl, fahrwerk(L_A, zFuss + 0.5), mensch(zKopf + 0.2, 1));
  varianten.A = { gruppe: g, deckel: [dk, df], klappen: [kl], text: 'Variante A: feste Kiste, 2,09 m lang' };
})();

(function variante_b() {
  const g = new THREE.Group();
  const zKopf = -L_A / 2, zEndeKopf = zKopf + L_KOPF;
  const kopfMitte = zKopf + L_KOPF / 2;
  const w = wanne(L_KOPF - 2 * T); w.position.z = kopfMitte;
  g.add(w, giebel(zKopf + T / 2, [KLAPPE_B, KLAPPE_H]));
  const ring = giebel(zEndeKopf - T / 2, LOCH); g.add(ring);
  const d1 = deckel(L_KOPF / 2, zKopf + L_KOPF / 4), d2 = deckel(L_KOPF / 2, zKopf + 3 * L_KOPF / 4);
  const kl = klappe(zKopf - 0.001, -1);

  // Fußteil: Fünfeck-Röhre mit eigenem Satteldach, Ursprung in der Längsmitte, y absolut
  const fussGruppe = new THREE.Group();
  const roehre = fuenfeck(FUSS);
  roehre.holes.push(fuenfeck(FUSS_INNEN, true));
  const roehreGeo = new THREE.ExtrudeGeometry(roehre, { depth: L_FUSS - 2 * FLANSCH, bevelEnabled: false });
  roehreGeo.translate(0, BODEN, -(L_FUSS - 2 * FLANSCH) / 2);
  fussGruppe.add(new THREE.Mesh(roehreGeo, mat(F.fuss)));
  const fussModule = module(FUSS.hb, FUSS.traufe, FUSS.first, L_FUSS - 0.1);
  fussModule.position.y = BODEN;
  fussGruppe.add(fussModule);
  // Stützfüße mit Kurbel am Fußende, eingeschoben hochgekurbelt (ausgeblendet)
  const stuetzen = new THREE.Group();
  for (const x of [-FUSS.hb + 0.04, FUSS.hb - 0.04]) {
    const h = BODEN + FUSS.unten;
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, h, 12), mat(F.rahmen));
    f.position.set(x, h / 2, L_FUSS / 2 - 0.08);
    stuetzen.add(f);
  }
  fussGruppe.add(stuetzen);
  // Axiale Dichtflansche: Innenflansch (folgt dem Innenquerschnitt des Kopfteils,
  // Fenster für die Beine) dichtet ausgezogen innen am Ring; Stirnplatte dichtet
  // eingeschoben außen am Ring
  const sp = 0.012, wf = B / 2 - T - sp;
  const innen = fuenfeck({ hb: wf, unten: T, traufe: TR, first: FI - T - sp - 0.02 });
  innen.holes.push(fuenfeck(FUSS_INNEN, true));
  const innenGeo = new THREE.ExtrudeGeometry(innen, { depth: FLANSCH, bevelEnabled: false });
  innenGeo.translate(0, BODEN, -L_FUSS / 2);
  const stirnGeo = new THREE.ExtrudeGeometry(fuenfeck(STIRN), { depth: FLANSCH, bevelEnabled: false });
  stirnGeo.translate(0, BODEN, L_FUSS / 2 - FLANSCH);
  fussGruppe.add(new THREE.Mesh(innenGeo, mat(F.dichtung)), new THREE.Mesh(stirnGeo, mat(F.dichtung)));

  // Innen: 10 Kniehebel rund um die Öffnung (spannen nachts den Innenflansch)
  const knie = new THREE.Group();
  const knieGeo = new THREE.BoxGeometry(0.05, 0.03, 0.04);
  const kantenpunkte = (f, abstand) => {
    const p = [[-f.hb, f.unten], [f.hb, f.unten], [f.hb, f.traufe], [0, f.first], [-f.hb, f.traufe]];
    const punkte = [];
    for (let i = 0; i < 5; i++) {
      const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % 5];
      if (i === 0) continue;                       // unten liegt der Boden
      for (const t of i === 3 || i === 2 ? [0.35, 0.75] : [0.1, 0.5, 0.9]) {
        const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
        const nx = (y2 - y1), ny = -(x2 - x1), n = Math.hypot(nx, ny);
        punkte.push([x + nx / n * abstand, y + ny / n * abstand]);
      }
    }
    return punkte;
  };
  for (const [x, y] of kantenpunkte(LOCH, 0.025)) {
    const k = new THREE.Mesh(knieGeo, mat(F.knie));
    k.position.set(x, BODEN + y, zEndeKopf - T - 0.02);
    knie.add(k);
  }
  g.add(knie);
  // Außen: 5 Sicherungsschrauben mit Kappe durch die Stirnplatte (Fahrt, Abwesenheit)
  const griffe = new THREE.Group();
  const griffGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.025, 12);
  griffGeo.rotateX(Math.PI / 2);
  const sx = LOCH.hb + 0.028;          // mittig auf der Überdeckung Stirnplatte–Ring
  for (const [x, y] of [[-sx, 0.08], [sx, 0.08], [-sx, LOCH.traufe - 0.02], [sx, LOCH.traufe - 0.02], [0, LOCH.first + 0.03]]) {
    const s = new THREE.Mesh(griffGeo, mat(F.griff));
    s.position.set(x, BODEN + y, 0);
    griffe.add(s);
  }
  g.add(griffe);
  // Fahrwerk nur unter dem Kopfteil; Deichsel am Fußende, nachts abgenommen
  const fw = fahrwerk(L_KOPF + 0.05, (L_KOPF + 0.05) / 2 + 0.5);
  fw.position.z = kopfMitte;
  g.add(d1, d2, kl, fussGruppe, fw, mensch(zKopf + 0.2, 1));
  varianten.B = {
    gruppe: g, deckel: [d1, d2], klappen: [kl],
    setzeAuszug(anteil) {   // 0 = Tag (eingeschoben), 1 = Nacht (ausgezogen)
      // Tag: Stirnplatte liegt außen am Ring; Nacht: Innenflansch liegt innen am Ring
      const zEin = zEndeKopf + FLANSCH - L_FUSS / 2;
      const zAus = zEndeKopf - T - FLANSCH + L_FUSS / 2;
      fussGruppe.position.z = zEin + (zAus - zEin) * anteil;
      // Sicherungsschrauben nur eingeschoben (Fahrt, Abwesenheit)
      griffe.position.z = zEndeKopf + FLANSCH + 0.012;
      griffe.visible = anteil < 0.02;
      stuetzen.visible = anteil > 0.5;
      fw.userData.deichsel.visible = anteil < 0.1;
    },
    text: 'Variante B: Auszug mit Satteldach und axialer Dichtung (innen Kniehebel, außen Sicherungsschrauben), am Tag 1,25 m, nachts 2,09 m lang',
  };
  varianten.B.setzeAuszug(1);
})();

for (const v of Object.values(varianten)) szene.add(v.gruppe);

// --- Bedienung ---------------------------------------------------------------
const zustand = { variante: 'A', deckelAuf: false, klappeAuf: false, auszug: 1, mensch: true };
const ziel = { deckel: 0, klappe: 0 };

// melden = false: Statuszeile nicht neu setzen (Regler, sonst liest der Screenreader jeden Schritt)
function anzeigen(melden = true) {
  for (const [k, v] of Object.entries(varianten)) v.gruppe.visible = k === zustand.variante;
  document.getElementById('d3-auszug-feld').hidden = zustand.variante !== 'B';
  // Im Auszug liegt nur jemand, wenn das Fußteil ausgezogen ist
  const liegtFrei = zustand.variante !== 'B' || zustand.auszug > 0.95;
  menschen.forEach(m => { m.visible = zustand.mensch && liegtFrei; });
  ziel.deckel = zustand.deckelAuf ? 1 : 0;
  ziel.klappe = zustand.klappeAuf ? 1 : 0;
  if (varianten.B) varianten.B.setzeAuszug(zustand.auszug);
  if (melden) status.textContent = varianten[zustand.variante].text +
    (zustand.deckelAuf ? ', Deckel offen als Vordach' : ', Deckel zu') +
    (zustand.klappeAuf ? ', Stirnklappe offen' : '');
  document.querySelectorAll('[data-variante]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.variante === zustand.variante)));
  document.getElementById('d3-deckel').setAttribute('aria-pressed', String(zustand.deckelAuf));
  document.getElementById('d3-klappe').setAttribute('aria-pressed', String(zustand.klappeAuf));
  document.getElementById('d3-mensch').setAttribute('aria-pressed', String(zustand.mensch));
}

document.querySelectorAll('[data-variante]').forEach(b => b.addEventListener('click', () => {
  zustand.variante = b.dataset.variante; anzeigen();
}));
document.getElementById('d3-deckel').addEventListener('click', () => { zustand.deckelAuf = !zustand.deckelAuf; anzeigen(); });
document.getElementById('d3-klappe').addEventListener('click', () => { zustand.klappeAuf = !zustand.klappeAuf; anzeigen(); });
document.getElementById('d3-mensch').addEventListener('click', () => { zustand.mensch = !zustand.mensch; anzeigen(); });
const regler = document.getElementById('d3-auszug');
regler.addEventListener('input', () => {
  zustand.auszug = Number(regler.value) / 100;
  const laenge = (L_KOPF + (L_A - L_KOPF) * zustand.auszug).toFixed(2).replace('.', ',');
  regler.setAttribute('aria-valuetext', `Länge ${laenge} m`);
  anzeigen(false);
});

let deckelWinkel = 0, klappeWinkel = 0;
function groesse() {
  const w = flaeche.clientWidth, h = flaeche.clientHeight;
  renderer.setSize(w, h, false);
  kamera.aspect = w / h;
  // Hochformat: Blickwinkel weiten, damit der ganze Wagen ins Bild passt
  kamera.fov = kamera.aspect < 1.2 ? Math.min(70, 35 * 1.2 / kamera.aspect * 0.8) : 35;
  kamera.updateProjectionMatrix();
}
new ResizeObserver(groesse).observe(flaeche);

// Gezeichnet wird nur, solange das Modell im Bild ist (spart Akku)
const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
let sichtbar = true, laeuft = false;
function schritt() {
  if (!sichtbar) { laeuft = false; return; }
  const k = ruhig ? 1 : 0.12;
  deckelWinkel += (ziel.deckel - deckelWinkel) * k;
  klappeWinkel += (ziel.klappe - klappeWinkel) * k;
  for (const v of Object.values(varianten)) {
    v.deckel.forEach(d => { d.rotation.z = -deckelWinkel * 1.75; });
    v.klappen.forEach(c => { c.rotation.x = klappeWinkel * 1.5 * c.userData.richtung; });
  }
  steuerung.update();
  renderer.render(szene, kamera);
  requestAnimationFrame(schritt);
}
function starten() { if (!laeuft) { laeuft = true; requestAnimationFrame(schritt); } }
new IntersectionObserver(e => { sichtbar = e[0].isIntersecting; if (sichtbar) starten(); })
  .observe(flaeche);

function themaAnwenden() {
  F = farben();
  szene.background.set(F.hg);
  grund.material.color.set(F.boden);
}
new MutationObserver(themaAnwenden)
  .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
dunkelSystem.addEventListener('change', themaAnwenden);

groesse();
anzeigen();
starten();
document.getElementById('d3-hinweis').hidden = true;
