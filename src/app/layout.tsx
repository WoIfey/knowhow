import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NextTopLoader from 'nextjs-toploader'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { getUserExperience } from '@/data/challenges/get-experience'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Knowhow',
  description:
    'Practice coding with challenges. Earn XP, unlock achievements and level up.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const xp = await getUserExperience().catch(() => 0)

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          <NextTopLoader showSpinner={false} />
          <Navbar xp={xp} />
          <main className="flex-1">{children}</main>
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
