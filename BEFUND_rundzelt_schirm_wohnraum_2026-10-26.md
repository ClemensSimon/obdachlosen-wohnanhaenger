# Befund Stufe 3: Wohnraum aus Jurte, Eisfischerzelt, Origami, mit Kokon und kleiner Heizung, 26.10.2026

Ziel (Simon, 26.10.): außer dem Schlafplatz ein **winziger Wohnraum**. Die Jurte gilt als bewährte Lösung. Eine **kleine Heizung** ist nötig.

Rechnung: `rechnung/rundzelt_schirm.py` mit zwei Annahmensätzen:
- „Stufe 1“: dieselben Werte wie für die Kiste.
- „realistisch“: nach der Kritik vom 26.10.
  - Vlies gestaucht, λ 0,048
  - Zuschlag 1,6 für Nähte und Reißverschlüsse
  - Leckluft 1,5 W/K für den Wohnraum, 0,8 W/K für den Kokon

3D-Modell: Varianten C, D und E auf der Webseite.

## Ergebnis

1. **Den Wohnraum allein mit Körperwärme warm zu halten, geht mit keiner Form.**
   - Jede Hülle mit Sitz- oder Stehhöhe hat 15–16 m² Fläche.
   - Mit 65 W Körperwärme wird sie nur 2–4 K wärmer als draußen. Das gilt für die Jurte genauso wie für die Origami-Tonne aus PIR-Platten und das Eisfischerzelt.
   - Ohne Flamme braucht es 4–6 kWh je Nacht, um den Wohnraum auf +15 °C zu heizen. Das schafft keine kleine Heizung.
2. **Darum gilt: Wohnraum als Puffer, warmer Kern zum Schlafen (Haus im Haus).**
   - Der Wohnraum hält Wind, Regen und Schnee ab. Er ist der Raum für den Tag, Tisch und Sachen.
   - Geschlafen wird im Kokon oder in der Kiste auf dem Anhänger, der im Wohnraum steht.
3. **Kokon in der Jurte:**
   - Realistisch +13 K, nach der einfachen Rechnung +17 K.
   - Bei −10 °C außen ist es im Kokon damit etwa +3 °C. Für +15 °C braucht der Kokon eine **kleine Heizung von etwa 60 W**, also 0,6 kWh je Nacht.
   - In Frage kommen eine Heizdecke mit 30–60 W mit Übertemperaturschutz und Wärmflaschen.
4. **Strom für die Heizung:**
   - Ein Akku mit 100 Ah reicht für 1–2 Nächte. Er muss tagsüber an einer Steckdose geladen werden, zum Beispiel an der Tagesstätte (zweiter Ladeeingang, Frage 15).
   - Solar liefert im Dezember 0,19 kWh am Tag, also nur ein Drittel.
   - Der Akku darf unter 0 °C nicht laden. Er gehört deshalb in den Kokon oder braucht ein BMS mit Heizfolie.
5. **Ohne Heizung ist die feste Kiste besser als der Kokon.**
   - Die Kiste erreicht +15,7 K, der Kokon mit 60 mm Vlies realistisch nur +10,7 K und mit 100 mm +14,2 K.
   - Ein Kokon aus Stoff ist leichter, aber feuchte- und schnittempfindlich.

## Zahlen (realistisch)

| Hülle | Fläche m² | Boden m² | Temperaturplus ohne Heizung | Gewicht Hülle und Gestell |
|---|---|---|---|---|
| Eisfischerzelt 1,8 m, 90 g/m² | 16,2 | 3,2 | +1,0 K | 15 kg |
| Schirm-Jurte Ø 2,7 m, Filz 2 × 10 mm | 16,0 | 5,7 | +1,2 K | 67 kg |
| Schirm-Jurte Ø 2,7 m, Vlies 100 mm | 16,0 | 5,7 | +2,6 K | 42 kg |
| Origami-Tonne 1,8 × 2,2 × 1,6 m, PIR 25 mm | 15,5 | 4,0 | +2,2 K | 68 kg |
| Origami-Tonne, PIR 45 mm | 15,5 | 4,0 | +3,1 K | 107 kg |
| Kokon innen 0,60 m, Vlies 60 mm | 3,9 | 1,2 | +10,7 K | 11 kg |
| Kokon innen 0,60 m, Vlies 100 mm | 4,1 | 1,2 | +14,2 K | 13 kg |
| Fünfeck-Kiste PIR 45 mm (Vergleich) | 4,1 | 1,5 | +15,7 K | 27 kg |
| **Kokon 60 mm in der Jurte 100 mm** | | | **+13,3 K** (obere Grenze) | 53 kg |

