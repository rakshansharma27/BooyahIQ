import { createHash } from 'crypto'

export async function uploadToCloudinary(
  file: File | Buffer,
  folder: string = 'booyahiq'
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData()
  
  if (file instanceof Buffer) {
    const blob = new Blob([new Uint8Array(file)])
    formData.append('file', blob)
  } else if (file instanceof File) {
    formData.append('file', file)
  }
  
  formData.append('upload_preset', 'booyahiq_unsigned')
  formData.append('folder', folder)

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) {
    throw new Error('Cloudinary upload failed')
  }

  const data = await response.json()
  return { url: data.secure_url, publicId: data.public_id }
}

export async function uploadToCloudinaryServer(
  base64Data: string,
  folder: string = 'booyahiq'
): Promise<{ url: string; publicId: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!
  const apiKey = process.env.CLOUDINARY_API_KEY!
  const apiSecret = process.env.CLOUDINARY_API_SECRET!

  const timestamp = Math.round(new Date().getTime() / 1000)

  const formData = new FormData()
  formData.append('file', base64Data)
  formData.append('timestamp', timestamp.toString())
  formData.append('folder', folder)
  formData.append('api_key', apiKey)

  // Simple signature for server-side upload
  const signature = createHash('sha1')
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex')
  
  formData.append('signature', signature)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Cloudinary upload failed: ${err}`)
  }

  const data = await response.json()
  return { url: data.secure_url, publicId: data.public_id }
}
