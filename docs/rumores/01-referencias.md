# Pesquisa de Referências - Plataformas de Vigilância Epidemiológica

Pesquisa sobre plataformas de Event-Based Surveillance (EBS) para informar o design da layer de notícias/rumores do Detecta Alerta.

> Data: 2026-02-12

---

## Plataformas Analisadas

### 1. ProMED (Program for Monitoring Emerging Diseases)

**Site:** promedmail.org | **Fundado:** 1994 | **Operador:** ISID
**Modelo:** Curadoria humana (45 moderadores globais) | **Acesso:** Público/gratuito

O maior sistema publicamente acessível de relatos de doenças emergentes. Publica 8-13 posts/dia, revisados por especialistas. Historicamente relevante: detectou SARS e COVID-19 precocemente.

**UX:**

- Lista cronológica reversa (estilo boletim/email)
- Cada post: assunto padronizado (`PRO/AH/EDR> [Doença] - [País]: [detalhes]`), número de arquivo, corpo, comentário do moderador
- Arquivo pesquisável com 30+ anos
- Distribuição por email, website, apps iOS/Android, RSS

**Filtros:** Por categoria (humano, animal, planta), busca textual, região, assinatura por tópico

**Alertas:** Boletins curados por email em tempo real. Parceria com samdesk (nov/2024) para geo-fencing e resumos por IA.

**Forças:** Gold standard em vigilância informal, alta confiabilidade, community-driven
**Fraquezas:** Sem dashboard visual/mapa, formato texto longo, quase colapsou em 2023

---

### 2. HealthMap (Boston Children's Hospital / Harvard)

**Site:** healthmap.org | **Fundado:** 2006
**Modelo:** Automatizado (NLP) | **Acesso:** Público/gratuito

Agrega dados de 20.000+ websites (~300 relatos/dia, 85% mídia jornalística). Classificação automática por NLP para exibição em mapa interativo.

**UX:**

- **Map-first design** - mapa interativo (Google Maps) como elemento central
- Marcadores com codificação dupla: cor (5 níveis, vermelho = alta atividade) + tamanho (grande = nacional, pequeno = local)
- Painéis laterais: feeds disponíveis, doenças, alertas por país, feed cronológico
- Slider temporal (janela até 30 dias)
- ~1.000 alertas simultaneamente na janela padrão

**Filtros:** Doença (12 categorias), localização, intervalo de datas, fonte, espécie, buscas predefinidas

**Alertas:** Activity Index (Low-to-High), alertas por email, clique no marcador mostra detalhes + links (Wikipedia, WHO, CDC, PubMed, Google Trends)

**Forças:** Interface intuitiva, NLP com 84% precisão, motor N-grams com 2.300+ padrões
**Fraquezas:** Precisão limitada, evoluindo para BEACON (2025)

---

### 3. GPHIN (Global Public Health Intelligence Network)

**Site:** gphin.canada.ca | **Fundado:** 1997 | **Operador:** PHAC + WHO/GOARN
**Modelo:** Híbrido IA + humano (24/7) | **Acesso:** Restrito (30+ países)

Monitora mídia em 10 idiomas, analisa 20.000-30.000+ relatos/dia. Contribui ~20% do input do WHO EIOS.

**UX:**

- Website protegido com lista de artigos publicados
- Cada artigo: timecodes, geocodes (com desambiguação), categoria, fonte, resumos extrativos
- Busca booleana e translingual
- Gráficos configuráveis e mapas color-coded em tempo real
- **Knowledge graphs** tópicos revelando correlações entre conjuntos de artigos

**Filtros:** Browsing facetado (timecodes, geocodes hierárquicos, doença, fonte), categorias UMLS, relevance scoring por ML

**Alertas:** Email + website, knowledge graphs, estatísticas socioeconômicas por país

**Forças:** Busca translingual, knowledge graphs, pipeline modular, relevance scoring retreinável
**Fraquezas:** Acesso restrito, criticado por "silenciar" alertas pré-COVID-19

---

### 4. EpiWatch (UNSW / Kirby Institute)

**Site:** epiwatch.org | **Fundado:** 2016
**Modelo:** IA + revisão humana | **Acesso:** Público/gratuito

Sistema de alerta precoce com IA que processa OSINT em 46 idiomas. 60%+ dos stakeholders desconheciam os surtos apresentados.

**UX:**

