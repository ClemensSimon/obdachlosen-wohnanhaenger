"""Stufe 3: textile Hüllen (Eisfischerzelt, Schirm-Jurte, Kokon mit Faltverdeck) gegen die Kiste.

Frage: Hält Körperwärme allein (keine Verbrennung, Frage 5) eine textile Hülle
nachts warm genug, und wie viel kleine Heizung braucht es dazu?
Zwei Annahmensätze:
  "Stufe 1" = dieselben Werte wie huellformen_stufe1.py (direkter Vergleich)
  "realistisch" = nach der Kritik vom 26.10.: Vlies gestaucht (λ 0,048), Zuschlag 1,6
                  für Nähte und Reißverschlüsse, Leckluft Jurte 1,5 W/K, Kokon 0,8 W/K

Aufruf: python rundzelt_schirm.py
"""
import math

KOERPER_W = 65         # W, sensibel (wie Stufe 1)
R_OBERFLAECHE = 0.17   # m²K/W, innen + außen
LAMBDA_PIR = 0.022     # W/mK
LAMBDA_FILZ = 0.040    # W/mK, Wollfilz (Jurte)
ZIEL_K = 15            # K Temperaturplus wie bei der Kiste
VLIES_MM_JE_G = 1 / 7  # mm Dicke je g/m² Füllung, locker (90 g/m² ≈ 13 mm)
FEUCHTE_G_H = 40       # g/h Wasserdampf aus Atem und Haut
NACHT_H = 10
AUSSEN = -10           # °C für den Heizbedarf

ANNAHMEN = {
    "Stufe 1": dict(vlies=0.040, zuschlag=1.4, luft_jurte=0.6, luft_kokon=0.6),
    "realistisch": dict(vlies=0.048, zuschlag=1.6, luft_jurte=1.5, luft_kokon=0.8),
}


def u_wert(dicke_m, lam):
    return 1 / (R_OBERFLAECHE + dicke_m / lam)


def zylinder_kegel(d, h_wand, h_first):
    """Jurte: Zylinderwand, Kegeldach, Boden."""
    r = d / 2
    return math.pi * d * h_wand + math.pi * r * math.hypot(r, h_first - h_wand), math.pi * r * r


def hub_wuerfel(a, h):
    """Eisfischerzelt (Hub): vier Wände, Dach, Bodenplane."""
    return 4 * a * h + a * a, a * a


def origami_tonne(breite, hoehe, laenge, falten=1.15):
    """Origami-Gewölbe (Yoshimura/Miura) als halbe Ellipse; Faltung vergrößert die Fläche."""
    a, b = breite / 2, hoehe
    umfang = math.pi * math.sqrt((a * a + b * b) / 2)
    stirn = math.pi * a * b / 2
    return (umfang * laenge + 2 * stirn) * falten, breite * laenge


def kokon(b_innen, h_seite, laenge, dicke):
    """Faltverdeck über dem Bett, gerechnet auf der Mittelfläche der Dämmung."""
    r = b_innen / 2 + dicke / 2
    umfang = 2 * h_seite + math.pi * r
    stirn = 2 * r * h_seite + math.pi * r * r / 2
    return umfang * laenge + 2 * stirn, b_innen * laenge


def ua(huelle, u_huelle, boden, u_boden, a):
    return (huelle * u_huelle + boden * u_boden) * a["zuschlag"]


# Name, Art, (Hülle, Boden), Dicke m, λ-Schlüssel, U Boden, kg/m² Hülle, Gestell kg
def konzepte(a):
    vl = a["vlies"]
    return [
        ("Eisfischerzelt 1,8 m, 90 g/m²", "jurte", hub_wuerfel(1.8, 1.8), 90 * VLIES_MM_JE_G / 1000, vl,
         u_wert(0.02, 0.035), 0.55, 6),
        ("Schirm-Jurte Ø 2,8 m, Filz 2 × 10 mm", "jurte", zylinder_kegel(2.8, 1.1, 1.9), 0.02, LAMBDA_FILZ,
         u_wert(0.02, 0.035), 3.2, 16),
        ("Schirm-Jurte Ø 2,8 m, Vlies 100 mm", "jurte", zylinder_kegel(2.8, 1.1, 1.9), 0.10, vl,
         u_wert(0.02, 0.035), 1.6, 16),
        ("Origami-Tonne 1,8 × 2,2 × 1,6 m, PIR 25 mm", "jurte", origami_tonne(1.8, 1.6, 2.2), 0.025,
         LAMBDA_PIR, u_wert(0.02, 0.035), 4.0, 6),
        ("Origami-Tonne 1,8 × 2,2 × 1,6 m, PIR 45 mm", "jurte", origami_tonne(1.8, 1.6, 2.2), 0.045,
         LAMBDA_PIR, u_wert(0.02, 0.035), 6.5, 6),
        ("Kokon, innen 0,60 m, Vlies 60 mm", "kokon", kokon(0.60, 0.28, 2.0, 0.06), 0.06, vl,
         u_wert(0.045, LAMBDA_PIR), 1.2, 6),
        ("Kokon, innen 0,60 m, Vlies 100 mm", "kokon", kokon(0.60, 0.28, 2.0, 0.10), 0.10, vl,
         u_wert(0.045, LAMBDA_PIR), 1.6, 6),
        ("Vergleich: Fünfeck-Kiste PIR 45 mm", "kiste", (5.59 - 1.46, 1.46), 0.045, LAMBDA_PIR,
         u_wert(0.045, LAMBDA_PIR), 6.5, 0),
    ]


