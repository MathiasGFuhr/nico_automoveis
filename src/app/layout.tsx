import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nico Automóveis - Veículos Usados e Seminovos em Santo Cristo/RS",
  description: "Encontre o carro dos seus sonhos na Nico Automóveis. Veículos usados e seminovos com garantia, financiamento facilitado e qualidade comprovada em Santo Cristo/RS.",
  keywords: "carros usados, veículos seminovos, Santo Cristo, RS, financiamento, garantia, Nico Automóveis",
  authors: [{ name: "Nico Automóveis" }],
  creator: "Nico Automóveis",
  publisher: "Nico Automóveis",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nicoautomoveis.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Nico Automóveis - Veículos Usados e Seminovos",
    description: "Encontre o carro dos seus sonhos na Nico Automóveis. Veículos usados e seminovos com garantia e qualidade comprovada.",
    url: 'https://nicoautomoveis.com.br',
    siteName: 'Nico Automóveis',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nico Automóveis - Veículos Usados e Seminovos',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nico Automóveis - Veículos Usados e Seminovos",
    description: "Encontre o carro dos seus sonhos na Nico Automóveis. Veículos usados e seminovos com garantia e qualidade comprovada.",
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
