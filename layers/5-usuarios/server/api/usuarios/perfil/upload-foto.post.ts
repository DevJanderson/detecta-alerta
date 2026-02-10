/**
 * POST /api/usuarios/perfil/upload-foto
 *
 * Upload de foto do usuario autenticado.
 * Le multipart form data e encaminha para a API Sinapse.
 */

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nenhum arquivo enviado'
    })
  }

  try {
    // Buscar ID do usuario autenticado
    const rawMe = await fetchSinapse<{ id: number }>('/usuarios/me', {
      accessToken
    })

    // Montar FormData para encaminhar a API Sinapse
    const body = new FormData()
    for (const part of formData) {
      if (part.filename) {
        const blob = new Blob([new Uint8Array(part.data)], {
          type: part.type || 'application/octet-stream'
        })
        body.append(part.name || 'file', blob, part.filename)
      }
    }

    const sinapseApiUrl = getSinapseApiUrl()

    // Usar $fetch direto pois fetchSinapse so suporta JSON body
    const response = await $fetch(`${sinapseApiUrl}/usuarios/${rawMe.id}/upload-foto`, {
      method: 'POST',
      body,
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      timeout: 30000
    })

    return response
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao enviar foto'
      })
    }

    logAuthError('Erro ao fazer upload de foto', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao enviar foto'
    })
  }
})
