---
title: 'Homepage — Requisitos'
description: 'Requisitos funcionais detalhados de cada seção da homepage.'
order: 3
---

# Requisitos Funcionais

Especificação detalhada das 8 seções da homepage, com elementos, comportamento e critérios de aceite.

---

## 3.1 Barra de Indicadores Regionais (Top Bar)

**Status:** ✅ Implementado (dados mock)
**Componente:** `AppTopBar`

Barra fixa no topo da página com indicadores resumidos por região.

| Elemento         | Descrição                                                          |
| ---------------- | ------------------------------------------------------------------ |
| Label            | "Indicadores Regionais"                                            |
| Regiões          | Norte, Nordeste, Centro-Oeste, Sudeste, Sul                        |
| Dados por região | Nível (Baixo/Médio/Alto) + variação percentual + seta de tendência |

**Exemplo:** `Norte: Médio -1% ↑` · `Nordeste: Alto -1%` · `Centro-Oeste: Médio +6% ↑`

**Comportamento:**

- A barra rola horizontalmente em telas menores
- Os indicadores são atualizados em tempo real via API
- Cores semânticas: success (baixo), alert (médio), danger (alto)

**Critérios de aceite:**

- [x] Exibe as 5 regiões com nível, variação e tendência
- [x] Scroll horizontal no mobile
- [ ] Dados vêm da API Sinapse (atualmente mock)

---

## 3.2 Header / Navegação

**Status:** ✅ Implementado
**Componente:** `AppHeader`

Barra de navegação principal com logos e menu.

| Elemento     | Descrição                                               |
| ------------ | ------------------------------------------------------- |
| Logo ITpS    | Link para home (`/`)                                    |
| Logo Detecta | Link para home (`/`)                                    |
| Menu         | Home, Meu Município, Mapa de Risco, Rumores, Relatórios |
| Usuário      | Avatar + nome (quando logado) com dropdown              |

**Comportamento:**

- Item ativo recebe destaque visual (ícone losango + cor)
- Menu do usuário: perfil, admin e logout
- Mobile: hamburger menu com Sheet (drawer)

**Critérios de aceite:**

- [x] Navegação funcional desktop e mobile
- [x] Menu do usuário com autenticação integrada
- [x] Destaque visual no item ativo

---

## 3.3 Hero Section

**Status:** ✅ Implementado
**Componente:** `HomeHero`

Seção de destaque com a pergunta principal e explicação da plataforma.

| Elemento        | Descrição                                                                          |
| --------------- | ---------------------------------------------------------------------------------- |
| Título (h1)     | "Quais os riscos de Surtos ou Epidemias no Brasil?"                                |
| CTA central     | "selecione sua região" com seta para baixo                                         |
| Subtexto        | "Não se preocupe! Os dados são abertos. ;)"                                        |
| Descrição       | Texto explicativo sobre o que o Detecta Alerta faz                                 |
| Fonte dos dados | "\*Dados públicos coletados do Google Maps e parcerias com instituições públicas." |

**Layout:** 3 colunas em desktop — título à esquerda, CTA no centro, descrição à direita. Fundo branco.

**Critérios de aceite:**

- [x] Layout 3 colunas em desktop, empilhado no mobile
- [x] Conteúdo estático exibido corretamente

---

## 3.4 Seletor de Região (Tabs)

**Status:** ✅ Implementado
**Componente:** `HomeRegionTabs`

Barra azul escura com tabs para selecionar a região do Brasil.

| Elemento | Descrição                                                                |
| -------- | ------------------------------------------------------------------------ |
| Label    | "Selecione uma Região:"                                                  |
| Tabs     | Brasil (default, com ícone), Norte, Nordeste, Centro-Oeste, Sudeste, Sul |

**Comportamento:**

- Tab selecionada tem fundo branco e borda
- Tab "Brasil" é a padrão e tem ícone especial
- Ao selecionar uma região, todos os dados da página (mapa, panorama, gráfico, tabela) são filtrados

**Fundo:** Azul escuro (secondary-900), com tabs em container arredondado branco.

**Critérios de aceite:**

- [x] 6 tabs funcionais com v-model bidirecional
- [x] Tab "Brasil" como padrão
- [ ] Seleção de região filtra todos os painéis abaixo (integração parcial)

