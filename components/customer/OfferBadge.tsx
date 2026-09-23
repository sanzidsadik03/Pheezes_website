import { OfferBadge as UIOfferBadge } from '@/components/ui/badge'

export function OfferBadge({ discount }: { discount?: number }) {
  return <UIOfferBadge discount={discount} />
}
