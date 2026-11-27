# Heresy Score — v0.18.4 · Dramatis ampliado e fontes verificadas

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


## Fundação v0.18.0 — UX, imagens reais no aplicativo e base extensível (24/11/2026)

**Objetivo:** eliminar sobreposição de botões, recuperar imagens nas seções e preparar o app para livros fora de Warhammer sem reescrever a lógica de leitura.

- Shell de leitura mobile: ação principal e Spotify empilhados em telas estreitas; player Pausar / Spotify / Concluir com três colunas mínimas; demais controles em menu avançado. Botões DOM movidos, não clonados: Spotify/timer/log mantêm os eventos antigos.
- Design tokens e CSS próprio em `styles/reader-foundation.css`, carregado por último por `scripts/reader-foundation.js`. Isso introduz uma base substitutiva para a sobreposição incremental de patches anteriores; wrappers legados ainda aguardam migração gradual.
- `data/visual-registry.js` define o contrato de arte por `slug`, `unlock`, proveniência e tema; `scripts/visual-archive-ui.js` usa o mesmo registro para prévia na home, Dramatis Personae independente e arquivo independente de lugares. Outros livros podem registrar sua própria pele e seus próprios dados; o core é genérico.
- Primeira arte local e **original ilustrativa, não canônica**: 4 ilustrações em `assets/visuals/caliban-first-archive.webp (principal) e assets/visuals/caliban-first-archive.svg (reserva offline)` (Zahariel, Nemiel, Florestas de Caliban, Aldurukh). Os quatro registros derivam apenas de dados conhecidos até Descent of Angels Capítulo 3, todos etiquetados como reconstruções.
- O slideshow / galeria não substitui **Dramatis Personae** nem **Universo**: as duas abas continuam com busca, modais e detalhes desbloqueados por capítulo.
- Não altera `state.done`, logs Supabase, playlists, scores nem pastas do Spotify. *Descent*: 4/25 e próximo Capítulo 4.
- Gate do dispositivo: conferir em Android 320–430 px layout, 4 ilustrações offline, modais, busca, progressão e link de Spotify. CI não substitui essa conferência.
- Leia `docs/PRODUCT_ARCHITECTURE_V1.md` para fronteiras e plano de migração modular futura.

## Checkpoint atual — 22/11/2026 — release 0.17.7

O leitor confirmou a conclusão de Prelude + Capítulos 1 e 2 de Descent of Angels.
No armazenamento Supabase, são as unidades técnicas 1, 2 e 3, com tempos
registrados de 17, 22 e 23 minutos; nenhuma leitura posterior foi confirmada.
O Prelude recebeu comentário especialmente positivo. No Capítulo 2, o leitor
registrou volume desigual entre músicas e picos altos após aumentar o volume.

Próximas três unidades para preparar sem iniciar leitura nem reprodução:
Capítulo 3 (unidade 4), Capítulo 4 (unidade 5), Capítulo 5 (unidade 6).
As trilhas piloto desses capítulos foram mapeadas privadamente com o MOBI real,
e o código público contém apenas títulos de OST, durações de referência,
funções musicais genéricas e posições numéricas sem detalhes narrativos.
Nenhum personagem, cena futura ou texto original é publicado.

Referências de catálogo / metas estimadas:
- Capítulo 3: 9 cues, 24:39 / alvo aproximado 25:09.
- Capítulo 4: 6 cues, 11:47 / alvo aproximado 11:39.
- Capítulo 5: 8 cues, 25:16 / alvo aproximado 25:40.

A duração da gravação e a playlist só podem ser confirmadas na sessão Spotify
autenticada pelo app no celular, depois de reconsulta da API. A curadoria
de dinâmica integral permanece PILOT_FULL_AUDIO_UNVERIFIED. A confirmação
técnica de uma playlist não significa que as mudanças de intensidade sejam boas.

A versão 0.17.7 ajusta o motor e os testes para preparar essas três unidades
automaticamente na PWA, mantendo verificações prévias e histórico.
Os próximos capítulos 6–23 e Aftermath continuam sem trilha publicada.