- Dashboard com três componentes: **tabela** pesquisável/ordenável, **mapa GIS** (ArcGIS), **analytics** com tendências
- Info mínima por relato: hora, localização, doenças/síndromes, link original
- Cobertura inclui síndromes clínicas não diagnosticadas (SARI, pneumonia, rash/febre)
- 1 mês gratuito web; registro libera 6 meses em Excel

**Filtros:** Doença/síndrome, localização, ordenação por data/relevância

**Alertas:** Ferramentas analíticas integradas: FLUCAST (severidade influenza), EPIRISK (priorização epidemias), ORIGINS (origens)

**Forças:** Pipeline IA em 3 camadas (NLP/NER + BERT 88.2% + LLMs), open-source, 46 idiomas, revisão humana obrigatória
**Fraquezas:** Interface SPA sem SSR, app mobile em desenvolvimento, histórico limitado sem registro

---

### 5. BlueDot

**Site:** bluedot.global | **Fundado:** 2008 | **Tipo:** Comercial (SaaS)
**Modelo:** IA + especialistas | **Acesso:** Comercial

Escaneie 300.000+ artigos/dia em 130+ idiomas, monitorando 190+ doenças. Detectou COVID-19 em 31/dez/2019, 6 dias antes do alerta da OMS.

**UX:**

- Quatro produtos: Event Alerts, Personalized Briefs, Intelligence Reports, BlueDot Assistant (chat tipo ChatGPT)
- GIS cloud-based com 100+ datasets (viagens aéreas, vigilância, demographics)
- Enterprise-first, API-first

**Filtros:** Geo-fencing por localizações do usuário, doença/síndrome (190+), janela temporal, queries em linguagem natural

**Alertas:** Alertas personalizados por localização, horizon scanning diário, avaliações de risco 24/7

**Forças:** Maior cobertura linguística (130+), assistente conversacional, briefs proativos, track record
**Fraquezas:** Fechado/comercial, custo proibitivo, interface não documentada publicamente

---

### 6. BEACON (Evolução do HealthMap)

**Site:** beaconbio.org | **Lançado:** abril 2025 | **Operador:** Boston University + Boston Children's Hospital
**Modelo:** LLM (PandemIQ Llama) + humano | **Acesso:** Público/gratuito, open-source

~600 surtos, 1.300+ relatos, 100+ doenças, 195 países, usuários em 168 países. Financiamento $6M (NSF, Gates Foundation, BU).

**UX:**

- Mapa com sombreamento de países + pins de localização
- Relatórios estruturados: resumo, data, região, patógeno, doença, população, sintomas
- Submissão de observações pelo usuário (processadas pelo LLM)
- Pipeline: coleta > IA filtra/traduz (7 idiomas) > nível de ameaça > relatório > verificação humana

**Filtros:** Patógeno, doença, espécie, localização/região, intervalo de datas, indicador de "filtros ativos"

**Forças:** Open-source completo (código, schemas, pipelines no GitHub), LLM especializado
**Fraquezas:** Relativamente novo, cobertura de 7 idiomas apenas

---

### 7. WHO EIOS (Epidemic Intelligence from Open Sources)

**Site:** who.int/initiatives/eios | **Operador:** WHO
**Modelo:** Agregação + IA | **Acesso:** Institucional (governos e organizações)

Líder mundial em inteligência open-source para saúde pública. EIOS 2.0 (out/2025): IA para análise automatizada, processamento de rádio com transcrição, interface multilíngue, dashboards aprimorados.

---

## Tabela Comparativa

| Feature                  | ProMED            | HealthMap           | GPHIN             | EpiWatch            | BlueDot            | BEACON            |
| ------------------------ | ----------------- | ------------------- | ----------------- | ------------------- | ------------------ | ----------------- |
| **Modelo**               | Curadoria humana  | Automatizado + mapa | Híbrido IA+humano | IA + revisão humana | IA + especialistas | LLM + humano      |
| **Acesso**               | Público           | Público             | Restrito          | Público             | Comercial          | Público           |
| **Idiomas**              | 5+                | 6+                  | 10                | 46                  | 130+               | 7                 |
| **Volume diário**        | 8-13 posts        | ~300 relatos        | 20-30K artigos    | Milhares            | 300K+ artigos      | ~600 surtos total |
| **Mapa interativo**      | Não               | Sim (central)       | Sim               | Sim (GIS)           | Sim (cloud)        | Sim               |
| **Tabela/feed**          | Lista cronológica | Lista lateral       | Lista facetada    | Tabela sort/filter  | Briefs + alerts    | Relatórios        |
| **IA/NLP**               | Não               | N-grams             | ML + NLP          | NLP + BERT + LLMs   | NLP + ML + LLMs    | LLM (Llama)       |
| **Alertas email**        | Sim               | Sim                 | Sim               | Não                 | Sim                | Não               |
| **Open-source**          | Não               | Parcial             | Não               | Sim                 | Não                | Sim               |
| **Ferramentas de risco** | Não               | Não                 | Não               | FLUCAST, EPIRISK    | Risk assessments   | Não               |

