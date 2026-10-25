"""Satteldach gegen Pultdach: Hülle, Wärme, Wind, Schnee und Solarertrag im Dezember.

Querschnitt außen 0,78 m breit, Box-Unterkante 0,40 m über Grund. Beide Formen
lassen in der Mitte (dort liegt der Kopf) dieselbe Kopfhöhe innen von 0,58 m.
Solar: Dezember, ca. 50° N, grobe Tageswerte der Einstrahlung auf die geneigte
Fläche je Ausrichtung (kWh/m²·d), Modulwirkungsgrad 20 %, 85 % der Dachfläche belegbar.
Aufruf: python dachform_pult_sattel.py
"""
import math

B, T, L = 0.78, 0.045, 2.09
BODEN = 0.40
H_MITTE_INNEN = 0.58
LAMBDA, ZUSCHLAG, LUEFTUNG, KOERPER = 0.022, 1.4, 0.6, 65
FLAECHENGEWICHT = 6.5
ETA, BELEGUNG = 0.20, 0.85
# Dezember-Einstrahlung auf ~30° geneigte Fläche, grob (kWh/m² am Tag)
STRAHLUNG = {"Süd": 0.95, "Ost/West": 0.55, "Nord": 0.30, "waagerecht": 0.55}


def sattel():
    traufe = 0.46                          # außen, über Unterkante Box
    first = H_MITTE_INNEN + 2 * T + 0.01   # 0,68 m
    dach = math.hypot(B / 2, first - traufe)
    umfang = B + 2 * traufe + 2 * dach
    flaeche = B * traufe + B / 2 * (first - traufe)
    return dict(name="Satteldach", hoch=first, umfang=umfang, flaeche=flaeche,
                neigung=math.degrees(math.atan((first - traufe) / (B / 2))),
                dachflaechen=[dach, dach])


def pult():
    tief = 0.46
    mitte = H_MITTE_INNEN + 2 * T + 0.01   # gleiche Kopfhöhe in der Mitte
    hoch = 2 * mitte - tief                # 0,90 m
    dach = math.hypot(B, hoch - tief)
    umfang = B + tief + hoch + dach
    flaeche = B * (tief + hoch) / 2
    return dict(name="Pultdach", hoch=hoch, umfang=umfang, flaeche=flaeche,
                neigung=math.degrees(math.atan((hoch - tief) / B)), dachflaechen=[dach])


def bewerte(d):
    huelle = d["umfang"] * L + 2 * d["flaeche"]
    ua = huelle * LAMBDA / T * ZUSCHLAG
    plus_k = KOERPER / (ua + LUEFTUNG)
    h_aussen = BODEN + d["hoch"]
    a_seite = h_aussen * L
    v_kipp = math.sqrt(60 * 9.81 * 0.74 / 2 / (h_aussen / 2) / (0.5 * 1.25 * 1.2 * a_seite))
    return huelle, huelle * FLAECHENGEWICHT, plus_k, h_aussen, v_kipp


def solar(d, lage):
    """Wh/Tag im Dezember. lage: Richtung, in die die (erste) Dachfläche zeigt."""
    gegenteil = {"Süd": "Nord", "Nord": "Süd", "Ost/West": "Ost/West"}
    summe = 0
    for i, breite in enumerate(d["dachflaechen"]):
        richtung = lage if i == 0 else gegenteil[lage]
        summe += breite * L * BELEGUNG * STRAHLUNG[richtung] * ETA * 1000
    return summe


if __name__ == "__main__":
    for d in (sattel(), pult()):
        huelle, kg, k, h, v = bewerte(d)
        print(f"{d['name']}: Neigung {d['neigung']:.0f}°, Höhe außen {h:.2f} m, Hülle {huelle:.2f} m² "
              f"= {kg:.1f} kg, +{k:.1f} K, kippt leer bei {v:.1f} m/s")
        flaeche = sum(d["dachflaechen"]) * L * BELEGUNG
        print(f"   Modulfläche {flaeche:.2f} m² ≈ {flaeche * ETA * 1000:.0f} Wp")
        for lage in ("Süd", "Ost/West", "Nord"):
            print(f"   Dezember, erste Dachfläche nach {lage}: {solar(d, lage):.0f} Wh/Tag")