Fontes musicais públicas:
- Elden Ring OST: https://musicbrainz.org/release/5039f414-4ada-4921-96af-b9783921dbd0
- Hollow Knight OST oficial do compositor: https://christopherlarkin.bandcamp.com/album/hollow-knight-original-soundtrack

**Limite de spoilers:** Descent of Angels Capítulo 2 concluído; Capítulo 3
e posteriores seguem fechados. Não deduzir progresso pelo pré-carregamento.

---



Progress: Fulgrim (V) completed, 25/25 chapters, reader score 3/5 Dreadnoughts.
Next: Descent of Angels (VI) **NOT STARTED**. Strict Book VI spoiler protocol.

## Delivered in this code release
- Book VI selectable in the library, with stable units: Prelude, Chapters 1–23, Aftermath (25 total), all initially unread.
- Existing IV/V logs and per-book Spotify runtime results isolated by book during switching (state v4). Verified in mocks. Supabase Fulgrim 25-row digest unchanged.
- Backup export and non-destructive restore (preview, explicit confirmation, import missing only), without credentials.
- Dramatis Personae: search within unlocked names, filter by known group, known relationships in dossiers; sealed cards hidden. Ships/locations now also searchable with sealed records excluded. Book VI characters and places not yet published.
- Readability pass: larger text, 44px tap targets, compact screens, gothic style retained.
- Narrative-score contract for scene roles/required cues now checks the first three Book VI preflight pilots; technical validation does not certify whole-recording dynamics or emotional fit.
- Spotify pagination max 50 items, atomic PWA install for essential files, central version/diagnostics and CI regression workflow.
- **Prelude pilot:** six spoiler-safe instrumental tracks with exact Spotify IDs, public-time estimate **16:38**, calibrated reading target **16:26**. The app validates artist/title/URI/duration and rereads the user's Spotify playlist before displaying **SPOTIFY OK**. Listening and transition quality remain **editorially unverified**.
- First three Book VI units have unlistened music pilots; units 4–25 remain without scores and future character/place content remains sealed.
- Spotify folders: no Web API support for creating/moving folders. Settings now guide creating folders on mobile/desktop and can safely link an owned **EMPTY playlist** already created inside a folder; auto-created playlists remain non-public and can be moved manually.

## Full recording QA: no fake musical approval

The Spotify API checks track identity, runtime and playlist order; it does
not provide raw full-length audio to this app. Spotify forbids feeding its
content into AI models. Because a calm OST intro can become loud mid-song,
the 6-track Book VI Prelude remains **PILOT_FULL_AUDIO_UNVERIFIED**, not
musically approved.

- New `tools/audio-qa/analyze_audio.py` profiles an independently authorized
  full recording from beginning to end, flagging volume swells, brightness
  changes, onset/activity, and late peaks. It never downloads or captures Spotify.
- `tools/audio-qa/analyze_library.py` scans one legal local folder in batch,
  privately, without uploading music or requiring the reader to upload each
  recording separately.
- `scripts/music-quality-gate.js` tracks structural analysis, full listening,
  and editorial approval as separate states (currently 0/6 for Prelude).
- `scripts/editorial-score-engine.js` can reject a profiled candidate that
  abruptly becomes loud when its scene requires quiet atmosphere or dialogue.
  This profile-aware gate is optional until independently authorized full
  recordings have been obtained and scanned; it is not a substitute for listening.
- **Spotify playlist creation is automatic by default**. Manual playlist link
  entry is relegated to an optional Advanced section. Spotify folders cannot
  be manipulated through the official Web API.

See [full audio QA / source rights and limitations](docs/MUSIC_FULL_AUDIO_QA.md).

## Book VI: three units prepared ahead

Book VI *Descent of Angels* remains unread (0/25); no future novel plot is disclosed.
The first three MUSIC PILOTS are now authored and catalogued using the
reader-supplied private MOBI and source-supported album metadata:

| Source unit | Internal index | Words approx. | Reading target | Public-duration pilot | Difference |
|---|---:|---:|---:|---:|---:|
| Prelude | 1 | 3,238 | 16:26 | 16:38, 6 cues | +12 sec |
| Chapter 1 | 2 | 4,365 | 22:09 | 21:58, 8 cues | -11 sec |
| Chapter 2 | 3 | 4,498 | 22:50 | 22:52, 8 cues | +2 sec |

