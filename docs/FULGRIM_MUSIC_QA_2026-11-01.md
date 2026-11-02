# Fulgrim — audit de retomada, transições e variedade musical
Data: 2026-11-01 | leitura confirmada: capítulos I–VIII; capítulo seguinte em andamento, não presumir conclusão

## Evidência dos logs no Supabase
- Cap. V — 36 min, comprimento GOOD, "Duas musica so nao encaixaram mas as outras encaixaram bastante." NENHUMA faixa individual identificada em trackFeedback.
- Cap. VI — 30 min, comprimento SHORT, "Acho que podemos diminuir o tempo de transição entre as músicas, e teve uma que nao encaixou muito na cena que era uma luta entre naves." Correção de cue VI inferida pelo mapa privado; não identificar a faixa reprovada como certeza.
- Cap. VII — 31 min, comprimento GOOD, "Esse foi um dos capítulos que mais encaixou as músicas, faltou um pouco de tempo no final mas por uma questao que eu estava lendo mais lento hoje."
- Cap. VIII — 30 min, comprimento GOOD, "Discordant feast nao encaixa." Rejeição explícita da faixa; referência musical anterior substituída editorialmente.
- Esses capítulos tinham arrays de trackFeedback e sceneMarkers vazios no Supabase. Notas por capítulo não equivalem a marcadores temporais por faixa.

## Correção de transporte Spotify
Antes de 0.13.3 o botão Resume apenas acionava Spotify Resume na música atualmente ativa, mesmo que estivesse ouvindo conteúdo fora da playlist. O timer continuava correto, mas o áudio não.

`scripts/spotify-chapter-resume.js`:
- botão **Retomar trilha no ponto da leitura** no painel Now, também usado pelo Resume de sessão pausada;
- recupera ID exato da playlist da sessão, lê durações das faixas da playlist via Spotify API, soma a linha do tempo musical e envia Start/Resume Playback com `context_uri`, `offset.position` e `position_ms`;
- mantém o timer intacto até sucesso do comando; se estava pausado, despausa apenas após confirmação da API;
- ajuste manual de ±30 segundos por sessão, para desvios reais entre voz/leitura e cues;
- não altera playback de outras músicas automaticamente ao abrir o app;
- `refreshPlayer()` não deve substituir o estado de currentTrack quando Spotify reporta outra playlist;
- o tempo musical calculado é **aproximado**: crossfade, pausas musicais internas e variação de velocidade de leitura não permitem correspondência exata com frase/página.

## Transições
Há dois defeitos distintos:
1. Intervalos silenciosos entre faixas ou mixagem Spotify: dependem de **Reprodução sem pausas / Transição gradual** no Spotify, não existem controles de crossfade na Spotify Web API usada pelo app. O Spotify documenta limitações com Connect.
2. Faixa com introdução/final arrastado, mudança de cena antecipada ou inadequação de energia: depende de nova edição narrativa, duração e escolha de faixa, **não** de uma configuração de reprodução.

Recomendação experimental: Spotify celular > Configurações e privacidade > Reprodução > habilitar **Reprodução sem pausas**; testar transição gradual curta (1–2s) apenas quando disponível no aparelho, entendendo que pode não funcionar via Spotify Connect. Não prometer que o app controla esse setting.

## Estatística de repetição
- Total público de Fulgrim: 255 posições musicais, capítulos I–XXV.
- **Repetições altas ainda sem aprovação de leitmotif:** Ancient Mystery (7), Path of Trust (6), Onslaught (6 antes da correção do VI), Vigil (6), Discordant Feast (6 antes da correção do VIII), Waiting to Strike (6), Our Enemies Approach (6), Death's Play (6).
- Repetição **não é automaticamente leitmotif**. Só declarar motivação recorrente quando o `docs/SOUND_DIRECTION_BIBLE_V1.md` e mapa privado sustentarem uma função dramática deliberada e o leitor confirmar encaixe. Não confundir a recorrência do mesmo compositor com leitmotif.
- **Candidato de retorno intencional:** The Royal Conservatory (Daniel Licht) para desconforto artístico em VIII, por função estética já explorada. É candidato editorial, não motivo plenamente validado.
- A trilha não é 100% Warhammer: na primeira auditoria, cerca de **47 das 255 posições (18,4%)** usavam compositores/obras identificados nas seleções externas (Frostpunk, Dishonored, Mass Effect e Dune), Após as duas substituições VI e VIII, são **49/255 posições (19,2%)** do pool externo e **206/255** do pool principal associado às OSTs Warhammer (classificação aproximada por faixa/compositor). A predominância de Warhammer nas trilhas VI–VIII é uma consequência do pool repetido, NÃO uma instrução permanente do leitor.
- A versão anterior do MD **já dizia** que leitmotifs exigem função e que o universo de compositores é irrestrito; a geração em lote não aplicou a revisão seletiva exigida.

## Correções pontuais após feedback
- VI: substituir hipoteticamente **Onslaught** (Nima Fakhrara) por **The End Run** (Jack Wall; Mass Effect 2) no bloco privado de combate espacial. Ajuste pendente de validação do leitor; não afirmar que Onslaught era a faixa efetivamente reprovada.
- VIII: substituir **Discordant Feast** por **The Royal Conservatory** (Daniel Licht; Dishonored 2) para um trecho privado de tensão estética. A faixa antiga foi reprovada explicitamente; a nova é uma candidata, ainda não avaliada na leitura.
- IX pode estar em leitura e não deve sofrer troca de músicas silenciosa durante a sessão.

## Próximas verificações
- Confirmar retomada de playlist/offset no Android, incluindo quando Spotify foi usado para outro áudio.
- Testar o que a API retorna em `/playlists/{id}/items` na conta e dispositivo do leitor.
- Saber se o intervalo sentido é silêncio de reprodução ou cauda musical/composição.
- Auditar leitmotifs e candidatos de outras fontes por capítulo **sem divulgar spoilers futuros**, sem reescrever automaticamente a trilha ativa.

## Atualização de entrega
- Versão corrente: app 0.13.3, PWA cache `heresy-score-v0135`. O botão existente **Open Spotify** durante uma sessão ativa agora chama o mesmo restaurador por contexto/posição; fora de sessão mantém o comportamento anterior.
- Teste com Spotify simulado: sessão pausada em 08:10 com durações de 03:00, 05:00, 03:40 posiciona a terceira faixa em 00:10; despausa somente após aceitar a reprodução. Teste no dispositivo e disponibilidade real do Spotify permanecem pendentes.
