"""Stufe 3b: Origami- und Faltmechanismen durchgerechnet, dann kombiniert.

Je Muster: Maße offen, Paket gefaltet MIT Plattendicke, passt auf den Anhänger
(0,78 × 2,09 m), Fugenlänge, Platten, Gewicht, Faltfehler (größte Längenänderung
einer Kante über den Faltweg; 0 = starr faltbar), Temperaturplus bei Hüllen.
Wärme mit dem Annahmensatz „realistisch“ aus rundzelt_schirm.py.

Aufruf: python origami_varianten.py
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rundzelt_schirm import ANNAHMEN, KOERPER_W, u_wert, zylinder_kegel, LAMBDA_PIR  # noqa: E402

REAL = ANNAHMEN["realistisch"]
ANH_B, ANH_L = 0.78, 2.09        # Ladefläche des Anhängers
PLATTE = {                       # Dicke m, kg/m², λ
    "PIR 25": (0.025, 4.0, LAMBDA_PIR),
    "PIR 45": (0.045, 6.5, LAMBDA_PIR),
    "Hohlkammer 10": (0.010, 1.7, None),   # Polycarbonat-Stegplatte, nur Regen- und Sonnenschutz
}
SCHARNIER_KG_M = 0.10            # Gewebeband oder Folienscharnier je m Fuge


# --- Miura-ori (Schenk & Guest 2013), starr faltbar ----------------------------
def miura(a, b, gamma, theta):
    """Zellmaße bei Faltwinkel theta (0 = flach). Knoten P(i,j) =
    (j·S, i·L + (j ungerade ? V : 0), (i ungerade ? H : 0))."""
    st, ct, sg, tg = math.sin(theta), math.cos(theta), math.sin(gamma), math.tan(gamma)
    H = a * st * sg
    S = b * ct * tg / math.sqrt(1 + ct * ct * tg * tg)
    L = a * math.sqrt(1 - st * st * sg * sg)
    V = b / math.sqrt(1 + ct * ct * tg * tg)
    return H, S, L, V


def miura_fehler(a, b, gamma):
    """Kantenlängen und Winkel über den ganzen Faltweg prüfen (soll 0 sein)."""
    f = 0.0
    for k in range(0, 90):
        H, S, L, V = miura(a, b, gamma, math.radians(k))
        f = max(f, abs(math.hypot(L, H) - a), abs(math.hypot(S, V) - b), abs(L * V - a * b * math.cos(gamma)))
    return f


def miura_blatt(name, zeilen, spalten, a, b, gamma_grad, theta_offen_grad, platte):
    g = math.radians(gamma_grad)
    t, kg, _ = PLATTE[platte]
    H, S, L, V = miura(a, b, g, math.radians(theta_offen_grad))
    offen = (spalten * S, zeilen * L + V, H)
    # gefaltet: S -> 0, je Spalte eine Plattenlage, Höhe a·sin γ, Länge zeilen·a·cos γ + b
    paket = (spalten * t * 1.15, zeilen * a * math.cos(g) + b, a * math.sin(g) + t)
    flaeche = zeilen * spalten * a * b * math.sin(g)
    fugen = zeilen * spalten * b + zeilen * spalten * a
    return dict(name=name, offen=offen, paket=paket, platten=zeilen * spalten, fugen=fugen,
                kg=flaeche * kg + fugen * SCHARNIER_KG_M, fehler=miura_fehler(a, b, g), flaeche=flaeche)


# --- Yoshimura-Tonne (wie im 3D-Modell, Ringabstand und Faltentiefe gekoppelt) ----
def yoshimura_fehler(spann, hoehe, laenge, ringe, m, h0=0.10):
    """Größte Längenänderung aller Dreieckskanten über den Faltweg (Modell F)."""
    d = laenge / (ringe - 1)
    kante = math.hypot(d, h0)
    a, schritt = spann / 2, math.pi / m

    def punkt(phi, tief):
        x, y = a * math.cos(phi), hoehe * math.sin(phi)
        nx, ny = math.cos(phi) / a, math.sin(phi) / hoehe
        n = math.hypot(nx, ny)
        return x - tief * nx / n, max(y - tief * ny / n, 0)

    laengen = {}
    for k in range(0, 101, 5):
        s = d * (0.06 + 0.94 * k / 100)
        tief = math.sqrt(max(kante * kante - s * s, 0))
        P = [(*punkt(j * schritt, 0), 0) for j in range(m + 1)]
        Q = [(*punkt(0, 0), -s)] + [(*punkt((j - 0.5) * schritt, tief), -s) for j in range(1, m + 1)] + [(*punkt(math.pi, 0), -s)]
        for j in range(m):
            for nm, (p, q) in (("PQ" + str(j), (P[j], Q[j + 1])), ("QP" + str(j), (Q[j + 1], P[j + 1]))):
                laengen.setdefault(nm, []).append(math.dist(p, q))
    return max(max(v) - min(v) for v in laengen.values())


def ellipse_umfang_halb(a, b):
    return math.pi * math.sqrt((a * a + b * b) / 2)


def yoshimura_tonne(name, spann, hoehe, laenge, ringe, m, platte, firstgelenk):
    t, kg, lam = PLATTE[platte]
    flaeche = ellipse_umfang_halb(spann / 2, hoehe) * laenge * 1.15
    stirn = math.pi * spann / 2 * hoehe / 2
    lagen = ringe - 1
    if firstgelenk:     # zwei Viertelbögen, je 0,5·spann breit, übereinander gestapelt
        paket = (spann / 2, hoehe, 2 * lagen * t * 1.15)
    else:
        paket = (spann, hoehe, lagen * t * 1.15)
    platten = (ringe - 1) * (2 * m + 1)
    fugen = platten * 1.5 * math.hypot(laenge / (ringe - 1), ellipse_umfang_halb(spann / 2, hoehe) / m)
    # Wärme: Tonne mit zwei Stirnwänden (eine mit Tür), Boden Matte 20 mm
    hges = ((flaeche + 2 * stirn) * u_wert(t, lam) + spann * laenge * u_wert(0.02, 0.035)) * REAL["zuschlag"] + REAL["luft_jurte"]
    return dict(name=name, offen=(spann, laenge, hoehe), paket=paket, platten=platten, fugen=fugen,
                kg=(flaeche + 2 * stirn) * kg + fugen * SCHARNIER_KG_M, fehler=yoshimura_fehler(spann, hoehe, laenge, ringe, m),
                h=hges, flaeche=flaeche)


# --- Fächerdach der Jurte: Rippen = Bergfalten, dazwischen Talfalten ------------------
def faecherdach(name, r, wand, first, krone, n, platte):
    t, kg, lam = PLATTE[platte]
    lr = math.hypot(r - krone, first - wand)
    d = 2 * math.pi / n
    phi_auf = math.atan2(r - krone, first - wand)
    c = (krone + lr * math.sin(phi_auf)) * math.sin(d / 2)      # halbe Sehne, offen
    laengen = {"CV": [], "MV": []}
    for k in range(30, 101, 5):                                  # unter 30 % liegen die Platten am Mast
        phi = 0.08 + (phi_auf - 0.08) * k / 100
        rE, yE = krone + lr * math.sin(phi), first - lr * math.cos(phi)
        rv = max(rE * math.cos(d / 2) - math.sqrt(max(c * c - (rE * math.sin(d / 2)) ** 2, 0)), krone)
        V = (rv * math.cos(d / 2), rv * math.sin(d / 2), yE)
        C = (krone, 0, first)
        M = (krone * math.cos(d / 2), krone * math.sin(d / 2), first)
        laengen["CV"].append(math.dist(C, V))
        laengen["MV"].append(math.dist(M, V))
    fehler = max(max(v) - min(v) for v in laengen.values())
    flaeche = math.pi * r * math.hypot(r, first - wand)
    platten = 4 * n
    fugen = n * lr * 3                                           # Rippe, Talfalte, Stoß
    umfang_bund = platten * t * 1.3
    paket = (umfang_bund / math.pi, umfang_bund / math.pi, lr)    # Bündel um den Mast
    return dict(name=name, offen=(2 * r, 2 * r, first), paket=paket, platten=platten, fugen=fugen,
                kg=flaeche * kg + fugen * SCHARNIER_KG_M + 16, fehler=fehler, flaeche=flaeche, t=t, lam=lam)


def passt(paket):
    a, b, c = sorted(paket)
    return b <= ANH_B and c <= ANH_L


if __name__ == "__main__":
    muster = [
        miura_blatt("Miura-Vordach 2,0 × 1,6 m, Stegplatte 10 mm", 8, 10, 0.20, 0.21, 70, 25, "Hohlkammer 10"),
        miura_blatt("Miura-Windwand 1,6 × 1,2 m, PIR 25", 6, 8, 0.20, 0.21, 70, 30, "PIR 25"),
        yoshimura_tonne("Yoshimura-Vorraum 1,8 breit (Modell F)", 1.8, 1.5, 1.8, 9, 8, "PIR 25", False),
        yoshimura_tonne("Yoshimura-Vorraum 1,56 breit, Firstgelenk", 1.56, 1.5, 1.8, 9, 8, "PIR 25", True),
        faecherdach("Fächerdach-Jurte Ø 2,8, PIR 25 (Wand Vlies)", 1.4, 1.1, 1.9, 0.25, 12, "PIR 25"),
    ]
    print("Muster | offen m | Paket m (mit Plattendicke) | passt | Platten | Fugen m | kg | Faltfehler mm")
    for d in muster:
        o, p = d["offen"], d["paket"]
        print(f"{d['name']} | {o[0]:.2f}×{o[1]:.2f}×{o[2]:.2f} | {p[0]:.2f}×{p[1]:.2f}×{p[2]:.2f} | "
              f"{'ja' if passt(p) else 'NEIN'} | {d['platten']} | {d['fugen']:.0f} | {d['kg']:.0f} | {d['fehler'] * 1000:.0f}")

    # Fächerdach-Jurte: Dach PIR 25 statt Vlies, Wand Vlies 100 mm
    fd = muster[4]
    wand_m2 = math.pi * 2.8 * 1.1
    h_fd = (fd["flaeche"] * u_wert(fd["t"], fd["lam"]) + wand_m2 * u_wert(0.10, REAL["vlies"])
            + math.pi * 1.4 ** 2 * u_wert(0.02, 0.035)) * REAL["zuschlag"] + REAL["luft_jurte"]
    h_jt = (sum(zylinder_kegel(2.8, 1.1, 1.9)[:1]) * u_wert(0.10, REAL["vlies"])
            + zylinder_kegel(2.8, 1.1, 1.9)[1] * u_wert(0.02, 0.035)) * REAL["zuschlag"] + REAL["luft_jurte"]
    h_yo = muster[3]["h"]

    # --- Kombinationen: warmer Kern × Wohnraum × Vordach ---------------------------
    BASIS = 45      # kg Rahmen, Fahrwerk, Akku, Solar, Elektrik [Annahme, Frage 9: leer ≤ 85 kg mit Kiste]
    kerne = {"Kiste PIR 45": (4.13, 27, 2), "Kokon 60 mm": (6.07, 11, 2), "Kokon 100 mm": (4.58, 13, 2)}
    raeume = {   # H W/K, kg, Handgriffe Aufbau, umschließt den Kern?
        "ohne": (None, 0, 0, False),
        "Jurte Stoff": (h_jt, 48, 12, True),                       # 43 kg Hülle und Gestell + 5 kg Bodenmatte
        "Fächerdach-Jurte": (h_fd, round(fd["kg"] + 21), 14, True),  # + Wand Vlies 16 kg + Bodenmatte 5 kg
        "Yoshimura-Vorraum": (h_yo, round(muster[3]["kg"]), 8, False),
        "Eisfischerzelt": (67.7, 15, 4, False),
    }
    vordach = round(muster[0]["kg"])
    print(f"\nKombination (+ Miura-Vordach {vordach} kg) | kg gesamt | Handgriffe | +K | Heizung für +15 °C bei −10 °C")
    for kn, (hk, kgk, gk) in kerne.items():
        for rn, (hr, kgr, gr, umschliesst) in raeume.items():
            if umschliesst:
                plus = KOERPER_W / hk + KOERPER_W / hr
                h_eff = 1 / (1 / hk + 1 / hr)
            else:       # Vorraum: nur die Stirnseite des Kerns grenzt an, kaum Gewinn
                plus = KOERPER_W / hk
                h_eff = hk
            heiz = max(0, h_eff * 25 - KOERPER_W)
            kg = BASIS + kgk + kgr + vordach
            print(f"{kn} + {rn} | {kg} | {gk + gr + 3} | {plus:+.1f} | {heiz:.0f} W")
    print(f"\nWohnraum allein: Jurte Stoff {KOERPER_W / h_jt:+.1f} K, Fächerdach-Jurte {KOERPER_W / h_fd:+.1f} K, "
          f"Yoshimura PIR 25 {KOERPER_W / h_yo:+.1f} K")
