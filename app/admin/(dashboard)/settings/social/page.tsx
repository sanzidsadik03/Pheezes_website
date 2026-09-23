import { getRawSettings } from '@/actions/settings'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { SocialSettingsForm } from '@/components/admin/SocialSettingsForm'

export default async function SocialSettingsPage() {
  const settings = await getRawSettings()

  return (
    <div>
      <AdminHeader
        title="Social Media Links"
        subtitle="Update your social media profile links shown in the footer."
        breadcrumbs={[{ label: 'Settings' }, { label: 'Social Media' }]}
      />
      <SocialSettingsForm
        defaultValues={{
          facebookUrl: settings.facebook_url ?? '',
          instagramUrl: settings.instagram_url ?? '',
          tiktokUrl: settings.tiktok_url ?? '',
        }}
      />
    </div>
  )
}
