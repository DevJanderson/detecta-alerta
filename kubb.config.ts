import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'
import { pluginFaker } from '@kubb/plugin-faker'
import { pluginMsw } from '@kubb/plugin-msw'

export default defineConfig({
  name: 'sinapse-api',
  root: '.',
  input: {
    path: './openapi/sinapse-api.json'
  },
  output: {
    path: './generated/sinapse',
    clean: true,
    // Remove extensão .ts dos imports para compatibilidade com bundlers
    extension: {
      '.ts': ''
    }
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: {
        path: './types',
        barrelType: 'named'
      },
      group: {
        type: 'tag',
        name: ({ group }) => `${group}Types`
      },
      enumType: 'enum',
      dateType: 'string'
    }),
    pluginZod({
      output: {
        path: './zod',
        barrelType: 'named'
      },
      group: {
        type: 'tag',
        name: ({ group }) => `${group}Schemas`
      },
      // typed e inferred removidos para evitar problema com verbatimModuleSyntax
      dateType: 'string'
    }),
    pluginFaker({
      output: {
        path: './mocks',
        // IMPORTANTE: false para NÃO incluir no barrel principal
        // Evita carregar @faker-js/faker no bundle de produção
        barrelType: false
      },
      group: {
        type: 'tag',
        name: ({ group }) => `${group}Mocks`
      },
      dateType: 'string'
    }),
    pluginMsw({
      output: {
        path: './msw',
        // IMPORTANTE: false para NÃO incluir no barrel principal
        // MSW handlers só devem ser usados em testes
        barrelType: false
      },
      group: {
        type: 'tag',
        name: ({ group }) => `${group}Handlers`
      }
    })
  ]
})
