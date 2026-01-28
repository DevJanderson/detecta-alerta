import { z } from 'zod'

/**
 * POST /api/auth/reset-password
 *
 * Solicita reset de senha enviando email com link.
 * SEGURANÇA: Sempre retorna sucesso para não revelar se o email existe.
 */

const resetPasswordSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido').max(255)
})

export default defineEventHandler(async event => {
  // Validar body
  const body = await readBody(event)
  const result = resetPasswordSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados inválidos',
      data: result.error.flatten()
    })
  }

  const { email } = result.data

  try {
    await fetchSinapse('/auth/reset-password', {
      method: 'POST',
      body: { email }
    })
  } catch (error: unknown) {
    // Log seguro (não expõe detalhes em produção)
    logAuthError('Erro ao solicitar reset de senha', error)
    // Não propaga o erro - sempre retorna sucesso
  }

  // Sempre retorna sucesso para não revelar se o email existe
  return {
    message: 'Se o email estiver cadastrado, você receberá as instruções para redefinir sua senha.'
  }
})
