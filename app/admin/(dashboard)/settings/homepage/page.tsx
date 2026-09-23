import { getRawSettings } from '@/actions/settings'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { HomepageSettingsForm } from '@/components/admin/HomepageSettingsForm'

export default async function HomepageSettingsPage() {
  const settings = await getRawSettings()

  return (
    <div>
      <AdminHeader
        title="Homepage Content"
        subtitle="Edit the hero section title, subtitle, and about text."
        breadcrumbs={[{ label: 'Settings' }, { label: 'Homepage' }]}
      />
      <HomepageSettingsForm
        defaultValues={{
          heroTitle: settings.hero_title ?? '',
          heroSubtitle: settings.hero_subtitle ?? '',
          aboutText: settings.about_text ?? '',
        }}
      />
    </div>
  )
}
