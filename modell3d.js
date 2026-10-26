// Drehbares 3D-Modell der Varianten (Maße in Metern, wie im Konzept).
// A: feste Kiste (Fünfeck), Deckel in zwei Hälften, Stirnklappe am Kopfende
// B: Auszug, Kopfteil 1,25 m, Fußteil mit eigenem Satteldach schiebt hinein;
//    gedichtet axial in den Endlagen (innen Kniehebel, außen Sicherungsschrauben)
// C: Schirm-Jurte als Wohnraum, darin der Kokon (Haus im Haus); D: Kokon allein;
// E: Kiste mit Eisfischerzelt als Vorraum; F: Kiste mit Origami-Vorraum (Stufe 3)
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

// --- Stufe 3: textile Hüllen (Befund 26.10.) ---------------------------------
const JURTE = { r: 1.40, wand: 1.1, first: 1.9, krone: 0.25 };   // Ø 2,8 m, damit der Anhänger neben dem Mast hineinpasst
const glas = (c, o = 0.35) => mat(c, { transparent: true, opacity: o, side: THREE.DoubleSide, depthWrite: false });

// Stab von a nach b (Zylinder der Höhe 1, wird gestreckt)
function stab(r, farbe) { return new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 8), mat(farbe)); }
const _y = new THREE.Vector3(0, 1, 0);
function setzeStab(m, a, b) {
  const d = new THREE.Vector3().subVectors(b, a);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.scale.set(1, Math.max(d.length(), 0.001), 1);
  m.quaternion.setFromUnitVectors(_y, d.normalize());
}

// Kokon: niedrige Wanne (PIR) mit Faltverdeck (Balg) aus Bügeln, die sich zum
// Kopfende zusammenschieben wie eine Schiebeplane; offen = 1 heißt zurückgeschoben.
// Der Balg ist unsymmetrisch (Simon 26.10.): links sitzt er auf der festen Wand,
// rechts (Wohnseite) reicht er bis zur Bettkante hinunter. Zurückgeschoben ist die
// Bettkante frei zum Sitzen, ohne zweiten Klappmechanismus.
function kokon(laenge) {
  const g = new THREE.Group();
  // innen 0,60 m breit, 0,58 m hoch (Kritik 26.10.); Vlies 60 mm + Haut: außen 0,74 m
  const hs = 0.28, r = 0.37, y0 = BODEN + T + hs, yb = BODEN + T, n = 6;
  const s = new THREE.Shape();      // Boden über die ganze Breite, nur links eine Wand
  s.moveTo(-B / 2, 0); s.lineTo(B / 2, 0); s.lineTo(B / 2, T); s.lineTo(-B / 2 + T, T);
  s.lineTo(-B / 2 + T, T + hs); s.lineTo(-B / 2, T + hs); s.closePath();
  const wg = new THREE.ExtrudeGeometry(s, { depth: laenge, bevelEnabled: false });
  wg.translate(0, BODEN, -laenge / 2);
  g.add(new THREE.Mesh(wg, mat(F.huelle)));
  // Querschnitt des Balgs: von der linken Wand über den Bogen, rechts senkrecht zur Bettkante
  const profil = [];
  for (let k = 0; k <= 24; k++) { const w = Math.PI * (1 - k / 24); profil.push([r * Math.cos(w), y0 + r * Math.sin(w)]); }
  profil.push([r, yb + 0.01]);
  const stirn = () => {             // Stirnfläche bis hinunter auf den Boden
    const f = new THREE.Shape();
    f.moveTo(-r, yb); profil.forEach(([x, y]) => f.lineTo(x, y)); f.closePath();
    return new THREE.Mesh(new THREE.ShapeGeometry(f), mat(F.fuss, { side: THREE.DoubleSide }));
  };
  const kopf = stirn(); kopf.position.z = -laenge / 2 + 0.01; g.add(kopf);
  const bGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(profil.map(([x, y]) => new THREE.Vector3(x, y, 0)),
    false, 'catmullrom', 0), 64, 0.012, 6);
  const ecken = [], idx = [];
  profil.forEach(([x, y]) => ecken.push(x, y, -0.5, x, y, 0.5));
  for (let k = 0; k < profil.length - 1; k++) { const a = 2 * k; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(ecken, 3));
  pGeo.setIndex(idx); pGeo.computeVertexNormals();
  const buegel = [], bahnen = [];
  for (let i = 0; i < n; i++) {
    const b = new THREE.Mesh(bGeo, mat(F.rahmen)); buegel.push(b); g.add(b);
    if (i < n - 1) { const p = new THREE.Mesh(pGeo, mat(F.dach, { side: THREE.DoubleSide })); bahnen.push(p); g.add(p); }
  }
  const fussende = stirn(); g.add(fussende);
  g.userData.setze = offen => {
    for (let i = 0; i < n; i++) {
      const zu = -laenge / 2 + i * laenge / (n - 1), auf = -laenge / 2 + 0.03 + i * 0.045;
      buegel[i].position.z = zu + (auf - zu) * offen;
    }
    for (let i = 0; i < n - 1; i++) {
      const a = buegel[i].position.z, e = buegel[i + 1].position.z;
      bahnen[i].position.z = (a + e) / 2;
      bahnen[i].scale.z = Math.max(e - a, 0.001);
    }
    fussende.position.z = buegel[n - 1].position.z;
  };
  g.userData.setze(0);
  return g;
}