Kleine Heizung bei −10 °C außen für +15 °C, Nacht von 10 h:

| Fall | Leistung | Energie je Nacht |
|---|---|---|
| Kokon allein | 87 W | 0,87 kWh |
| Kokon in der Jurte | 57 W | 0,57 kWh |
| ganzer Wohnraum (Jurte) | 565 W | 5,65 kWh, nicht machbar ohne Flamme |

## Korrekturen durch den Maschinenbau-Kritiker (26.10.)

| Nr | Befund | Umgesetzt |
|---|---|---|
| 1 | Bei Ø 2,2 m stand der Mast im Bett, Stehhöhe gab es nur über dem Bett | Jurte Ø 2,7 m, Mast neben dem Anhänger, Wohnseite frei (3D-Modell C) |
| 2 | Kippen bei Wind schon bei Bft 6, Böen bis 20 m/s ergeben 580 Nm gegen 220 Nm | Ballast 25–30 kg (Wassersäcke) an der Wand, Abspannung, ab Bft 6 abbauen |
| 3 | Mast Alu Ø 40 × 2 erreicht bei Wind die Fließgrenze | Mast mindestens Ø 50 × 2,5, abgespannt |
| 4 | Dampf aus dem Kokon gefriert im Jurtenvlies, 2,8 kg Eis pro Woche | Lüfter des Kokons nach außen führen, Innenhaut der Jurte als Dampfsperre, Vlies in Kammern |
| 5 | Kokon 0,69 m innen plus Vlies war breiter als 0,80 m | Innen 0,60 × 0,58 m, außen 0,74 m |
| 6 | 20 l Wasser bei 85 °C verbrüht, Salzspeicher wird 58 °C heiß, LiFePO4 lädt nicht unter 0 °C | Nur Wärmflaschen bei 70 °C mit Hülle, Heizdecke mit Übertemperaturschutz, Akku warm halten |
| 7 | Zuschlag 1,4 und λ 0,040 für Stoff zu günstig | Zweiter Annahmensatz „realistisch“ |
| 8 | Ohne Schürze verliert der Kokonboden nach außen, nicht in die Jurte | Schürze unter dem Anhänger, +13 K ist deshalb die obere Grenze |
| 11 | Schnee schiebt die Rippenfüße auseinander | Zugring an den Rippenfüßen |
| 13 | Alu-Bügel des Verdecks sind Kältebrücken | Bügel aus GFK, Hülle innen mit Abstandsgewirke |

## Die Konzepte

- **C, Schirm-Jurte mit Kokon (Haus im Haus):**
  - Aufbau:
    - Mast Ø 50 mm neben dem Anhänger, Krone (Toono) oben.
    - 12 Rippen spannen sich über Streben auf, wenn ein Läufer am Mast hochgeschoben wird.
    - Danach hängt die Wand aus Vlies mit Tür. Ein Zugring hält die Rippenfüße zusammen.
  - Im Wohnraum: 2,7 m Durchmesser, 5,7 m² Boden, davon etwa 4 m² neben dem Anhänger frei. Stehhöhe gibt es nur im Ring um den Mast.
  - Tagsüber ist das Verdeck des Kokons zurückgeschoben, und der Kokon wird zur Bank.
  - Für die Fahrt passen Rippen (1,36 m), Mast (geteilt) und Wand als Bündel neben den Kokon.
  - Die Bewährung kommt von der Jurte: Bauform und Abdeckung sind seit Jahrhunderten erprobt. Neu sind hier nur der Schirm-Läufer und der kleine Maßstab.
