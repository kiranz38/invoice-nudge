import React from 'react';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="InvoiceNudge - Automate your invoicing and payment follow-up." />
        <title>InvoiceNudge</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-[#0a0a0f] text-white min-h-screen`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}