// Schirm-Jurte: Mittelmast, Krone, 12 Rippen mit Streben zum Läufer; die Wand
// hängt erst, wenn der Schirm offen ist. Mitte im Ursprung der Gruppe.
function schirmJurte(xTuer) {
  const g = new THREE.Group(), J = JURTE, n = 12;
  const lr = Math.hypot(J.r - J.krone, J.first - J.wand);
  const phiAuf = Math.atan2(J.r - J.krone, J.first - J.wand), phiZu = 0.08;
  const strebe = 0.85, anRippe = 0.45 * lr;
  const boden = new THREE.Mesh(new THREE.CircleGeometry(J.r, 48), mat(F.fuss));
  boden.rotation.x = -Math.PI / 2; boden.position.y = 0.012; g.add(boden);
  const mast = stab(0.025, F.rahmen); setzeStab(mast, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, J.first + 0.12, 0)); g.add(mast);
  const krone = new THREE.Mesh(new THREE.TorusGeometry(J.krone, 0.02, 8, 32), mat(F.rahmen));
  krone.rotation.x = Math.PI / 2; krone.position.y = J.first; g.add(krone);
  const laeufer = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 12), mat(F.griff)); g.add(laeufer);
  const rippen = [], streben = [];
  for (let i = 0; i < n; i++) { const a = stab(0.012, F.rahmen), b = stab(0.008, F.griff); rippen.push(a); streben.push(b); g.add(a, b); }
  const dach = new THREE.Mesh(new THREE.BufferGeometry(), glas(F.dach, 0.45)); g.add(dach);
  // Wand mit Tür (Lücke 0,8 m) am Fußende des Anhängers (bei x = xTuer, +z):
  // durch sie wird der 0,78 m breite Anhänger der Länge nach hineingeschoben
  const tuerWinkel = 0.8 / J.r;
  const td = Math.atan2(xTuer, Math.sqrt(J.r * J.r - xTuer * xTuer));   // Zylinder: x = r·sin θ, z = r·cos θ
  const wandGeo = new THREE.CylinderGeometry(J.r, J.r, J.wand, 48, 1, true, td + tuerWinkel / 2, 2 * Math.PI - tuerWinkel);
  const wand = new THREE.Mesh(wandGeo, glas(F.huelle, 0.3)); wand.position.y = J.wand / 2; g.add(wand);
  const e1 = [J.r * Math.sin(td - tuerWinkel / 2), J.r * Math.cos(td - tuerWinkel / 2)];
  const e2 = [J.r * Math.sin(td + tuerWinkel / 2), J.r * Math.cos(td + tuerWinkel / 2)];
  const tuerGrund = Math.atan2(-(e2[1] - e1[1]), e2[0] - e1[0]);
  const sehne = Math.hypot(e2[0] - e1[0], e2[1] - e1[1]);
  const tuer = new THREE.Group();
  const tb = new THREE.Mesh(new THREE.PlaneGeometry(sehne, J.wand - 0.05), glas(F.klappe, 0.55));
  tb.position.x = sehne / 2; tuer.add(tb);
  tuer.position.set(e1[0], J.wand / 2, e1[1]); tuer.rotation.y = tuerGrund;
  tuer.userData.grund = tuerGrund;
  g.add(tuer);
  // Drei flexible Solarmodule auf der Südseite des Dachs
  const module3 = new THREE.Group();
  for (const w of [-0.5, 0, 0.5]) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.006, 0.8), mat(F.modul, { roughness: 0.35 }));
    // auf der Dachfläche (Kegel von der Krone zur Traufe), 1,5 cm darüber
    const rm = (J.r + J.krone) / 2, ym = J.first - (rm - J.krone) * (J.first - J.wand) / (J.r - J.krone) + 0.015;
    m.position.set(rm * Math.cos(w + Math.PI), ym, rm * Math.sin(w + Math.PI));
    m.rotation.order = 'YXZ'; m.rotation.y = -(w + Math.PI) + Math.PI / 2;
    m.rotation.x = Math.atan2(J.first - J.wand, J.r - J.krone);
    module3.add(m);
  }
  g.add(module3);
  g.userData.setze = auf => {
    const phi = phiZu + (phiAuf - phiZu) * auf;
    const ende = [J.krone + lr * Math.sin(phi), J.first - lr * Math.cos(phi)];
    const p = [J.krone + anRippe * Math.sin(phi), J.first - anRippe * Math.cos(phi)];
    const yl = p[1] - Math.sqrt(Math.max(strebe * strebe - p[0] * p[0], 0));
    laeufer.position.y = yl;
    for (let i = 0; i < n; i++) {
      const w = i * 2 * Math.PI / n, c = Math.cos(w), s = Math.sin(w);
      setzeStab(rippen[i], new THREE.Vector3(J.krone * c, J.first, J.krone * s), new THREE.Vector3(ende[0] * c, ende[1], ende[0] * s));
      setzeStab(streben[i], new THREE.Vector3(0, yl, 0), new THREE.Vector3(p[0] * c, p[1], p[0] * s));
    }
    dach.geometry.dispose();
    dach.geometry = new THREE.CylinderGeometry(J.krone, ende[0], J.first - ende[1], 48, 1, true);
    dach.position.y = (J.first + ende[1]) / 2;
    const steht = auf > 0.999;
    wand.visible = tuer.visible = module3.visible = steht;
  };
  g.userData.tuer = tuer;
  g.userData.setze(1);
  return g;
}