---

## 3.5 Painel Principal (Mapa + Dados)

Seção dividida em duas colunas: mapa à esquerda (sticky) e dados à direita (scroll).

**Componente orquestrador:** `HomeDashboard`

### 3.5a Mapa Interativo

**Status:** 🔧 Esqueleto (Leaflet pendente)
**Componente:** `HomeMap`

| Elemento | Descrição                                                                      |
| -------- | ------------------------------------------------------------------------------ |
| Legenda  | "Nível de Movimento:" — Normal (cinza), Moderado (amarelo), Elevado (vermelho) |
| Mapa SVG | Mapa do Brasil dividido por estados, coloridos conforme nível                  |
| Tooltip  | "Clique na região — Selecione uma área no mapa para ver os detalhes."          |
| Fonte    | "Dados via Sinapse, há X minutos." com indicador verde de status               |

**Comportamento:**

- Estados coloridos conforme nível de movimento
- Clique em estado atualiza os dados à direita
- Suporte a zoom e pan

**Critérios de aceite:**

- [x] Estrutura visual com legenda e tooltip
- [ ] Renderização do mapa SVG/Leaflet com dados reais
- [ ] Interação: clique no estado filtra dados
- [ ] Cores dinâmicas baseadas no nível de movimento

### 3.5b Filtros

**Status:** ✅ Implementado (dados mock)
**Componente:** `HomeFilters`

| Elemento              | Descrição                                                                     |
| --------------------- | ----------------------------------------------------------------------------- |
| Estado                | Dropdown com os 27 estados + "Todos os Estados"                               |
| Semana Epidemiológica | Dropdown com semana + intervalo de datas (ex: "Semana 4 (25 a 31 jan. 2026)") |

**Critérios de aceite:**

- [x] Dropdown de estado com lista completa de UFs (value/label)
- [x] Dropdown de semana epidemiológica com componente Select do shadcn
- [ ] Semanas carregadas dinamicamente da API
- [ ] Seleção de filtro atualiza todos os painéis

### 3.5c Panorama — Resumo de Risco

**Status:** 🎭 Mockado (pronto para API)
**Componente:** `HomePanorama`

Card com o resumo do risco epidemiológico.

| Elemento            | Descrição                                                                    |
| ------------------- | ---------------------------------------------------------------------------- |
| Header              | "Panorama - Brasil" + link "como é feito o cálculo" (abre modal)             |
| Indicador principal | Porcentagem (ex: "44.7%") + badge de nível ("Médio")                         |
| Descrição           | "dos estabelecimentos acima da média histórica. Tendência de alta."          |
| Análise textual     | Texto descrevendo o cenário (ex: "Centro-Oeste mostra variação moderada...") |
| Estabelecimentos    | Total + breakdown por tipo (drogarias, UBS, UPAs) com ícones                 |
| Botão info          | "Mais informações"                                                           |

**Critérios de aceite:**

- [x] Layout com indicador principal, nível de risco e breakdown
- [x] Exibe total e contagem por tipo de estabelecimento
- [ ] Dados vêm da API (atualmente mock: 44.7%, 3365 estabelecimentos)
- [ ] Atualiza ao trocar região/filtro
- [ ] Modal "como é feito o cálculo" implementado

### 3.5d Gráfico — Lotação Semanal vs. Média Histórica

**Status:** 🔧 Esqueleto (ApexCharts pendente)
**Componente:** `HomeChart`

| Elemento  | Descrição                                                                                |
| --------- | ---------------------------------------------------------------------------------------- |
| Header    | "Lotação Semanal vs. Média Histórica"                                                    |
| Subtítulo | "Últimas 8 semanas. Para acessar o histórico completo, acesse aqui" (link → /relatorios) |
| Controles | Switches: "mostrar variação", "mostrar média"                                            |
| Filtros   | Toggle por tipo: UBS, UPA, Drogaria                                                      |
| Gráfico   | Linhas com eixo Y em % (0-100%), eixo X com datas semanais                               |
| Legenda   | Lotação Atual (linha sólida azul), Média Móvel (tracejada), cores por nível              |
| Análise   | Card "Análise dos Especialistas" com texto descritivo + link "ir para rumores"           |

