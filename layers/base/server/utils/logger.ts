/**
 * Logger centralizado para o server-side (BFF)
 * Usa consola (já incluso no Nuxt/Nitro) com tag do projeto
 * Auto-importado pelo Nitro em todos os endpoints e utils
 */

import { createConsola } from 'consola'

export const logger = createConsola({ defaults: { tag: 'detecta' } })
