# language: pt

Funcionalidade: Meu Município
  Como usuário autenticado do Detecta Alerta
  Quero visualizar dados epidemiológicos do meu município
  Para monitorar a situação das unidades de saúde locais

  Contexto:
    Dado que estou autenticado no sistema
    E acesso a página "/meu-municipio"

  # ============================================================
  # PERMISSÕES E ACESSO
  # ============================================================

  Cenário: Redirecionar usuário não autenticado para login
    Dado que NÃO estou autenticado no sistema
    Quando acesso a página "/meu-municipio"
    Então devo ser redirecionado para "/auth/login"
    E a URL de retorno deve conter "/meu-municipio"

  Cenário: Exibir página para usuário autenticado
    Então devo ver o mapa interativo
    E devo ver o campo de busca de municípios
    E devo ver o seletor de semana epidemiológica

  # ============================================================
  # ESTADO INICIAL (sem município selecionado)
  # ============================================================

  Cenário: Exibir estado inicial sem município selecionado
    Então o mapa deve mostrar o Brasil inteiro
    E o painel lateral NÃO deve estar visível
    E devo ver o card de onboarding com busca e geolocalização

  Cenário: Exibir onboarding com campo de busca e geolocalização
    Então devo ver o campo "Buscar município"
    E devo ver o botão "Usar minha localização"

  # ============================================================
  # BUSCA DE MUNICÍPIO — Happy Path
  # ============================================================

  Cenário: Buscar município por nome com autocomplete
    Quando digito "Aracat" no campo de busca
    Então devo ver sugestões contendo "Aracati, CE"
    E devo ver sugestões contendo "Aracatu, BA"

  Cenário: Selecionar município da lista de sugestões
    Dado que digitei "Aracaju" no campo de busca
    E vejo "Aracaju, SE" na lista de sugestões
    Quando seleciono "Aracaju, SE"
    Então o mapa deve centralizar no município de Aracaju
    E o painel lateral deve abrir com o título "Aracaju, SE"
    E devo ver os marcadores de unidades de saúde no mapa
    E o card de onboarding deve fechar

  Cenário: Navegar nas sugestões com teclado
    Dado que digitei "São" no campo de busca
    E vejo a lista de sugestões
    Quando pressiono "ArrowDown" duas vezes
    E pressiono "Enter"
    Então o segundo município da lista deve ser selecionado

  Cenário: Abrir busca com atalho de teclado
    Quando pressiono "Ctrl+K"
    Então o campo de busca deve receber foco

  Cenário: Limpar município selecionado
    Dado que selecionei o município "Aracaju, SE"
    Quando clico no botão limpar (×)
    Então o mapa deve voltar a mostrar o Brasil inteiro
    E o painel lateral deve fechar
    E o card de onboarding deve reaparecer

  Cenário: Selecionar município via geolocalização
    Dado que o navegador permite acesso à geolocalização
    Quando clico em "Usar minha localização"
    Então devo ver um indicador de carregamento
    E o município mais próximo deve ser selecionado automaticamente
    E o mapa deve centralizar nesse município

  # ============================================================
  # BUSCA DE MUNICÍPIO — Erros e Edge Cases
  # ============================================================

  Cenário: Buscar município inexistente
    Quando digito "Xyzfoobar" no campo de busca
    Então devo ver a mensagem "Nenhum município encontrado"
    E a lista de sugestões deve estar vazia

  Cenário: Buscar com menos de 3 caracteres
    Quando digito "Ar" no campo de busca
    Então a lista de sugestões NÃO deve aparecer

  Cenário: Geolocalização negada pelo navegador
    Dado que o navegador NEGOU acesso à geolocalização
    Quando clico em "Usar minha localização"
    Então devo ver a mensagem "Não foi possível acessar sua localização"
    E o campo de busca deve continuar disponível

  Cenário: Geolocalização com timeout
    Dado que a geolocalização demora mais de 10 segundos
    Quando clico em "Usar minha localização"
    Então devo ver a mensagem "Tempo esgotado ao buscar localização"

  Cenário: Fechar dropdown de busca ao clicar fora
    Dado que digitei "São" no campo de busca
    E vejo a lista de sugestões
    Quando clico fora do campo de busca
    Então a lista de sugestões deve fechar

  Cenário: Fechar dropdown de busca com Escape
    Dado que digitei "São" no campo de busca
    E vejo a lista de sugestões
    Quando pressiono "Escape"
    Então a lista de sugestões deve fechar
    E o campo de busca deve manter o texto digitado

  # ============================================================
  # SEMANA EPIDEMIOLÓGICA
  # ============================================================

  Cenário: Exibir semana epidemiológica atual por padrão
    Então o seletor deve mostrar a semana epidemiológica atual
    E o formato deve ser "SE {número} ({início} a {fim} {mês}. {ano})"

  Cenário: Trocar semana epidemiológica
    Dado que selecionei o município "Aracaju, SE"
    Quando seleciono a semana epidemiológica 5
    Então os dados de lotação devem recarregar para a SE 5
    E os rumores devem ser filtrados pela SE 5

  Cenário: Não permitir selecionar semana futura
    Dado que a semana atual é a SE 10
    Então as semanas de 11 a 53 NÃO devem estar disponíveis

  # ============================================================
  # PAINEL LATERAL — VISÃO MUNICÍPIO
  # ============================================================

  Cenário: Exibir header do painel lateral com dados do município
    Dado que selecionei o município "Aracaju, SE"
    Então devo ver o título "Aracaju, SE"
    E devo ver o subtítulo "Aracaju, Sergipe — Região Nordeste"
    E devo ver o total de unidades ativas
    E devo ver os botões compartilhar, imprimir e colapsar

  Cenário: Alternar entre tabs resumo e rumores
    Dado que selecionei o município "Aracaju, SE"
    Quando clico na aba "rumores"
    Então devo ver a lista de rumores do município
    Quando clico na aba "resumo"
    Então devo ver os filtros, lotação e alerta

  # ============================================================
  # FILTROS POR TIPO DE ESTABELECIMENTO
  # ============================================================

  Cenário: Exibir filtros com contagem e tendência
    Dado que selecionei o município "Aracaju, SE"
    Então devo ver o filtro "UBS" com contagem e percentual de variação
    E devo ver o filtro "UPA" com contagem e percentual de variação
    E devo ver o filtro "Drogaria" com contagem e percentual de variação

  Cenário: Filtrar marcadores no mapa por tipo
    Dado que selecionei o município "Aracaju, SE"
    E vejo marcadores de UBS, UPA e Drogaria no mapa
    Quando clico no filtro "UBS"
    Então apenas marcadores do tipo UBS devem aparecer no mapa
    E os filtros UPA e Drogaria devem ficar inativos

  Cenário: Desativar filtro e mostrar todos os marcadores
    Dado que selecionei o município "Aracaju, SE"
    E o filtro "UBS" está ativo
    Quando clico novamente no filtro "UBS"
    Então todos os marcadores devem aparecer no mapa

  Cenário: Indicar cor de alerta por percentual de variação
    Dado que selecionei o município "Aracaju, SE"
    E uma categoria tem variação acima de 50%
    Então o indicador dessa categoria deve estar em vermelho (danger)

  Cenário: Indicar cor de alerta moderado
    Dado que selecionei o município "Aracaju, SE"
    E uma categoria tem variação entre 30% e 50%
    Então o indicador dessa categoria deve estar em amarelo (alert)

  # ============================================================
  # LOTAÇÃO E GRÁFICO
  # ============================================================

  Cenário: Exibir card de lotação com nível de risco
    Dado que selecionei o município "Aracaju, SE"
    Então devo ver o card "Lotação"
    E devo ver o badge de nível de risco (Baixo, Médio ou Alto)

  Cenário: Exibir gráfico de lotação em formato de linha
    Dado que selecionei o município "Aracaju, SE"
    Então devo ver o gráfico de lotação
    E o eixo X deve mostrar as semanas epidemiológicas
    E o eixo Y deve mostrar o percentual de ocupação

  Cenário: Alternar entre gráfico de linha e faixa
    Dado que selecionei o município "Aracaju, SE"
    E vejo o gráfico de lotação em formato "linha"
    Quando clico na aba "faixa"
    Então o gráfico deve mudar para formato de área/faixa

  # ============================================================
  # RUMORES E ALERTAS
  # ============================================================

  Cenário: Exibir alerta epidemiológico quando há alerta ativo
    Dado que selecionei o município "Aracaju, SE"
    E existe um alerta epidemiológico ativo para esse município
    Então devo ver o card de alerta com título e descrição
    E devo ver o link "ver todos os rumores"

  Cenário: Não exibir alerta quando não há alertas ativos
    Dado que selecionei o município "Aracaju, SE"
    E NÃO existe alerta epidemiológico ativo para esse município
    Então o card de alerta NÃO deve aparecer

  Cenário: Exibir prévia de rumores na aba resumo
    Dado que selecionei o município "Aracaju, SE"
    E estou na aba "resumo"
    Então devo ver os 3 rumores mais recentes
    E devo ver o link "ir para rumores"

  Cenário: Exibir lista completa de rumores na aba rumores
    Dado que selecionei o município "Aracaju, SE"
    E clico na aba "rumores"
    Então devo ver a lista de rumores com título, fonte, data e tags
    E cada rumor deve ter tags de doenças e regiões
    E cada rumor deve ter o link "ver rumor"

  Cenário: Navegar para rumor individual
    Dado que selecionei o município "Aracaju, SE"
    E estou na aba "rumores"
    Quando clico em "ver rumor" de um rumor
    Então devo ser direcionado para a página do rumor

  # ============================================================
  # MAPA — MARCADORES E INTERAÇÃO
  # ============================================================

  Cenário: Exibir marcadores tipados no mapa
    Dado que selecionei o município "Aracaju, SE"
    Então devo ver marcadores com ícone de estetoscópio para UBS
    E devo ver marcadores com ícone de hospital para UPA
    E devo ver marcadores com ícone de pílula para Drogaria

  Cenário: Exibir polígono do município selecionado
    Dado que selecionei o município "Aracaju, SE"
    Então devo ver o contorno do município em azul claro no mapa

  Cenário: Abrir popup ao clicar em marcador
    Dado que selecionei o município "Aracaju, SE"
    E vejo marcadores no mapa
    Quando clico em um marcador de UBS
    Então devo ver um popup com nome da unidade
    E devo ver o tipo da unidade
    E devo ver o percentual de ocupação

  # ============================================================
  # DETALHES DA UNIDADE (drill-down)
  # ============================================================

  Cenário: Navegar para detalhes de uma unidade
    Dado que selecionei o município "Aracaju, SE"
    E cliquei no marcador de uma UBS no mapa
    Então o painel lateral deve trocar para detalhes da unidade
    E devo ver o botão "Voltar"
    E devo ver o nome e endereço da unidade
    E devo ver as abas "resumo", "rumores" e "sobre"

  Cenário: Voltar da unidade para visão do município
    Dado que estou vendo os detalhes de uma unidade
    Quando clico no botão "Voltar"
    Então o painel lateral deve voltar para a visão do município
    E as abas devem mostrar "resumo" e "rumores"

  Cenário: Exibir gráfico de lotação da unidade individual
    Dado que estou vendo os detalhes de uma unidade
    E estou na aba "resumo"
    Então devo ver o gráfico de barras por semana epidemiológica
    E as cores das barras devem variar conforme o nível de ocupação

  Cenário: Exibir informações CNES da unidade
    Dado que estou vendo os detalhes de uma unidade
    E clico na aba "sobre"
    Então devo ver o endereço completo
    E devo ver o tipo de estabelecimento
    E devo ver se possui dados em tempo real (Disponível/Indisponível)
    E devo ver se a unidade está ativa (Sim/Não)

  Cenário: Tratar unidade sem dados CNES
    Dado que estou vendo os detalhes de uma unidade
    E a API CNES retorna 404 para essa unidade
    Quando clico na aba "sobre"
    Então devo ver a mensagem "Dados CNES indisponíveis para esta unidade"
    E as demais informações devem permanecer visíveis

  # ============================================================
  # CONTROLES DO MAPA
  # ============================================================

  Cenário: Centralizar mapa no município
    Dado que selecionei o município "Aracaju, SE"
    E naveguei o mapa para outra região
    Quando clico no botão "Centralizar"
    Então o mapa deve voltar a centralizar em Aracaju

  Cenário: Mostrar localização do usuário no mapa
    Dado que o navegador permite acesso à geolocalização
    Quando clico no botão "Mostrar meu Local"
    Então devo ver um marcador na minha localização atual

  Cenário: Alternar tela cheia do mapa
    Quando clico no botão "Tela cheia"
    Então o mapa deve ocupar toda a tela
    Quando clico novamente no botão "Tela cheia"
    Então o mapa deve voltar ao tamanho normal

  Cenário: Trocar estilo do mapa
    Quando clico no botão "Trocar Mapa"
    Então o tileset do mapa deve mudar
    E os marcadores devem permanecer visíveis

  # ============================================================
  # AÇÕES DO PAINEL LATERAL
  # ============================================================

  Cenário: Compartilhar link do município
    Dado que selecionei o município "Aracaju, SE"
    Quando clico no botão "Compartilhar"
    Então o link da página deve ser copiado para a área de transferência
    E devo ver uma notificação de confirmação

  Cenário: Imprimir dados do município
    Dado que selecionei o município "Aracaju, SE"
    Quando clico no botão "Imprimir"
    Então o diálogo de impressão do navegador deve abrir

  Cenário: Colapsar e expandir painel lateral
    Dado que selecionei o município "Aracaju, SE"
    E o painel lateral está visível
    Quando clico no botão "Colapsar menu"
    Então o painel lateral deve fechar
    E o mapa deve ocupar toda a largura
    Quando clico no botão para expandir
    Então o painel lateral deve reabrir

  # ============================================================
  # ERROS DE API
  # ============================================================

  Cenário: Tratar erro ao carregar dados epidemiológicos
    Dado que selecionei o município "Aracaju, SE"
    E a API de dados epidemiológicos retorna erro 500
    Então devo ver a mensagem "Erro ao carregar dados epidemiológicos"
    E o mapa deve permanecer visível
    E os controles devem continuar funcionais

  Cenário: Tratar erro ao carregar rumores
    Dado que selecionei o município "Aracaju, SE"
    E a API de notícias retorna erro 500
    Então a aba "resumo" deve mostrar filtros e lotação normalmente
    E a seção de rumores deve mostrar "Não foi possível carregar rumores"

  Cenário: Tratar erro ao carregar unidades do mapa
    Dado que selecionei o município "Aracaju, SE"
    E a API de unidades retorna erro 500
    Então o mapa deve mostrar o polígono do município sem marcadores
    E devo ver a mensagem "Não foi possível carregar unidades"

  Cenário: Tratar município sem unidades de saúde cadastradas
    Dado que selecionei um município sem unidades de saúde
    Então o mapa deve centralizar no município
    E devo ver a mensagem "Nenhuma unidade de saúde encontrada"
    E os filtros devem mostrar contagem zero

  # ============================================================
  # RESPONSIVIDADE
  # ============================================================

  Cenário: Exibir layout mobile sem painel lateral
    Dado que estou em uma tela menor que 1024px
    E selecionei o município "Aracaju, SE"
    Então o mapa deve ocupar toda a tela
    E o painel lateral NÃO deve estar visível como sidebar
    E devo ter acesso aos dados via drawer ou bottom sheet

  Cenário: Exibir layout desktop com painel lateral
    Dado que estou em uma tela maior que 1024px
    E selecionei o município "Aracaju, SE"
    Então o mapa deve ocupar o lado esquerdo
    E o painel lateral deve ocupar 520px no lado direito

  # ============================================================
  # PERFORMANCE
  # ============================================================

  Cenário: Carregar mapa base em menos de 3 segundos
    Quando a página carrega
    Então os tiles do mapa devem estar visíveis em menos de 3 segundos

  Cenário: Autocomplete deve responder em menos de 300ms
    Quando digito "Ara" no campo de busca
    Então as sugestões devem aparecer em menos de 300ms

  Cenário: Transição suave ao selecionar município
    Quando seleciono o município "Aracaju, SE"
    Então o mapa deve animar a centralização (não pular)
    E o painel lateral deve abrir com transição suave
