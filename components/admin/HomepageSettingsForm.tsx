'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { homepageSettingsSchema, type HomepageSettingsValues } from '@/lib/validations'
import { updateHomepageSettings } from '@/actions/settings'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

export function HomepageSettingsForm({ defaultValues }: { defaultValues: HomepageSettingsValues }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const { register, handleSubmit } = useForm<HomepageSettingsValues>({
    resolver: zodResolver(homepageSettingsSchema),
    defaultValues,
  })

  const onSubmit = async (data: HomepageSettingsValues) => {
    startTransition(async () => {
      const result = await updateHomepageSettings(data)
      if (result.success) {
        toast.success('Homepage content updated!')
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
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>The large hero text shown at the top of the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input id="heroTitle" {...register('heroTitle')} placeholder="Gifts that elevate every moment." />
            <p className="text-xs text-pheezes-gray-400 mt-1">The main headline on the homepage.</p>
          </div>
          <div>
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Textarea id="heroSubtitle" {...register('heroSubtitle')} placeholder="Discover our curated collection..." rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Section</CardTitle>
          <CardDescription>The brand story text on the homepage and About page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="aboutText">About Text</Label>
          <Textarea
            id="aboutText"
            {...register('aboutText')}
            placeholder="Pheezes is your destination for premium, thoughtfully curated gifts..."
            rows={5}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="md" loading={isPending}>
          <Save className="h-4 w-4" />
          Save Homepage Content
        </Button>
      </div>
    </form>
  )
}
