'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface DashboardStats {
  total_clients: number;
  total_invoices: number;
  pending_invoices: number;
  paid_invoices: number;
  overdue_invoices: number;
}

interface Invoice {
  id: string;
  client_id: string;
  amount: number;
  due_date: string;
  status: string;
}

interface PaginatedResponse {
  items: Invoice[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, invoicesRes] = await Promise.all([
          api.get<DashboardStats>('/api/v1/dashboard/stats'),
          api.get<PaginatedResponse>('/api/v1/invoices?per_page=5'),
        ]);
        setStats(statsRes);
        setRecentInvoices(invoicesRes.items);
      } catch {
        // Auth errors handled by api client
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5c7cfa]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-medium text-zinc-400">Total Clients</h3>
            <p className="text-2xl font-bold text-white mt-1">{stats.total_clients}</p>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-medium text-zinc-400">Total Invoices</h3>
            <p className="text-2xl font-bold text-white mt-1">{stats.total_invoices}</p>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-medium text-zinc-400">Pending</h3>
            <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.pending_invoices}</p>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-medium text-zinc-400">Paid</h3>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.paid_invoices}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">Recent Invoices</h2>
        <div className="overflow-x-auto bg-white/[0.04] border border-white/10 rounded-xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3 text-left text-sm font-medium text-zinc-400">Invoice ID</th>
                <th className="p-3 text-left text-sm font-medium text-zinc-400">Amount</th>
                <th className="p-3 text-left text-sm font-medium text-zinc-400">Due Date</th>
                <th className="p-3 text-left text-sm font-medium text-zinc-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3 text-sm text-white">{inv.id.slice(0, 8)}...</td>
                  <td className="p-3 text-sm text-white">${inv.amount.toFixed(2)}</td>
                  <td className="p-3 text-sm text-white">{new Date(inv.due_date).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        inv.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : inv.status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentInvoices.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-zinc-500">
                    No invoices yet. Create your first invoice to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
