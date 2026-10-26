# Befund Stufe 3b: Origami und Faltmechanismen, gefaltet und offen, kombiniert, 26.10.2026

Auftrag (Simon, 26.10.): weitere Origami-Lösungen finden, die gefalteten Pakete zeigen, Kombinationen suchen, alles durchrechnen, Anregungen aus dem Internet holen.

- Rechnung: `rechnung/origami_varianten.py`. Für die Wärme nutzt sie den Annahmensatz „realistisch“ aus Stufe 3.
- 3D-Modell: Variante F, Auswahl „Muster“. Regler auf 0 zeigt das gefaltete Paket in Transportlage, auf 100 den offenen Zustand.

## Ergebnis zuerst

1. **Origami gehört dorthin, wo nichts dicht sein muss:** Vordach, Windwand, Vorraum.
   - Für den warmen Schlafraum bleibt das Urteil aus Stufe 2: viele Fugen, und die Falten frieren fest.
   - Damit ist der Widerspruch zu Stufe 3 aufgelöst. Dort hieß es noch „Origami als faltbare Kiste“, das ist hiermit zurückgenommen.
2. **Miura-ori ist der Gewinner.**
   - Es faltet starr, die Rechnung zeigt 0 mm Faltfehler. Feste Platten mit einfachen Scharnieren gehen also.
   - Es faltet in beide Richtungen und passt deshalb auf den Anhänger:
     - Vordach 1,95 × 1,55 m wird ein Paket von 0,11 × 0,76 × 0,20 m und wiegt 9 kg.
     - Windwand 1,55 × 1,14 m aus PIR 25 wird ein Paket von 0,23 × 0,62 × 0,21 m und wiegt 10 kg.
3. **Yoshimura-Tonne als Vorraum geht nur mit Firstgelenk.**
   - Das alte Modell F mit 1,8 m Breite passte gefaltet nicht auf den Anhänger: Das Paket war 1,8 m breit.
   - Mit 1,56 m Breite und einem Gelenk am First werden daraus zwei Pakete von zusammen 0,78 × 1,5 × 0,46 m. Sie stehen beim Fahren vor der Stirnklappe, der Anhänger wird dadurch 0,46 m länger.
   - Der Faltfehler beträgt 15 mm, die Platten falten also **nicht ganz starr**. Die Gelenke brauchen Spalt oder elastische Bänder.
   - Gewicht 56 kg, Fugen 106 m.
   - Als Wohnraum bringt die Tonne nur +3 K. Die Kiste steht davor und nicht darin, deshalb addiert sich nichts.
4. **Fächerdach für die Jurte aus festen Platten geht nicht.**
   - Der Faltfehler ist 107 mm. Die Platten müssten sich verziehen.
   - Möglich bleibt es nur mit biegsamen Platten, etwa Hohlkammer-PP 4 mm, oder mit Stoff.
   - Wärmer wird es dadurch nicht: +2,1 K gegenüber +2,4 K mit Vlies 100 mm.
5. **Simons Deckel-Idee für die Kiste (26.10.):**
   - Die Seitenwand zur Wohnseite gehört zum Deckel. Das Scharnier sitzt an der anderen Traufe, und der Deckel öffnet wie ein Koffer. Die Bettkante ist dann frei.
   - Im 3D-Modell ist das in A, B, E und F umgesetzt.
   - Kosten:
     - Der Deckel ist kein Vordach mehr. Den Schatten (Entscheidung 21) liefert dann das Miura-Vordach.
     - Der Deckel wird schwerer, weil die Wand dazukommt, und der Hebel zum Gelenk wird länger. Er braucht deshalb Gasfedern.
     - Die Dichtfuge liegt jetzt unten an der Bettkante statt an der Traufe. Die Fugenlänge bleibt gleich.

## Muster einzeln

| Muster | offen m | gefaltet m (mit Platten) | passt auf 0,78 × 2,09 | Platten | Fugen m | kg | Faltfehler |
|---|---|---|---|---|---|---|---|
| Miura-Vordach, Stegplatte 10 mm | 1,95 × 1,55 | 0,11 × 0,76 × 0,20 | ja | 80 | 33 | 9 | 0 mm |
| Miura-Windwand, PIR 25 | 1,55 × 1,14 | 0,23 × 0,62 × 0,21 | ja | 48 | 20 | 10 | 0 mm |
| Yoshimura-Vorraum 1,8 m (altes F) | 1,8 × 1,8 × 1,5 | 1,80 × 1,50 × 0,23 | **nein** | 136 | 109 | 60 | 14 mm |
| Yoshimura-Vorraum 1,56 m mit Firstgelenk | 1,56 × 1,8 × 1,5 | 0,78 × 1,50 × 0,46 | ja | 136 | 106 | 56 | 15 mm |
| Fächerdach-Jurte Ø 2,8, PIR 25 | Ø 2,8 × 1,9 | Bündel Ø 0,5 × 1,4 | ja | 48 | 50 | 49 | 107 mm |

