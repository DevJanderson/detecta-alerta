/**
 * POST /api/usuarios/perfil/upload-foto
 *
 * Upload de foto do usuario autenticado.
 * Le multipart form data e encaminha para a API Sinapse.
 */

import { UsuariosErrors } from '#shared/domain/errors'

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: UsuariosErrors.PHOTO_NO_FILE
    })
  }

  // Validacao de upload: tipo MIME, tamanho e quantidade
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const files = formData.filter(p => p.filename)

  if (files.length !== 1) {
    throw createError({
      statusCode: 400,
      statusMessage: UsuariosErrors.PHOTO_TOO_MANY
    })
  }

  const file = files[0]!
  if (!file.type || !ALLOWED_TYPES.includes(file.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: UsuariosErrors.PHOTO_INVALID_TYPE
    })
  }

  if (file.data.length > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 400,
      statusMessage: UsuariosErrors.PHOTO_TOO_LARGE
    })
  }

  try {
    // Buscar ID do usuario autenticado
    const rawMe = await fetchSinapse<{ id: number }>('/usuarios/me', {
      accessToken
    })

    // Montar FormData para encaminhar a API Sinapse
    const formBody = new FormData()
    const blob = new Blob([new Uint8Array(file.data)], { type: file.type })
    formBody.append(file.name || 'file', blob, file.filename)

    const response = await fetchSinapse(`/usuarios/${rawMe.id}/upload-foto`, {
      method: 'POST',
      body: formBody,
      accessToken,
      timeout: 30000
    })

    return response
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || UsuariosErrors.PHOTO_UPLOAD_FAILED
      })
    }

    logAuthError('Erro ao fazer upload de foto', error)

    throw createError({
      statusCode: 500,
      statusMessage: UsuariosErrors.PHOTO_UPLOAD_FAILED
    })
  }
})
