# Warhammer — Reading Context (updated 2026-11-23)

## Checkpoint v0.18.4 — 26/11/2026 · Dramatis canônico e imagens por procedência

- Pedido: `Retomar trilha no ponto da leitura` e ajustes ±30s ficam em `Outras opções` do player **expandido**, sem ocupar o mini-player. `scripts/reader-foundation.js` move os mesmos nós DOM (listeners e Spotify intactos). As ações primárias continuam Pausar, Spotify, Concluir.
- Foi relido o **MOBI privado original**, somente Prelude e Capítulos 1–5, para distinguir personagens realmente apresentados daqueles listados apenas no Dramatis inicial. Foram cadastrados **9 personagens** (Lion El’Jonson, Luther, Zahariel, Nemiel, Lord Cypher, Mestre Ramiel, Irmão Amadis, Attias e Eliath) e **5 lugares** (Caliban, florestas de Caliban, Aldurukh, Câmara Circular, Northwilds), todos com `unlock` na primeira aparição segura.
- Apenas **4 imagens originais anteriores** (Zahariel, Nemiel, florestas, Aldurukh) continuam representativas. Os sete outros personagens e três lugares ficam com a indicação honesta `retratro em pesquisa` / `imagem em pesquisa`; NÃO atribuir a eles arte não validada.
- Pesquisa feita primeiro no catálogo oficial: [Warhammer Art — Descent of Angels / Neil Roberts](https://www.warhammerart.com/products/descent-of-angels). O app liga para a capa como referência editorial externa, sem reaproveitar arte protegida nem declarar que o rosto é um personagem. Fanarts sem autorização ou de época futura não foram integradas. **Não houve geração de novas imagens por IA.**
- Regra editorial permanente: **arte oficial segura e com permissão de uso → fanart creditada com permissão → reconstrução original somente se aprovada**, sempre protegendo o ponto de leitura.
- **Leitura:** Prelude e Capítulos 1–5 são os concluídos confirmados pelo leitor. Supabase mostra agora unidade 7 (Capítulo 6) com **8 minutos e encerramento**, coerente com o fechamento acidental relatado; isso **não confirma leitura integral nem libera spoilers**. Não alterar/excluir registro remoto sem instrução; a ação `Reabrir leitura` continua no app.
- Sem mudanças em playlist, sequências musicais, dados de leitura ou esquema Supabase. Cobertura e processo completos em `docs/DESCENT_VISUAL_SOURCE_AUDIT.md`.

---

## Atualização v0.18.3 — 26/11/2026 · desenho clássico e recuperação de leitura

- **Problema visto em Android:** ao abrir a PWA o leitor via o layout original e depois outra apresentação excessivamente arredondada; a causa era CSS essencial anexado ao `head` somente após a inicialização de JavaScript, somado a wrappers visuais históricos. A base e skin Warhammer agora são carregadas em `<head>` antes do corpo, com `body.hs-reader-ux` marcado desde a primeira pintura. O visual busca reproduzir o Archivum original (preto/verde, monoespaçado, aquila/skull, linhas retas e cantos quadrados), conservando a organização responsiva, controles grandes e ações legíveis.
- **Incidente real:** o leitor tocou involuntariamente em `Concluir` durante o próximo capítulo, perdendo a sessão e acesso ao botão de retomar a trilha. No Supabase, o livro VI apresentava apenas unidades internas 1–6 (Prelude e capítulos 1–5); **nenhuma unidade 7 encontrada na nuvem** em consulta somente leitura. O eventual encerramento acidental da unidade 7 pode estar somente no armazenamento local do telefone. Não mexer nos logs 1–6.
- **Correção preventiva:** `scripts/reading-recovery.js` exige confirmação de `Concluir`; `Continuar lendo` mantém a sessão. `Reabrir leitura` pode ser acionado no último histórico, no formulário pós-leitura e na home durante 48h de uma conclusão recente. Não reabre registros de capítulos anteriores se existir outro mais recente.
- **Recuperação sem perda:** salva o registro anterior por livro em `state.books[slug].pendingReopens[chapter]`, retira-o temporariamente de `done`, restabelece `state.active` pausada com cronômetro em ms. Ao confirmar a conclusão real, preserva notas antigas e libera nova sincronização. `cloudPullLogs` não reimporta automaticamente uma conclusão antiga enquanto há uma recuperação pendente. **Não há deleção/alteração de linhas remotas no Supabase** por esta sprint.
- **Spotify:** `hsRestoreChapterMusic` e ±30s agora ficam visíveis no mini-player, sem desaparecer na área avançada. Recuperação não dispara playback. Nos novos capítulos, `refreshPlayer` guarda a URI e `progress_ms` somente se o contexto corresponde à playlist do capítulo; após reabertura, toque explícito em `Retomar trilha no ponto da leitura` dá preferência à posição Spotify salva. Para sessões encerradas na versão anterior, é estimado pelo tempo do cronômetro; avisar essa limitação, permitir ±30s.
- **Qualidade pendente:** validação real no Galaxy/Android (primeira pintura sem flash; forma dos botões; não sobreposição; confirmação, log, recuperar e retomar posição real com Spotify conectado). Os testes de Node/GitHub não substituem teste do navegador.
- **Teto de spoiler:** não inferir progresso de leitura pela conclusão acidental. Até confirmação do leitor, manter **Prelude + capítulos 1–5 realmente concluídos**; próximo capítulo narrativo é o 6 (unidade interna 7). Não expor acontecimentos futuros.

---

## CHECKPOINT 25/11/2026 — v0.18.2: Spotify, visual e curadoria sem atalhos

**Teto de spoiler:** *Descent of Angels* Prelude e capítulos 1–5 concluídos (**6/25 unidades**); próxima leitura **Capítulo 6 / unidade 7**. Supabase só foi consultado, sem modificações. Dados existentes e playlists anteriores devem permanecer intactos.

**Correção crítica:** no Android v0.18.1, o Spotify exibiu `candidateUri?.split is not a function` para os capítulos 6–8. O resolvedor pode devolver uma URI string ou um objeto `{uri}`/`{id}`, e o código do Livro VI presumiu string. A v0.18.2 normaliza os formatos válidos, rejeita estruturas inválidas ANTES de criar/gravar playlist, confere o resultado pela API Spotify, e testa as duas formas. Não habilitar fallback que omite faixas silenciosamente.

**Identidade visual:** a skin bronze-heavy v0.18.1 ficou destoante da estética inicial (arquivo imperial preto e verde). Restauramos os elementos originais (aquila, skull, verde militar, texturas discretas e cards de arquivo), mantendo o layout responsivo e os botões Spotify/Leitura/Concluir. Painel de Spotify resumido por padrão; detalhes por capítulo e os quatro quadrados técnicos antigos ficam em submenus recolhidos. Não tratar mocks/CI como teste visual real no Android.

**Política musical revisada e tecnicamente imposta:**
- `data/descent-of-angels-future-scores.js` mantém a cobertura estrutural das unidades 7–25 como **rascunho de catálogo**, NÃO curadoria cinematográfica. A escolha anterior foi majoritariamente por heurísticas de duração, papel geral e penalidade de repetição; a documentação anterior exagerava o rigor da curadoria de acontecimentos.
- `data/descent-next-scene-review.js` sobrepõe **somente as unidades 7, 8 e 9** (Capítulos 6–8), após revisão dos respectivos trechos do MOBI do leitor. Publicar apenas música, roles genéricas e posições numéricas. Nenhum fato futuro, evento, personagem, lugar ou trecho de romance deve constar no repositório ou UI antes da leitura.
- Status 7–9: `SCENE_MAPPED_AUDIO_UNVERIFIED`. Trilha alinhada ao mapa de acontecimentos do texto, MAS **não foi escutada integralmente nem aprovada musicalmente**.
- Status 10–25: `PREPLANNED_FULL_AUDIO_UNVERIFIED`, sem `sceneReview.reviewed`; **bloqueadas para criação/validação de playlists** até revisão narrativa individual. Não mascarar como "prontas" na home, na seção técnica, nem no indicador de playlists.
- Os próximos três capítulos serão preparados via Spotify autenticado na PWA, com fail-closed por título, artista, duração, URI e ordem; não iniciam áudio/crônometro. Spotify metadata ≠ qualidade real da dinâmica: ainda falta audição de gravação inteira e feedback de volume.
- A partir de então, é possível revisar o livro TODO numa mesma etapa de trabalho se cada capítulo tiver análise narrativa e revisão da trilha. O que não se pode afirmar sem arquivos de áudio/escuta é aprovação total do encaixe sonoro. Nunca confundir lote de capítulos com revisão por tempo de duração.

**Gates ainda pendentes:** versão no Android, ausência de sobreposição, painel técnico compacto e colapsável, Spotify 3/3 real, logs anteriores, áudio integral e cenas mais complexas. Corrigir pelo motivo efetivo antes de prosseguir com aumento de escopo.

---

## SITUAÇÃO ATUAL — 25/11/2026 · v0.18.1

**Teto de spoiler do leitor:** *Descent of Angels* Prelude + Capítulos 1–5 concluídos (**6/25** unidades internas). Próxima leitura = Capítulo 6 (**unidade 7**). Conferido no Supabase em 25/11: 17, 22, 23, 25, 12 e 23 minutos. Nenhuma leitura posterior deve ser presumida. O conteúdo dos capítulos 6+ continua privado.

**Prioridade UX:** o visual anterior parecia excessivamente neutro/"ChatGPT". Nova skin `styles/themes/horus-heresy.css` usa inspiração em livros negros Horus Heresy, heráldica, metal, bronze, pergaminho, tipografia editorial e botões angulares — sem interferir na estrutura genérica da plataforma, que poderá servir outros livros.

**Estratégia musical agora:** o livro VI tem 25 unidades de *planejamento de faixas e papéis musicais* (`data/descent-of-angels.js` + `data/descent-of-angels-future-scores.js`); a nova tranche cobre as unidades 7–25. Esses planos foram formulados com inspeção privada do texto-base, contagem de palavras e papéis musicais genéricos; nenhuma cena, trecho ou personagem futuro foi ao GitHub público.

**Música pronta não é playlist aprovada:** 7–25 têm `PREPLANNED_FULL_AUDIO_UNVERIFIED`. As durações de catálogo são de fontes oficiais; não há validação de toda a dinâmica das gravações nem confirmação da conta Spotify brasileira. A PWA, com autorização do leitor, verifica título/artista/duração/ordem e relê a playlist; jamais inventa Spotify URI ou modifica trilha durante leitura. Os score plans são candidatos — feedback posterior autoriza ajuste editorial. As unidades 1–6 e logs históricos permanecem preservados. **Só preparar três playlists à frente; não criar o resto sem sessão autenticada.**

**Fontes públicas para metadados musicais:** [Hollow Knight OST / Christopher Larkin](https://christopherlarkin.bandcamp.com/album/hollow-knight-original-soundtrack) e [Warhammer 40,000: Darktide OST / Jesper Kyd](https://warhammermusic.bandcamp.com/album/warhammer-40000-darktide-original-soundtrack). Trilhas Darktide são *música oficial de outro período de Warhammer*; sua presença não é arte nem enredo canônico de Descent of Angels.

**A validar no Android:** cache v0.18.1, botões com a skin Warhammer, paleta do arquivo visual, capítulo 6 próximo, status das playlists 7–9, a abertura no Spotify, preservação dos registros e a acessibilidade. CI não comprova visual/device audio.

---


## Atualização confirmada — 23/11/2026

**Teto de spoiler: *Descent of Angels* até o Capítulo 3, inclusive.**
O leitor concluiu Prelude e Capítulos 1, 2 e 3: **4 de 25 unidades**.
Os índices do aplicativo/Supabase são 1=Prelude, 2=Capítulo 1,
3=Capítulo 2, 4=Capítulo 3. Registros conferidos: **17, 22, 23 e 25
minutos**. Capítulo 4 (índice 5) é a próxima leitura. Não revelar nada
do Capítulo 4 em diante, inclusive indiretas em imagens, nomes de
personagens futuros ou mapas privados de cenas.

A captura da PWA v0.17.7 mostra a janela de três playlists com **2/3
verificadas**: Capítulos 4 e 5 preparados tecnicamente, enquanto o
Capítulo 6 ainda não possui curadoria publicada. Não é erro de
sincronização nem autorização para expor acontecimentos futuros.

**Preferência nova de UX:** tela principal deve priorizar leitura,
cronômetro e acesso imediato ao Spotify. Feedback pós-leitura é
opcional, preferencialmente anotações e problemas específicos, sem
avaliações positivas automáticas. Preservar dados históricos e
o debrief detalhado para consulta.

---

## Teto de spoiler atualizado — 22/11/2026

Descent of Angels: Prelude, Capítulo 1 e Capítulo 2 concluídos e confirmados
pelo próprio leitor e pelo Supabase. A contagem técnica é 1=Prelude,
2=Capítulo 1, 3=Capítulo 2. O próximo capítulo narrativo é o 3.
Não revelar cenas, personagens, destinos, imagens ou etiquetas de trilhas
futuras. Tempos lidos: 17, 22, 23 minutos. Feedback de trilha:
Prelude particularmente bom; capítulo 2 com diferenças de volume perceptíveis.
A existência de playlists preparadas não aumenta o limite de spoilers.

Os parágrafos históricos abaixo são anteriores a esta atualização e não
podem prevalecer sobre ela.
---



**Spoiler ceiling: Fulgrim, Chapter XXV (BOOK V COMPLETED).**
**Next book: Descent of Angels (VI) — NOT STARTED.**
Never disclose Book VI plot, later character identities, outcomes, transformations, spoilers via fanart or track titles.

Completed reading sequence:
I — Horus Rising
II — False Gods
III — Galaxy in Flames (recorded rating 4.5/5)
IV — The Flight of the Eisenstein
V — Fulgrim (25 chapters, final rating **3/5 Dreadnoughts**).
Do not invent ratings for the other books.

Reader feedback carried forward:
- Soundtrack must track atmosphere, conversations, tension, action, consequences and scene transitions WITHOUT requiring any taps while reading.
- Valid Fulgrim time logs: 23 sessions; XVI and XXII are invalid 1-minute timers. Last book soundtrack often fitted elapsed time without fitting emotional intensity; no more arbitrary stopwatch-based cue cuts.
- Official era-safe 2D art first; then credited fanart; retain existing AI only as honest temporary fallback. Never substitute a blank for a working illustration.
- Canonical text first, community speculation separately; when a reading interpretation is not supported by the actual book, say so without spoiling later developments.

Book VI source MOBI is available privately for authoring. It has four parts, a Prelude, 23 numbered chapters and an Aftermath; no chapter from it has yet been cleared for discussion.
The old historical snapshot following this separator is superseded where dates or spoiler limits conflict.


---

## Historical Book IV snapshot — October 2026 (superseded)

Last updated: 2026-10-23
Spoiler ceiling: **The Flight of the Eisenstein — complete (including Chapter XVII epilogue)**
Next safe chapter: **Fulgrim — Chapter I (not yet started)**

## Reading order and current position
- Reading the Horus Heresy in English, publication order, without skipping the main sequence.
- Completed:
  - I — Horus Rising
  - II — False Gods
  - III — Galaxy in Flames — 4.5/5
- Current:
  - IV — The Flight of the Eisenstein
  - Parts One and Two complete.
  - Part Three in progress.
  - Chapter XV complete; Chapter XVI is the final chapter.
- Never expose Chapter XVI events, character fates, images, labels, or consequences before the reader reports completing it.

## Reader preferences
- Avoid spoilers aggressively, including meta-spoilers from status labels, image choices, track names, file names, or future-character presence.
- Prefer canonical sources first, then clearly separated community interpretation.
- Discuss narrative craft, themes, legion culture, dialogue, military logic and character psychology in depth.
- Correct mistaken interpretations when needed rather than agreeing automatically.
- Keep future connections sealed even when they are common 40k knowledge.
- Images must be safe for the current book/chapter clearance.

## Current thematic interests
- Great Crusade idealism and camaraderie versus the collapse into the Heresy.
- The contradiction between the Imperial Truth and the reality of Chaos.
- Faith emerging before the later institutional Imperial Creed.
- Brotherhood, father/son dynamics and the question of what Astartes are for in a future without war.
- Garro as a loyalist whose idea of loyalty is shifting from Legion/Primarch hierarchy toward Emperor, conscience and faith.
- Difference between ideological corruption and visible supernatural corruption.
- Interest in legion cultures and how individuals differ inside the same Legion.

## Flight of the Eisenstein — safe state through Chapter XV

### Part One
- Nathaniel Garro is Battle-Captain of the Death Guard 7th Company and a Terran veteran from the Legion's Dusk Raiders tradition.
- Mortarion's Death Guard culture emphasizes endurance, hierarchy, austerity and Barbaran identity.
- Calas Typhon is First Captain; Ignatius Grulgor commands the 2nd Company.
- Garro's circle includes Meric Voyen, Solun Decius, Andus Hakur, Pyr Rahl, Tollen Sendek and housecarl Kaleb Arin.
- Amendera Kendel introduces the Sisters of Silence and the nature of psychic blanks.
- The Jorgall and Warsinger encounters establish the book's alien/psychic horror.
- Pyr Rahl dies during the Warsinger battle.
- Garro loses a leg and experiences a liminal near-death moment associated with the words "the Emperor protects."
- Kaleb's faith grows and begins influencing Garro.
- Warrior lodges are present within the Death Guard, but lodge membership is not treated as automatic proof of betrayal.

### Part Two
- Garro remains aboard the Eisenstein during the Isstvan III betrayal.
- Life-Eater virus weapons are revealed aboard the ship.
- Saul Tarvitz reaches Garro and the loyalists.
- Kaleb sacrifices himself during the internal battle for the Eisenstein.
- Grulgor and his men are lost to space; before their later reappearance, the app must label this only as LOST rather than "presumed dead."
- The survivors consciously choose to rebel against the traitor chain of command and escape.
- Isstvan III is seen from several viewpoints, including Ullis Temeter and Huron-Fal.
- Garro's faith becomes increasingly conscious.
- Iacton Qruze, Euphrati Keeler, Kyril Sindermann and Mersadie Oliton reach the Eisenstein.
- The Eisenstein flees Isstvan under attack from the Terminus Est.
- The Warp/Geller-field crisis makes Chaos corruption physically undeniable.
- Grulgor returns in a Nurgle-corrupted form; by this point his status may safely change from LOST to CORRUPTED.
- Solun Decius is wounded by the corrupted enemy.
- The Eisenstein escapes the Warp, becomes stranded, and uses an overloaded Warp engine as a beacon.
- Rogal Dorn and the Imperial Fists arrive aboard the Phalanx.
- The end of Part Two provides relief after the long escape.

### Part Three through Chapter XV
- Dorn initially responds to Garro's accusation against Horus with furious disbelief.
- Mersadie Oliton's mnemonic recordings provide decisive evidence.
- Dorn reorganizes his forces after accepting the betrayal.
- The badly damaged Eisenstein is destroyed after the survivors transfer away; its narrative mission is complete.
- Garro and the survivors finally return to the Sol System, creating a strong "coming home" feeling after the earlier books' distance from Terra.
- Despite reaching home, Dorn keeps the Death Guard survivors detained while the situation is resolved.
- They are taken to Luna and held in the Somnus Citadel, headquarters of the Sisters of Silence.
- Euphrati Keeler is now physically close to the Sisters of Silence, raising a reader question about how blanks will react to a phenomenon that does not fit the normal psyker/Warp framework.
- Solun Decius's condition deteriorates severely by the end of Chapter XV; he is beginning to give in.
- Reader interpretation: Decius's fall can feel opportunistically timed, but it may also be read as Nurgle allowing the suffering/decay to continue until he reaches the desired breaking point. Do not confirm or deny future consequences before Chapter XVI.

## Character status through Chapter XV
- Nathaniel Garro — active.
- Meric Voyen — active.
- Solun Decius — active but critically afflicted/corrupted condition; do not reveal Chapter XVI outcome.
- Andus Hakur — active unless current text says otherwise.
- Tollen Sendek — active; reader especially likes his analytical/intellectual side as an Astartes.
- Amendera Kendel — active.
- Euphrati Keeler — active.
- Iacton Qruze — active.
- Kyril Sindermann — active.
- Mersadie Oliton — active.
- Rogal Dorn — active.
- Kaleb Arin — deceased.
- Pyr Rahl — deceased.
- Ullis Temeter — deceased.
- Huron-Fal — deceased.
- Tirin Maas — deceased.
- Ignatius Grulgor — corrupted as revealed in Chapter XI.

## Open reader questions
- What exactly Garro's dream means, and how closely it relates to the book-cover imagery.
- How Keeler's faith/phenomenon interacts with the Sisters of Silence and their blank nature.
- What Decius's final condition means.
- What Garro's changing definition of duty, faith and loyalty becomes after delivering the warning.
- How the book closes the Eisenstein survivors' role now that the warning has reached the Imperium.

## Spoiler-protection rule for future maintenance
When adding a status, image, compendium entry, soundtrack cue or label:
1. Ask what the reader knows at the current chapter.
2. Do not encode future knowledge indirectly.
3. Prefer neutral labels such as ACTIVE, LOST, UNKNOWN or REDACTED until the text itself reveals more.
4. Never use later-era official art if the visual transformation itself reveals a future fate.


## Book IV completion — 2026-10-23
- The Flight of the Eisenstein completed, including a short chapter XVII / epilogue (corrects earlier count of 16).
- Reader rating: 3/5 'robôs gigantes'. Main criticism: first third retreads already-known Isstvan material, ship-flight section felt short for the title, climax cinematic but dialogue and battles less compelling than Horus Rising and Galaxy in Flames respectively.
- Climax: Garro faces Decius as Lord of the Flies on Luna, turns to faith and experiences a perceived voice of the Emperor.
- Tollen Sendek dies; reader considered the death abrupt and underdeveloped for an interesting analytical character.
- No Fulgrim plot clearance yet. Transition reading discussion to a new Book V conversation.
