/**
 * POST /api/auth/login
 *
 * Adaptador HTTP fino — valida input, executa use case, retorna resposta.
 * Toda lógica de negócio está em server/usecase/login.ts.
 */

import { loginRequestSchema } from '~/generated/sinapse/zod/loginRequestSchema'
import { executeLogin, handleLoginResult } from '../../usecase/login'

export default defineEventHandler(async event => {
  const { username, password } = await validateBody(event, loginRequestSchema)

  const result = await executeLogin({ username, password })

  return handleLoginResult(event, result)
})
