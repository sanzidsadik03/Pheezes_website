'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  loading?: boolean
  variant?: 'destructive' | 'warning'
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  loading = false,
  variant = 'destructive',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm" showClose={false}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div
              className={
                variant === 'destructive'
                  ? 'w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0'
                  : 'w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0'
              }
            >
              <AlertTriangle
                className={
                  variant === 'destructive' ? 'h-5 w-5 text-red-600' : 'h-5 w-5 text-orange-600'
                }
              />
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            size="md"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            size="md"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
