'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { removeToken } from '@/lib/api';

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/resources', label: 'Invoices' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="hidden md:flex bg-[#0a0a0f] text-white w-64 flex-col justify-between">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-6">InvoiceNudge</h1>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-2 px-4 rounded transition ${
                    pathname === item.href ? 'bg-[#5c7cfa] font-semibold' : 'hover:bg-zinc-800'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 rounded text-sm transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#0a0a0f] text-white p-4 flex justify-between items-center z-10">
        <h1 className="text-lg font-bold">InvoiceNudge</h1>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#0a0a0f] text-white z-20 p-4 pt-16">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-2 px-4 rounded ${
                    pathname === item.href ? 'bg-[#5c7cfa]' : 'hover:bg-zinc-800'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={handleLogout}
            className="mt-4 w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-16">
        {children}
      </main>
    </div>
  );
}