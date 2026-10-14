import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata = {
  title: 'ForgeFlow — Manufacturing Management',
  description: 'From Raw Materials to Finished Products—Manage Production in One Place. Enterprise Manufacturing & Production Management System (MPMS).',
  openGraph: {
    title: 'ForgeFlow — Manufacturing Management',
    description: 'From Raw Materials to Finished Products—Manage Production in One Place. Enterprise MPMS for modern factories.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ForgeFlow — Manufacturing Management',
    description: 'From Raw Materials to Finished Products—Manage Production in One Place.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen antialiased bg-slate-50 text-slate-900">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