// Eisfischerzelt (Hub): Würfel 1,8 m mit Naben in den Wänden, steht am Kopfende
function hubZelt() {
  const g = new THREE.Group(), a = 1.8;
  const box = new THREE.Mesh(new THREE.BoxGeometry(a, a, a), glas(0x2f6f8f, 0.3));
  box.position.y = a / 2; g.add(box);
  const kanten = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(a, a, a)),
    new THREE.LineBasicMaterial({ color: F.rahmen }));
  kanten.position.y = a / 2; g.add(kanten);
  for (const [x, y, z] of [[a / 2, a / 2, 0], [-a / 2, a / 2, 0], [0, a / 2, -a / 2], [0, a, 0]]) {
    const nabe = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), mat(F.griff));
    nabe.position.set(x, y, z); g.add(nabe);
  }
  return g;
}

// Origami-Tonne (Yoshimura-Muster): Bergringe auf der Ellipse, Talringe um eine
// halbe Teilung versetzt und nach innen gefaltet. Angenähert: Ringabstand und
// Faltentiefe sind gekoppelt (Abstand Ring zu Ring gleich lang), die Diagonalen
// der Dreiecke ändern sich noch; ein starr faltbares Muster ist noch zu rechnen.
function origamiTonne(spann = 1.8, hoehe = 1.5, laenge = 1.8, ringe = 9, m = 8) {
  const d = laenge / (ringe - 1), h0 = 0.10, kante = Math.hypot(d, h0);
  const geo = new THREE.BufferGeometry();
  const anzahl = (ringe - 1) * (2 * m + 1) * 3;
  const pos = new Float32Array(anzahl * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const tonne = new THREE.Mesh(geo, mat(F.huelle, { flatShading: true, side: THREE.DoubleSide }));
  const kanten = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 10), new THREE.LineBasicMaterial({ color: F.rahmen }));
  const g = new THREE.Group(); g.add(tonne, kanten);
  const a = spann / 2, schritt = Math.PI / m;
  const punkt = (phi, tief) => {     // Punkt auf der Ellipse, um tief nach innen versetzt
    const x = a * Math.cos(phi), y = hoehe * Math.sin(phi);
    const nx = Math.cos(phi) / a, ny = Math.sin(phi) / hoehe, n = Math.hypot(nx, ny);
    return [x - tief * nx / n, Math.max(y - tief * ny / n, 0)];
  };
  g.userData.setze = auf => {
    const s = d * (0.06 + 0.94 * auf), tief = Math.sqrt(Math.max(kante * kante - s * s, 0));   // offen: h0
    let k = 0;
    const tri = (p, q, r) => { for (const v of [p, q, r]) { pos[k++] = v[0]; pos[k++] = v[1]; pos[k++] = v[2]; } };
    for (let i = 0; i < ringe - 1; i++) {
      // gerade Ringe: Berg (auf der Ellipse), ungerade: Tal (versetzt, nach innen)
      const berg = i % 2 === 0 ? i : i + 1, tal = i % 2 === 0 ? i + 1 : i;
      const zb = -berg * s, zt = -tal * s;
      const P = [], Q = [];
      for (let j = 0; j <= m; j++) { const [x, y] = punkt(j * schritt, 0); P.push([x, y, zb]); }
      Q.push([...punkt(0, 0), zt]);
      for (let j = 1; j <= m; j++) { const [x, y] = punkt((j - 0.5) * schritt, tief); Q.push([x, y, zt]); }
      Q.push([...punkt(Math.PI, 0), zt]);
      for (let j = 0; j < m; j++) tri(P[j], P[j + 1], Q[j + 1]);
      for (let j = 0; j <= m; j++) tri(Q[j], Q[j + 1], P[j]);
    }
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
    kanten.geometry.dispose();
    kanten.geometry = new THREE.EdgesGeometry(geo, 10);
  };
  g.userData.setze(1);
  return g;
}

