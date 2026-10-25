"""Stufe 1: sechs Hüllformen im Querschnitt vergleichen.

Alle Formen erfüllen dieselben Innenmaße für einen liegenden Menschen und
dieselbe Außenbreite von 78 cm. Gerechnet wird je Form:
Innenfläche, Hüllfläche, Gewicht der Hülle, Wärmeverlust, Temperaturplus
durch Körperwärme, Außenhöhe, Kippwind (leer) und Schneeneigung.

Annahmen stehen oben als Konstanten. Aufruf: python huellformen_stufe1.py
"""
import math

# --- Annahmen ---------------------------------------------------------------
B_AUSSEN = 0.78        # m, Gesamtbreite (Frage 6)
T_WAND = 0.045         # m, Wandstärke PIR-Sandwich (Frage 7)
L_INNEN = 2.00         # m, Liegelänge (Frage 6)
H_BETT = 0.45          # m, Unterkante Schlafraum über Boden (Frage 10)
LAMBDA = 0.022         # W/mK, PIR
WAERMEBRUECKEN = 1.4   # Zuschlag für ca. 20 m Fugen, Kanten, Deckel (Kritik 25.10.)
LUEFTUNG_WK = 0.6      # W/K, Pendellüfter mit Rückgewinnung (Frage 7/15)
KOERPER_W = 65         # W, sensibler Anteil; Rest geht als Feuchte (Kritik 25.10.)
FLAECHENGEWICHT = 6.5  # kg/m², mit Randprofilen, Einsätzen, Kleber (Kritik 25.10.)
BOGEN_ZUSCHLAG = 1.10  # gebogene Flächen aus Segmenten: +10 % Gewicht
M_LEER = 60            # kg, Leergewicht gesamt (Frage 9)
STUETZ_ABSTAND = 0.74  # m, Abstand der Stützfüße quer
RHO_LUFT = 1.25        # kg/m³
CW_SEITE = 1.2         # Widerstandsbeiwert Kiste seitlich angeströmt

B_INNEN = B_AUSSEN - 2 * T_WAND
# Mindestmaße innen: Schulterbreite in Seitenlage, Kopfhöhe in der Mitte
SCHULTER_B, SCHULTER_H = 0.50, 0.25   # m Breite in m Höhe über Matratze
H_MITTE_MIN = 0.58                    # m


def rechteck():
    h = H_MITTE_MIN
    return dict(name="Rechteck", h_innen=h, umfang=2 * (B_INNEN + h),
                flaeche=B_INNEN * h, neigung=0, ebene_platten=4, bogen=False)


def fuenfeck(h_wand=0.35, h_first=0.62):
    a = B_INNEN / 2
    dach = math.hypot(a, h_first - h_wand)
    return dict(name="Fünfeck (Ulmer Nest)", h_innen=h_first,
                umfang=B_INNEN + 2 * h_wand + 2 * dach,
                flaeche=B_INNEN * h_wand + a * (h_first - h_wand),
                neigung=math.degrees(math.atan((h_first - h_wand) / a)),
                ebene_platten=5, bogen=False)


def a_frame():
    # Spitze so hoch, dass auf SCHULTER_H noch SCHULTER_B frei sind
    a = B_INNEN / 2
    h = a / ((a - SCHULTER_B / 2) / SCHULTER_H)
    return dict(name="A-Frame", h_innen=h,
                umfang=B_INNEN + 2 * math.hypot(a, h),
                flaeche=a * h, neigung=math.degrees(math.atan(h / a)),
                ebene_platten=3, bogen=False)


def tonne():
    r = B_INNEN / 2
    h_wand = H_MITTE_MIN - r
    return dict(name="Tonne (Conestoga)", h_innen=H_MITTE_MIN,
                umfang=B_INNEN + 2 * h_wand + math.pi * r,
                flaeche=B_INNEN * h_wand + math.pi * r * r / 2,
                neigung=90, ebene_platten=3, bogen=True)


def sechseck(fase=0.15):
    # Rechteck mit zwei 45°-Fasen oben (halbes Sechseck, Hexayurt-Prinzip)
    h = H_MITTE_MIN
    f = fase
    umfang = B_INNEN + 2 * (h - f) + 2 * f * math.sqrt(2) + (B_INNEN - 2 * f)
    return dict(name="Sechseck (Hexayurt)", h_innen=h, umfang=umfang,
                flaeche=B_INNEN * h - f * f, neigung=45,
                ebene_platten=6, bogen=False)


def tropfen():
    # Querschnitt wie Tonne, zusätzlich im Längsprofil zum Fuß hin verjüngt:
    # volle Höhe auf 1,2 m, dann linear auf 0,35 m Innenhöhe am Fußende.
    d = tonne()
    d.update(name="Tropfen (Teardrop)", laengs_verjuengt=True)
    return d


