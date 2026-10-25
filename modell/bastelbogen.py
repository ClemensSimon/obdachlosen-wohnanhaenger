"""Bastelbögen 1:5 für die beiden Varianten aus Stufe 2.

A: feste Kiste (Fünfeck) mit geteiltem Deckel und Stirnklappe
B: Auszug, Kopfteil 1,25 m mit Deckel, Fußteil schiebt hinein

Material: Schaumplatte 5 mm. Alle Maße in mm im Modell (1:5).
Ausgabe: SVG-Seiten A3 quer zum Ausdrucken in 100 % (nicht „an Seite anpassen“).
Aufruf: python bastelbogen.py   ->  bogen_A_1.svg ... bogen_B_n.svg
"""
import math
import os

M = 5          # Maßstab 1:M
D = 5.0        # Plattenstärke im Modell, mm

# Außenmaße in Wirklichkeit (m), aus Stufe 1 (Fünfeck optimiert)
B_AUSSEN = 0.78
TRAUFE = 0.46     # Außenhöhe an der Traufe
FIRST = 0.68      # Außenhöhe am First
L_GESAMT = 2.09
L_KOPF = 1.25     # Variante B: Kopfteil
KLAPPE = (0.45, 0.48)          # Stirnklappe Breite × Höhe
# Variante B: Fußteil außen; ringsum bleibt am Ring Platz für die Dichtfläche
FUSS_AUSSEN = (0.61, 0.40)
STIRN = (0.71, 0.46)           # Außenflansch (Stirnplatte), dichtet eingeschoben außen am Ring
FUSS_L = 0.905                 # Fußteil mit beiden Flanschen; ausgezogen genau 2,09 m


def mm(m):
    return round(m * 1000 / M, 1)


B, TR, FI = mm(B_AUSSEN), mm(TRAUFE), mm(FIRST)
DACH = round(math.hypot(B / 2, FI - TR), 1)    # schräge Dachbreite


def rechteck(name, w, h, anzahl=1, hinweis=""):
    return [dict(name=name, w=w, h=h, form="r", hinweis=hinweis)
            for _ in range(anzahl)]


def giebel(name, loch=None, hinweis=""):
    """Fünfeck, optional mit rechteckigem Ausschnitt (Breite, Höhe) unten mittig."""
    return [dict(name=name, w=B, h=FI, form="g", loch=loch, hinweis=hinweis)]


def teile_a():
    l = mm(L_GESAMT) - 2 * D         # zwischen den Giebeln
    halb = round(l / 2, 1)
    kl = (mm(KLAPPE[0]), mm(KLAPPE[1]))
    t = []
    t += giebel("A Giebel Kopf", loch=kl, hinweis="Ausschnitt = Stirnklappe, aufbewahren")
    t += giebel("A Giebel Fuß")
    t += rechteck("A Boden (Hälfte)", halb, B - 2 * D, 2, "Stoß in der Mitte")
    t += rechteck("A Seitenwand (Hälfte)", halb, TR, 4, "zwischen den Giebeln")
    t += rechteck("A Deckel Kopf", halb, DACH, 2, "links/rechts, mit Klebeband als Gelenk")
    t += rechteck("A Deckel Fuß", halb, DACH, 2, "links/rechts")
    return t


def teile_b():
    lk = mm(L_KOPF) - 2 * D
    kl = (mm(KLAPPE[0]), mm(KLAPPE[1]))
    fb, fh = mm(FUSS_AUSSEN[0]), mm(FUSS_AUSSEN[1])     # Fußteil außen
    fl = mm(FUSS_L) - 2 * D                             # Kasten zwischen den Flanschen
    spiel = 1.0
    t = []
    t += giebel("B Giebel Kopf", loch=kl, hinweis="Ausschnitt = Stirnklappe")
    t += giebel("B Ring zum Fußteil", loch=(fb + 2 * spiel, fh + spiel),
                hinweis="Dichtfläche innen und außen, 6 Löcher")
    t += rechteck("B Boden Kopfteil", lk, B - 2 * D)
    t += rechteck("B Seitenwand Kopfteil", lk, TR, 2)
    t += rechteck("B Deckel Kopfteil", round(lk / 2, 1), DACH, 4, "zwei Hälften je Seite")
    t += rechteck("B Fußteil Boden", fl, fb)
    t += rechteck("B Fußteil Seite", fl, fh - D, 2, "auf den Boden")
    t += rechteck("B Fußteil Decke", fl, fb - 2 * D, 1, "zwischen die Seiten")
    # Innenflansch: Innenquerschnitt des Kopfteils mit 1 mm Luft, Fenster für die Beine
    t += [dict(name="B Innenflansch", w=B - 2 * D - 2 * spiel, h=FI - 2 * D - 2 * spiel,
               traufe=TR - D, form="g", loch=(fb - 2 * D, fh - 2 * D),
               hinweis="Kopfende des Fußteils, dichtet ausgezogen")]
    t += rechteck("B Außenflansch (Stirn)", mm(STIRN[0]), mm(STIRN[1]), 1,
                  "Fußende, dichtet eingeschoben")
    return t


