import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'ITS-R Universe',
  description: 'ITS-R Universe — In loving memory of Roshan Ali Sahab',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('its-r-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');})()` }} />
      </head>
      <body>{children}</body>
    </html>
  )
}