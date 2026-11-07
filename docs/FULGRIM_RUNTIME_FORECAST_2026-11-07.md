# Fulgrim — previsão de leitura e QA da trilha (sem spoilers)
Atualizado: 2026-11-07 · Heresy Score v0.15.4

## Base factual
Logs do Supabase até capítulo XII: V=36, VI=30, VII=31, VIII=30, IX=24, X=35, XI=27, XII=29 minutos. Capítulo XIII não tem log confirmado.
O corpus privado (`Fulgrim - Graham McNeill.mobi`) tem contagens de palavras públicas e neutras em `data/fulgrim-chapter-metrics.json`.
Capítulos V–XII: 44.346 palavras / 242 minutos = **~183,25 palavras/minuto**. Cada capítulo varia muito: não tratar esta média como duração fixa.

## Previsão de leitura individual (não é duração confirmada da playlist)
| Capítulo | Palavras | Leitura estimada (min) | Spotify real | QA editorial |
|---|---:|---:|---|---|
| 13 | 4,610 | 25.2 | Pendente | Pendente |
| 14 | 4,804 | 26.2 | Pendente | Pendente |
| 15 | 6,399 | 34.9 | Pendente | Pendente |
| 16 | 4,848 | 26.5 | Pendente | Pendente |
| 17 | 5,590 | 30.5 | Pendente | Pendente |
| 18 | 4,405 | 24.0 | Pendente | Pendente |
| 19 | 5,277 | 28.8 | Pendente | Pendente |
| 20 | 5,517 | 30.1 | Pendente | Pendente |
| 21 | 5,418 | 29.6 | Pendente | Pendente |
| 22 | 5,283 | 28.8 | Pendente | Pendente |
| 23 | 5,319 | 29.0 | Pendente | Pendente |
| 24 | 5,015 | 27.4 | Pendente | Pendente |
| 25 | 5,586 | 30.5 | Pendente | Pendente |

As estimativas acima são somente *projeções de leitura* pelo ritmo medido, e não medição do Spotify nem sinal de capítulo pronto. O app também mantém o alvo editorial original separado. Para cada próximo capítulo, comparar os dois e usar a observação real mais recente antes de definir o ajuste. **Não inflar o alvo artificialmente para esconder faixas longas.**

## Ordem de execução
1. Confirmar que o leitor terminou apenas até XII; XIII é a próxima trilha liberada. Não revelar trechos narrativos XIV–XXV.
2. Autorizar Spotify `playlist-read-private`, conferir XII antigo versus catálogo oficial revisado, ler a playlist de volta e verificar diferença residual.
3. Auditar XIII no celular antes de começar a leitura; usar previsão ~25,2min como segunda referência ao alvo editorial de ~23,2min.
4. Auditar XIV–XVI em lote pequeno e classificar `WITHIN_RANGE`, `OVER_TARGET`, `UNDER_TARGET` ou `FAILED`. Se houver excesso, revisar mapa privado de cenas e selecionar explicitamente uma substituição com a mesma função.
5. Avançar XVII–XXV nas próximas rodadas, sem tocar em playlists durante leitura ativa. Não carregar a obra original ou mapas futuros no bundle público.

## Critério de pronto
- Spotify leu e confirmou todas as URIs em ordem e cada duração `duration_ms`;
- o início, o percurso emocional e o final têm correspondência com blocos reais do texto;
- o final cue está no lugar desejado e não é movido por algoritmo;
- repetição e mudanças bruscas de energia justificadas;
- desvio musical informado sem falso sucesso, idealmente inferior a cerca de 1 minuto;
- progresso, logs, licença de imagens e proteção contra spoilers preservados.

## Capítulo XII: projeção apenas
A versão anterior do Spotify tinha 34:34. A gravação do álbum de *IXION* para o cue intermediário omitido é de aproximadamente **3:45** em catálogos públicos, o que sugeriria cerca de **30:49** após remoção de uma única faixa, ainda ~1:13 acima do alvo 29:36. Isso **não é confirmação do Spotify do usuário**: o app deve informar o valor real e uma eventual diferença residual. Não apagar outra música sem decisão editorial baseada no texto.