// Tagstellung des Kokons: Balg zurück, die Bettkante auf der Wohnseite wird frei
function tagBank(k, d) {
  k.userData.setze(d);
}

(function variante_c() {
  const g = new THREE.Group();
  // Anhänger mit Kokon 12 cm neben dem Mast (Streben frei), Wohnseite (+x) bleibt
  // frei; je ein Sitz links und rechts vom Mast
  const xWagen = -(B / 2 + 0.12);
  const j = schirmJurte(xWagen); g.add(j);
  const wagen = new THREE.Group();
  const k = kokon(L_A); wagen.add(k, fahrwerk(L_A, L_A / 2 + 0.5), mensch(-L_A / 2 + 0.2, 1));
  wagen.position.x = xWagen;
  wagen.children[1].userData.deichsel.visible = false;
  g.add(wagen);
  // Regler: bis 0,8 spannt sich der Schirm auf, danach rollt der Anhänger der Länge
  // nach durch die Tür hinein (vorher stünden die hängenden Rippen im Kokon)
  let rein = 1;
  varianten.C = {
    gruppe: g, deckel: [], klappen: [], regler: 'Aufbau: Schirm, dann Anhänger',
    setzeRegler: v => {
      j.userData.setze(Math.min(1, v / 0.8));
      rein = Math.min(1, Math.max(0, (v - 0.8) / 0.2));
      wagen.position.z = (1 - rein) * 2.7;
    },
    animiere(d, kl) {
      tagBank(k, d);
      const t = j.userData.tuer;
      t.rotation.y = t.userData.grund + (rein < 1 ? 1 : kl) * 1.4;   // offen, solange der Anhänger hereinrollt
    },
    text: 'Variante C: Schirm-Jurte Ø 2,8 m als Wohnraum, darin der Kokon auf dem Anhänger (Haus im Haus); erst den Schirm aufspannen, dann den Anhänger durch die 0,8 m breite Tür hineinschieben',
  };
})();

