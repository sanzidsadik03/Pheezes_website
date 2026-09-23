import { getSettings } from '@/actions/settings'
import { Navbar } from '@/components/customer/Navbar'
import { Footer } from '@/components/customer/Footer'

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar messengerUrl={settings.messengerUrl} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  )
}
