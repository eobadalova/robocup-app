import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardTitle, Button, Row, Col, Collapse } from "reactstrap";
import sumoring from '../assets/img/sumoring.png'
import draha1 from '../assets/img/draha-150x150.png'
import draha2 from '../assets/img/draha1-150x150.png'
import cleaner from '../assets/img/cleaner.png'


function Rules() {
  const [isOpen, setIsOpen] = useState({});
  const toggle = id => setIsOpen(prevState => ({ ...prevState, [id]: !prevState[id] }));

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card className="card-plain">
            <CardHeader>
              <CardTitle tag="h1">Pravidla soutěže Robogames</CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                <Button color="primary" onClick={() => toggle('ageCategories')} style={{ marginBottom: '1rem' }}>Věkové kategorie</Button>

                <Collapse isOpen={isOpen['ageCategories']}>
                  <p>Dle data narození (vyplňuje se v přihlášce) budou soutěžící rozděleni do následujících kategorií:</p>
                  <ul>
                    <li>Žáci: do 15 let (včetně)</li>
                    <li>Studenti a dospělí nad 15 let</li>
                  </ul>
                </Collapse>
              </div>
              <div>
                <Button color="primary" onClick={() => toggle('allowedParts')} style={{ marginBottom: '1rem' }}>Povolené díly a stavebnice</Button>
                <Collapse isOpen={isOpen['allowedParts']}>
                  <p>Kromě stavebnic LEGO v Robogames chceme co nejvíce podporovat roboty, postavené z čehokoli. Chceme motivovat všechny nadšence a studenty robotiky k účasti nezávisle na tom, jestli mají nebo nemají dostatek peněz na „oficiální“ LEGO stavebnice. Věříme, že o úspěchu na soutěži by měl rozhodovat především talent, píle a sportovní štěstí. Chápeme obavy uživatelů „oficiálních“ stavebnic, že budou oproti jiným soutěžícím v nevýhodě např. kvůli slabším motorům nebo bateriím. Mohou se však právě na naší soutěži nechat inspirovat a ke svojí oficiální stavebnici také připojit silnější („neoficiální“) komponenty.</p>
                </Collapse>
              </div>
              <div>
                <Button color="primary" onClick={() => toggle('team')} style={{ marginBottom: '1rem' }}>Soutěžní týmy</Button>
                <Collapse isOpen={isOpen['team']}>
                  <p>Ve všech soutěžích může s jedním robotem soutěžit vícečlenný tým. V případě vítězství ale tým obdrží pouze 1 hmotnou cenu.</p>
                </Collapse>
              </div>
              <div>
                <Button color="primary" onClick={() => toggle('registration')} style={{ marginBottom: '1rem' }}>Registrace a omezení</Button>
                <Collapse isOpen={isOpen['registration']}>
                  <p>Do každé disciplíny je možné se zaregistrovat s jedním robotem na tým. Při účasti týmu ve více disciplínách je možné mít jiného robota na každou disciplínu.</p>
                </Collapse>
              </div>
              <div>
                <Button color="primary" onClick={() => toggle('schedule')} style={{ marginBottom: '1rem' }}>Rozpiska soutěže</Button>
                <Collapse isOpen={isOpen['schedule']}>
                  <p>Před zahájením soutěže bude vypracován rozpis startů, který soutěžící musí dodržovat. V případě nedodržení může být soutěžící penalizován až diskvalifikací.</p>

                  <ul >
                    <li>Před zahájením soutěže bude vypracován rozpis startů, který soutěžící musí dodržovat. V případě nedodržení může být soutěžící penalizován a to až diskvalifikací.</li>
                    <li>Soutěžící musí na výzvu rozhodčího absolvovat svoji soutěž. Možné zdržení je možné pouze při opravách robotů nebo výměně baterií.</li>
                    <li>Pokud soutěžící odmítne na výzvu organizátorů soutěžit, nebude mu dovoleno svoji disciplínu absolvovat.</li>
                  </ul>
                </Collapse>
              </div>

              <div>
                <Button color="primary" onClick={() => toggle('robosumo')} style={{ marginBottom: '1rem' }}>Robosumo</Button>
                <Collapse isOpen={isOpen['robosumo']}>
                  <p>Účelem soutěže je soupeření dvou robotů, kteří se snaží vytlačit svého protivníka z hrací plochy.</p>
                  <ul>
                    <li>Časový limit: 9 minut</li>
                    <li>Maximální váha robota: 1kg</li>
                    <li>Maximální rozměry robota: půdorys max. 20×20 cm, výška neomezena</li>
                    <li>Rozměry ringu: průměr 154 cm</li>
                  </ul>

                  <b>Pravidla:</b>



                  <ol>
                    <li>Účelem soutěže je soupeření dvou robotů, kteří se snaží vytlačit své ho
                      protivníka z hrací plochy.</li>
                    <li>Roboti mohou mít neomezenou výšku, ale jejich půdorys může být maximálně
                      20 x 20 cm. Splnění tohoto pravidla bude kontrolováno vložením robota do rámu s vnitřním rozměrem 20×20 cm. Robot musí tímto rámem projít.</li>
                    <li>Robot může vážit maximálně 1 kg. Váhový limit bude kontrolován před vstupem robota do ringu, ale také po výměně baterií.</li>
                    <li>Po startu zápasu může robot svoje rozměry zvětšit, např. roztažením klamných cílů.</li>
                    <li>Robot se může po startu rozdělit na několik samostatných dílů nebo robotů.
                      Pokud ale kterýkoli díl skončí mimo ring, robot prohrává.</li>
                    <li>Robot nesmí v zápase používat žádné techniky pro změnu přilnavosti (adheze)
                      k povrchu ringu, ať už mechanické nebo chemické.</li>
                    <li>Robot nesmí znečistit plochu ringu. Nesmí vypouštět žádné látky (lepidla, oleje, odmašťovadla, kouř, mlhu..).</li>
                    <li>Robot smí soupeře pouze tlačit. Nesmí používat techniky pro destrukci, poškození nebo znehybnění soupeře, jako např. střelbu, údery kladivem, použití plamenů, elektrických výbojů, sítí nebo materiálů namotávajících se na hřídele kol atd.</li>
                    <li>Sumo ring má průměr 154 cm. Je vyroben z černě laminované dřevotřískové desky tloušťky 1 cm, podložené nožkami o výšce 4 cm. Ring má 5 cm široký bílý okraj. Startovací čáry jsou hnědé, 2 cm široké a jsou od sebe vzdáleny 20 cm – viz rozměry na Obr. 1.</li>
                    <li>Sumo ring je sestaven ze dvou polovin, takže středem plochy vede spoj, který není ideálně hladký.</li>
                    <li>Zápas trvá maximálně 9 minut čistého času a sestává z maximálně tří platných kol, takže délka jednoho kola jsou 3 minuty. Vítěz kola získává 1 bod a zápas končí v okamžiku, kdy jeden z robotů získá 2 body.</li>
                    <li>Zápas začíná tak, že jsou roboti umístěni na vyznačené značky na hrací ploše zadní stranou robota a na pokyn rozhodčího jsou soutěžícími uvedeni k činnosti. Po zapnutí se 5 sekund robot nesmí hýbat, ale je dovoleno signalizovat činnost robota například opticky nebo akusticky. Během pěti sekund po startu zápasu musí soutěžící odstoupit od hrací plochy alespoň na vzdálenost 150 cm. Pokud by se některý z robotů začal hýbat v prvních pěti sekundách od startu zápasu, může být rozhodčím penalizován, případně až diskvalifikován.</li>
                    <li>Pokud chce robot poprvé přejet na druhou polovinu soutěžního ringu, musí se oproti startovní pozici otočit alespoň o 90°.</li>
                    <li>Robot prohrává soutěžní kolo v okamžiku, kdy se některá jeho část dotkne podložky, na které je položena soutěžní plocha.</li>
                    <li>Pokud po uplynutí 3 minut ve třetím rozhodujícím kole mají oba roboti stejný počet bodů, může rozhodčí nařídit prodloužení nebo přidělit vítězný bod za větší
                      aktivitu.</li>
                    <li>Pokud jsou roboti do sebe zakleslí a/nebo jejich pohyb nenaznačuje naději na změnu po dobu delší, než 5 sekund, může rozhodčí nařídit nové kolo.</li>
                    <li>Pokud jeden robot zastaví a stojí déle, než 5 sekund, získává jeho oponent 1 bod a kolo je ukončeno.</li>
                    <li>Robot se pohybuje pouze autonomně a v průběhu soutěžního kola není dovolena jakákoli forma komunikace s robotem.</li>
                    <li>Podle počtu soutěžících jsou rozřazeni do skupin, ve kterých se soutěží stylem „každý s každým“, nebo je vytvořena pouze jedna skupina a zápasí se stejným způsobem.</li>
                    <li>Vítězem celé soutěže se stává ten, kdo získá nejvíce bodů.</li>
                  </ol>



                  <h3 >Mini sumo 10 x 10</h3>
                  <ul>
                    <li>Varianta soutěže Robosumo, jejíž pravidla jsou s touto variantou sdílena.</li>
                    <li>Průměr soutěžního ringu je 77 cm.</li>
                    <li>Maximální rozměr robota je 10 × 10 cm.</li>
                    <li>Maximální váha robota je 500g.</li>
                  </ul>


                  <img src={sumoring} alt="Sumo Ring" style={{ maxWidth: '50%', height: '400px' }}/>


          
                </Collapse>
              </div>
              <div>
                <Button color="primary" onClick={() => toggle('lineFollowing')} style={{ marginBottom: '1rem' }}>Sledování čáry</Button>
                <Collapse isOpen={isOpen['lineFollowing']}>
                  <div>
                    <p>Soutěž vyhrává robot, který nejrychleji projede dráhu, realizovanou jako černá čára na bílém podkladu. Dráha obsahuje zatáčky, pravoúhlé (ostré) rohy a křižovatky a robot ji musí projet od začátku do konce co nejpřesněji.</p>
                    <p>Základní parametry soutěže:</p>
                    <ol>
                      <li>Soutěž má na 2 varianty:
                        <ul>
                          <li>roboti s jedním senzorem čáry (dříve "LEGO")</li>
                          <li>roboti s více senzory čáry (dříve "MCU")</li>
                        </ul>
                      </li>
                      <li>Časový limit: 3 minuty</li>
                      <li>Maximální váha robota: 1 kg</li>
                      <li>Maximální rozměry robota: půdorys max. 25×25 cm, výška neomezena</li>
                      <li>Rozměry dráhy: 280×200 cm</li>
                    </ol>
                    <p>Pravidla:</p>
                    <ul>
                      <li>Dráha je vyrobena z bílé plastové folie (používané pro reklamní plachty) o rozměrech 280×200 cm. Na této folii je vyznačena trasa černou čarou šířky 15 mm. Zatáčky mají nejmenší poloměr 10 cm, nejmenší vzdálenost souběžných čar („rastr“) dráhy je 20 cm.</li>
                      <li>Robot musí čáru sledovat celou cestu od startu až do cíle.</li>
                      <li>Pokud robot čáru opustí, poté opět nalezne a nezkrátí si tím cestu, je jízda platná.</li>
                      <li>Pokud robot čáru opustí, poté opět nalezne a zkrátí si tím cestu, rozhodčí prohlásí jízdu za neplatnou.</li>
                      <li>Dokud nevyprší časový limit 3 minuty, je možné robota umístit zpět na start a začít další pokus. Výsledný čas je čas nejkratšího pokusu.</li>
                      <li>Pokud robot v časovém limitu nedojede ani jednou do cíle, zapíše rozhodčí do výsledkové listiny pouze počet kontrolních bodů, kterými robot při svém pokusu projel a také maxilmální čas pokusu.</li>
                      <li>Roboti, kteří nedojedou do cíle jsou penalizováni za každý neprojetý kontrolní bod fixní hodnotou (1 minuta) a výsledná penalizace je poté připočtena k soutěžnímu pokusu.</li>
                      <li>Robot se pohybuje pouze autonomně a za soutěžní jízdy není dovolena jakákoli forma komunikace s robotem.</li>
                      <li>Soutěžící absolvuje "ostrou" soutěžní jízdu pouze jedenkrát a opětovné pokusy nejsou dovoleny.</li>
                      <li>Pokud není v registračním formuláři uvedeno jinak, tak roboti musí soutěžní pokus provést na obou typech drah (viz níže).</li>
                      <li>Varianty:
                        <ul>
                          <li>LEGO - Robot je vybaven pouze jedním optickým sensorem</li>
                          <li>MCU - Robot může být vybaven několika sensory</li>
                        </ul>
                      </li>
                      <li>Příklady drah (nemusí být použit zobrazovaný vzor):</li>
                    </ul>

                    <img src={draha1} alt="Sumo Ring" style={{ maxWidth: '50%', height: '200px' }}/>
                    <br></br>
                    <br></br>
                    <img src={draha2} alt="Sumo Ring" style={{ maxWidth: '100%', height: '200px' }}/>
                  </div>

                </Collapse>
              </div>
              <div>
                <Button color="primary" onClick={() => toggle('cleanerRobot')} style={{ marginBottom: '1rem' }}>Robot uklízeč</Button>
                <Collapse isOpen={isOpen['cleanerRobot']}>
                  <div>
                    <p>Základní parametry soutěže:</p>
                    <ul>
                      <li>Časový limit: 3 minuty</li>
                      <li>Maximální váha robota: není omezena</li>
                      <li>Maximální rozměry robota: půdorys max. 25×25 cm, výška neomezena</li>
                      <li>Rozměry soutěžní plochy: 140×100 cm</li>
                    </ul>
                    <p>Společná pravidla</p>
                    <ul>
                      <li>Robot se pohybuje po ploše o rozměrech 140×100 cm.</li>
                      <li>Plocha je vyrobena z bílé desky Sololak, olemované černou elektrikářskou páskou o tloušťce 30 mm.</li>
                      <li>Na ploše je rozmístěno 6 kostek o rozměru Lego® Duplo.</li>
                      <li>Robot má celkem tři pokusy, každý o délce tři minuty, na to, aby dovezl maximum kostek do definované oblasti.</li>
                      <li>Oblast pro přivezení kostek je kruhová výseč o poloměru 30 cm v rohu soutěžní plochy.</li>
                      <li>Pozice, ze které robot začíná pokus je úhlopříčně od oblasti, kam má kostky přivést.</li>
                      <li>V cílové oblasti je krabice vysoká alespoň 30 cm, postavená pod úhlem 45° k hranám hrací plochy ve vzdálenosti 10 cm.</li>
                      <li>Kostky jsou umístěny náhodně a jejich poloha je pro každého soutěžícího totožná.</li>
                      <li>Robot má tři minuty na to, aby kostky posbíral a přivezl na definované místo. Pokud v tomto limitu nestihne všechny kostky sesbírat, je soutěžícímu přičtena jedna minuta k času pokusu za každou kostku, kterou nezvládl robot přivést.</li>
                      <li>Soutěžící může svůj pokus kdykoli ukončit oznámením rozhodčímu. Rozhodčí provede zaznamenání času pokusu a také počtu přivezených kostek.</li>
                      <li>Vítězí robot, jehož pokus je nejkratší.</li>
                    </ul>
                    <p>Varianty:</p>
                    <ol>
                      <li>Robot pouze přiveze kostky do definované oblasti.
                        <ul>
                          <li>Kostka je započítána v případě, že po ukončení pokusu je v definované oblasti alespoň částí svého objemu.</li>
                          <li>Kostky, které robot přiveze a poté je opět vytlačí, nejsou započítány.</li>
                        </ul>
                      </li>
                      <li>Robot kostky vhazuje do boxu.
                        <ul>
                          <li>V rohu cílové oblasti je místo krabice umístěn box, do kterého jsou kostky vhazovány.</li>
                          <li>Box má rozměry 210×210×100 mm. Zadní strana je vysoká 300 mm.</li>
                          <li>Kostka je započítána pouze v případě, že po ukončení pokusu uvnitř boxu.</li>
                        </ul>
                      </li>
                    </ol>

                    <img src={cleaner} alt="Sumo Ring" style={{ maxWidth: '50%', height: 'auto' }}/>
                  </div>

                </Collapse>
              </div>
              {/* References section */}
              <div>
                <Button color="primary" onClick={() => toggle('references')} style={{ marginBottom: '1rem' }}>Reference</Button>
                <Collapse isOpen={isOpen['references']}>
                  <ul>
                    <li><a href="http://robogames.net/rules/all-sumo.php" target="_blank" rel="noopener noreferrer">Unified Sumo Robot Rules</a></li>
                    <li><a href="http://robogames.net/rules/line-following.php" target="_blank" rel="noopener noreferrer">Line Following Rules</a></li>
                    <li><a href="http://www.ntf.or.jp/mouse/micromouse2011/ruleclassic-EN.html" target="_blank" rel="noopener noreferrer">Micromouse Japan - rules for Classic Micromouse</a></li>
                    <li><a href="http://cyberneticzoo.com/tag/maze-runner/" target="_blank" rel="noopener noreferrer">Maze Runner Archives</a></li>
                    <li><a href="http://robogames.net/rules/maze.php" target="_blank" rel="noopener noreferrer">Maze Solving / Micromouse Rules</a></li>
                  </ul>
                </Collapse>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Rules;