(function variante_d() {
  const g = new THREE.Group();
  const k = kokon(L_A);
  g.add(k, fahrwerk(L_A, L_A / 2 + 0.5), mensch(-L_A / 2 + 0.2, 1));
  varianten.D = {
    gruppe: g, deckel: [], klappen: [],
    animiere(d) { tagBank(k, d); },
    text: 'Variante D: Kokon mit Balg (Bügel schieben sich zum Kopfende); auf der Wohnseite reicht der Balg bis zur Bettkante, zurückgeschoben ist die Bettkante frei zum Sitzen; 0,78 m breit',
  };
})();

(function variante_e() {
  const g = new THREE.Group();
  const zKopf = -L_A / 2, zFuss = L_A / 2;
  g.add(wanne(L_A - 2 * T));
  g.add(giebel(zKopf + T / 2, [KLAPPE_B, KLAPPE_H]), giebel(zFuss - T / 2));
  const dk = deckel(L_A / 2, -L_A / 4), df = deckel(L_A / 2, L_A / 4);
  const kl = klappe(zKopf - 0.001, -1);
  const hub = hubZelt(); hub.position.z = zKopf - 0.9;
  g.add(dk, df, kl, hub, fahrwerk(L_A, zFuss + 0.5), mensch(zKopf + 0.2, 1));
  varianten.E = {
    gruppe: g, deckel: [dk, df], klappen: [kl], regler: 'Zelt aufbauen',
    setzeRegler: v => { const s = 0.08 + 0.92 * v; hub.scale.set(s, s, s); hub.position.z = zKopf - 0.9 * s; },
    text: 'Variante E: feste Kiste mit Eisfischerzelt 1,8 m als Vorraum vor der Stirnklappe',
  };
})();

(function variante_f() {
  const g = new THREE.Group();
  const zKopf = -L_A / 2, zFuss = L_A / 2;
  g.add(wanne(L_A - 2 * T));
  g.add(giebel(zKopf + T / 2, [KLAPPE_B, KLAPPE_H]), giebel(zFuss - T / 2));
  const dk = deckel(L_A / 2, -L_A / 4), df = deckel(L_A / 2, L_A / 4);
  const kl = klappe(zKopf - 0.001, -1);
  const ori = origamiTonne(); ori.position.z = zKopf - 0.01;
  g.add(dk, df, kl, ori, fahrwerk(L_A, zFuss + 0.5), mensch(zKopf + 0.2, 1));
  varianten.F = {
    gruppe: g, deckel: [dk, df], klappen: [kl], regler: 'Faltwerk aufziehen',
    setzeRegler: v => ori.userData.setze(v),
    text: 'Variante F: feste Kiste mit Origami-Vorraum (Yoshimura-Tonne 1,8 × 1,5 × 1,8 m, feste Dreiecksplatten mit Stoffgelenken)',
  };
})();

for (const v of Object.values(varianten)) szene.add(v.gruppe);
varianten.B.regler = 'Auszug';
varianten.B.setzeRegler = v => varianten.B.setzeAuszug(v);

// --- Bedienung ---------------------------------------------------------------
const zustand = { variante: 'A', deckelAuf: false, klappeAuf: false, mensch: true,
  regler: { B: 1, C: 1, E: 1, F: 1 } };
const ziel = { deckel: 0, klappe: 0 };
const KNOPF = {   // Beschriftung der zwei Schalter je Variante; null = Schalter ausblenden
  A: ['Deckel als Vordach', 'Stirnklappe'], B: ['Deckel als Vordach', 'Stirnklappe'],
  C: ['Tag: Balg zurück, Bettkante frei', 'Jurtentür'], D: ['Tag: Balg zurück, Bettkante frei', null], E: ['Deckel als Vordach', 'Stirnklappe'],
  F: ['Deckel als Vordach', 'Stirnklappe'],
};

