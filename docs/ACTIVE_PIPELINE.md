# Heresy Score — Active Product Pipeline

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


## UX ATUAL — 23/11/2026 · v0.17.8 (sprint de usabilidade)

- Feedback do leitor no Android: tela de leitura tinha pré-auditoria Spotify e estados internos muito extensos; abrir Spotify e concluir capítulo escondidos no player; formulário de sete dimensões estimulava notas `good` por inércia.
- Camada nova `scripts/reader-ux-v3.js`, carregada por último sem mexer em lógica de Spotify, cronômetro, nuvem ou desbloqueio. Histórico preservado. PWA cache/versionamento 0.17.8.
- Tela principal simplificada: livro, progresso, capítulo selecionado, estado curto da trilha e **Começar leitura + Abrir Spotify** visíveis como ações distintas. O Spotify abre a playlist verificada do mesmo livro/unidade em clique direto, evitando pop-up assíncrono e playlist de outro capítulo.
- Preparação de próximas três trilhas e antigo painel de diagnóstico movidos para o painel de **Configurações**, em elemento recolhido. Isso não desliga a preparação em primeiro plano.
- Player compacto expõe **Pausa, Spotify e Concluir**; ações avançadas continuam disponíveis no player expandido.
- Log: anotação livre + tags opcionais de problemas (volume, duração curta/longa, música fora da cena, transição abrupta), sem nota positiva padrão. Antigas avaliações de 7 quesitos continuam disponíveis em `Avaliações detalhadas`. `Sem observações` deve salvar e fazer push neutro como `Salvar e continuar`, e `Cancelar` ao editar comentários antigos deve preservar o log.
- Campos `feedbackIssues` são armazenados no JSON de cada log, sem alterar schema do Supabase; métricas anteriores intactas e campos opcionais vazios não equivalem a "good".
- **QA pendiente no dispositivo:** testar navegação, botões Spotify, atualizar PWA offline, concluir capítulo e sincronizar um log sem comentário. CI verifica integração, modelo puro de livro/playlist, scripts e cache; não substitui experiência no Android.
- Screenshot mostra 4/25 unidades, capítulo 4 em foco e 2/3 playlists na janela atual. Não confundir três playlists preparadas com avanço de spoiler. Não publicar narrativa futura.

---

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



## SPRINT ATUAL — LIVRO VI · v0.17.6 (20/11/2026)

Estado autoritativo detalhado: `docs/HERESY_SCORE_CONTEXT.md`, seção ESTADO ATUAL. As tarefas antigas abaixo são histórico de 0.11.x e não representam o estado presente.

- [x] 25 unidades estruturadas para VI; nenhuma leitura VI registrada.
- [x] 25 registros `fulgrim` preservados; nota 3/5; isolamento IV/V/VI em testes.
- [x] Três scores piloto criados, playlist não pública com preparação automática na sessão autenticada; sem iniciar áudio/cronômetro.
- [x] Último commit runtime `ba07b3b7`: CI verde (run 44848542392), Pages verde (run 44848542524). Checar novo commit antes de declarar release verde.
- [ ] **QA real:** PWA Android + Spotify conectado, janela 3/3, durações efetivas, playlists corretas/sem duplicações; ainda não verificado.
- [ ] **QA musical:** escuta integral e correção de repetições de 3 faixas entre Capítulos 1 e 2; validar transições e dinâmica, não só tempo.
- [ ] **QA de histórico:** backups não destrutivos, troca de livro, sessão offline e sincronização real sem perder logs.
- [ ] **Melhorias seguintes:** imagens e direitos, falhas de cache, conflitos Supabase, modularização. Nunca revelar conteúdo privado futuro.

### Histórico anterior (referência apenas)
**Updated:** 2026-10-24 — v0.11.6
**Protocol:** v0.11.4
**Reader clearance:** `The Flight of the Eisenstein` completed including XVII; `Fulgrim` Chapter I completed. Nothing from Book V Chapter II+ may be exposed before reading.
**Owner:** Heresy Score / App Lab (conversation 00)

