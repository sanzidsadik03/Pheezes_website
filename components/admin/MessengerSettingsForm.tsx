'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messengerSettingsSchema, type MessengerSettingsValues } from '@/lib/validations'
import { updateMessengerSettings } from '@/actions/settings'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Save, MessageCircle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface MessengerSettingsFormProps {
  defaultValues: MessengerSettingsValues
}

export function MessengerSettingsForm({ defaultValues }: MessengerSettingsFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MessengerSettingsValues>({
    resolver: zodResolver(messengerSettingsSchema),
    defaultValues,
  })

  const messengerUrl = watch('messengerUrl')

  const onSubmit = async (data: MessengerSettingsValues) => {
    startTransition(async () => {
      const result = await updateMessengerSettings({
        messengerUrl: data.messengerUrl,
        defaultMessage: data.defaultMessage ?? '',
      })
      if (result.success) {
        toast.success('Messenger settings updated!')
        router.refresh()
      } else {
        toast.error('Failed to update')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-pheezes-yellow" />
            <CardTitle>Messenger Configuration</CardTitle>
          </div>
          <CardDescription>
            All "Order Now" buttons on the website will open this Messenger URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="messengerUrl" required>Messenger URL</Label>
            <div className="flex gap-2">
              <Input
                id="messengerUrl"
                {...register('messengerUrl')}
                placeholder="https://m.me/pheezes"
                error={errors.messengerUrl?.message}
              />
              {messengerUrl && (
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 border border-pheezes-gray-200 rounded-xl text-sm text-pheezes-gray-500 hover:border-pheezes-yellow hover:text-pheezes-black transition-colors flex-shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                  Test
                </a>
              )}
            </div>
            {errors.messengerUrl && <p className="text-red-500 text-xs mt-1">{errors.messengerUrl.message}</p>}
            <p className="text-xs text-pheezes-gray-400 mt-1">
              Format: https://m.me/your-page-name
            </p>
          </div>

          <div>
            <Label htmlFor="defaultMessage">Default Order Message Template</Label>
            <Textarea
              id="defaultMessage"
              {...register('defaultMessage')}
              placeholder="Hi! I'd like to order: {product}"
              rows={3}
            />
            <p className="text-xs text-pheezes-gray-400 mt-1">
              Use <code className="bg-pheezes-gray-100 px-1 rounded">{'{product}'}</code> as a placeholder for the product name.
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="md" loading={isPending}>
              <Save className="h-4 w-4" />
              Save Messenger Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
