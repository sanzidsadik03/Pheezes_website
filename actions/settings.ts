'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import type { ActionResult, SiteSettings } from '@/types'

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  return session
}

// ─── Default Values ───────────────────────────────────────

const DEFAULTS: Record<string, string> = {
  delivery_inside_dhaka_charge: '80',
  delivery_inside_dhaka_payment: 'Cash on Delivery (COD)',
  delivery_outside_dhaka_charge: '120',
  delivery_outside_dhaka_payment: 'Advance Payment Required',
  delivery_description:
    'We deliver all across Bangladesh. Orders are processed within 1-2 business days.',
  messenger_url: 'https://m.me/pheezes',
  messenger_default_message: 'Hi, I am interested in [Product Name].',
  facebook_url: 'https://facebook.com/pheezes',
  instagram_url: 'https://instagram.com/pheezes',
  tiktok_url: 'https://tiktok.com/@pheezes',
  hero_title: 'Gifts that elevate every moment.',
  hero_subtitle:
    'Discover our curated collection of premium gifts crafted for every special occasion.',
  about_text:
    'Pheezes is your destination for premium, thoughtfully curated gifts. We believe every moment deserves something special — something beautiful, meaningful, and memorable. From elegant accessories to lifestyle essentials, our collection is designed to elevate the gift-giving experience.',
  site_name: 'Pheezes',
  tagline: 'Gifts that elevate every moment.',
}

// ─── Get All Settings (public) ────────────────────────────

export async function getSettings(): Promise<SiteSettings> {
  const map: Record<string, string> = {}

  try {
    const rows = await prisma.settings.findMany()
    rows.forEach((r) => {
      map[r.key] = r.value
    })
  } catch (error) {
    console.warn('getSettings DB fallback to defaults')
  }

  // Merge with defaults for any missing keys
  const get = (key: string) => map[key] ?? DEFAULTS[key] ?? ''

  return {
    deliveryInsideDhaka: get('delivery_inside_dhaka_charge'),
    deliveryInsideDhakaPayment: get('delivery_inside_dhaka_payment'),
    deliveryOutsideDhaka: get('delivery_outside_dhaka_charge'),
    deliveryOutsideDhakaPayment: get('delivery_outside_dhaka_payment'),
    deliveryDescription: get('delivery_description'),
    messengerUrl: get('messenger_url'),
    messengerDefaultMessage: get('messenger_default_message'),
    facebookUrl: get('facebook_url'),
    instagramUrl: get('instagram_url'),
    tiktokUrl: get('tiktok_url'),
    heroTitle: get('hero_title'),
    heroSubtitle: get('hero_subtitle'),
    aboutText: get('about_text'),
    siteName: get('site_name'),
    tagline: get('tagline'),
  }
}

// ─── Get Raw Settings Map (admin) ────────────────────────

export async function getRawSettings(): Promise<Record<string, string>> {
  await requireAdmin()
  const map: Record<string, string> = { ...DEFAULTS }
  try {
    const rows = await prisma.settings.findMany()
    rows.forEach((r) => {
      map[r.key] = r.value
    })
  } catch {
    // fallback to defaults
  }
  return map
}

// ─── Update Settings (admin) ─────────────────────────────
// Batch upsert — accepts a key-value record of settings to update

export async function updateSettings(
  updates: Record<string, string>
): Promise<ActionResult> {
  try {
    await requireAdmin()

    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        prisma.settings.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    )

    // Revalidate all pages that use settings
    revalidatePath('/')
    revalidatePath('/delivery')
    revalidatePath('/about')
    revalidatePath('/products')
    revalidatePath('/admin/settings/delivery')
    revalidatePath('/admin/settings/social')
    revalidatePath('/admin/settings/messenger')
    revalidatePath('/admin/settings/homepage')
    revalidatePath('/admin/settings/general')

    return { success: true }
  } catch (error) {
    console.error('updateSettings error:', error)
    return { success: false, error: 'Failed to update settings. Please try again.' }
  }
}

// ─── Convenience: Update Delivery Settings ────────────────

export async function updateDeliverySettings(data: {
  insideCharge: string
  insidePayment: string
  outsideCharge: string
  outsidePayment: string
  description?: string
}): Promise<ActionResult> {
  return updateSettings({
    delivery_inside_dhaka_charge: data.insideCharge,
    delivery_inside_dhaka_payment: data.insidePayment,
    delivery_outside_dhaka_charge: data.outsideCharge,
    delivery_outside_dhaka_payment: data.outsidePayment,
    delivery_description: data.description ?? '',
  })
}

// ─── Convenience: Update Social Settings ─────────────────

export async function updateSocialSettings(data: {
  facebookUrl?: string
  instagramUrl?: string
  tiktokUrl?: string
}): Promise<ActionResult> {
  return updateSettings({
    facebook_url: data.facebookUrl ?? '',
    instagram_url: data.instagramUrl ?? '',
    tiktok_url: data.tiktokUrl ?? '',
  })
}

// ─── Convenience: Update Messenger Settings ───────────────

export async function updateMessengerSettings(data: {
  messengerUrl: string
  defaultMessage?: string
}): Promise<ActionResult> {
  return updateSettings({
    messenger_url: data.messengerUrl,
    messenger_default_message: data.defaultMessage ?? '',
  })
}

// ─── Convenience: Update Homepage Settings ────────────────

export async function updateHomepageSettings(data: {
  heroTitle?: string
  heroSubtitle?: string
  aboutText?: string
}): Promise<ActionResult> {
  return updateSettings({
    hero_title: data.heroTitle ?? '',
    hero_subtitle: data.heroSubtitle ?? '',
    about_text: data.aboutText ?? '',
  })
}

// ─── Convenience: Update General Settings ────────────────

export async function updateGeneralSettings(data: {
  siteName: string
  tagline?: string
}): Promise<ActionResult> {
  return updateSettings({
    site_name: data.siteName,
    tagline: data.tagline ?? '',
  })
}
