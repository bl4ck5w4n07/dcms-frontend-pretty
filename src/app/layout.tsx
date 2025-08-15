import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/globals.css';

export const metadata: Metadata = {
  title: 'SmileCare Dental - Modern Dental Clinic Management',
  description: 'Complete dental clinic management system for appointments, patient records, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}