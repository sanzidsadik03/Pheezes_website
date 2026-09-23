import { Truck, MapPin, CreditCard, Clock } from 'lucide-react'
import type { SiteSettings } from '@/types'

interface DeliveryInfoProps {
  settings: SiteSettings
  compact?: boolean
}

export function DeliveryInfo({ settings, compact = false }: DeliveryInfoProps) {
  if (compact) {
    return (
      <div className="bg-pheezes-gray-50 rounded-xl border border-pheezes-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Truck className="h-4 w-4 text-pheezes-yellow" />
          <span className="text-sm font-semibold text-pheezes-black">Delivery Info</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-pheezes-gray-500">Inside Dhaka</span>
            <span className="font-semibold text-pheezes-black">{settings.deliveryInsideDhaka} TK</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-pheezes-gray-500">Outside Dhaka</span>
            <span className="font-semibold text-pheezes-black">{settings.deliveryOutsideDhaka} TK</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 bg-pheezes-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-0.5 w-8 bg-pheezes-yellow" />
            <span className="text-pheezes-yellow text-sm font-semibold uppercase tracking-wider">
              Shipping
            </span>
            <div className="h-0.5 w-8 bg-pheezes-yellow" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Delivery Information</h2>
          <p className="text-white/50 mt-3 max-w-lg mx-auto">
            {settings.deliveryDescription || 'Fast and reliable delivery across Bangladesh.'}
          </p>
        </div>

        {/* Delivery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inside Dhaka */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 transition-colors">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-pheezes-yellow flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-pheezes-black" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Inside Dhaka</h3>
                <p className="text-white/40 text-sm">Dhaka Metropolitan</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Truck className="h-4 w-4" />
                  Delivery Charge
                </div>
                <span className="text-pheezes-yellow text-2xl font-bold">
                  {settings.deliveryInsideDhaka} TK
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <CreditCard className="h-4 w-4" />
                  Payment
                </div>
                <span className="text-white font-semibold text-sm text-right max-w-[180px]">
                  {settings.deliveryInsideDhakaPayment}
                </span>
              </div>
            </div>
          </div>

          {/* Outside Dhaka */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 transition-colors">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Outside Dhaka</h3>
                <p className="text-white/40 text-sm">Rest of Bangladesh</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Truck className="h-4 w-4" />
                  Delivery Charge
                </div>
                <span className="text-pheezes-yellow text-2xl font-bold">
                  {settings.deliveryOutsideDhaka} TK
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <CreditCard className="h-4 w-4" />
                  Payment
                </div>
                <span className="text-white font-semibold text-sm text-right max-w-[180px]">
                  {settings.deliveryOutsideDhakaPayment}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Note */}
        <div className="flex items-center gap-3 mt-8 p-4 bg-pheezes-yellow/10 border border-pheezes-yellow/20 rounded-xl">
          <Clock className="h-4 w-4 text-pheezes-yellow flex-shrink-0" />
          <p className="text-white/70 text-sm">
            Orders are processed within 1–2 business days after confirmation via Messenger.
          </p>
        </div>
      </div>
    </section>
  )
}
