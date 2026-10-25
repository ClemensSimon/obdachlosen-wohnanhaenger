# Befund: Hüllformen, Stufe 1 (25.10.2026)

Grundlage: [Entscheidungen](ENTSCHEIDUNGEN.md)
Rechnung: [rechnung/huellformen_stufe1.py](rechnung/huellformen_stufe1.py)
Geprüft vom Maschinenbau-Kritiker. Seine Einwände sind eingearbeitet (Abschnitt unten).

## Annahmen (nach Kritik)
- Außenbreite 0,78 m, Wand 45 mm PIR-Sandwich, innen 0,69 m breit, Liegelänge 2,0 m
- Schlafraum beginnt 0,45 m über dem Boden (Bett über den Radkästen)
- Mindestmaß innen: 0,58 m Kopfhöhe in der Mitte, 0,50 m Breite in 0,25 m Höhe, 0,40 m Breite in 0,45 m Höhe
- Fünfeck und Sechseck unter diesen Mindestmaßen auf kleinste Hüllfläche optimiert (vorher frei gewählt)
- U-Wert 0,49 W/m²K plus **40 %** Wärmebrücken (ca. 20 m Fugen), Lüftung 0,6 W/K
- Körper **65 W** sensibel (90 W gesamt, der Rest geht als Feuchte)
- Hülle **6,5 kg/m²** (mit Randprofilen, Einsätzen für Beschläge, Kleber), gebogen +10 %
- Kippwind: leer 60 kg, Stützfüße 0,74 m auseinander, cw 1,2

## Ergebnis

| Form | H außen | Hülle m² | Hülle kg | +K innen | Volumen m³ | Dach | Platten | Kippt leer ab (Mittelwind) |
|---|---|---|---|---|---|---|---|---|
| Rechteck | 1,07 | 6,40 | 41,6 | 13,1 | 0,91 | flach | 4 eben | 15,5 m/s |
| **Fünfeck, optimiert** | 1,07 | **5,59** | **36,4** | **14,7** | 0,75 | 33° | 5 eben | 15,5 m/s |
| A-Frame | 1,40 | 6,42 | 41,7 | 13,0 | 0,74 | 69° | 3 eben | 11,9 m/s |
| Tonne | 1,07 | 5,68 | 40,6 | 14,5 | 0,80 | rund | 3 + Bogen | 15,5 m/s |
| **Sechseck, optimiert** | 1,07 | 6,02 | 39,1 | 13,8 | **0,87** | 45°, oben 0,4 m flach | 6 eben | 15,5 m/s |
| Tropfen (grob) | 1,07 | 5,48 | 39,2 | 14,9 | 0,74 | rund | 3 + Bogen | 16,8 m/s |

## Bewertung
Die Unterschiede bei der Wärme (unter 1 K) liegen innerhalb der Modellunsicherheit. Eine Punktwertung würde hier eine Genauigkeit vortäuschen, die es nicht gibt. Darum gibt es nur Ausschlüsse und eine Vorauswahl:

- **Raus:** A-Frame (1,4 m hoch, kippt am frühesten, wenig Kopfraum), Rechteck (Schnee bleibt liegen, schwerste Hülle), Tonne und Tropfen (Bogen nicht mit Handwerkzeug aus PIR-Platten zu bauen, schwerer als das Fünfeck).
- **In Stufe 2:** **Fünfeck** (leichteste ebene Hülle, Dach durchgehend geneigt) und **Sechseck** (16 % mehr Raum, weniger Gefühl „Sarg“, aber 2,7 kg schwerer und oben ein flaches Stück, auf dem Schnee liegen bleibt).
- Der Kritiker merkt an: Die Gehrung am Fünfeck (ca. 57–64°) ist mit Handwerkzeug ungenauer als 45° am Sechseck. Das geht in Stufe 2 als Kriterium Fertigung ein.

## Befunde, die über die Form hinausgehen

1. **Es wird kälter als in der Grillung gesagt.** Mit den korrigierten Annahmen liegt das Plus durch Körperwärme bei ca. **14–15 K, nicht 21 K.** Bei −15 °C außen bleibt es innen bei etwa 0 °C. Das Überleben hängt damit noch mehr am Schlafsack. Undichtigkeit am Deckel ist dabei nicht eingerechnet (5 m³/h kosten weitere ca. 1,7 W/K). Darum ist die Kompressionsdichtung Pflicht.
2. **Das Gewichtsziel von 60 kg ist so nicht erreichbar.** Die Hülle allein wiegt 36–39 kg. Realistisch ist der Wagen leer bei **78–88 kg** (Kritiker, Einzelposten: Fach und Radkästen, Kurbelfüße, Bremsen, Akkukiste, Melder, Dichtungen, Scharniere). **Entschieden am 25.10.:** Ziel leer höchstens 85 kg.
3. **Winterschlafsäcke sind an den Schultern 70–80 cm weit, innen sind nur 69 cm frei.** Der Schlafsack wird an der Wand zusammengedrückt, verliert dort Dämmung, und an der kalten Wand fällt Kondensat an. **Entschieden am 25.10.:** 78 cm bleiben, im Schulterbereich Vakuumpaneel 20 mm (innen dort ca. 74 cm), schmal geschnittener Mumienschlafsack gehört zum System.
4. **Kippen und Rutschen:** Leer kippt der Wagen bei ca. 15 m/s Mittelwind. Mit Böen (Faktor 1,5) sind es schon **10–11 m/s, das entspricht Bft 5–6.** Noch früher rutscht er seitlich weg (Haltekraft bei μ = 0,5 ca. 290 N, Wind bei 15 m/s ca. 410 N), auf Eis erst recht. Folge: Gurt oder Anker an Pfosten oder Boden ist Pflicht. Ausschwenkende Stützfüße (1,2 m) helfen nur gegen Kippen.
5. **Die Sandwichbox trägt nicht.** Mit geteiltem Deckel und Notklappe ist sie eine offene Wanne. Achse, Deichsel, Auflaufbremse und Stützfüße brauchen einen eigenen Rahmen.
6. **Verjüngung zum Fußende** spart grob 3–4 % Hülle. Wird in Stufe 2 als Zusatz geprüft.

## Nächster Schritt
Stufe 2: sieben Öffnungsprinzipien auf Fünfeck und Sechseck, siehe [BEFUND_oeffnungsprinzipien_stufe2_2026-10-25.md](BEFUND_oeffnungsprinzipien_stufe2_2026-10-25.md).
