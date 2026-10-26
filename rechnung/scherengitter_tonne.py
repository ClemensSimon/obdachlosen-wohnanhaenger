"""Stufe 3d: Scherengitter-Tonne (Simons Entwurf 2025, v3) als Wohnraum über dem Anhänger.

Bögen aus polaren Scherenelementen (Escrig, Pérez Piñero): Zwei gerade Stäbe kreuzen
sich im Gelenk, das sie im Verhältnis k = a/b teilt. Die Enden liegen innen auf dem
Radius Ri und außen auf Ro = k·Ri, je zwei auf einem Strahl zum Mittelpunkt. Mit dem
Öffnungswinkel φ je Element ändert sich nur der Radius, die Form bleibt ein Kreisbogen.
Bei φ = 0 liegen alle Stäbe nebeneinander (Bündel von Stablänge).

Zwischen den Bögen sitzen in Längsrichtung gewöhnliche Scherenpaare. Die ganze Tonne
faltet sich so in beiden Richtungen zu einem Bündel (Prinzip Piñero). Die Haut ist
eine Plane mit Vlies 100 mm, innen eingehängt; die Stirnwände bestehen aus derselben
Plane, eine davon mit Tür.

Aufruf: python scherengitter_tonne.py
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rundzelt_schirm import ANNAHMEN, KOERPER_W, u_wert  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")
REAL = ANNAHMEN["realistisch"]
ROHR_KG_M = 0.24          # Alu 20 × 1,5
GELENK_KG = 0.03
PLANE_KG_M2 = 0.9 + 0.2   # Vlies 100 mm + Außenhaut
SCHNEE_KN_M2 = 0.83


def polar_bogen(Ro, tiefe, n, bogen=math.pi):
    """Halbkreisbogen aus n polaren Elementen; liefert Stablänge und das Faltverhalten."""
    Ri = Ro - tiefe
    k = Ro / Ri
    phi = bogen / n
    l = Ri * math.sqrt(1 + k * k - 2 * k * math.cos(phi))
    # Probe über den Faltweg: Stablänge konstant, Radius ändert sich mit φ
    weg = []
    for s in range(1, 101):
        p = phi * s / 100
        ri = l / math.sqrt(1 + k * k - 2 * k * math.cos(p))
        weg.append((p, ri, n * p))
    return dict(Ri=Ri, k=k, l=l, phi=phi, weg=weg)


def tonne(Ro=1.25, tiefe=0.15, n=8, laenge=2.6, felder=4, stab_d=0.02):
    b = polar_bogen(Ro, tiefe, n)
    boegen = felder + 1
    stäbe_bogen = 2 * n
    feld = laenge / felder
    # Längsscheren: je Knotenreihe (n+1 innen, n+1 außen) ein Scherenpaar je Feld
    l_laengs = math.hypot(feld, tiefe)
    stäbe_laengs = 2 * (n + 1) * felder
    kg_stab = (boegen * stäbe_bogen * b["l"] + stäbe_laengs * l_laengs) * ROHR_KG_M
    gelenke = boegen * (n + 2 * (n + 1)) + stäbe_laengs // 2 * 3
    gestell = kg_stab + gelenke * GELENK_KG
    mantel = math.pi * Ro * laenge
    stirn = math.pi * Ro * Ro / 2
    plane = (mantel + 2 * stirn) * PLANE_KG_M2
    boden = 2 * Ro * laenge
    # Paket: alle Stäbe gefaltet nebeneinander; Länge = längster Stab
    stabzahl = boegen * stäbe_bogen + stäbe_laengs
    quer = math.sqrt(stabzahl) * stab_d * 1.4
    paket = (quer, quer, max(b["l"], l_laengs))
    h = ((mantel + 2 * stirn) * u_wert(0.10, REAL["vlies"]) + boden * u_wert(0.02, 0.035)) * REAL["zuschlag"] \
        + REAL["luft_jurte"]
    # Schnee: Last je Bogen, als Dreigelenkbogen grob: Horizontalschub am Fuß
    q = SCHNEE_KN_M2 * feld                              # kN/m auf einen Bogen
    schub = q * (2 * Ro) ** 2 / (8 * Ro)                  # kN, Parabelnäherung H = qL²/8f
    return dict(b=b, boegen=boegen, gestell=gestell, plane=plane, kg=gestell + plane + 5, paket=paket,
                h=h, stabzahl=stabzahl, gelenke=gelenke, schub=schub, breite=2 * Ro, hoehe=Ro, laenge=laenge)


if __name__ == "__main__":
    print("Variante | Stab Bogen m | Stäbe | Gelenke | Gestell kg | Plane kg | gesamt kg | Paket m"
          " | Tonne allein K | Kiste darin K | Heizung W | Schub je Bogen kN")
    for name, kw in (("Ro 1,25, 8 Elemente, 5 Bögen", {}),
                     ("Ro 1,25, 6 Elemente, 4 Bögen", dict(n=6, felder=3)),
                     ("Ro 1,40, 8 Elemente, 5 Bögen", dict(Ro=1.40))):
        t = tonne(**kw)
        hk = 4.13
        plus = KOERPER_W / hk + KOERPER_W / t["h"]
        heiz = max(0, 1 / (1 / hk + 1 / t["h"]) * 25 - KOERPER_W)
        p = t["paket"]
        print(f"{name} | {t['b']['l']:.2f} | {t['stabzahl']} | {t['gelenke']} | {t['gestell']:.0f} | "
              f"{t['plane']:.0f} | {t['kg']:.0f} | {p[0]:.2f}×{p[1]:.2f}×{p[2]:.2f} | "
              f"{KOERPER_W / t['h']:+.1f} | {plus:+.1f} | {heiz:.0f} | {t['schub']:.2f}")
    t = tonne()
    print("\nFaltweg (erste Zeile): φ je Element → Innenradius → Bogenwinkel")
    for p, ri, ges in t["b"]["weg"][::20] + [t["b"]["weg"][-1]]:
        print(f"  φ {math.degrees(p):5.1f}° → Ri {ri:5.2f} m → {math.degrees(ges):5.0f}°")
    print("\nAchtung: Der polare Bogen ist ein Mechanismus. Er steht erst, wenn ein Gelenk je Bogen"
          " gesperrt ist oder ein Seil die Fußpunkte hält (Schub oben).")
