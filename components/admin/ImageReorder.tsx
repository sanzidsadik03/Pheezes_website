'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import { GripVertical, X, Star, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageItem {
  id: string
  url: string
  isPrimary?: boolean
}

interface ImageReorderProps {
  images: ImageItem[]
  onReorder: (newOrder: string[]) => void
  onDelete?: (id: string) => void
  onSetPrimary?: (id: string) => void
  deletingId?: string
}

function SortableImageItem({
  image,
  onDelete,
  onSetPrimary,
  deletingId,
}: {
  image: ImageItem
  onDelete?: (id: string) => void
  onSetPrimary?: (id: string) => void
  deletingId?: string
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isDeleting = deletingId === image.id

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group rounded-xl overflow-hidden aspect-square border-2 bg-pheezes-gray-50 transition-all',
        image.isPrimary ? 'border-pheezes-yellow shadow-xs' : 'border-pheezes-gray-200 hover:border-pheezes-gray-300',
        isDragging && 'opacity-50 z-50 shadow-2xl scale-105'
      )}
    >
      <Image
        src={image.url}
        alt="Product image"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 33vw, 150px"
      />

      {/* Drag Handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-1.5 left-1.5 p-1 bg-black/60 text-white rounded-md cursor-grab active:cursor-grabbing hover:bg-black/80 transition-colors z-10"
        title="Drag to reorder"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>

      {/* Actions */}
      <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {onSetPrimary && !image.isPrimary && (
          <button
            type="button"
            onClick={() => onSetPrimary(image.id)}
            className="p-1 bg-pheezes-yellow text-pheezes-black rounded-md hover:bg-pheezes-yellow-dark shadow-xs"
            title="Set as primary"
          >
            <Star className="h-3.5 w-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(image.id)}
            disabled={isDeleting}
            className="p-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 shadow-xs"
            title="Delete"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {image.isPrimary && (
        <div className="absolute bottom-0 inset-x-0 bg-pheezes-yellow text-pheezes-black text-[10px] font-bold text-center py-0.5 tracking-wider">
          PRIMARY
        </div>
      )}
    </div>
  )
}

export function ImageReorder({
  images: initialImages,
  onReorder,
  onDelete,
  onSetPrimary,
  deletingId,
}: ImageReorderProps) {
  const [images, setImages] = useState(initialImages)

  useEffect(() => {
    setImages(initialImages)
  }, [initialImages])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((item) => item.id === active.id)
      const newIndex = images.findIndex((item) => item.id === over.id)
      const newItems = arrayMove(images, oldIndex, newIndex)
      setImages(newItems)
      onReorder(newItems.map((item) => item.id))
    }
  }

  if (images.length === 0) return null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {images.map((img) => (
            <SortableImageItem
              key={img.id}
              image={img}
              onDelete={onDelete}
              onSetPrimary={onSetPrimary}
              deletingId={deletingId}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