def bewerte(d):
    t = T_WAND
    umfang_mitte = d["umfang"] + math.pi * t      # Mittelfläche der Wand
    flaeche_mitte = d["flaeche"] + d["umfang"] * t / 2
    l_mitte = L_INNEN + t
    if d.get("laengs_verjuengt"):
        # mittlerer Höhenfaktor über die Länge: 1,2 m voll, 0,8 m Rampe
        f_fuss = 0.35 / d["h_innen"]
        faktor = (1.2 + 0.8 * (1 + f_fuss) / 2) / L_INNEN
        umfang_mitte *= (1 + faktor) / 2           # grob: Umfang schrumpft mit
        flaeche_mitte_mittel = flaeche_mitte * faktor
    else:
        flaeche_mitte_mittel = flaeche_mitte
    huelle = umfang_mitte * l_mitte + 2 * flaeche_mitte
    masse = huelle * FLAECHENGEWICHT * (BOGEN_ZUSCHLAG if d["bogen"] else 1)
    ua = huelle * LAMBDA / t * WAERMEBRUECKEN
    plus_k = KOERPER_W / (ua + LUEFTUNG_WK)
    volumen = flaeche_mitte_mittel * L_INNEN
    h_aussen = H_BETT + d["h_innen"] + t
    # Kippwind leer: Winddruck auf Seitenfläche, Angriff in halber Höhe
    a_seite = (h_aussen) * (L_INNEN + 2 * t)
    if d.get("laengs_verjuengt"):
        a_seite *= 0.85
    m_halt = M_LEER * 9.81 * STUETZ_ABSTAND / 2
    v_kipp = math.sqrt(m_halt / (h_aussen / 2) / (0.5 * RHO_LUFT * CW_SEITE * a_seite))
    return dict(huelle=huelle, masse=masse, ua=ua, plus_k=plus_k,
                volumen=volumen, h_aussen=h_aussen, v_kipp=v_kipp)


def beaufort(v):
    grenzen = [0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7]
    return next((i for i, g in enumerate(grenzen) if v < g), 12)


def passt(d, h_wand_oder_fase, art):
    """Mindestmaß: auf SCHULTER_H frei SCHULTER_B, Mitte >= H_MITTE_MIN."""
    if art == "fuenfeck":
        h_wand, h_first = h_wand_oder_fase, d
        if h_wand >= SCHULTER_H:
            return True
        a = B_INNEN / 2
        breite = 2 * a * (h_first - SCHULTER_H) / (h_first - h_wand)
        return breite >= SCHULTER_B
    return True  # Sechseck: Fase beginnt erst über SCHULTER_H, siehe unten


def optimum(art):
    """Kleinste Hüllfläche unter den Mindestmaßen, gleich fair für beide."""
    beste = None
    if art == "fuenfeck":
        for i in range(10, 59):
            h_wand = i / 100
            for j in range(58, 90):
                h_first = j / 100
                if h_first <= h_wand or not passt(h_first, h_wand, art):
                    continue
                # Kopfraum: auf 0,45 m Höhe mindestens 0,40 m Breite
                a = B_INNEN / 2
                if h_wand < 0.45:
                    b45 = 2 * a * (h_first - 0.45) / (h_first - h_wand)
                    if b45 < 0.40:
                        continue
                d = fuenfeck(h_wand, h_first)
                f = bewerte(d)["huelle"]
                if beste is None or f < beste[0]:
                    beste = (f, d)
    else:
        for i in range(0, 34):
            fase = i / 100
            if H_MITTE_MIN - fase < SCHULTER_H:
                continue
            if B_INNEN - 2 * fase < 0.40 and H_MITTE_MIN - fase < 0.45:
                continue
            d = sechseck(fase)
            f = bewerte(d)["huelle"]
            if beste is None or f < beste[0]:
                beste = (f, d)
    return beste[1]


if __name__ == "__main__":
    formen = [rechteck(), fuenfeck(), optimum("fuenfeck"), a_frame(), tonne(),
              sechseck(), optimum("sechseck"), tropfen()]
    formen[2]["name"] += " optimiert"
    formen[6]["name"] += " optimiert"
    print(f"Innenbreite {B_INNEN:.2f} m, Wand {T_WAND*1000:.0f} mm, "
          f"Liegelänge {L_INNEN:.2f} m\n")
    kopf = ("Form", "H innen", "H außen", "Hülle m²", "Hülle kg", "UA W/K",
            "+K", "Vol m³", "Dach °", "Platten", "Kippwind")
    print(" | ".join(kopf))
    for d in formen:
        r = bewerte(d)
        print(" | ".join([
            d["name"], f"{d['h_innen']:.2f}", f"{r['h_aussen']:.2f}",
            f"{r['huelle']:.2f}", f"{r['masse']:.1f}", f"{r['ua']:.2f}",
            f"{r['plus_k']:.1f}", f"{r['volumen']:.2f}", f"{d['neigung']:.0f}",
            f"{d['ebene_platten']}{' + Bogen' if d['bogen'] else ''}",
            f"{r['v_kipp']:.1f} m/s (Bft {beaufort(r['v_kipp'])})"]))
