---
title: 'Meu Município — Casos de Uso'
description: 'User stories e cenários de uso da página Meu Município.'
order: 2
---

# Casos de Uso

User stories principais da página Meu Município, derivadas do [BDD spec](/tests/bdd/meu-municipio.feature).

---

## UC-1: Selecionar município por busca

**Como** usuário autenticado,
**quero** buscar um município pelo nome,
**para** visualizar seus dados epidemiológicos.

**Fluxo principal:**

1. Usuário digita 3+ caracteres no campo de busca
2. Autocomplete exibe sugestões filtradas (~5570 municípios)
3. Usuário seleciona um município da lista
4. Mapa centraliza no município com animação (flyTo)
5. Painel lateral abre com dados do município
6. Onboarding fecha

**Fluxos alternativos:**

- Navegação por teclado (↑↓ + Enter)
- Atalho Ctrl+K para focar busca
- Limpar seleção (×) volta ao estado inicial

---

## UC-2: Selecionar município por geolocalização

**Como** usuário autenticado,
**quero** usar minha localização atual,
**para** encontrar rapidamente o município onde estou.

**Fluxo principal:**

1. Usuário clica em "Usar minha localização"
2. Navegador solicita permissão de geolocalização
3. Sistema identifica o município mais próximo
4. Mapa centraliza e painel lateral abre

**Fluxos de erro:**

- Geolocalização negada → mensagem + busca manual continua disponível
- Timeout (>10s) → mensagem "Tempo esgotado"

---

## UC-3: Monitorar lotação de unidades de saúde

**Como** gestor de saúde,
**quero** ver a lotação das unidades do meu município,
**para** identificar unidades sobrecarregadas.

**Fluxo principal:**

1. Com município selecionado, aba "resumo" ativa
2. Card de lotação exibe nível de risco (Baixo/Médio/Alto)
3. Gráfico de linha mostra evolução por semana epidemiológica
4. Alternar entre gráfico de linha e faixa

**Filtros:**

- UBS, UPA, Drogaria — toggleáveis individualmente
- Cada filtro mostra contagem + variação percentual
- Cor do indicador varia conforme risco (verde/amarelo/vermelho)

---

## UC-4: Acompanhar rumores epidemiológicos locais

**Como** epidemiologista,
**quero** ver rumores de saúde filtrados pelo meu município,
**para** identificar ameaças emergentes.

**Fluxo principal:**

1. Na aba "resumo": prévia dos 3 rumores mais recentes
2. Link "ir para rumores" troca para aba completa
3. Na aba "rumores": lista com título, fonte, data e tags
4. Cada rumor tem tags de doenças e regiões
5. "Ver rumor" navega para a página do rumor

---

## UC-5: Investigar unidade individual (drill-down)

**Como** analista,
**quero** clicar em uma unidade de saúde no mapa,
**para** ver seus dados detalhados.

**Fluxo principal:**

1. Clicar em marcador no mapa abre popup (nome, tipo, ocupação)
2. Painel lateral troca para detalhes da unidade
3. Abas: "resumo" (gráfico de barras), "rumores", "sobre" (CNES)
4. Botão "Voltar" retorna à visão do município

**Dados CNES (aba "sobre"):**

- Endereço completo
- Tipo de estabelecimento
- Disponibilidade de dados em tempo real
- Status ativo/inativo

---

## UC-6: Navegar no mapa

**Como** usuário,
**quero** controlar a visualização do mapa,
**para** explorar diferentes áreas.

**Controles:**

| Ação              | Elemento                  |
| ----------------- | ------------------------- |
| Zoom in/out       | Botões +/−                |
| Centralizar       | Botão "Centralizar"       |
| Minha localização | Botão "Mostrar meu Local" |
| Tela cheia        | Botão "Tela cheia"        |
| Trocar tileset    | Botão "Trocar Mapa"       |
| Trocar município  | Botão "Trocar local"      |

---

## UC-7: Trocar semana epidemiológica

**Como** epidemiologista,
**quero** selecionar uma semana epidemiológica específica,
**para** analisar dados históricos.

**Fluxo principal:**

1. Seletor mostra semana atual por padrão (formato "SE {n} ({início} a {fim})")
2. Calendário permite selecionar semana anterior
3. Semanas futuras estão desabilitadas
4. Ao trocar, lotação e rumores recarregam para a nova semana

---

## UC-8: Compartilhar e imprimir

**Como** gestor,
**quero** compartilhar os dados do meu município,
**para** comunicar a situação aos colegas.

**Ações:**

- **Compartilhar** — copia link para área de transferência + notificação
- **Imprimir** — abre diálogo de impressão do navegador
