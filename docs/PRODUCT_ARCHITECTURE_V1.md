# Heresy Score — Arquitetura de produto (v1)
**Atualizado:** 24/11/2026 · **release da fundação:** 0.18.0

## Princípio central

O aplicativo é um **companheiro de leitura**. *Warhammer / Horus Heresy*
é o primeiro universo visual, mas **não deve ser um requisito da plataforma**.
Um livro de fantasia, ficção científica ou outro gênero deve poder fornecer
seus dados, suas regras editoriais e suas cores sem alterar Spotify,
temporizador, logs ou sincronização.

### Contrato de domínios

| Camada | Responsabilidade | Não deve conter |
| --- | --- | --- |
| Leitura | Estado local, unidades, progresso, cronômetro, backup, nuvem | Personagens, ilustrações, fatos futuros |
| Livro | Manifesto `slug`, unidades estáveis, metadados sem spoilers, pontuações | Tokens de conta, renderização, CSS |
| Música | Cues, identidades Spotify, playlists privadas, auditorias e estado editorial | Enredo serializado, controle de spoiler visual |
| Arquivo visual | Registros `id`, `kind`, `unlock`, fonte e proveniência | Lógica de Spotify e leitura |
| UI reutilizável | Hierarquia de ações, biblioteca, imagens, detalhes, busca, formulários | Suposições sobre Legiões ou personagens |
| Skin editorial | Paleta, tipografia, marcas e arte do universo | Dados pessoais ou comportamento de negócio |

**Atenção:** o código histórico contém ainda vários wrappers encadeados de
`render`, `openPerson`, `renderRoster`, etc. A v0.18.0 não finge que toda a
separação foi concluída. É uma etapa de contenção: registros visuais, estilos
e shell de leitura ganharam arquivos próprios e testes. A substituição
progressiva dos wrappers é uma tarefa técnica futura, com snapshots e
testes de regressão antes de qualquer remoção.

## Decisões de experiência

- **Tela de leitura:** livro, progresso, capítulo, CTA principal,
  Spotify acessível, mini-player e uma seleção pequena de registros
  visuais conhecidos. Nada de diagnósticos ocupando o topo.
- **Dramatis Personae:** **continuará uma seção independente**, com busca,
  afiliação, retratos e fichas que evoluem com a leitura.
- **Universo / lugares:** **continuará outra seção independente** de
  cenários, lugares, facções e naves, com busca e modal de detalhes.
- **Na home:** quatro atalhos visuais desbloqueados são apenas uma
  janela para os mesmos dados dos arquivos. Nenhuma ficha ou imagem se
  duplica em registros manuais distintos.
- **Log:** tempo automático, texto e tags opcionais. Sem coerção para
  dar nota positiva. Escalas antigas ficam na área avançada.
- **Mobile:** botões principais empilhados sem sobreposição na leitura;
  em atividade, 3 ações claras no player (Pausar, Spotify, Concluir).
  Itens de navegação musical fina ficam expandidos.

## Registry inicial

`data/visual-registry.js` publica a API `HSReaderVisuals`:
`known(bookSlug, clearance)`, `entry(bookSlug,id)`,
`byName(bookSlug,name)`, `theme(bookSlug)`.

Cada registro tem `id` estável, `kind`, `unlock`, nome e descrição já
conhecidos, além de posição da arte e proveniência. A mesma fonte atende
`scripts/visual-archive-ui.js` (home + Personae + Universo).
`scripts/reader-foundation.js` organiza ações e carrega
`styles/reader-foundation.css` por último para substituir os ajustes
temporários anteriores sem empilhar mais estilos em novos scripts.

## Livro VI — primeiro conjunto

**Spoiler ceiling até Capítulo 3 concluído**, quatro unidades internas.
Somente quatro ilustrações representativas são incluídas:
Zahariel, Nemiel, florestas de Caliban e Aldurukh/fortaleza da Ordem.
Personagens ainda não apresentados permanecem totalmente ausentes do
registro publicado. Os conteúdos de referência são as primeiras
unidades do MOBI privado fornecido pelo leitor, com acesso limitado
ao teto de spoilers, sem publicação de trechos.

A arte em `assets/visuals/caliban-first-archive.webp (principal) e assets/visuals/caliban-first-archive.svg (reserva offline)` é uma
**reconstrução original ilustrativa, não oficial e não canônica**:
não deve ser identificada como retrato fiel dos personagens, nem
confundida com uma imagem fornecida pela Games Workshop.

## Qualidade / direito / spoiler

**Hierarquia de imagens** para novas fichas: arte oficial de época
verificada e cuja incorporação seja autorizada; fanart com autorização e
crédito; reconstrução original com legenda; por último, ausência
identificada, jamais link quebrado. Não hotlinkar assets instáveis.

Uma arte ou nome só entra em áreas visíveis quando
`unlock <= maior unidade concluída do livro selecionado`.
Pré-carregar playlists **não aumenta** autorização de narrativa.
Não expor dados de capítulos futuros em HTML, imagens, nomes ou
metadados públicos.

## Gates da release

1. CI de integração: recursos essenciais da PWA offline, JS e SVG no
   repositório, 4 registros e bloqueio editorial, dados IV/V não alterados.
