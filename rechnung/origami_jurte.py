"""Stufe 3c: Origami-Jurte = Khana (Scherengitter aus Rohren) + Faltkegel-Dach.

Dach: 24 Trapezplatten, alle Falten zielen auf EINEN gedachten Scheitel (Faltung um
einen Knoten, „Schirmprinzip“). Innen- und Außenfalten wechseln sich ab. Die Platten
enden 0,4 m unter dem Scheitel, darüber sitzt die Krone als lose Haube. Der Flasher
aus dem Vorschlag in Stufe 3b ist verworfen: Er faltet sich zu einer Ebene auf,
das Dach braucht aber Gefälle gegen Schnee.

Geprüft über den ganzen Faltweg: Kantenlängen (Faltfehler), kein Knoten über dem
Scheitel, Plattendicke an der Krone, Paketmaß. Dazu Schneelast, Zugring,
Plattenbiegung, Wärme, Gewicht, Schwerpunkt beim Transport und die harten Grenzen.

Aufruf: python origami_jurte.py
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rundzelt_schirm import ANNAHMEN, KOERPER_W, u_wert, AUSSEN, ZIEL_K  # noqa: E402
from origami_varianten import PLATTE, SCHARNIER_KG_M, passt  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")
REAL = ANNAHMEN["realistisch"]
DT = ZIEL_K - AUSSEN                       # 25 K: +15 °C innen bei −10 °C außen
Y_DECKEL = 0.40 + 0.68                     # First des Deckels über Grund (BODEN + FI)
J = dict(r=1.40, wand=1.10, first=1.90)    # wie Schirm-Jurte (Variante C)
N_DACH = 24                                # Platten = Falten
S_KRONE = 0.40                             # Platten enden 0,4 m (schräg) unter dem Scheitel
TUER = 0.80
SCHNEE_KN_M2 = 0.83                        # Entscheidung 11: 30 cm Nassschnee = 135 kg auf 1,63 m²


# --- Faltkegel ------------------------------------------------------------------
def kegel():
    hoehe = J["first"] - J["wand"]
    R = math.hypot(J["r"], hoehe)                 # Länge einer Falte vom Scheitel zur Traufe
    th0 = math.atan2(J["r"], hoehe)               # Polarwinkel offen (von der Senkrechten nach unten)
    d = 2 * math.pi / N_DACH                      # Azimut zwischen zwei Falten
    c = 2 * J["r"] * math.sin(d / 2)              # Traufkante einer Platte (fest)
    K = 1 - c * c / (2 * R * R)                   # cos des Winkels Falte–Falte am Scheitel
    return R, th0, d, c, K


def aussenwinkel(a, d, K):
    """Innenfalten auf Polarwinkel a; Außenfalte b aus fester Traufkante."""
    m = math.hypot(math.cos(a), math.sin(a) * math.cos(d))
    psi = math.atan2(math.sin(a) * math.cos(d), math.cos(a))
    return psi + math.acos(min(1.0, K / m))


def knoten(a, b, R, d, i):
    """Traufknoten i (Scheitel im Ursprung, y nach unten negativ)."""
    p = a if i % 2 == 0 else b
    w = i * d
    return (R * math.sin(p) * math.cos(w), -R * math.cos(p), R * math.sin(p) * math.sin(w))


def faltweg(t):
    R, th0, d, c, K = kegel()
    rho_min = N_DACH * t * 1.15 / (2 * math.pi)   # Platten an der Krone brauchen diesen Radius
    a_min = math.asin(min(1.0, rho_min / S_KRONE))
    fehler, ueber, schritte = 0.0, False, []
    for k in range(0, 201):
        a = a_min + (th0 - a_min) * k / 200
        b = aussenwinkel(a, d, K)
        P = [knoten(a, b, R, d, i) for i in range(N_DACH + 1)]
        for i in range(N_DACH):
            fehler = max(fehler, abs(math.dist(P[i], P[i + 1]) - c),
                         abs(math.dist(P[i], (0, 0, 0)) - R))
        ueber |= max(a, b) > math.pi / 2
        schritte.append((a, b))
    a_zu, b_zu = schritte[0]
    paket = (2 * R * math.sin(b_zu), 2 * R * math.sin(b_zu), (R - S_KRONE) * math.cos(min(a_zu, b_zu)))
    return dict(R=R, th0=th0, c=c, a_min=a_min, b_zu=b_zu, fehler=fehler, ueber=ueber, paket=paket,
                rho_min=rho_min)


def faecher_weg(t, schritte=200):
    """Fächer mit offener Naht über der Tür: Abstand der Falten im Azimut wächst
    von fast 0 (Stapel) bis 2π/N (Kegel); Innenfalte a frei gewählt, Außenfalte b aus der
    festen Traufkante. Gefaltet liegen alle Platten in einer Ebene übereinander."""
    R, th0, d, c, K = kegel()
    fehler, ueber = 0.0, False
    for k in range(0, schritte + 1):
        v = k / schritte
        a = 0.05 + (th0 - 0.05) * v
        dz = d * v
        m = math.hypot(math.cos(a), math.sin(a) * math.cos(dz))
        psi = math.atan2(math.sin(a) * math.cos(dz), math.cos(a))
        b = psi + math.acos(min(1.0, K / m))
        P = [(R * math.sin(a if i % 2 == 0 else b) * math.cos(i * dz), -R * math.cos(a if i % 2 == 0 else b),
              R * math.sin(a if i % 2 == 0 else b) * math.sin(i * dz)) for i in range(N_DACH + 1)]
        for i in range(N_DACH):
            fehler = max(fehler, abs(math.dist(P[i], P[i + 1]) - c))
        ueber |= max(a, b) > math.pi / 2
    paket = (N_DACH * t * 1.15, c + t, R - S_KRONE)
    return dict(fehler=fehler, ueber=ueber, paket=paket)


def dach(platte, mit_vlies=False):
    t, kgm2, lam = PLATTE[platte]
    R, *_ = kegel()
    flaeche = math.pi * J["r"] * R * (1 - (S_KRONE / R) ** 2)    # Kegelmantel ohne Krone
    fugen = N_DACH * (R - S_KRONE)
    kg = flaeche * kgm2 + fugen * SCHARNIER_KG_M + 1.0 + 2.5 + 1.5   # Zugring, Krone, Regenhaut
    if mit_vlies:
        kg += flaeche * 0.9                                       # Vlies 100 mm in Kassetten
        u = u_wert(0.10, REAL["vlies"])
    else:
        u = u_wert(t, lam)
    return dict(platte=platte + (" + Vlies 100" if mit_vlies else ""), t=t, flaeche=flaeche,
                fugen=fugen, kg=kg, u=u, weg=faltweg(t), faecher=faecher_weg(t))


def statik(d, kg_dach, platte):
    """Schnee auf der Grundfläche, Ring am Traufkranz, Platte quer zwischen zwei Falten
    (Biegespannung nur für reinen PIR-Schaum; Stegplatte 10 mm ist für diese Spannweite ausgelegt)."""
    beta = math.atan2(J["first"] - J["wand"], J["r"])
    W = SCHNEE_KN_M2 * 1000 * math.pi * J["r"] ** 2 + kg_dach * 9.81    # N
    ring = W / (2 * math.pi * math.tan(beta))                            # N Zugkraft im Ring
    spann = d["c"]                                                       # größte Plattenbreite
    q = SCHNEE_KN_M2 * 1000 * math.cos(beta) ** 2                        # N/m² senkrecht zur Platte
    M = q * spann ** 2 / 8                                               # Nm/m, frei aufliegend
    sigma = M / (PLATTE["PIR 25"][0] ** 2 / 6) / 1e6 if platte.startswith("PIR") else None   # MPa
    return dict(W=W, ring=ring, sigma=sigma, beta=math.degrees(beta))


# --- Khana: Scherengitter aus Rohren (Simons Scherengelenk 2025) ------------------
def khana(e=0.267, glieder=6, rohr_kg_m=0.127, gelenk_kg=0.025, abschnitte=4, rohr_d=0.016):
    ls = glieder * e
    umfang = 2 * math.pi * J["r"] - TUER
    sin_a = J["wand"] / ls
    w = 2 * e * math.sqrt(1 - sin_a ** 2)                 # Breite einer Raute offen
    zellen = round(umfang / w)
    staebe = 2 * (zellen + glieder // 2)
    gelenke = staebe * glieder // 2
    kg = staebe * ls * rohr_kg_m + gelenke * gelenk_kg + 1.0     # + Türrahmen
    # zu: Stäbe liegen nebeneinander, je Abschnitt zwei Lagen
    je = staebe / abschnitte
    paket = (abschnitte * 2 * rohr_d * 1.3, je / 2 * rohr_d * 1.3, ls)
    return dict(ls=ls, alpha=math.degrees(math.asin(sin_a)), zellen=zellen, staebe=staebe,
                gelenke=gelenke, kg=kg, paket=paket, w=w)


def waerme(d):
    wand = (2 * math.pi * J["r"] - TUER) * J["wand"]
    tuer = TUER * J["wand"]
    h = (d["flaeche"] * d["u"] + (wand + tuer) * u_wert(0.10, REAL["vlies"])
         + math.pi * J["r"] ** 2 * u_wert(0.02, 0.035)) * REAL["zuschlag"] + REAL["luft_jurte"] + d["fugen"] * 0.02
    return h


if __name__ == "__main__":
    kh = khana()
    print(f"Khana: {kh['staebe']} Rohre Alu 16×1 je {kh['ls']:.2f} m, {kh['zellen']} Rauten, "
          f"{kh['gelenke']} Scherengelenke, offen {kh['alpha']:.0f}° Kreuzungswinkel, {kh['kg']:.1f} kg, "
          f"Paket {kh['paket'][0]:.2f}×{kh['paket'][1]:.2f}×{kh['paket'][2]:.2f} m")

    W_FILZ = 16 + 5     # Wandhülle Vlies 100 mm und Bodenmatte (wie Stufe 3b)
    BASIS_KISTE = 81    # Kiste + Miura-Vordach (Stufe 3b), Grenze leer 85 kg
    print("\nA) Geschlossener Ring (alle 24 Falten verbunden), symmetrisch gefaltet:")
    print("Dach | Faltfehler mm | Knoten über Scheitel | Platten an Krone | Bündel m | passt")
    dächer = (dach("PIR 25"), dach("Hohlkammer 10", True))
    for d in dächer:
        w, p = d["weg"], d["weg"]["paket"]
        print(f"{d['platte']} | {w['fehler'] * 1000:.2f} | {'JA' if w['ueber'] else 'nein'} | "
              f"Innenfalte mind. {math.degrees(w['a_min']):.0f}° (ρ {w['rho_min'] * 100:.1f} cm) | "
              f"Ø {p[0]:.2f} × {p[2]:.2f} | {'ja' if passt(p) else 'NEIN'}")

    print("\nB) Fächer mit offener Naht über der Tür (gewählt):")
    print("Dach | Faltfehler mm | Knoten über Scheitel | Stapel m | passt | kg"
          " | Ring kN | Platte σ MPa | Jurte allein K | Kiste darin K | Heizung W")
    for d in dächer:
        w, p = d["faecher"], d["faecher"]["paket"]
        st = statik(d["weg"], d["kg"], d["platte"])
        sig = f"{st['sigma']:.2f}" if st["sigma"] is not None else "–"
        h = waerme(d)
        hk = 4.13                          # Kiste PIR 45, Stufe 3b
        plus = KOERPER_W / hk + KOERPER_W / h
        heiz = max(0, 1 / (1 / hk + 1 / h) * DT - KOERPER_W)
        print(f"{d['platte']} | {w['fehler'] * 1000:.2f} | {'JA' if w['ueber'] else 'nein'} | "
              f"{p[0]:.2f} × {p[1]:.2f} × {p[2]:.2f} | {'ja' if passt(p) else 'NEIN'} | {d['kg']:.0f} | "
              f"{st['ring'] / 1000:.2f} | {sig} | {KOERPER_W / h:+.1f} | {plus:+.1f} | {heiz:.0f}")
        jurte_kg = d["kg"] + kh["kg"] + W_FILZ
        # Transport: Dachstapel flach auf dem Deckel, Khana daneben, Hülle in der Kiste

        oben = max(p[0], kh["paket"][0])
        teile = [(BASIS_KISTE, 0.55), (d["kg"], Y_DECKEL + p[0] / 2),
                 (kh["kg"], Y_DECKEL + kh["paket"][0] / 2), (W_FILZ, 0.65)]
        m = sum(k for k, _ in teile)
        ys = sum(k * y for k, y in teile) / m
        spur = 0.68
        print(f"   Jurte gesamt {jurte_kg:.0f} kg; mit Kiste {m:.0f} kg (Grenze 85 kg: "
              f"{'VERLETZT' if m > 85 else 'ok'}); Breite oben {p[1] + kh['paket'][1]:.2f} m; "
              f"Transporthöhe {Y_DECKEL + oben:.2f} m; "
              f"Schwerpunkt {ys:.2f} m, kippt seitlich ab {math.degrees(math.atan2(spur / 2, ys)):.0f}° "
              f"(Kiste allein {math.degrees(math.atan2(spur / 2, 0.55)):.0f}°); Schnee gesamt {st['W'] / 1000:.1f} kN")
    print("\nHarte Grenzen: leer ≤ 85 kg verletzt, sobald die Jurte mitfährt. Steht sie am Platz,"
          " ist sie ein fester Bau (Entscheidung 13: nur als Fahrzeug). Losfahren in 5 min geht nur ohne Abbau:"
          " Anhänger rückwärts durch die Tür, Jurte bleibt stehen.")
