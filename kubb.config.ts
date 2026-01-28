import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'
import { pluginClient } from '@kubb/plugin-client'

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
    pluginClient({
      output: {
        path: './client',
        barrelType: 'named'
      },
      group: {
        type: 'tag',
        name: ({ group }) => `${group}Service`
      },
      client: 'fetch',
      dataReturnType: 'data',
      pathParamsType: 'object'
    })
  ]
})