Nicht gerechnet, als Idee notiert:
- **Waterbomb-Röhre** als Balg des Kokons: Sie dehnt sich auch quer aus. Bei rund 40 m Fugen ist die Leckluft aber zu groß.
- **Kresling-Turm:** Laut Literatur taugt er nicht für dicke Platten.
- **Scherengitter-Bogen (Simons Entwurf 2025) mit Origami-Haut:** Das Gestell faltet sich wie eine Ziehharmonika (Hoberman-Prinzip). Die Haut aus Yoshimura-Stoff hängt darunter. Es wäre der leichteste Wohnraum mit fester Form. Er wäre als Nächstes zu rechnen, weil Simon das Gelenk schon konstruiert hat.

## Origami-Jurte (Simons Frage: „Gibt es keine Jurten-Origami-Lösung?“)

Es gibt sie. Das Fächerdach aus K3b war nur der naheliegendste und schlechteste Weg. Besser sind diese vier:

| Teil der Jurte | Faltprinzip | Gefaltet | Bewertung |
|---|---|---|---|
| **Wand (Khana)** | Scherengitter, so faltet schon die echte Jurtenwand. Es ist das Prinzip von Simons Scherengelenk (2025). | Bündel etwa 0,3 × 0,3 × 1,2 m | Bewährt und starr, also erste Wahl. Simons eigenes Gelenk passt direkt. |
| **Dach** | **Flasher-Muster** mit der Krone als Nabe. Damit falten NASA und BYU ihre Solarsegel. Feste Platten mit Folien- oder Stoffscharnieren, die Plattendicke ist eingerechnet. | Prisma um die Krone. Im BYU-Prototyp war es 9,2-mal kleiner, für Ø 2,8 m also etwa Ø 0,3 m. Die Höhe muss im Muster gerechnet werden. | Starr faltbar. Die Solarzellen können **direkt auf den Dachplatten** sitzen. Offen: Der Flasher wird flach, das Dach braucht aber Gefälle. Ein flacher Kegel muss gerechnet werden. |
| **ganze Kuppel** | Origami-Kuppel nach dem Schirmprinzip (MIT 2017, Machover, Coleman und Pantazis): aus Buchgröße 11-fach aufgefaltet, harte Schale für eine Person, Volumen gefaltet nur 2,1 % (Hoberman-Kugel 4,6 %) | Die Platten liegen flach gestapelt | Passt als **harter Kokon** über dem Bett, nicht als Wohnraum. Der Prototyp hatte nur 1 m. |
| **ganze Kuppel** | Faltkuppel aus festen Platten (Shelter Systems „Folding Dome“, Origami Dome) | flach | Es gibt sie zu kaufen. Taugt als Vorbild für Plattenmaße und Gelenke. |

**Vorschlag für eine Origami-Jurte:**
- Wand: Khana als Scherengitter mit Simons Gelenk.
- Dach: Flasher aus festen Platten um die Krone, die Hälfte davon mit Solarzellen belegt.
- Dämmung innen: Vlies-Kassetten in Kammern, mit einer Dampfsperre innen (Kritik vom 26.10.).
- Der Mast entfällt, wenn der Flasher mit der Krone auf der Khana aufliegt. Die Krone trägt sich dann wie bei der echten Jurte über das Dach selbst.

Bewertung:
- Wärme wie bei der Jurte aus Stoff: Der Wohnraum allein ist ein Puffer, etwa +2 bis +3 K.
- Neu gegenüber der Stoff-Jurte:
  - Das Dach hält Schnee und Messer stand.
  - Es trägt die Solarmodule.
  - Es lässt sich ohne Mast aufspannen.
- **Überholt durch Stufe 3c (unten):** Das Flasher-Dach ist verworfen, und der Mast bleibt als Aufstellstange für den Aufbau.

## Stufe 3c: Origami-Jurte gerechnet (26.10. abends)

Rechnung: `rechnung/origami_jurte.py`, 3D-Modell: Variante G. Anlass war Simons Auftrag: „Arbeite die verschiedensten Versionen aus, eine Origami-Jurte kann ich noch nicht sehen.“

