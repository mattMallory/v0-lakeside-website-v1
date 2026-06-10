import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Lexend_Deca } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const lexendDeca = Lexend_Deca({
  variable: '--font-lexend-deca',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Lakeside | More Patient Appointments For Your Clinic',
  description:
    'Lakeside helps natural healthcare clinics generate qualified patient inquiries through proven lead generation systems so you can focus on patient care.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${lexendDeca.variable}`}>
      <body className="font-sans antialiased bg-background">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body>
    </html>
  )
}
