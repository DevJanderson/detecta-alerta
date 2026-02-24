import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'

export default defineConfig({
  name: 'sinapse-api',
  root: '.',
  input: {
    path: 'https://staging.sinapse.org.br/openapi.json'
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
    })
  ]
})
