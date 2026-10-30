'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Upload, X, Loader2, AlertCircle, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export interface UploadedAsset {
  url: string
  publicId: string
  type: 'image' | 'video'
}

interface MediaUploaderProps {
  folder: string
  accept?: 'image' | 'video' | 'both'
  onUpload: (asset: UploadedAsset) => void
  maxFiles?: number
  label?: string
  hint?: string
}

// ─── Upload to Cloudinary via Signed Upload ───────────────
export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<{ url: string; publicId: string }> {
  // Get signature from our API
  const sigRes = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  })

  if (!sigRes.ok) throw new Error('Failed to get upload signature')
  const { signature, timestamp, apiKey, cloudName } = await sigRes.json()

  const isVideo = file.type.startsWith('video/')
  const resourceType = isVideo ? 'video' : 'image'

  const formData = new FormData()
  formData.append('file', file)
  formData.append('signature', signature)
  formData.append('timestamp', String(timestamp))
  formData.append('api_key', apiKey)
  formData.append('folder', folder)

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: 'POST', body: formData }
  )

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json().catch(() => ({}))
    console.error('Cloudinary upload error:', errorData)
    throw new Error(errorData.error?.message || 'Upload failed')
  }
  const result = await uploadRes.json()
  return { url: result.secure_url, publicId: result.public_id }
}

export function MediaUploader({
  folder,
  accept = 'image',
  onUpload,
  maxFiles = 10,
  label = 'Upload Files',
  hint,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const acceptTypes: Record<string, string[]> = {}
  if (accept === 'image' || accept === 'both') {
    acceptTypes['image/*'] = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  }
  if (accept === 'video' || accept === 'both') {
    acceptTypes['video/*'] = ['.mp4', '.mov', '.webm', '.avi']
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return
      setUploading(true)
      setProgress(0)

      const total = acceptedFiles.length
      let done = 0

      for (const file of acceptedFiles) {
        try {
          const result = await uploadToCloudinary(file, folder)
          const type = file.type.startsWith('video/') ? 'video' : 'image'
          onUpload({ ...result, type })
          done++
          setProgress(Math.round((done / total) * 100))
        } catch (err: any) {
          console.error(err)
          toast.error(`Failed to upload ${file.name}: ${err.message}`)
        }
      }

      setUploading(false)
      if (done > 0) {
        toast.success(`${done} file${done > 1 ? 's' : ''} uploaded successfully`)
      }
    },
    [folder, onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptTypes,
    maxFiles,
    disabled: uploading,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
        isDragActive
          ? 'border-pheezes-yellow bg-pheezes-yellow/5'
          : 'border-pheezes-gray-200 hover:border-pheezes-yellow hover:bg-pheezes-gray-50',
        uploading && 'cursor-not-allowed opacity-60'
      )}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <div className="space-y-3">
          <Loader2 className="h-8 w-8 text-pheezes-yellow mx-auto animate-spin" />
          <p className="text-sm font-medium text-pheezes-black">Uploading... {progress}%</p>
          <div className="w-full bg-pheezes-gray-100 rounded-full h-1.5 max-w-xs mx-auto">
            <div
              className="bg-pheezes-yellow h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : isDragActive ? (
        <div className="space-y-2">
          <Upload className="h-8 w-8 text-pheezes-yellow mx-auto" />
          <p className="text-sm font-semibold text-pheezes-black">Drop files here</p>
        </div>
      ) : (
        <div className="space-y-2">
          <ImageIcon className="h-8 w-8 text-pheezes-gray-300 mx-auto" />
          <p className="text-sm font-semibold text-pheezes-black">{label}</p>
          <p className="text-xs text-pheezes-gray-400">
            {hint ||
              (accept === 'image'
                ? 'JPG, PNG, WebP — drag & drop or click to browse'
                : accept === 'video'
                  ? 'MP4, MOV, WebM — drag & drop or click to browse'
                  : 'Images and videos supported')}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Image Preview Grid ───────────────────────────────────

interface ImagePreviewGridProps {
  images: Array<{ id?: string; url: string; isPrimary?: boolean }>
  onDelete: (id: string, url: string) => void
  onSetPrimary?: (id: string) => void
  deletingId?: string
}

export function ImagePreviewGrid({
  images,
  onDelete,
  onSetPrimary,
  deletingId,
}: ImagePreviewGridProps) {
  if (images.length === 0) return null

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
      {images.map((img, index) => (
        <div
          key={img.id ?? index}
          className={cn(
            'relative group rounded-xl overflow-hidden aspect-square border-2 transition-all',
            img.isPrimary ? 'border-pheezes-yellow' : 'border-transparent hover:border-pheezes-gray-300'
          )}
        >
          <Image
            src={img.url}
            alt={`Image ${index + 1}`}
            fill
            className="object-cover"
            sizes="100px"
          />

          {/* Primary Badge */}
          {img.isPrimary && (
            <div className="absolute bottom-0 left-0 right-0 bg-pheezes-yellow text-pheezes-black text-center text-[10px] font-bold py-0.5">
              PRIMARY
            </div>
          )}

          {/* Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 p-1">
            {onSetPrimary && !img.isPrimary && img.id && (
              <button
                type="button"
                onClick={() => onSetPrimary(img.id!)}
                className="bg-pheezes-yellow text-pheezes-black text-[9px] font-bold px-1.5 py-1 rounded-md hover:bg-pheezes-yellow-dark"
                title="Set as primary"
              >
                Set Primary
              </button>
            )}
            <button
              type="button"
              onClick={() => img.id && onDelete(img.id, img.url)}
              disabled={deletingId === img.id}
              className="w-7 h-7 bg-red-600 text-white rounded-md flex items-center justify-center hover:bg-red-700 disabled:opacity-50"
              title="Delete image"
            >
              {deletingId === img.id ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
