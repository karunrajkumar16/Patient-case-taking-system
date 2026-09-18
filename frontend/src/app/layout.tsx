import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediKiosk - Digital Healthcare Kiosk & Clinical Context System',
  description: 'Indian Government Digital Service Portal for Patient Case-Taking and Doctor Clinical Summaries',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