- **D, Kokon mit Faltverdeck:**
  - 6 Bügel aus GFK schieben sich zum Kopfende zusammen wie eine Lkw-Schiebeplane.
  - Am Tag ist der Kokon eine Bank, nachts die Schlafhülle.
  - Er hat 0,74 m Außenbreite und wiegt 11–13 kg statt 27 kg wie die Kiste.
- **E, Kiste mit Eisfischerzelt als Vorraum:**
  - Das Zelt steht in 30–90 s, ist aber nur Windschutz (+1 K).
  - Es ist die billigste Möglichkeit, einen Wohnraum zu bekommen. Man kann es fertig kaufen, für 150–300 €.
- **K10, Origami (Simon, 26.10.):**
  - Faltplatten aus PIR mit Stoffgelenken, als Tonne nach dem Yoshimura- oder Miura-Muster. Gefaltet liegen sie flach auf dem Anhänger.
  - Vorteile:
    - steif und schneefest
    - schnittfest
    - Wärme so gut wie die Jurte
  - Nachteile:
    - 68–107 kg
    - viele Gelenkfugen, also Leckluft
    - die Dicke der Platten verlangt eigene Faltmuster (thick origami)
  - Vorbild: Cardborigami von Tina Hovsepian. Das ist ein gefalteter Unterstand aus Pappe für Obdachlose in Los Angeles, 4,8 kg schwer und in unter einer Minute aufgebaut.
  - Origami taugt als feste, faltbare **Kiste**, also als Ersatz für Deckel und Auszug, und als robuster Wohnraum. Wärmer als die Jurte wird der Wohnraum dadurch nicht.
  - 3D-Modell, Variante F:
    - Kiste mit Origami-Vorraum am Kopfende: Tonne 1,8 m breit, 1,5 m hoch, 1,8 m lang. Sie hat 9 Ringe zu je 8 Feldern, im Wechsel Berg- und Talfalte.
    - Die Faltbewegung ist **angenähert**. Ringabstand und Tiefe der Talfalte sind so gekoppelt, dass der Abstand von Ring zu Ring gleich bleibt. Die Talfalte wird beim Aufziehen von etwa 25 cm auf 10 cm flacher.
    - Die Diagonalen der Dreiecke ändern sich dabei noch zwischen 0,28 und 0,38 m. Für feste Platten braucht es ein berechnetes, starr faltbares Muster. Zusammengeschoben ist der Stapel etwa 0,1 m tief, aber 1,8 m breit.
    - Für die Fahrt mit 0,8 m Breite muss die Tonne deshalb zusätzlich in der Mitte falten (Miura-Muster) oder flach auf der Kiste liegen. Das ist noch offen.
    - Die Stirnwand vorne fehlt im Modell noch.

## Offen

- Gesamtgewicht Anhänger, Kokon und Jurte samt Ballast: etwa 120 kg. Ob das Fahrrad die Anhängelast schafft, ist ungeprüft.
- Schneelastzone für den Einsatzort.
- Messung am Modell: Leckluft, Feuchte im Vlies, Setzen nach einigen Nächten.

## Quellen

- Eisfischerzelte: [Norrik](https://norrik.com/selecting-the-best-ice-fishing-shelter/), [Outdoor Life](https://www.outdoorlife.com/story/gear/best-ice-fishing-shelter/), [North American Outdoorsman](https://northamerican-outdoorsman.com/best-ice-fishing-shanties/)
- Schirmzelt-Mechanik: [US6230728B1](https://patents.google.com/patent/US6230728), [CA2397172C](https://patents.google.com/patent/CA2397172C/en), [US2864389A](https://patents.google.com/patent/US2864389A/en)
- Origami-Unterstand für Obdachlose: [New Atlas: Cardborigami](https://newatlas.com/cardborigami-homeless-shelter/26437/), [Millennial Magazine: Cardborigami](https://millennialmagazine.com/2015/04/13/cardborigami-provides-popup-shelters-for-homeless/)
