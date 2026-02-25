---
title: Homepage
description: Documentação completa da página inicial do Detecta Alerta — estrutura, seções, componentes e dados.
order: 1
---

# Homepage

A homepage é a página principal do Detecta Alerta. Apresenta um panorama nacional da vigilância epidemiológica com dados de lotação de estabelecimentos de saúde (Drogarias, UBS e UPAs), mapa interativo, gráficos de tendência e análise de especialistas.

**Rota:** `/`
**Layer:** `2-home`
**Acesso:** Público (com login overlay para funcionalidades completas)

---

## Estrutura da Página

A homepage é composta por **8 seções** principais, na seguinte ordem de cima para baixo:

### 1. Barra de Indicadores Regionais (Top Bar)

Barra fixa no topo da página com indicadores resumidos por região.

| Elemento         | Descrição                                                          |
| ---------------- | ------------------------------------------------------------------ |
| Label            | "Indicadores Regionais"                                            |
| Regiões          | Norte, Nordeste, Centro-Oeste, Sudeste, Sul                        |
| Dados por região | Nível (Baixo/Médio/Alto) + variação percentual + seta de tendência |

**Exemplo:** `Norte: Médio -1% ↑` · `Nordeste: Alto -1%` · `Centro-Oeste: Médio +6% ↑`

**Comportamento:** A barra rola horizontalmente em telas menores. Os indicadores são atualizados em tempo real via API.

---

### 2. Header / Navegação

Barra de navegação principal com logos e menu.

| Elemento     | Descrição                                                       |
| ------------ | --------------------------------------------------------------- |
| Logo ITpS    | Link para home (`/`)                                            |
| Logo Detecta | Link para home (`/`)                                            |
| Menu         | Início, Meu Município, Rumores, Lugares Monitorados, Relatórios |
| Usuário      | Avatar + nome (quando logado) com dropdown                      |

**Comportamento:** O item ativo no menu recebe destaque visual (ícone losango vermelho + cor diferenciada). O menu do usuário permite acessar perfil, admin e logout.

---

### 3. Hero Section

Seção de destaque com a pergunta principal e explicação da plataforma.

| Elemento        | Descrição                                                                          |
| --------------- | ---------------------------------------------------------------------------------- |
| Título (h1)     | "Quais os riscos de Surtos ou Epidemias no Brasil?"                                |
| CTA central     | "selecione sua região" com seta para baixo                                         |
| Subtexto        | "Não se preocupe! Os dados são abertos. ;)"                                        |
| Descrição       | Texto explicativo sobre o que o Detecta Alerta faz                                 |
| Fonte dos dados | "\*Dados públicos coletados do Google Maps e parcerias com instituições públicas." |

**Layout:** 3 colunas em desktop — título à esquerda, CTA no centro, descrição à direita. Fundo branco.

---

### 4. Seletor de Região (Tabs)

Barra azul escura com tabs para selecionar a região do Brasil.

| Elemento | Descrição                                                                |
| -------- | ------------------------------------------------------------------------ |
| Label    | "Selecione uma Região:"                                                  |
| Tabs     | Brasil (default, com ícone), Norte, Nordeste, Centro-Oeste, Sudeste, Sul |

**Comportamento:** A tab selecionada tem fundo branco e borda. A tab "Brasil" é a padrão e tem um ícone especial. Ao selecionar uma região, todos os dados da página (mapa, panorama, gráfico, tabela) são filtrados para aquela região.

**Fundo:** Azul escuro (brand-secondary-900 ou similar), com as tabs em um container arredondado branco.

---

### 5. Painel Principal (Mapa + Dados)

Seção dividida em duas colunas: mapa à esquerda e dados à direita.

#### 5a. Coluna Esquerda — Mapa Interativo

| Elemento | Descrição                                                                      |
| -------- | ------------------------------------------------------------------------------ |
| Legenda  | "Nível de Movimento:" — Normal (cinza), Moderado (amarelo), Elevado (vermelho) |
| Mapa SVG | Mapa do Brasil dividido por estados, coloridos conforme nível                  |
| Tooltip  | "Clique na região — Selecione uma área no mapa para ver os detalhes."          |
| Fonte    | "Dados via Sinapse, há X minutos." com indicador verde de status               |

**Comportamento:** Os estados são coloridos conforme o nível de movimento. Ao clicar em um estado, os dados à direita são atualizados. O mapa suporta zoom e pan.