## Rule of priority
**Keep the next chapter playable and spoiler-safe before introducing large architectural or illustration changes.** Artistic quality and the protected ending outweigh maximizing playlist runtime.

## Current verified state
- `patch-v0102.js` implements opt-in narrative-only additions/removals; automatic runtime padding/trimming is gated off by default.
- Book IV logs were preserved when reader manually switched IV → V → IV; no end-to-end recovery-from-cloud test yet.
- Supabase Chapter I Fulgrim: 25 minutes logged; length = long; overall intensity/opening/peak = good; ~3.5 musical tracks remained according to reader.
- Kindle estimated Chapter II Fulgrim at 26 min. Reader baseline ~1.5 min/page, but actual chapter variation should outrank blanket rules.
- `data/fulgrim-score.js` currently contains **only Chapter I**, and `people:[]`, `archive:[]`. Chapter II not yet released.
- Existing artist reference importing and cropping are available locally; source licenses for redistribution not assumed.
- GitHub context file is newer than static Project attachments, which still mention Eisenstein XV / v0.10.7; synchronize these for correct context in later conversations.

## Now — must complete before next Fulgrim chapter session
- [x] **P0.1** Privately review Chapter II's dramatic beats with reader's current spoiler limit; if chapter content cannot be verified confidently, keep the score provisional and avoid inventing scene-specific alignment.
- [x] **P0.2** Compose a function-first cue sheet: point of view, subtext, implied acoustics (no literal effects required), energy progression, transitions and **protected final cue**.
- [ ] **P0.3** Check Spotify matching tracks and exact `duration_ms`; calibrate to Kindle ~26 minutes while treating it as a forecast, not a mathematical target. No reserve/trim unless justified by a specific scene and position before final cue.
- [ ] **P0.4** Publish Chapter II **only**, verify Chapter III+ remain sealed, and run start/pause/resume/final cue tests. Reader can begin once score and player QA are confirmed.
- [x] **P1.1** Make Book V Chapter I safe personae and theatre records available, based on what reader actually encountered. Never expose scenes, variants or statuses from later chapters. Keep image source metadata truthful.
- [ ] **P1.2** Confirm media appear with correct full-image/crop option in both card and modal. Allow absent art without hiding a safe character.

## Next — reliability sprint
- [ ] **P2.1** Verify real Spotify player synchronization, playlist length, failure fallback and manual Final Cue placement; ensure active playlist reuse doesn't overwrite the only archived cue list a future user may want to revisit without warning.
- [ ] **P2.2** Test IV → V → IV after reload and cloud pull with separate `book_slug` log keys, including local-only data and stored history.
- [ ] **P2.3** Confirm completed Book IV 17 records incl. XVII epilogue and user book rating remain recoverable; check data from Supabase for duplicates rather than silently deleting rows.
- [ ] **P2.4** Confirm PWA fresh/installed/offline loads are consistent; test on mobile and desktop. Backups should be exportable and verifiable.
- [x] **P2.5** Add distinct **ending**, **ambient space** and **transition** feedback categories; optional opportunity notes remain free text.

## Later — maintainable architecture
- [ ] **P3.1** Consolidate runtime overrides from `patch-v0102.js` into coherent book-aware modules.
- [ ] **P3.2** Remove fixed 17/20 chapter assumptions; derive progress from the active book manifest.
- [ ] **P3.3** Move every future book into isolated score/personae/theatre manifest, while retaining legacy state migrations.
- [ ] **P3.4** Introduce score quality checks for dynamic runtime, repeated music, transitions, implied spatial ambience and ending protection.
- [ ] **P3.5** Maintain full provenance and per-variant spoiler gates for portraits, ships and planets. Complete P0 portraits, then wider gallery.

