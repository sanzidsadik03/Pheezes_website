import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Pheezes database...\n')

  // ── 1. Admin User ──────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@pheezes.com'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Pheezes1234'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Pheezes Admin',
    },
  })
  console.log(`✅ Admin created: ${admin.email}`)

  // ── 2. Categories ──────────────────────────────────────────
  const categoryData = [
    { name: 'Wallets & Accessories', slug: 'wallets-accessories' },
    { name: 'Gift Sets', slug: 'gift-sets' },
    { name: 'Stationery', slug: 'stationery' },
    { name: 'Home Decor', slug: 'home-decor' },
  ]

  const categories: Record<string, string> = {}
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    })
    categories[cat.slug] = created.id
    console.log(`  ✅ Category: ${cat.name}`)
  }

  // ── 3. Products ────────────────────────────────────────────
  const productData = [
    {
      name: 'Premium Canvas Wallet',
      slug: 'premium-canvas-wallet',
      shortDescription: 'Handcrafted canvas wallet with premium leather trim. Perfect for everyday use.',
      description: `A beautifully crafted wallet made from premium canvas with genuine leather accents.

Features:
• 8 card slots + 2 hidden compartments
• Premium canvas exterior
• Leather trim and stitching
• RFID protection layer
• Available in Black, Navy, and Khaki`,
      regularPrice: new Prisma.Decimal('699.00'),
      offerPrice: new Prisma.Decimal('549.00'),
      offerEnabled: true,
      categoryId: categories['wallets-accessories'],
      availability: 'IN_STOCK' as const,
      visible: true,
      featured: true,
      displayOrder: 1,
      metaTitle: 'Premium Canvas Wallet — Pheezes',
      metaDescription: 'Handcrafted canvas wallet with premium leather trim. 8 card slots, RFID protection.',
    },
    {
      name: 'Luxury Gift Box Set',
      slug: 'luxury-gift-box-set',
      shortDescription: 'An exquisite curated gift box with premium items. Ideal for special occasions.',
      description: `A thoughtfully curated gift box that makes any occasion extra special.

What's included:
• Premium scented candle
• Luxury hand cream
• Designer notebook
• Elegant pen
• Handwritten gift card

Perfect for birthdays, anniversaries, and corporate gifting.`,
      regularPrice: new Prisma.Decimal('1299.00'),
      offerPrice: null,
      offerEnabled: false,
      categoryId: categories['gift-sets'],
      availability: 'IN_STOCK' as const,
      visible: true,
      featured: true,
      displayOrder: 2,
    },
    {
      name: 'Minimalist Leather Card Holder',
      slug: 'minimalist-leather-card-holder',
      shortDescription: 'Ultra-slim genuine leather card holder. Holds up to 6 cards.',
      description: `The perfect minimalist carry. Genuine leather, ultra-slim profile.

Features:
• Genuine full-grain leather
• Holds 6-8 cards + cash slot
• Aging beautifully with use
• Available in Black and Dark Brown`,
      regularPrice: new Prisma.Decimal('450.00'),
      offerPrice: new Prisma.Decimal('349.00'),
      offerEnabled: true,
      categoryId: categories['wallets-accessories'],
      availability: 'IN_STOCK' as const,
      visible: true,
      featured: true,
      displayOrder: 3,
    },
    {
      name: 'Personalized Notebook Set',
      slug: 'personalized-notebook-set',
      shortDescription: 'Hardcover A5 notebooks with personalized name engraving. Set of 2.',
      description: `Beautiful hardcover notebooks, perfect for journaling, notes, and gifting.

Features:
• Hardcover A5 format
• 200 dot-grid pages
• Personalized name/initials option
• Elastic band closure
• Set of 2 notebooks`,
      regularPrice: new Prisma.Decimal('599.00'),
      offerPrice: null,
      offerEnabled: false,
      categoryId: categories['stationery'],
      availability: 'IN_STOCK' as const,
      visible: true,
      featured: false,
      displayOrder: 4,
    },
    {
      name: 'Aromatherapy Candle Set',
      slug: 'aromatherapy-candle-set',
      shortDescription: 'Set of 3 handcrafted soy wax candles. Available in relaxing scents.',
      description: `Handcrafted from 100% natural soy wax. These candles create the perfect ambiance.

Scents available:
• Lavender & Vanilla
• Sandalwood & Cedar
• Rose & Jasmine

Each candle burns for 40+ hours.`,
      regularPrice: new Prisma.Decimal('799.00'),
      offerPrice: new Prisma.Decimal('649.00'),
      offerEnabled: true,
      categoryId: categories['home-decor'],
      availability: 'IN_STOCK' as const,
      visible: true,
      featured: false,
      displayOrder: 5,
    },
    {
      name: 'Bamboo Desk Organizer',
      slug: 'bamboo-desk-organizer',
      shortDescription: 'Eco-friendly bamboo desk organizer with 6 compartments. Coming soon.',
      description: `Sustainably sourced bamboo desk organizer to keep your workspace tidy and elegant.

Features:
• 6 compartment design
• Eco-friendly bamboo
• Natural finish
• Cable management slot`,
      regularPrice: new Prisma.Decimal('899.00'),
      offerPrice: null,
      offerEnabled: false,
      categoryId: categories['home-decor'],
      availability: 'COMING_SOON' as const,
      visible: true,
      featured: false,
      displayOrder: 6,
    },
  ]

  for (const prod of productData) {
    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        regularPrice: prod.regularPrice,
        offerEnabled: prod.offerEnabled,
        featured: prod.featured,
      },
      create: prod,
    })
    console.log(`  ✅ Product: ${product.name}`)

    if (prod.slug === 'premium-canvas-wallet') {
      const sampleVariations = [
        { name: 'Black', availability: 'IN_STOCK' as const, visible: true, displayOrder: 1 },
        { name: 'Navy', availability: 'IN_STOCK' as const, visible: true, displayOrder: 2 },
        { name: 'Khaki', availability: 'OUT_OF_STOCK' as const, visible: true, displayOrder: 3 },
      ]
      for (const v of sampleVariations) {
        const existingVar = await prisma.productVariation.findFirst({
          where: { productId: product.id, name: v.name },
        })
        if (!existingVar) {
          await prisma.productVariation.create({
            data: {
              productId: product.id,
              ...v,
            },
          })
          console.log(`     🎨 Variation: ${v.name}`)
        }
      }
    }
  }

  // ── 4. Reviews ─────────────────────────────────────────────
  const reviewsData = [
    {
      customerName: 'Nadia Rahman',
      description: 'Absolutely loved my purchase from Pheezes! The wallet is beautifully crafted and feels premium. Packaging was gorgeous. Will definitely order again!',
      rating: 5,
      productName: 'Premium Canvas Wallet',
      visible: true,
      displayOrder: 1,
      reviewDate: new Date('2024-06-15'),
    },
    {
      customerName: 'Rafiq Ahmed',
      description: 'Ordered the gift box set for my wife\'s birthday. She was blown away! Every item inside was premium quality. Great customer service through Messenger too.',
      rating: 5,
      productName: 'Luxury Gift Box Set',
      visible: true,
      displayOrder: 2,
      reviewDate: new Date('2024-07-02'),
    },
    {
      customerName: 'Sadia Islam',
      description: 'The card holder is slim, elegant and feels expensive. Exactly what I wanted. Delivery was fast and the packaging was very professional.',
      rating: 5,
      productName: 'Minimalist Leather Card Holder',
      visible: true,
      displayOrder: 3,
      reviewDate: new Date('2024-07-20'),
    },
    {
      customerName: 'Tanvir Hassan',
      description: 'Great notebooks! Perfect for daily journaling. The personalization was a sweet touch — gave it as a gift and my friend was really touched.',
      rating: 4,
      productName: 'Personalized Notebook Set',
      visible: true,
      displayOrder: 4,
      reviewDate: new Date('2024-08-05'),
    },
    {
      customerName: 'Fatema Khanam',
      description: 'The candles smell amazing! Lavender & Vanilla is my favorite. The set makes a perfect gift. Ordered for Eid and everyone loved it!',
      rating: 5,
      productName: 'Aromatherapy Candle Set',
      visible: true,
      displayOrder: 5,
      reviewDate: new Date('2024-08-12'),
    },
  ]

  for (const review of reviewsData) {
    const existing = await prisma.review.findFirst({
      where: { customerName: review.customerName },
    })
    if (!existing) {
      await prisma.review.create({ data: review })
      console.log(`  ✅ Review: ${review.customerName}`)
    } else {
      console.log(`  ⏭️  Review already exists: ${review.customerName}`)
    }
  }

  // ── 5. Default Settings ────────────────────────────────────
  const defaultSettings = [
    // Site info
    { key: 'site_name', value: 'Pheezes' },
    { key: 'tagline', value: 'Gifts that elevate every moment.' },

    // Hero
    { key: 'hero_title', value: 'Gifts that elevate every moment.' },
    { key: 'hero_subtitle', value: 'Discover our curated collection of premium gifts crafted for every special occasion.' },

    // About
    { key: 'about_text', value: 'Pheezes is your destination for premium, thoughtfully curated gifts. We believe every moment deserves something special — something beautiful, meaningful, and memorable.\n\nFounded with a passion for quality and elegance, we select each product with care, ensuring that when you give a Pheezes gift, it truly elevates the moment.' },

    // Delivery
    { key: 'delivery_inside_dhaka', value: '80' },
    { key: 'delivery_inside_dhaka_payment', value: 'Cash on Delivery (COD)' },
    { key: 'delivery_outside_dhaka', value: '120' },
    { key: 'delivery_outside_dhaka_payment', value: 'Advance Payment Required' },
    { key: 'delivery_description', value: 'We deliver all across Bangladesh. Orders are processed within 1–2 business days after confirmation via Messenger.' },

    // Social
    { key: 'facebook_url', value: 'https://facebook.com/pheezes' },
    { key: 'instagram_url', value: '' },
    { key: 'tiktok_url', value: '' },

    // Messenger
    { key: 'messenger_url', value: 'https://m.me/pheezes' },
    { key: 'messenger_default_message', value: "Hi! I'm interested in ordering: {product}. Please let me know availability and details." },
  ]

  for (const setting of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {}, // Don't overwrite existing settings
      create: setting,
    })
  }
  console.log('\n✅ Default settings applied.')

  console.log('\n🎉 Seeding complete!')
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📧 Admin Email:    ${adminEmail}`)
  console.log(`🔑 Admin Password: ${adminPassword}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