**Dados do gráfico:** Cada ponto representa a porcentagem de estabelecimentos com lotação acima da média naquela semana. A linha tracejada é a média móvel histórica.

**Critérios de aceite:**

- [x] Controles de visualização funcionais (switches, filtros por tipo)
- [ ] Gráfico de linhas renderizado com ApexCharts
- [ ] Dados de 8 semanas vindos da API
- [ ] Linha de variação e média toggleáveis
- [ ] Card de análise de especialistas com conteúdo dinâmico

### 3.5e Tabela — Lotação por Estabelecimento

**Status:** ✅ Implementado (dados mock)
**Componente:** `HomeTable`

| Coluna    | Descrição                                                |
| --------- | -------------------------------------------------------- |
| Região    | Centro-Oeste, Nordeste, Norte, Sudeste, Sul              |
| Todos     | Nível + porcentagem + tendência (todos os tipos somados) |
| Drogarias | Nível + porcentagem + tendência (sortable)               |
| UPA       | Nível + porcentagem + tendência (sortable)               |
| UBS       | Nível + porcentagem + tendência (sortable)               |

**Formato das células:** `Nível · porcentagem% seta` (ex: "Médio · 46.5% ↑", "Baixo · 42% →")

Cada coluna tem botão (i) de "Mais informações" com tooltip explicativo.

**Critérios de aceite:**

- [x] Tabela com 5 regiões e 4 colunas de dados
- [x] Exibe nível, porcentagem e seta de tendência
- [ ] Dados vêm da API (atualmente mock)
- [ ] Colunas ordenáveis (sort)

---

## 3.6 CTA — Meu Município

**Status:** ✅ Implementado
**Componente:** `HomeCtaMunicipio`

Banner de call-to-action para a página "Meu Município".

| Elemento    | Descrição                                             |
| ----------- | ----------------------------------------------------- |
| Título (h2) | "Quer saber sobre sua cidade?"                        |
| Subtítulo   | "Explore os dados na página Meu Município."           |
| Botão       | "ir para Meu Município →" (variant outline, com seta) |

**Layout:** Fundo com padrão pontilhado sutil. Título à esquerda, botão à direita.

**Critérios de aceite:**

- [x] Banner com título, descrição e botão
- [x] Botão direciona para `/municipio`

---

## 3.7 Footer

**Status:** ✅ Implementado
**Componente:** `AppFooter`

Rodapé com informações institucionais.

### Parte Superior

| Elemento      | Descrição                                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| Logos         | Detecta Alerta + ITpS                                                                                      |
| Descrição     | "Plataforma de monitoramento de movimento que acompanha a lotação de unidades de saúde em tempo oportuno." |
| Redes sociais | Instagram, LinkedIn, YouTube (ícones circulares)                                                           |

### Links de Navegação (3 colunas)

| Explore             | Sinapse     | Suporte             |
| ------------------- | ----------- | ------------------- |
| Início              | Arboviroses | Documentação        |
| Meu Município       | Clima       | Notas metodológicas |
| Rumores             | CNES        |                     |
| Lugares Monitorados | I.A.        |                     |
| Relatórios          | Outros      |                     |

### Parte Inferior

| Elemento  | Descrição                                                              |
| --------- | ---------------------------------------------------------------------- |
| Copyright | "©Todos os Direitos Reservados Instituto Todos pela Saúde (ITpS)"      |
| Endereço  | "Avenida Paulista, 1.938 - 16º andar, CEP: 01310-942 - São Paulo (SP)" |
| Link      | "Termos de Uso e Aviso de Privacidade"                                 |

**Critérios de aceite:**

- [x] Footer completo com 3 colunas de links
- [x] Redes sociais com ícones
- [x] Link para termos de uso funcional
- [ ] Links da coluna "Sinapse" apontam para URLs reais (atualmente `#`)

---

## 3.8 Login Overlay (Dialog)

**Status:** ✅ Implementado
**Componente:** `AuthLoginForm`

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

**Critérios de aceite:**

- [x] Dialog renderiza sobre a homepage
- [x] Autenticação funcional via API
- [x] Toggle de visibilidade da senha
- [x] Link "Esqueci minha senha" funcional
