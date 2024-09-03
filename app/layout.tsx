import '@/app/ui/global.css'
import {inter} from "@/app/ui/fonts";

import { Metadata } from 'next';

// template allows other pages to prefix their title eg `Invoices | Acme Dashboard`
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export const metadata: Metadata = {
    title: {
        template: '%s | Acme Dashboard',
        default: 'Acme Dashboard',
    },
    description: 'The official Next.js Learn Dashboard built with App Router.',
    metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
      </html>
  );
}
