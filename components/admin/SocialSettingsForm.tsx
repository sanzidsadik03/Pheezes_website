'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { socialSettingsSchema, type SocialSettingsValues } from '@/lib/validations'
import { updateSocialSettings } from '@/actions/settings'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'
import { FacebookIcon, InstagramIcon, TikTokIcon } from '@/components/ui/icons'
import { toast } from 'sonner'

// This page needs to be a server component to pre-fill. Since we need form, making it a client component with useEffect.
// Actually, let's use a server page + client form pattern.

// Export the client form:
export function SocialSettingsForm({
  defaultValues,
}: {
  defaultValues: SocialSettingsValues
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialSettingsValues>({
    resolver: zodResolver(socialSettingsSchema),
    defaultValues,
  })

  const onSubmit = async (data: SocialSettingsValues) => {
    startTransition(async () => {
      const result = await updateSocialSettings({
        facebookUrl: data.facebookUrl ?? '',
        instagramUrl: data.instagramUrl ?? '',
        tiktokUrl: data.tiktokUrl ?? '',
      })
      if (result.success) {
        toast.success('Social links updated!')
        router.refresh()
      } else {
        toast.error('Failed to update')
      }
    })
  }

  const fields = [
    { id: 'facebookUrl' as const, label: 'Facebook URL', icon: FacebookIcon, placeholder: 'https://facebook.com/pheezes' },
    { id: 'instagramUrl' as const, label: 'Instagram URL', icon: InstagramIcon, placeholder: 'https://instagram.com/pheezes' },
    { id: 'tiktokUrl' as const, label: 'TikTok URL', icon: TikTokIcon, placeholder: 'https://tiktok.com/@pheezes' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            These links appear in the website footer and on social buttons.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {fields.map(({ id, label, icon: Icon, placeholder }) => (
            <div key={id}>
              <Label htmlFor={id}>{label}</Label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pheezes-gray-400" />
                <Input
                  id={id}
                  type="url"
                  {...register(id)}
                  placeholder={placeholder}
                  className="pl-9"
                  error={errors[id]?.message}
                />
              </div>
              {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id]?.message}</p>}
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md" loading={isPending}>
              <Save className="h-4 w-4" />
              Save Social Links
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
