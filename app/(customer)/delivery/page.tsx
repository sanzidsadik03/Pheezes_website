import { getSettings } from '@/actions/settings'
import { DeliveryInfo } from '@/components/customer/DeliveryInfo'
import { MessengerButton } from '@/components/customer/MessengerButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delivery Information',
  description: 'Delivery charges and payment methods for inside and outside Dhaka.',
}

export default async function DeliveryPage() {
  const settings = await getSettings()

  return (
    <div className="min-h-screen bg-pheezes-black">
      <DeliveryInfo settings={settings} />

      {/* Order CTA */}
      <div className="py-16 text-center px-4">
        <p className="text-white/60 text-base mb-6">
          Ready to order? Contact us on Messenger to place your order.
        </p>
        <MessengerButton
          messengerUrl={settings.messengerUrl}
          variant="primary"
          size="lg"
        />
      </div>
    </div>
  )
}