Those durations are **album references**, not yet authenticated Spotify
readback and not full-song emotional approval. The first 3 units are
**PILOT_FULL_AUDIO_UNVERIFIED**. Source metadata contains only title,
composer, generic musical role and numeric transition anchors; the original
novel and private narrative maps stay outside the public repository.

### Hands-free Spotify preflight

`scripts/bookvi-read-ahead.js` keeps a visible **3-unit window** from the
current unread chapter. When the reader opens Book VI in a visible browser
with Spotify connected, it automatically prepares (or reuses) the next
three non-public per-unit playlists, strictly verifying recording title,
composer, whole-track duration, URI sequence and readback. It does not
start playback or a reading timer and will not repeat previously confirmed
preflights unnecessarily. Any error is visibly marked **PENDING**, not
falsely ready.

After a unit is completed the window advances. If the third future unit has
not yet been curated, the app reports the editorial gap instead of
inventing a score. A daily conditional review at 18:00 America/Sao_Paulo
has also been configured in this project to monitor and replenish future
curation when suitable materials and checks are available. This scheduled
editorial check cannot authenticate the user's Spotify app on its own.

Current prerequisite for *actual* playlist creation: the reader must open
the updated app in the Book VI library while connected to Spotify.
No account changes or existing Fulgrim logs were made from the code editor.

### CI failure triage

The recent email storm comes from rapid GitHub push commits and stale
test expectations: old tests expected Book VI to have only Prelude score
and previously expected the earlier editorial-status string. Tests now
require precisely the first three scored units and all later units sealed;
mock API tests cover those three, exact duration, distinct playlist IDs and
no duplicate writes. Runtime commit `ba07b3b7` has verified GREEN CI run `44848542392` and successful Pages deploy `44848542524` (20/11/2026 local); recheck after future pushes. Avoid declaring intermediate commits
successful releases.

## Scope not yet done
- Listen to and approve the Prelude's full recordings and emotional transitions; confirm authenticated Spotify readback on the reader's device.
- Replace external image hotlinks/old AI art with actually renderable, rights-safe original images.
- GitHub runtime CI and Pages are green; Android device UI, live Spotify authorization, cloud roundtrip and visual regression remain unverified. An actual failed CI run at commit 0e75ab3 was caused by an outdated test expectation for the improved Spotify HTTP 403 message; this assertion was fixed. Green status of runtime commit `ba07b3b7` has since been confirmed.
- Modularize legacy IV/V wrappers and add safe cloud merge conflict resolution.

[Prelude pilot and folders](docs/BOOKVI_PRELUDE_PILOT_2026-11-20.md) · [Implementation ledger](docs/BOOK_VI_IMPLEMENTATION_2026-11-20.md) · [Full audit](docs/APP_AUDIT_2026-11-20.md) · [Spoiler ceiling](docs/READING_CONTEXT.md)

Historical Spotify notes below are retained for regression context.

## Spotify audit reliability repair — 2026-11-16

The older "Auditar duração Spotify" button could appear inert because errors vanished in a one-second toast. The runtime also could ONLY shorten tracks, and an earlier caching shortcut could mistake a fitted playlist for the original score.

- **Auditing always leaves a persistent result in the current chapter card or the dedicated Settings panel.** Shows each stage (connecting, resolving, fitting, writing, verifying), exact confirmed duration/target, or the reason for failure.
- **Short AND long** playlists now use a chapter-specific editorial plan. Protected scene cues are never discarded. The algorithm may remove only editorially optional tracks and insert only preapproved ambient/action/tension bridge cues at selected boundaries. This is not arbitrary duplication, time stretching, or continuous playback trimming.
- **Spotify API verification is compulsory:** resolve exact recordings, write playlist if needed, re-read URI sequence and durations. Never mark corrected before read-back; do not blindly reuse an earlier fitted list as canonical.
- Spotify API errors surface HTTP statuses, expired authorization, insufficient scopes/ownership, network failures and timeouts. A failure without a safe combination does not rewrite the playlist.
- Typical tolerance for exact whole-song fitting: 45 seconds under or 60 seconds over. If no safe full-recording combination meets this, the app explicitly reports **not corrected**, since Spotify playlists do not trim songs to exact seconds.
- Pace targets use valid completed chapter reading times and source-backed word counts; suspicious one-minute chapter XVI entry is excluded.
- No in-reading correction buttons are required; the normal Begin Chapter flow performs the same fitting. The manual audit is a preflight check.
- Automated offline fake-Spotify scenarios cover adding a curated cue, removing an optional cue, idempotent repeat audits, no safe fit, and 403 write denial. Run locally with `node tests/spotify-bidirectional-fit.js` and `node tests/spotify-runtime-reconciliation.js`.
- **Not yet verified:** live authenticated Spotify readback on the user's Android device or published PWA deployment. A GitHub commit alone is NOT proof that Spotify playlist contents changed.

