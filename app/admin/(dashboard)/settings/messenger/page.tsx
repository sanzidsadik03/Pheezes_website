import { getRawSettings } from '@/actions/settings'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { MessengerSettingsForm } from '@/components/admin/MessengerSettingsForm'

export default async function MessengerSettingsPage() {
  const settings = await getRawSettings()

  return (
    <div>
      <AdminHeader
        title="Messenger Settings"
        subtitle="Configure the Messenger URL and default order message."
        breadcrumbs={[{ label: 'Settings' }, { label: 'Messenger' }]}
      />
      <MessengerSettingsForm
        defaultValues={{
          messengerUrl: settings.messenger_url ?? '',
          defaultMessage: settings.messenger_default_message ?? '',
        }}
      />
    </div>
  )
}
