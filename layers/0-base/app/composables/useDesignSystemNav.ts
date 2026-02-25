export function useDesignSystemNav() {
  return useNavigation([
    {
      title: 'Cores',
      items: [
        { title: 'Cores da Marca', path: '/design-system' },
        { title: 'Base (Neutros)', path: '/design-system/cores/base' },
        { title: 'Feedback', path: '/design-system/cores/feedback' },
        { title: 'Semânticas', path: '/design-system/cores/semanticas' }
      ]
    },
    {
      title: 'Componentes',
      items: [
        { title: 'Botões', path: '/design-system/componentes/botoes' },
        { title: 'Página de Erro', path: '/design-system/componentes/pagina-de-erro' }
      ]
    }
  ])
}
