import { getRawSettings } from '@/actions/settings'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { GeneralSettingsForm } from '@/components/admin/GeneralSettingsForm'

export default async function GeneralSettingsPage() {
  const settings = await getRawSettings()

  return (
    <div>
      <AdminHeader
        title="General Settings"
        subtitle="Site name and tagline settings."
        breadcrumbs={[{ label: 'Settings' }, { label: 'General' }]}
      />
      <GeneralSettingsForm
        defaultValues={{
          siteName: settings.site_name ?? 'Pheezes',
          tagline: settings.tagline ?? 'Gifts that elevate every moment.',
        }}
      />
    </div>
  )
}