# --- Seiten packen (Regale, A3 quer) ------------------------------------------
SEITE_W, SEITE_H, RAND, ABST = 420, 297, 10, 6


def packen(teile):
    """Regale über alle Seiten, Rechtecke dürfen gedreht werden (first fit)."""
    oben, rechts, unten = RAND + 14, SEITE_W - RAND, SEITE_H - RAND
    seiten = []          # je Seite: dict(teile=[], regale=[[y, h, x]])
    for p in sorted(teile, key=lambda p: -max(p["w"], p["h"])):
        lagen = [(p["w"], p["h"])]
        if p["form"] == "r":
            lagen.append((p["h"], p["w"]))
        platz = None
        for s in seiten:
            for r in s["regale"]:
                for w, h in lagen:
                    if h <= r[1] and r[2] + w <= rechts:
                        platz = (s, r, w, h)
                        break
                if platz:
                    break
            if platz:
                break
        if not platz:
            w, h = min(lagen, key=lambda l: l[1])   # flach liegend neues Regal
            for s in seiten:
                y = s["regale"][-1][0] + s["regale"][-1][1] + ABST if s["regale"] else oben
                if y + h <= unten:
                    s["regale"].append([y, h, RAND])
                    platz = (s, s["regale"][-1], w, h)
                    break
        if not platz:
            s = dict(teile=[], regale=[[oben, h, RAND]])
            seiten.append(s)
            platz = (s, s["regale"][0], w, h)
        s, r, w, h = platz
        s["teile"].append(dict(p, w=w, h=h, x=r[2], y=r[0]))
        r[2] += w + ABST
    return [s["teile"] for s in seiten]


def svg_teil(p):
    x, y, w, h = p["x"], p["y"], p["w"], p["h"]
    s = []
    if p["form"] == "r":
        s.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" class="s"/>')
    else:
        tr = p.get("traufe", TR)    # Traufhöhe dieses Fünfecks
        pts = [(x, y + h), (x, y + h - tr), (x + w / 2, y), (x + w, y + h - tr), (x + w, y + h)]
        s.append('<polygon class="s" points="%s"/>' % " ".join(f"{a:.1f},{b:.1f}" for a, b in pts))
        if p.get("loch"):
            lw, lh = p["loch"]
            lx, ly = x + (w - lw) / 2, y + h - D - lh
            s.append(f'<rect x="{lx:.1f}" y="{ly:.1f}" width="{lw}" height="{lh}" class="s"/>')
    cx, cy = x + w / 2, y + h / 2
    s.append(f'<text x="{cx:.1f}" y="{cy:.1f}" class="n">{p["name"]}</text>')
    s.append(f'<text x="{cx:.1f}" y="{cy + 5:.1f}" class="m">{w:g} × {h:g} mm</text>')
    if p["hinweis"]:
        s.append(f'<text x="{cx:.1f}" y="{cy + 10:.1f}" class="m">{p["hinweis"]}</text>')
    return "\n".join(s)


def svg_seite(titel, teile, nr, gesamt):
    kopf = (f'<text x="{RAND}" y="{RAND + 4}" class="t">{titel} · Bogen {nr}/{gesamt} · '
            f'Maßstab 1:{M} · Schaumplatte {D:g} mm · in 100 % drucken</text>'
            f'<line x1="{SEITE_W - RAND - 100}" y1="{RAND + 6}" x2="{SEITE_W - RAND}" y2="{RAND + 6}" class="k"/>'
            f'<text x="{SEITE_W - RAND - 50}" y="{RAND + 3}" class="m">Kontrolle: 100 mm</text>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{SEITE_W}mm" height="{SEITE_H}mm" '
            f'viewBox="0 0 {SEITE_W} {SEITE_H}">\n'
            '<style>.s{fill:none;stroke:#000;stroke-width:.3}.k{stroke:#000;stroke-width:.5}'
            '.t{font:bold 4.5px sans-serif}.n{font:bold 3.6px sans-serif;text-anchor:middle}'
            '.m{font:3px sans-serif;text-anchor:middle}</style>\n'
            + kopf + "\n" + "\n".join(svg_teil(p) for p in teile) + "\n</svg>\n")


if __name__ == "__main__":
    ziel = os.path.dirname(os.path.abspath(__file__))
    for kurz, titel, teile in (("A", "Variante A: feste Kiste", teile_a()),
                               ("B", "Variante B: Auszug", teile_b())):
        seiten = packen(teile)
        for i, seite in enumerate(seiten, 1):
            pfad = os.path.join(ziel, f"bogen_{kurz}_{i}.svg")
            with open(pfad, "w", encoding="utf-8") as f:
                f.write(svg_seite(titel, seite, i, len(seiten)))
        print(kurz, len(teile), "Teile auf", len(seiten), "Bögen")
    print(f"Außen: Breite {B} mm, Traufe {TR} mm, First {FI} mm, Dachbreite {DACH} mm")
