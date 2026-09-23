import { v2 as cloudinary } from 'cloudinary'

// ─── Configure Cloudinary ─────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

// ─── Generate Signed Upload Signature ────────────────────
// Used by the /api/upload route — keeps API secret server-side only
export function generateSignature(folder: string): {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
} {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const params = { timestamp, folder }

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  )

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder,
  }
}

// ─── Delete Asset from Cloudinary ────────────────────────
export async function deleteCloudinaryAsset(
  publicId: string,
  resourceType: 'image' | 'video' = 'image'
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  } catch (error) {
    console.error('Failed to delete Cloudinary asset:', error)
    // Don't throw — DB cleanup should proceed even if Cloudinary delete fails
  }
}

// ─── Upload from URL (for seeding) ───────────────────────
export async function uploadFromUrl(
  url: string,
  folder: string,
  publicId?: string
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(url, {
    folder,
    public_id: publicId,
    overwrite: true,
  })
  return { url: result.secure_url, publicId: result.public_id }
}
