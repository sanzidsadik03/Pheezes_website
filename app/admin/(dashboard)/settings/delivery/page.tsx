import { getSettings } from '@/actions/settings'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { DeliverySettingsClient } from '@/components/admin/DeliverySettingsForm'

export default async function DeliverySettingsPage() {
  const settings = await getSettings()

  return (
    <div>
      <AdminHeader
        title="Delivery Settings"
        subtitle="Configure delivery charges and payment methods shown on the website."
        breadcrumbs={[{ label: 'Settings' }, { label: 'Delivery' }]}
      />
      <DeliverySettingsClient settings={settings} />
    </div>
  )
}