---

## Padrões UX Comuns

### 1. Mapa como elemento central

Todas as plataformas modernas usam mapa interativo com marcadores color-coded, sombreamento de países, zoom hierárquico e clustering. É o ponto de entrada visual principal.

### 2. Feed/lista complementar

Tabela ou lista cronológica reversa ao lado do mapa com informação mínima: doença, localização, data, fonte, link. Funciona como índice navegável.

### 3. Tendências temporais

Slider temporal, gráficos de tendência, animação da progressão geográfica, comparação entre janelas de tempo.

### 4. Relevance scoring

Algoritmos compostos (importância x volume x fontes), ML com feedback, BERT, ponderação exponencial com decaimento. Ajuda a priorizar o que importa.

### 5. Pipeline híbrido IA + humano

IA filtra e prioriza, humano verifica e contextualiza. **Nenhuma plataforma madura confia apenas em IA.**

### 6. Multi-idioma como requisito

De 9 a 130+ idiomas monitorados, tradução neural automática, busca translingual.

### 7. Contexto e artigos relacionados

Links para fontes originais, deduplicação, referência cruzada com bases externas (Wikipedia, WHO, CDC, PubMed).

### 8. Entrega proativa vs busca ativa

Tendência emergente de entregar informação relevante ao usuário (briefs personalizados, alertas por localização) em vez de esperar que ele busque.

---

## Aplicabilidade ao Detecta Alerta

### O que podemos adaptar

| Padrão                            | Referência                   | Aplicação no Detecta Alerta                              |
| --------------------------------- | ---------------------------- | -------------------------------------------------------- |
| Map-first + feed lateral          | HealthMap, BEACON            | Mapa do Brasil com pins por notícia + lista lateral      |
| Filtros facetados                 | GPHIN, EpiWatch              | Doença, região, data, fonte, nível de alerta             |
| Codificação visual por relevância | HealthMap                    | Cor/tamanho dos marcadores por `nivel_alerta`            |
| Tendências temporais              | API `/estatisticas/temporal` | Gráfico de tendência abaixo do mapa                      |
| Relatórios estruturados           | BEACON, EpiWatch             | Card de notícia com campos: doença, região, data, resumo |
| Artigos relacionados              | HealthMap, ProMED            | Endpoint `/relacionadas` já disponível na API            |
| Dashboards de estatísticas        | API `/estatisticas/*`        | Resumo, alertas, distribuição geográfica                 |

### O que não se aplica (por enquanto)

| Padrão                            | Motivo                                  |
| --------------------------------- | --------------------------------------- |
| Pipeline de coleta/NLP            | API Sinapse já faz isso (scraping + IA) |
| Tradução multi-idioma             | Foco no Brasil (pt-BR)                  |
| Submissão de relatos pelo usuário | V1 usa apenas dados da API Sinapse      |
| Assistente conversacional         | Complexidade não justificada na V1      |
| Knowledge graphs                  | Requer infraestrutura adicional         |
| Alertas por email                 | Requer sistema de notificação (V2+)     |

---

## Decisões Informadas

1. **Layout:** Map-first com feed lateral (como HealthMap/BEACON), não lista pura (como ProMED)
2. **Filtros:** Facetados inspirados no GPHIN (doença, região, data, nível de alerta)
3. **Cards de notícia:** Estruturados como BEACON (resumo, doença, região, data, fonte)
4. **Relevância visual:** Color-coded por `nivel_alerta` do campo da API
5. **Progressividade:** Feed público → detalhes com auth → admin (inspirado no modelo EpiWatch)
6. **Estatísticas:** Usar os 4 endpoints de estatísticas da API para dashboard analítico