**Dach:**
- Der **Flasher fällt weg.** Er faltet sich zu einer Ebene auf, das Dach braucht aber Gefälle gegen Schnee.
- **Gewählt ist ein Faltkegel:** 24 Trapezplatten, alle Falten zielen auf einen gedachten Scheitel. Innen- und Außenfalten wechseln sich ab. Die Platten enden 0,4 m unter dem Scheitel, darüber sitzt die Krone als lose Haube.
- Über den ganzen Faltweg wurde geprüft:
  - Faltfehler 0,00 mm
  - kein Knoten über dem Scheitel
  - Plattendicke an der Krone
- **Als geschlossener Ring passt das Dach nicht auf den Anhänger.** Dort bleibt das Bündel rund: Ø 1,50 m mit PIR 25, Ø 1,05 m mit Stegplatte. Grund: An der Krone brauchen die Platten Platz für ihre Dicke.
- **Mit offener Naht über der Tür passt es.** Das Dach faltet dann wie ein Handfächer zu einem flachen Stapel:

| Dach | Stapel m | Dach kg | Jurte kg | Jurte allein | Kiste darin | Heizung −10 °C |
|---|---|---|---|---|---|---|
| **Stegplatte 10 mm + Vlies 100 mm** | **0,28 × 0,38 × 1,21** | **25** | **61** | +2,4 K | **+18,1 K** | 25 W |
| PIR 25 | 0,69 × 0,39 × 1,21 | 35 | 70 | +2,1 K | +17,9 K | 26 W |

- Die Jurte allein hält kaum warm. Erst mit der Kiste darin wird es so warm wie mit der Stoff-Jurte (+18,2 K), und Origami bringt dabei nichts zusätzlich.
- **Gewonnen werden:** ein festes Dach gegen Schnee, Messer und Wind sowie ein Paket, das flach auf dem Deckel liegt. Dazu braucht der Anhänger keinen Platz neben dem Mast mehr und steht mittig.

**Wand (Khana):**
- 48 Alu-Rohre 16 × 1 mm, je 1,60 m lang, verbunden mit 144 Scherengelenken nach Simons Gelenk von 2025.
- 21 Rauten, offen im Winkel von 43° gekreuzt, Wandhöhe 1,1 m.
- Gewicht 14 kg, Paket 0,17 × 0,12 × 1,6 m.
- Darüber hängt eine Hülle aus Vlies 100 mm.

**Statik (überschlägig, nicht geprüft):**
- 30 cm Nassschnee bringen 5,4 kN aufs Dach.
- Der Zugring an der Traufe muss 1,5 kN halten. Ein Stahlseil mit 4 mm reicht.
- Eine Platte aus PIR 25 trägt quer zwischen zwei Falten mit 0,10 MPa Biegespannung. Reiner Schaum hält etwa 0,2–0,4 MPa aus, deshalb braucht sie eine Deckschicht.
- Steif ist das Dach nur, wenn alle Traufpunkte am Zugring festliegen und die Naht über der Tür verriegelt ist.
- Gegen Regen an den Falzen: eine durchgehende Regenhaut (1,5 kg, im Gewicht enthalten).

**Aufbau:**
1. Die Khana von der Tür aus um den Kreis aufziehen.
2. Den Dachstapel am Scheitel an die Aufstellstange mit Kurbel hängen und hochkurbeln.
3. Den Fächer aufziehen, bis sich die Naht über der Tür schließt. Dabei wandert die Traufe von 0,3 m auf 1,1 m und legt sich auf die Khana.
4. Die Stange herausnehmen.
5. Den Anhänger rückwärts hineinschieben. Die Stirnklappe zeigt dann zur Tür, davor bleiben 0,3 m frei.

**Harte Grenzen:**
- **Fährt die Jurte mit, ist die Grenze „leer höchstens 85 kg“ verletzt.** Mit Kiste sind es 142 kg.
- Die Pakete liegen auf dem Deckel. Die Transporthöhe beträgt dann 1,36 m, der Schwerpunkt liegt auf 0,75 m. Der Wagen kippt seitlich schon ab 25° statt ab 32°.
- Taugt sie als Station am Platz, gilt: Losfahren in 5 Minuten geht, weil der Anhänger rückwärts hinausrollt. **Das widerspricht aber Entscheidung 13 („nur als Fahrzeug“).** Diese Frage geht an Simon.
- Das gilt genauso für die Stoff-Jurte (Variante C, 129 kg) und wurde dort bisher nicht als Grenzverletzung ausgewiesen.

**Offen:**
- Gelenke für dicke Platten: Die Scharniere sitzen bei Bergfalten außen und bei Talfalten innen.
- Verriegelung der Naht
- Gewicht der Krone
- Kritik durch einen Maschinenbauer