## Artwork backlog

Official character-specific 2D art > era-safe credited fanart > existing AI portrait explicitly identified as temporary. External image hotlinks remain unreliable and many places/people still lack genuine illustrations. Do not label the gallery complete until images are rendered on-device.

## Historical project notes (may contain older progress estimates)

## P2 reliability and feedback (v0.11.6)

- Post-reading form now accepts optional **Ending**, **Atmosphere** and **Transitions** evaluations; fields are mirrored as JSON log payload with no Supabase schema migration.
- PWA prevents late cloud operations from mixing books after IV ↔ V changes.
- Spotify creates a **separate private playlist per book/chapter** when first prepared, leaving prior legacy playlists intact.
- Avoids duplicate chapter starts while a Spotify score is being prepared.
- Cogitator Settings supports **Export all books backup** (no credentials) and **Run local diagnostics** (sanitized report).
- QA status: JavaScript and simulated race tests passed; user-device Spotify, Supabase round-trip and offline tests remain in [P2 QA checklist](docs/P2_QA_CHECKLIST.md).

## Main features

- PWA installable on mobile.
- Spotify PKCE connection with automatic private chapter playlist sync.
- Spotify playback-device state detection, with the reading timer held at 00:00 when Spotify has no active device.
- In-app reading session controls:
  - Play / Resume
  - Pause session
  - Previous / Next track
  - protected Final Cue jump
- Reading timer pauses together with the Spotify session.
- Scene-first soundtrack curation: emotional/scene function is prioritized before total playlist duration.
- Pace-aware chapter targeting uses the reader's ~1.5 min/page baseline plus recent actual chapter times; duration is calibrated per chapter rather than with a global buffer.
- The app now measures the real Spotify runtime after track resolution and can trim or add only chapter-curated cues to stay near the intended duration.
- Leitmotif layer tracks recurring musical identities without forcing the same cue into every appearance.
- Expanded composer palette can pull from additional official Warhammer soundtracks when a scene needs a different emotional color.
- Chapter-specific score metadata supports:
  - curated target duration
  - optional reserve tracks only where the chapter structure allows them
  - protected final cue
  - READY / STAGED / SEALED states
- Field Logs with:
  - reading time
  - duration / opening / peak feedback
  - notes
  - per-track Fits / Doesn't Fit marks
  - Copy Debrief
  - local/cloud sync state
- Compact chapter reading window plus full archive toggle.
- Book archive view.
- Spoiler-gated Dramatis Personae.
- Progressive spoiler-safe character summaries that expand only when the relevant chapter clearance is reached.
- Progressive ACTIVE / DECEASED status tracking based only on the current reading clearance.
- Broken/unreliable external character visuals fall back to an intentional REDACTED record instead of a broken image.
- Voidcraft, Theatre & Entity Compendium with clearance-gated records and explicit Official / Reconstruction / REDACTED labeling.ED provenance.
- Private Archive Recovery Code for restoring the same cloud log identity after reinstalling or moving devices.
- Safe character visuals when a period-appropriate source is available.
- Imperial-style REDACTED dossiers when a safe visual is not available.
- Dedicated adaptive-safe PWA icon generated from the repository Aquila asset.

## Spotify

Spotify uses Authorization Code with PKCE. The public Client ID is configured in the app; no Client Secret is stored in the frontend.

