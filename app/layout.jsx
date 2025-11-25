import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from '@/lib/CartContext'
import "./globals.css";
import { Inter } from 'next/font/google'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ 
    subsets: ['latin'],
    display: 'swap', // Shows fallback font immediately
    preload: true,
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CoreComponents",
  description: "Your trusted source for automotive and trucking parts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