## Repeatable chapter lifecycle
1. **After reader completes chapter N:** read GitHub + Supabase local/cloud logs, collect Kindle prediction vs real reading time, observed leftover/shortage, opening, peak, **ending**, sonic context and favourite/mismatched cues.
2. **Lock clearance:** update `READING_CONTEXT.md`; register newly safe personae, roles, locations, craft and status facts with chapter gates. Don't unlock future changes.
3. **Curate N+1 privately:** book text → function → POV/subtext → spatial/acoustic suggestion → transitions → protected ending → tempo/duration candidates; broaden music search beyond 40k.
4. **QA:** Spotify resolves exact recordings and durations; score contains no filler reserves, duplicate by accident, vocal distraction, or spoiler label; tests pass.
5. **Publish:** commit narrowly scoped score + Compendium data + version/cache; maintain readable change log.
6. **Read and learn:** record track-level marks when available; calibrate next cue sheet without reshuffling historical logs.

## Done criteria
- Next reader chapter appears as ready; following chapter stays sealed.
- Spotify sync resolves its intended tracks and placement of Final Cue without automatic padding.
- Existing books/logs remain unchanged and cloud operations are scoped.
- Only already-seen characters/locales shown; safe blank cards are better than spoilers.
- Docs and installed PWA versions match committed source.

## Sources of truth and known drift
- `docs/SOUND_DIRECTION_BIBLE_V1.md`: normative editorial rules.
- `docs/HERESY_SCORE_CONTEXT.md`: latest technical context.
- `READING_CONTEXT.md` and `PROJECT_ROUTER.md` are in the ChatGPT Warhammer Project but their mounted copies are currently outdated (2026-10-22); align spoiler ceiling and version with this pipeline before relying on them in a new thread.
- Logs: Supabase `reading_logs` by `book_slug` (or app's exported JSON backup); do not equate the visible log with source text of a chapter.

### v0.11.5 checkpoint (2026-10-24)
- **P0 published:** seven-cue Chapter II score (25:39 published catalog runtime), protected ending, no padding. Reader has not read II; the score's narrative function ledger stays private. Secondary-source chapter skeleton checked; individual transitions still need feedback.
- **P0 release gate still open:** click **Check Spotify Runtime** inside Fulgrim II to fetch real Spotify `duration_ms`, check resolved recording identities, and ensure start/pause/resume/manual Final Cue. Not tested using user's Spotify login yet.
- **P1 published:** six already-known character dossiers and five archive records under Chapter I gate. Image crop/portrait correctness needs device QA; only Fulgrim currently has a suitable imported personal reference in the conversation pack.
- **QA regression:** JS parse and isolated book-state tests passed; book IV preserved after IV↔V simulation. Live app/PWA/cloud remain separate validation tasks.
- **Next execution:** validate preflight and finish P1 image QA; then resume P2 reliability and add explicit ending/sonic-design feedback fields.

### P2 reliability checkpoint — v0.11.6
- **Code complete / device QA open:** async Supabase cross-book guard, chapter-scoped private Spotify playlists, no duplicate starts during Spotify prepare, all-book backup (no secrets), three optional sound-direction ratings and offline-cached local diagnostics.
- Synthetic regression tests passed; no user-account Spotify, Supabase, offline-device, pause/resume or Final Cue behavior claimed as tested.
- [P2 QA checklist](P2_QA_CHECKLIST.md): lightweight user-device smoke test and remaining gates.
- P2.1 Spotify live verification, P2.2 cloud round-trip and P2.4 offline real-device check are **not closed**. The user already verified basic IV↔V switching before this release; post-change test still needed.
- Do not reset localStorage or delete the legacy Spotify playlist; historical reading scores remain separated.


### Field validation — P2 (2026-10-24)
- Installed PWA is the only authoritative reading client; user reports Book IV complete (17) and successful Fulgrim II Spotify Runtime preflight.
- Separate web browser local diagnostics showed incomplete archive (IV=2, V=0). Read-only Supabase check shows two different owner groups, **17+1** and **2+0**. The incompleteness did not overwrite the complete cloud archive. Do not wipe/reconnect any token as a workaround.
- Real-device preflight passed as an *action*, but exact Spotify runtime and final cue position weren't supplied.
- P2 follow-up: test directional feedback persistence, all-books backup on PWA, Final Cue, offline shell and Supabase roundtrip; then address push-first cloud initialization if second-device recovery becomes a supported workflow.
