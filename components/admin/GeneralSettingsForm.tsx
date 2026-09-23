'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { generalSettingsSchema, type GeneralSettingsValues } from '@/lib/validations'
import { updateGeneralSettings } from '@/actions/settings'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

export function GeneralSettingsForm({ defaultValues }: { defaultValues: GeneralSettingsValues }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const { register, handleSubmit } = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues,
  })

  const onSubmit = async (data: GeneralSettingsValues) => {
    startTransition(async () => {
      const result = await updateGeneralSettings(data)
      if (result.success) {
        toast.success('General settings updated!')
        router.refresh()
      } else {
        toast.error('Failed to update')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>Basic information about your Pheezes store.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="siteName" required>Site Name</Label>
            <Input id="siteName" {...register('siteName')} placeholder="Pheezes" />
          </div>
          <div>
            <Label htmlFor="tagline" required>Tagline</Label>
            <Input id="tagline" {...register('tagline')} placeholder="Gifts that elevate every moment." />
            <p className="text-xs text-pheezes-gray-400 mt-1">Shown in the footer and page metadata.</p>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="md" loading={isPending}>
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