The app maintains one private active playlist and replaces its contents with the score for the current chapter rather than creating a new playlist for every chapter.

## Cloud logs

Cloud sync is active. A reproducible Supabase schema is included at:

`supabase/schema.sql`

The frontend already supports:
- pushing individual chapter logs,
- mirroring all local logs,
- pulling logs back to a device,
- per-install sync tokens,
- local-first fallback.

The Supabase backend is provisioned in São Paulo (`sa-east-1`), the schema is applied, RLS is enabled, and the PWA is preconfigured with the project URL and publishable key. Existing local logs are mirrored automatically on app load unless cloud sync was explicitly disabled. The archive recovery code can be copied to another installation to recover the same log identity.

## Repository layout

```text
assets/
  ui/
    symbols/
    animated/
    numerals/
    icons/
scripts/
  build_app_icons.py
supabase/
  schema.sql
.github/
  workflows/
    build-app-icons.yml
index.html
manifest.webmanifest
sw.js
```

## Versioning / maintenance

UI, soundtrack logic, reading-state behavior and integrations are tracked in `CHANGELOG.md`.

Service-worker cache versions are bumped whenever the installed PWA must receive a new shell/assets revision.

## Attribution

This is an unofficial personal reading tool. Warhammer, The Horus Heresy and related marks/characters are property of Games Workshop. Some spoiler-safe official visual references may be displayed for personal archival/reference use. The interface and application code are custom.


## Persistent project context
- `docs/READING_CONTEXT.md` — spoiler-safe reading state, themes, character status and open questions.
- `docs/HERESY_SCORE_CONTEXT.md` — soundtrack methodology, reader calibration, app architecture, known debt and next-book refactor plan.

## Book IV epilogue and portrait work
- Chapter XVII has an epilogue score and a separate option to mark prior completion without fabricating reading minutes.
- Compendium now distinguishes existing image provenance from missing original portraits, using a consistent branded placeholder.
- See `docs/BOOK_IV_V_TRANSITION_SPEC.md` for transition requirements and portrait audit. Fulgrim is not yet enabled.

## v0.11.3 book archives
- Book IV data extracted and preserved under `state.books["flight-of-the-eisenstein"]`.
- Book V selector is available through Book Archives. Fulgrim scores/content remain sealed pending curation.
- Local state migration v3 preserves legacy `heresy-score-v01` storage and independent chapter logs by book.
- Cloud requests now use active book slug; Spotify still uses one active playlist but no Book V tracks are provided before curation.
- This is not a validated multi-device release: test book switching, cloud recovery, app cache and player before relying on the new workflow.

## v0.11.3 local portrait import
- Personal Art Pack importer in Settings accepts the one `.hsartpack` file from the user's conversation, stores files in IndexedDB, and does not upload artwork to GitHub or Supabase.
- Per-character portrait crop studio controls horizontal/vertical focal position and zoom (card view); dossier modal displays full image.
- The original per-file importer remains available; bulk import shares its IndexedDB store.
- Private art package is intentionally not shipped in the public repository. If changing devices, import it again.
- Browser/device runtime test still needed; source files passed JavaScript syntax checks.

## Book V opening score — v0.11.3
- Fulgrim Chapter I prepared in `data/fulgrim-score.js`. This is an **initial mood-first** playlist, not a chapter-text-verified, scene-by-scene timed score. Reader runtime target 33 minutes, Spotify real track resolution still untested.
- Book switch loads a chapter I score while later chapters remain sealed. The Spotify active playlist name adapts to the current book and reuses the existing private playlist.
- No future character descriptions or scenes embedded in the public player. Device/browser, API and playlist-length verification remain pending.

## Fulgrim Chapter III — v0.11.7
- Chapter III: source-driven cue sequencing from a **private** 9-segment narrative map, total **24:20** across 9 catalog-verified tracks. Live Spotify account duration/availability remains pending.
- The next unread chapter has a **Check Spotify Runtime** button; it does not start playback, only resolves and populates its private chapter playlist. Chapters IV onward remain sealed.
- No private source text or scene maps have been added to the public repo. Cache v0120. The user's previous 17-chapter Eisenstein archive remains separate and was smoke-tested for preservation.