Quellen:
- Flasher mit dicken Platten: [Lang: Accommodating Thickness in Origami-Based Deployable Arrays](https://langorigami.com/publication/accommodating-thickness-in-origami-based-deployable-arrays/), [NASA JPL: Solar Power, Origami-Style](https://www.jpl.nasa.gov/news/solar-power-origami-style/)
- Origami-Kuppel nach dem Schirmprinzip: [Machover, Coleman, Pantazis: Deployable, Collapsible, Rigid Origami Shelter (MIT 2017, Figshare)](https://figshare.com/articles/deployable-collapsible-rigid_1_pdf_pdf/6848444)
- Faltkuppeln: [Shelter Systems: Paper Model of Domes](https://shelter-systems.com/plans/paper-model-of-shelter-systems-domes/)
- Faltbarer Unterstand für den Katastrophenschutz: [FoldEX](https://www.tandfonline.com/doi/full/10.1080/17452007.2025.2597982)

## Kombinationen

Gemeinsame Annahmen:
- Basis 45 kg: Rahmen, Fahrwerk, Akku, Solar. Das ist eine Annahme.
- Das Miura-Vordach (9 kg) ist überall dabei.
- Wärme realistisch gerechnet. Heizbedarf für +15 °C im Kern bei −10 °C außen.

| Kern + Wohnraum | kg | Handgriffe | Temperaturplus | Heizung |
|---|---|---|---|---|
| Kiste + nur Vordach | 81 | 5 | +15,7 K | 38 W |
| **Kiste + Jurte Stoff** | **129** | 17 | **+18,2 K** | **24 W** |
| Kiste + Fächerdach-Jurte | 151 | 19 | +17,9 K | 26 W |
| Kiste + Yoshimura-Vorraum | 137 | 13 | +15,7 K | 38 W |
| Kiste + Eisfischerzelt | 96 | 9 | +15,7 K | 38 W |
| Kokon 100 mm + nur Vordach | 67 | 5 | +14,2 K | 50 W |
| Kokon 100 mm + Jurte Stoff | 115 | 17 | +16,6 K | 33 W |
| Kokon 60 mm + Jurte Stoff | 113 | 17 | +13,1 K | 59 W |

Was sich gut kombinieren lässt:
- **Kiste mit Koffer-Deckel, Miura-Vordach und Miura-Windwand:**
  - Das ergibt eine Sitzecke an der Bettkante mit Dach und Windschutz. Alles bleibt flach am Anhänger, 19 kg Zusatz, 5 Handgriffe.
  - Das ist die leichteste Lösung mit Tagesplatz.
- **Dazu die Jurte aus Stoff, wenn ein echter Wohnraum gebraucht wird:**
  - Mit der Kiste darin erreicht sie die beste Wärme (+18 K, 24 W Heizung).
  - Sie wiegt aber 129 kg. Ob das Fahrrad das ziehen darf, ist ungeprüft.
- **Nicht kombinieren:**
  - Yoshimura-Vorraum und Jurte: Beides sind Wohnräume.
  - Fächerdach: Es faltet nicht starr.

## Quellen

Faltmuster und dicke Platten:
- Misseroni et al. 2024, „Origami engineering“, Nature Reviews: [PDF Caltech](https://www.daraio.caltech.edu/publications/Misseroni_et_at_2024.pdf)
- Yoshimura mit dicken Platten: [Thick panel origami for load-bearing deployable structures](https://www.sciencedirect.com/science/article/abs/pii/S0093641322000830)
- Gekoppelte Miura-Röhren: [arXiv 2312.04048](https://arxiv.org/pdf/2312.04048)
- Kresling bei dicken Platten: [arXiv 2003.10411](https://arxiv.org/pdf/2003.10411)
- Faltbarer Unterstand aus Miura und Wasserbombe: [Curletto & Gambarotta, IASS 2016 (Academia.edu)](https://www.academia.edu/32362210/Design_of_a_composed_origami_inspired_deployable_shelter_modeling_and_technological_issues)

Unterstände:
- University of Maine, Origami-Unterstand für Obdachlose: [Good Good Good](https://www.goodgoodgood.co/articles/origami-shelters-homeless-disaster-relief)
- Notre Dame, Sandwichplatten, 70 % weniger Heizenergie als Zelt: [Origami Shelters](https://fightingfor.nd.edu/stories/origami-shelter/)

Mechanismen:
- [Hoberman-Mechanismus](https://en.wikipedia.org/wiki/Hoberman_mechanism)
- Sarrus-Polyeder: [arXiv 2308.15874](https://arxiv.org/pdf/2308.15874)

Miura-Formeln: Schenk & Guest 2013, Geometry of Miura-folded metamaterials. Die Formeln sind in der Rechnung mit Kantenlängen und Winkeln über den ganzen Faltweg geprüft.
