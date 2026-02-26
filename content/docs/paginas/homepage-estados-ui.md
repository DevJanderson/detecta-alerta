---
title: 'Homepage — Estados da UI'
description: 'Comportamento visual da homepage nos estados de loading, vazio e erro.'
order: 6
---

# Estados da UI

Definição de como a homepage se comporta visualmente nos diferentes estados: loading, vazio, erro e sucesso.

---

## Loading (carregamento)

Quando os dados estão sendo buscados da API, cada seção exibe um skeleton animado com pulso.

| Seção        | Comportamento                                                             |
| ------------ | ------------------------------------------------------------------------- |
| **Top Bar**  | 5 retângulos cinza pulsando no lugar dos indicadores                      |
| **Panorama** | Skeleton com blocos para porcentagem, badge de nível e contadores         |
| **Gráfico**  | Retângulo cinza na área do gráfico + controles visíveis mas desabilitados |
| **Tabela**   | 5 linhas skeleton com larguras variadas simulando dados                   |
| **Mapa**     | Silhueta do mapa em cinza claro sem cores por estado                      |
| **Filtros**  | Dropdowns visíveis com placeholder mas desabilitados                      |

### Regras

- O skeleton aparece **apenas na primeira carga** — ao trocar filtro, os dados anteriores permanecem visíveis enquanto os novos carregam
- Transição suave (fade) ao substituir skeleton por dados reais
- Tempo máximo de loading: **10 segundos** — após isso, exibir estado de erro

---

## Vazio (sem dados)

Quando a API retorna resposta válida mas sem dados para a seleção atual.

| Seção        | Mensagem                                | Comportamento                                              |
| ------------ | --------------------------------------- | ---------------------------------------------------------- |
| **Panorama** | "Dados indisponíveis para esta região." | Card com ícone informativo e mensagem centralizada         |
| **Gráfico**  | "Sem dados para o período selecionado." | Área do gráfico com mensagem + sugestão de alterar filtros |
| **Tabela**   | "Nenhum dado encontrado."               | Mensagem centralizada na área da tabela                    |
| **Mapa**     | Mapa cinza sem coloração                | Tooltip: "Sem dados disponíveis para esta semana"          |

### Regras

- O estado vazio **nunca** deve deixar uma seção em branco — sempre exibir mensagem explicativa
- Sugerir ação ao usuário quando possível (ex: "Tente selecionar outra semana epidemiológica")

---

## Erro

Quando a API falha ou retorna erro.

| Cenário              | Comportamento                                                      | Ação do usuário          |
| -------------------- | ------------------------------------------------------------------ | ------------------------ |
| **Erro de rede**     | Toast com "Falha ao carregar dados. Verifique sua conexão."        | Botão "Tentar novamente" |
| **Erro 500**         | Toast com "Erro interno. Tente novamente em instantes."            | Botão "Tentar novamente" |
| **Timeout (> 10s)**  | Exibe último dado disponível + aviso "Dados de X minutos atrás"    | Atualiza automaticamente |
| **API indisponível** | Banner discreto no topo: "Alguns dados podem estar desatualizados" | —                        |

### Regras

- Erros **não devem travar** a página — cada seção é independente
- Se o panorama falha mas a tabela carrega, exibir a tabela normalmente
- Toasts de erro usam `vue-sonner` com duração de 5 segundos
- Retry automático: 1 tentativa após 5 segundos em caso de erro de rede
- Máximo de 2 retries por seção

---

## Sucesso

Estado padrão quando os dados estão carregados e disponíveis.

| Seção        | Indicador visual                                          |
| ------------ | --------------------------------------------------------- |
| **Top Bar**  | Indicadores com cores semânticas (verde/amarelo/vermelho) |
| **Mapa**     | Estados coloridos conforme nível de movimento             |
| **Panorama** | Porcentagem, badge de nível e contadores preenchidos      |
| **Gráfico**  | Linhas renderizadas com dados de 8 semanas                |
| **Tabela**   | 5 linhas com dados completos e setas de tendência         |
| **Fonte**    | "Dados via Sinapse, há X minutos." com indicador verde    |

### Regras

- O indicador de "última atualização" deve mostrar tempo relativo (ex: "há 3 minutos")
- Indicador verde de status confirma que os dados estão frescos

---

## Transições entre estados

```
[Inicial] ──→ [Loading] ──→ [Sucesso]
                  │              │
                  ├──→ [Erro] ──→ [Retry] ──→ [Sucesso]
                  │                   │
                  │                   └──→ [Erro final] (exibe toast)
                  │
                  └──→ [Vazio] (dados carregaram mas sem resultado)
```

### Ao trocar filtro

```
[Sucesso atual] ──→ [Loading overlay sutil] ──→ [Novo sucesso]
                          │
                          └──→ [Erro] ──→ [Mantém dados anteriores + toast]
```

- Dados anteriores **não são limpos** durante transição de filtro
- Loading overlay sutil (opacity 0.5) sobre o conteúdo atual
- Se o novo request falha, mantém os dados anteriores e exibe toast de erro
