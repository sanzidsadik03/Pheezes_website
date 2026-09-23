import { auth } from '@/lib/auth'
import { generateSignature } from '@/lib/cloudinary'
import { NextResponse } from 'next/server'

// POST /api/upload
// Returns a Cloudinary signed upload signature.
// Only accessible to authenticated admins.
// The client uses this signature to upload directly to Cloudinary,
// so the CLOUDINARY_API_SECRET never reaches the browser.

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const folder: string = body.folder ?? 'pheezes'

    const signatureData = generateSignature(folder)
    return NextResponse.json(signatureData)
  } catch (error) {
    console.error('Upload signature error:', error)
    return NextResponse.json({ error: 'Failed to generate upload signature' }, { status: 500 })
  }
}