2. Android: header e card sem sobreposição em 320–430px; ver os botões,
   abrir Spotify sem link de outro livro, concluir sem avaliação;
   mini-player sem cortar controles.
3. Arte: conferir carregamento real das quatro imagens, home e arquivos,
   modais, navegação depois de trocar de livro e versão offline.
4. Dados: nenhum novo log, exclusão ou alteração de playlists nesta sprint.

## Próximas etapas recomendadas

- Criar manifestos para TODOS os livros no mesmo contrato e migrar os
  registros históricos do Personae e do arquivo de locais sem perder fatos.
- Isolar o controlador de leitura da renderização e abandonar wrappers
  incrementais após testes de snapshot.
- Melhorar o fluxo de curadoria e importação de imagens com validação
  automática de licença/proveniência e prévia real de cada arte.
- Fazer testes reais responsivos com navegador automatizado e dispositivo.

### Robustez da arte

A atlas WebP principal foi validada com hash Git blob SHA-1 `aaea8b79167beaf1c45b428059fb252658f668a7`; o SVG de reserva evita um quadrante vazio caso o aparelho não decodifique WebP. Ambos ficam em precache essencial e são imagens locais, sem hotlinks.


## Theme system and full-book music plan — 0.18.1

The shared reading engine and default shell remain neutral. `styles/themes/horus-heresy.css` is loaded after the foundation CSS and applies only if `data-hs-ui-series="warhammer-30k"`. Future books should register a different skin without changing timer, cloud, navigation, or the music engine.

A music score must distinguish **prepared catalog candidate**, **authenticated Spotify verification**, and **human-approved full-audio emotional fit** as separate phases. Book VI has all 25 musical cue sheets staged, but only the next three can be preflighted by the foreground Spotify OAuth session. Plans for unvisited chapters never imply narrative clearance.

Before editing future-book scores, privately inspect the reader-supplied edition and keep the corresponding scene map PRIVATE. Public files contain only musical roles and relative numeric markers. Track catalog provenance and runtime fail-closed matching are required; never label Spotify metadata as a full-track sonic quality review.

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

## Atualização v0.18.3 — 26/11/2026 · desenho clássico e recuperação de leitura

- **Problema visto em Android:** ao abrir a PWA o leitor via o layout original e depois outra apresentação excessivamente arredondada; a causa era CSS essencial anexado ao `head` somente após a inicialização de JavaScript, somado a wrappers visuais históricos. A base e skin Warhammer agora são carregadas em `<head>` antes do corpo, com `body.hs-reader-ux` marcado desde a primeira pintura. O visual busca reproduzir o Archivum original (preto/verde, monoespaçado, aquila/skull, linhas retas e cantos quadrados), conservando a organização responsiva, controles grandes e ações legíveis.
- **Incidente real:** o leitor tocou involuntariamente em `Concluir` durante o próximo capítulo, perdendo a sessão e acesso ao botão de retomar a trilha. No Supabase, o livro VI apresentava apenas unidades internas 1–6 (Prelude e capítulos 1–5); **nenhuma unidade 7 encontrada na nuvem** em consulta somente leitura. O eventual encerramento acidental da unidade 7 pode estar somente no armazenamento local do telefone. Não mexer nos logs 1–6.
- **Correção preventiva:** `scripts/reading-recovery.js` exige confirmação de `Concluir`; `Continuar lendo` mantém a sessão. `Reabrir leitura` pode ser acionado no último histórico, no formulário pós-leitura e na home durante 48h de uma conclusão recente. Não reabre registros de capítulos anteriores se existir outro mais recente.
- **Recuperação sem perda:** salva o registro anterior por livro em `state.books[slug].pendingReopens[chapter]`, retira-o temporariamente de `done`, restabelece `state.active` pausada com cronômetro em ms. Ao confirmar a conclusão real, preserva notas antigas e libera nova sincronização. `cloudPullLogs` não reimporta automaticamente uma conclusão antiga enquanto há uma recuperação pendente. **Não há deleção/alteração de linhas remotas no Supabase** por esta sprint.
- **Spotify:** `hsRestoreChapterMusic` e ±30s agora ficam visíveis no mini-player, sem desaparecer na área avançada. Recuperação não dispara playback. Nos novos capítulos, `refreshPlayer` guarda a URI e `progress_ms` somente se o contexto corresponde à playlist do capítulo; após reabertura, toque explícito em `Retomar trilha no ponto da leitura` dá preferência à posição Spotify salva. Para sessões encerradas na versão anterior, é estimado pelo tempo do cronômetro; avisar essa limitação, permitir ±30s.
- **Qualidade pendente:** validação real no Galaxy/Android (primeira pintura sem flash; forma dos botões; não sobreposição; confirmação, log, recuperar e retomar posição real com Spotify conectado). Os testes de Node/GitHub não substituem teste do navegador.
- **Teto de spoiler:** não inferir progresso de leitura pela conclusão acidental. Até confirmação do leitor, manter **Prelude + capítulos 1–5 realmente concluídos**; próximo capítulo narrativo é o 6 (unidade interna 7). Não expor acontecimentos futuros.

---