#### 5b. Coluna Direita — Filtros + Panorama + Gráfico + Tabela

##### Filtros

| Elemento              | Descrição                                                                     |
| --------------------- | ----------------------------------------------------------------------------- |
| Estado                | Dropdown com todos os 27 estados + "Todos os Estados"                         |
| Semana Epidemiológica | Dropdown com semana + intervalo de datas (ex: "Semana 4 (25 a 31 jan. 2026)") |

##### Panorama - Brasil (section `region`)

Card com o resumo do risco epidemiológico.

| Elemento            | Descrição                                                                           |
| ------------------- | ----------------------------------------------------------------------------------- |
| Header              | "Panorama - Brasil" + link "como é feito o cálculo" (abre modal)                    |
| Indicador principal | Porcentagem (ex: "44.7%") + badge de nível ("Médio")                                |
| Descrição           | "dos estabelecimentos acima da média histórica. Tendência de alta."                 |
| Análise textual     | Texto gerado descrevendo o cenário (ex: "Centro-Oeste mostra variação moderada...") |
| Estabelecimentos    | Total + breakdown por tipo (drogarias, UBS, UPAs) com ícones                        |
| Botão info          | "Mais informações"                                                                  |

##### Lotação Semanal vs. Média Histórica (section `region`)

Gráfico de linhas com a evolução da lotação.

| Elemento  | Descrição                                                                                |
| --------- | ---------------------------------------------------------------------------------------- |
| Header    | "Lotação Semanal vs. Média Histórica"                                                    |
| Subtítulo | "Últimas 8 semanas. Para acessar o histórico completo, acesse aqui" (link → /relatorios) |
| Controles | Checkboxes: "mostrar variação", "mostrar média"                                          |
| Filtros   | Toggle switches: UBS, UPA, drogaria                                                      |
| Gráfico   | Linhas com eixo Y em porcentagem (0-100%), eixo X com datas semanais                     |
| Legenda   | Lotação Atual (linha sólida azul), Média Móvel (tracejada), cores por nível              |
| Análise   | Card "Análise dos Especialistas" com texto descritivo + link "ir para rumores"           |

**Dados do gráfico:** Cada ponto representa a porcentagem de estabelecimentos com lotação acima da média naquela semana. A linha tracejada é a média móvel histórica.

##### Lotação por Estabelecimento (section `region`)

Tabela comparativa por região.

| Coluna    | Descrição                                                    |
| --------- | ------------------------------------------------------------ |
| região    | Nome da região (Centro-Oeste, Nordeste, Norte, Sudeste, Sul) |
| todos     | Nível + porcentagem + tendência (todos os tipos somados)     |
| Drogarias | Nível + porcentagem + tendência (sortable)                   |
| UPA       | Nível + porcentagem + tendência (sortable)                   |
| UBS       | Nível + porcentagem + tendência (sortable)                   |

**Formato das células:** `Nível · porcentagem% seta` (ex: "Médio · 46.5% ↑", "Baixo · 42% →")

**Cada coluna tem um botão (i)** de "Mais informações" com tooltip explicativo.

---

### 6. CTA — Meu Município

Banner de call-to-action para a página "Meu Município".

| Elemento    | Descrição                                             |
| ----------- | ----------------------------------------------------- |
| Título (h2) | "Quer saber sobre sua cidade?"                        |
| Subtítulo   | "Explore os dados na página Meu Município."           |
| Botão       | "ir para Meu Município →" (variant outline, com seta) |

**Layout:** Fundo com padrão pontilhado sutil. Título à esquerda, botão à direita.

---

### 7. Footer

Rodapé da página com informações institucionais.

#### Parte Superior

| Elemento      | Descrição                                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| Logos         | Detecta Alerta + ITpS                                                                                      |
| Descrição     | "Plataforma de monitoramento de movimento que acompanha a lotação de unidades de saúde em tempo oportuno." |
| Redes sociais | Instagram, LinkedIn, YouTube (ícones circulares)                                                           |

#### Links de Navegação (3 colunas)

| Explore             | Sinapse     | Suporte             |
| ------------------- | ----------- | ------------------- |
| Início              | Arboviroses | Documentação        |
| Meu Município       | Clima       | Notas metodológicas |
| Rumores             | CNES        |                     |
| Lugares Monitorados | I.A.        |                     |
| Relatórios          | Outros      |                     |

