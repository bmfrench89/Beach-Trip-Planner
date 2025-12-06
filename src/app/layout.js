import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FavoritesProvider } from '@/lib/store';
import NameModal from '@/components/NameModal';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Beach Trip Planner",
  description: "Collaborative beach trip planning board",
};

/**
 * Root Layout Component
 * 
 * This is the top-level layout for the application. It wraps all pages with:
 * - Global styles
 * - Font configurations (Geist Sans and Mono)
 * - FavoritesProvider for managing global state
 * - Navigation bar
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The child components to render
 * @returns {JSX.Element} The rendered Root Layout
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <FavoritesProvider>
          <nav className="main-nav">
            <div className="container">
              <a href="/" className="nav-logo">2026 Beach Planner 🏖️</a>
            </div>
          </nav>
          {children}
          <NameModal />
        </FavoritesProvider>
      </body>
    </html>
  );
}