// melden = false: Statuszeile nicht neu setzen (Regler, sonst liest der Screenreader jeden Schritt)
function anzeigen(melden = true) {
  const v = varianten[zustand.variante];
  for (const [k, w] of Object.entries(varianten)) w.gruppe.visible = k === zustand.variante;
  document.getElementById('d3-auszug-feld').hidden = !v.regler;
  if (v.regler) {
    const wert = zustand.regler[zustand.variante];
    document.getElementById('d3-regler-text').textContent = v.regler;
    regler.value = Math.round(wert * 100);
    regler.setAttribute('aria-valuetext', reglerText(wert));
    v.setzeRegler(wert);            // nur die sichtbare Variante neu stellen
  }
  const [t1, t2] = KNOPF[zustand.variante];
  document.getElementById('d3-deckel').textContent = t1;
  const kb = document.getElementById('d3-klappe');
  kb.hidden = !t2; if (t2) kb.textContent = t2;
  // Im Auszug liegt nur jemand, wenn das Fußteil ausgezogen ist
  const liegtFrei = zustand.variante !== 'B' || zustand.regler.B > 0.95;
  menschen.forEach(m => { m.visible = zustand.mensch && liegtFrei; });
  ziel.deckel = zustand.deckelAuf ? 1 : 0;
  ziel.klappe = zustand.klappeAuf ? 1 : 0;
  if (melden) status.textContent = v.text +
    (zustand.deckelAuf ? `, ${t1.toLowerCase()}: offen` : '') +
    (zustand.klappeAuf && t2 ? `, ${t2} offen` : '');
  document.querySelectorAll('[data-variante]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.variante === zustand.variante)));
  document.getElementById('d3-deckel').setAttribute('aria-pressed', String(zustand.deckelAuf));
  document.getElementById('d3-klappe').setAttribute('aria-pressed', String(zustand.klappeAuf));
  document.getElementById('d3-mensch').setAttribute('aria-pressed', String(zustand.mensch));
}

const regler = document.getElementById('d3-auszug');
// Startansicht je Variante: Kamera und Blickpunkt (Jurte und Zelt sind größer)
const ANSICHT = { A: [3.2, 2.0, 2.6, 0.55], B: [3.2, 2.0, 2.6, 0.55], C: [4.6, 3.2, 4.2, 0.9],
  D: [3.2, 2.0, 2.6, 0.55], E: [3.4, 2.6, -4.4, 0.8], F: [3.4, 2.6, -4.4, 0.8] };
function reglerText(wert) {
  if (zustand.variante !== 'B') return `${varianten[zustand.variante].regler}: ${Math.round(wert * 100)} Prozent`;
  return `Länge ${(L_KOPF + (L_A - L_KOPF) * wert).toFixed(2).replace('.', ',')} m`;
}
document.querySelectorAll('[data-variante]').forEach(b => b.addEventListener('click', () => {
  if (zustand.variante === b.dataset.variante) return;   // Drehung des Nutzers behalten
  zustand.variante = b.dataset.variante;
  zustand.deckelAuf = zustand.klappeAuf = false;          // Schalter gelten je Variante neu
  const [x, y, z, ty] = ANSICHT[zustand.variante];
  kamera.position.set(x, y, z); steuerung.target.set(0, ty, 'EF'.includes(zustand.variante) ? -0.9 : 0);
  anzeigen();
}));
document.getElementById('d3-deckel').addEventListener('click', () => { zustand.deckelAuf = !zustand.deckelAuf; anzeigen(); });
document.getElementById('d3-klappe').addEventListener('click', () => { zustand.klappeAuf = !zustand.klappeAuf; anzeigen(); });
document.getElementById('d3-mensch').addEventListener('click', () => { zustand.mensch = !zustand.mensch; anzeigen(); });
regler.addEventListener('input', () => {
  const wert = Number(regler.value) / 100;
  zustand.regler[zustand.variante] = wert;
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
    if (v.animiere) v.animiere(deckelWinkel, klappeWinkel);
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