#### Parte Inferior

| Elemento  | Descrição                                                              |
| --------- | ---------------------------------------------------------------------- |
| Copyright | "©Todos os Direitos Reservados Instituto Todos pela Saúde (ITpS)"      |
| Endereço  | "Avenida Paulista, 1.938 - 16º andar, CEP: 01310-942 - São Paulo (SP)" |
| Link      | "Termos de Uso e Aviso de Privacidade"                                 |

---

### 8. Login Overlay (Dialog)

Modal de login que aparece por cima da página.

| Elemento    | Descrição                                                                  |
| ----------- | -------------------------------------------------------------------------- |
| Título      | "Detecta Alerta"                                                           |
| Subtítulo   | "Sistema de vigilância epidemiológica"                                     |
| Campo email | Input com ícone de envelope, placeholder "seu@email.com"                   |
| Campo senha | Input com ícone de cadeado, placeholder "••••••••", toggle de visibilidade |
| Link        | "Esqueci minha senha"                                                      |
| Botão       | "Entrar" (desabilitado até preencher campos)                               |

**Comportamento:** O dialog aparece ao acessar a plataforma. O conteúdo da home é visível (desfocado) por trás. Após login, o dialog fecha e a página carrega os dados completos.

---

## Fontes de Dados

| Dado                     | Origem                                     | Frequência                |
| ------------------------ | ------------------------------------------ | ------------------------- |
| Indicadores regionais    | API Sinapse                                | Tempo real                |
| Mapa de estados          | TopoJSON local (`public/geo/`) + dados API | Por semana epidemiológica |
| Panorama/Risco           | Cálculo baseado em z-score da lotação      | Por semana epidemiológica |
| Gráfico de lotação       | Histórico de 8 semanas via API             | Semanal                   |
| Análise de especialistas | Gerada via API (possivelmente IA)          | Por atualização           |
| Tabela de lotação        | Agregação por região e tipo via API        | Por semana epidemiológica |

---

## Componentes a Implementar

Baseado na análise da plataforma atual, os seguintes componentes precisam ser criados:

### Globais (layer 0-base)

| Componente  | Descrição                                    | Prioridade |
| ----------- | -------------------------------------------- | ---------- |
| `AppTopBar` | Barra de indicadores regionais no topo       | Alta       |
| `AppFooter` | Footer completo com links, logos e copyright | Alta       |

### Homepage (layer 2-home)

| Componente               | Descrição                                             | Prioridade |
| ------------------------ | ----------------------------------------------------- | ---------- |
| `HomeHero`               | Hero section (já existe, precisa expandir)            | Alta       |
| `HomeRegionTabs`         | Tabs de seleção de região (Brasil, Norte, etc.)       | Alta       |
| `HomeMap`                | Mapa interativo SVG do Brasil por estados             | Alta       |
| `HomeMapLegend`          | Legenda do mapa (Normal, Moderado, Elevado)           | Média      |
| `HomePanorama`           | Card com resumo do risco + análise + estabelecimentos | Alta       |
| `HomeChart`              | Gráfico de lotação semanal vs. média histórica        | Alta       |
| `HomeChartControls`      | Checkboxes e toggles de filtro do gráfico             | Média      |
| `HomeAnalysis`           | Card "Análise dos Especialistas"                      | Média      |
| `HomeEstablishmentTable` | Tabela de lotação por estabelecimento/região          | Alta       |
| `HomeCtaMunicipio`       | Banner CTA "Quer saber sobre sua cidade?"             | Baixa      |
| `HomeFilters`            | Dropdowns de estado e semana epidemiológica           | Alta       |

---

## Etapas de Implementação

1. **Estrutura base** — Layout da home com as seções skeleton
2. **Header e Footer** — Componentes globais (AppTopBar, AppFooter)
3. **Hero** — Expandir o HomeHero existente
4. **Seletor de região** — Tabs + estado global de região selecionada
5. **Mapa** — SVG interativo com TopoJSON
6. **Filtros** — Dropdowns de estado e semana epidemiológica
7. **Panorama** — Card de risco com dados da API
8. **Gráfico** — Lotação semanal com controles
9. **Tabela** — Lotação por estabelecimento
10. **CTA** — Banner Meu Município
11. **Login overlay** — Adaptar o login existente como dialog sobre a home
