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