def rechne(a):
    print(f"\n=== Annahmen {name_a}: Vlies λ {a['vlies']}, Zuschlag {a['zuschlag']}, "
          f"Luft Jurte {a['luft_jurte']} / Kokon {a['luft_kokon']} W/K ===")
    print("Konzept | Hülle m² | Boden m² | U Hülle | H W/K | +K ohne Heizung | Hülle kg")
    h = {}
    for name, art, (huelle, boden), dicke, lam, u_boden, kg_m2, gestell in konzepte(a):
        luft = a["luft_jurte"] if art == "jurte" else (a["luft_kokon"] if art == "kokon" else 0.6)
        zuschlag = 1.4 if art == "kiste" else a["zuschlag"]   # Kiste bleibt wie Stufe 1
        hges = (huelle * u_wert(dicke, lam) + boden * u_boden) * zuschlag + luft
        h[name] = hges
        print(f"{name} | {huelle:.2f} | {boden:.2f} | {u_wert(dicke, lam):.2f} | {hges:.2f} | "
              f"{KOERPER_W / hges:+.1f} | {huelle * kg_m2 + gestell:.0f}")
    hj, hk = h["Schirm-Jurte Ø 2,8 m, Vlies 100 mm"], h["Kokon, innen 0,60 m, Vlies 60 mm"]
    # Haus im Haus: Kokon steht in der Jurte. Derselbe Wärmestrom geht durch beide Hüllen.
    # Der Kokonboden liegt auf dem Anhänger; ohne Schürze darunter gibt er nach außen ab.
    k_reihe = KOERPER_W / hk + KOERPER_W / hj
    print(f"Haus im Haus (Kokon 60 mm in Jurte 100 mm): {k_reihe:+.1f} K "
          f"(obere Grenze; Kokonboden gibt einen Teil direkt nach außen ab)")
    for name_f, hges in (("Kokon allein", hk), ("Kokon in der Jurte", 1 / (1 / hk + 1 / hj))):
        heiz = max(0.0, hges * (15 - AUSSEN) - KOERPER_W)
        print(f"  Heizung für +15 °C im {name_f} bei {AUSSEN} °C: {heiz:.0f} W, "
              f"{heiz * NACHT_H / 1000:.2f} kWh je Nacht")
    heiz_j = max(0.0, hj * (15 - AUSSEN) - KOERPER_W)
    print(f"  Wohnraum (Jurte) ganz auf +15 °C: {heiz_j:.0f} W, {heiz_j * NACHT_H / 1000:.2f} kWh je Nacht")


if __name__ == "__main__":
    for name_a, a in ANNAHMEN.items():
        rechne(a)
    akku = 12.8 * 100 / 1000 * 0.85            # LiFePO4 100 Ah, 85 % nutzbar
    flaschen = 3 * 2 * 4.19 * (70 - 35) / 3600  # drei Wärmflaschen à 2 l, 70 → 35 °C
    print(f"\nQuellen ohne Flamme: Solar Dezember ca. 0,19 kWh/Tag | Akku 100 Ah {akku:.2f} kWh "
          f"(11 kg, lädt nicht unter 0 °C) | 3 Wärmflaschen à 2 l bei 70 °C {flaschen:.2f} kWh")
    print(f"Feuchte je Nacht: {FEUCHTE_G_H * NACHT_H} g Wasser. Ohne Dampfsperre innen wandert sie "
          "ins Vlies und gefriert dort.")
