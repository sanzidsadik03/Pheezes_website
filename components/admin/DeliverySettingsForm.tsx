'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { deliverySettingsSchema, type DeliverySettingsValues } from '@/lib/validations'
import { updateDeliverySettings } from '@/actions/settings'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, Truck } from 'lucide-react'
import { toast } from 'sonner'
import type { SiteSettings } from '@/types'

interface DeliverySettingsClientProps {
  settings: SiteSettings
}

export function DeliverySettingsClient({ settings }: DeliverySettingsClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliverySettingsValues>({
    resolver: zodResolver(deliverySettingsSchema),
    defaultValues: {
      insideCharge: settings.deliveryInsideDhaka,
      insidePayment: settings.deliveryInsideDhakaPayment,
      outsideCharge: settings.deliveryOutsideDhaka,
      outsidePayment: settings.deliveryOutsideDhakaPayment,
      description: settings.deliveryDescription,
    },
  })

  const onSubmit = async (data: DeliverySettingsValues) => {
    startTransition(async () => {
      const result = await updateDeliverySettings(data)
      if (result.success) {
        toast.success('Delivery settings updated!')
        router.refresh()
      } else {
        toast.error(result.error ?? 'Failed to update')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inside Dhaka */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-pheezes-yellow" />
              <CardTitle>Inside Dhaka</CardTitle>
            </div>
            <CardDescription>Delivery within Dhaka Metropolitan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="insideCharge" required>Delivery Charge (TK)</Label>
              <Input
                id="insideCharge"
                {...register('insideCharge')}
                placeholder="80"
                error={errors.insideCharge?.message}
              />
              {errors.insideCharge && <p className="text-red-500 text-xs mt-1">{errors.insideCharge.message}</p>}
            </div>
            <div>
              <Label htmlFor="insidePayment" required>Payment Method</Label>
              <Input
                id="insidePayment"
                {...register('insidePayment')}
                placeholder="Cash on Delivery (COD)"
                error={errors.insidePayment?.message}
              />
            </div>
          </CardContent>
        </Card>

        {/* Outside Dhaka */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-pheezes-gray-400" />
              <CardTitle>Outside Dhaka</CardTitle>
            </div>
            <CardDescription>Delivery to rest of Bangladesh</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="outsideCharge" required>Delivery Charge (TK)</Label>
              <Input
                id="outsideCharge"
                {...register('outsideCharge')}
                placeholder="120"
                error={errors.outsideCharge?.message}
              />
            </div>
            <div>
              <Label htmlFor="outsidePayment" required>Payment Method</Label>
              <Input
                id="outsidePayment"
                {...register('outsidePayment')}
                placeholder="Advance Payment Required"
                error={errors.outsidePayment?.message}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Info</CardTitle>
          <CardDescription>Shown on the delivery page</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="description">Delivery Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="We deliver all across Bangladesh. Orders are processed within 1-2 business days."
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="md" loading={isPending}>
          <Save className="h-4 w-4" />
          Save Delivery Settings
        </Button>
      </div>
    </form>
  )
}
