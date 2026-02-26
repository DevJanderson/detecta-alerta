---
title: 'Homepage — Casos de Uso'
description: 'User stories e critérios de aceite da homepage do Detecta Alerta.'
order: 2
---

# Casos de Uso

User stories e critérios de aceite para a homepage. Cada caso de uso representa uma jornada real de um usuário da plataforma.

---

## UC-01: Visualizar panorama nacional

> Como **visitante**, quero ver o panorama geral de lotação de saúde no Brasil para entender se há risco de surtos.

**Fluxo principal:**

1. Visitante acessa a homepage
2. A página carrega com dados nacionais (região "Brasil" selecionada por padrão)
3. O panorama exibe porcentagem, nível de risco e tendência
4. O gráfico mostra as últimas 8 semanas

**Critérios de aceite:**

- [ ] A página carrega com dados nacionais (região "Brasil") por padrão
- [ ] O panorama exibe porcentagem de estabelecimentos acima da média, nível de risco e tendência
- [ ] O gráfico mostra as últimas 8 semanas de lotação vs. média histórica
- [ ] A tabela exibe comparativo das 5 regiões

---

## UC-02: Filtrar por região

> Como **gestor de saúde**, quero filtrar os dados por região ou estado para ver informações relevantes à minha área de atuação.

**Fluxo principal:**

1. Gestor clica na tab "Nordeste" no seletor de região
2. Todos os painéis (panorama, gráfico, tabela, mapa) atualizam para Nordeste
3. Gestor refina selecionando "Bahia" no dropdown de estado
4. Os dados são filtrados para a Bahia

**Fluxo alternativo — via mapa:**

1. Gestor clica no estado da Bahia no mapa interativo
2. O dropdown de estado atualiza automaticamente para "Bahia"
3. Os painéis são filtrados

**Critérios de aceite:**

- [ ] As tabs de região (Brasil, Norte, Nordeste, Centro-Oeste, Sudeste, Sul) filtram todos os painéis
- [ ] Os dropdowns de estado e semana epidemiológica refinam os dados exibidos
- [ ] O mapa destaca visualmente a região/estado selecionado
- [ ] Clique no mapa sincroniza com os dropdowns de filtro

---

## UC-03: Analisar tendências no gráfico

> Como **epidemiologista**, quero comparar a lotação semanal com a média histórica para detectar padrões anormais.

**Fluxo principal:**

1. Epidemiologista observa o gráfico de lotação semanal
2. Ativa "mostrar variação" para ver a amplitude
3. Filtra apenas "UPA" para isolar o tipo de estabelecimento
4. Identifica que UPAs da região Sudeste estão com tendência de alta
5. Lê a análise de especialistas para contexto

**Critérios de aceite:**

- [ ] O gráfico de linhas mostra lotação atual vs. média móvel
- [ ] Posso alternar visualização por tipo de estabelecimento (UBS, UPA, Drogaria)
- [ ] Posso ativar/desativar a linha de variação e a linha de média
- [ ] A análise de especialistas contextualiza os dados exibidos
- [ ] Link "ir para rumores" direciona para `/rumores`

---

## UC-04: Comparar regiões na tabela

> Como **pesquisador**, quero comparar a lotação entre regiões e tipos de estabelecimento em uma tabela consolidada.

**Fluxo principal:**

1. Pesquisador rola até a tabela de "Lotação por Estabelecimento"
2. Visualiza as 5 regiões lado a lado
3. Ordena por coluna "UPA" para identificar quais regiões têm mais pressão nas UPAs
4. Clica no ícone (i) para entender a metodologia de cálculo

**Critérios de aceite:**

- [ ] A tabela exibe as 5 regiões com nível, porcentagem e tendência
- [ ] Cada tipo de estabelecimento (Drogarias, UPA, UBS) tem coluna própria
- [ ] Colunas são ordenáveis (sort)
- [ ] Ícones (i) exibem tooltip com explicação

---

## UC-05: Navegar para detalhes do município

> Como **gestor municipal**, quero acessar rapidamente a página do meu município a partir da homepage.

**Fluxo principal:**

1. Gestor visualiza o panorama nacional
2. Quer ver os dados específicos da sua cidade
3. Clica no CTA "ir para Meu Município"
4. É redirecionado para `/municipio`

**Critérios de aceite:**

- [x] O CTA "Meu Município" é visível após a seção do dashboard
- [x] O botão direciona para `/municipio`
- [x] O design tem destaque visual adequado (fundo pontilhado, botão outline)

---

## UC-06: Login para acesso completo

> Como **usuário cadastrado**, quero fazer login para acessar funcionalidades completas da plataforma.

**Fluxo principal:**

1. Usuário acessa a homepage
2. Dialog de login aparece por cima da página (conteúdo visível desfocado ao fundo)
3. Preenche email e senha
4. Clica em "Entrar"
5. Dialog fecha, página carrega dados completos

**Fluxo alternativo — esqueci a senha:**

1. Usuário clica em "Esqueci minha senha"
2. É redirecionado para `/auth/reset-password`
3. Informa o email e solicita recuperação

**Critérios de aceite:**

- [x] O dialog de login aparece ao acessar a plataforma
- [x] Posso fazer login com email e senha
- [x] Após login, o dialog fecha e a página carrega os dados
- [x] O link "Esqueci minha senha" direciona para recuperação
- [x] Toggle de visibilidade da senha funcional
- [x] Botão "Entrar" desabilitado até preencher os campos

---

## UC-07: Monitorar indicadores regionais

> Como **gestor de saúde**, quero ver rapidamente o nível de risco de cada região sem precisar rolar a página.

**Fluxo principal:**

1. Gestor acessa a homepage
2. Na barra superior fixa, visualiza os 5 indicadores regionais
3. Identifica que "Norte" está com nível "Alto" e tendência de subida
4. Decide filtrar por "Norte" para ver mais detalhes

**Critérios de aceite:**

- [x] A barra de indicadores está fixa no topo
- [x] Exibe as 5 regiões com nível, variação percentual e seta de tendência
- [x] Cores semânticas indicam o nível (verde/amarelo/vermelho)
- [ ] Dados atualizados em tempo real via API
