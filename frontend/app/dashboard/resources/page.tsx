'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import Modal from '@/components/ui/modal';

interface Invoice {
  id: string;
  client_id: string;
  amount: number;
  due_date: string;
  status: string;
  created_at: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

interface PaginatedResponse {
  items: Invoice[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

interface ClientsResponse {
  items: Client[];
  total: number;
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formClientId, setFormClientId] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDueDate, setFormDueDate] = useState('');

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: '20' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const data = await api.get<PaginatedResponse>(`/api/v1/invoices?${params}`);
      setInvoices(data.items);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const data = await api.get<ClientsResponse>('/api/v1/clients');
      setClients(data.items);
    } catch {
      toast.error('Failed to load clients');
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, search, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this invoice?')) return;
    try {
      await api.delete(`/api/v1/invoices/${id}`);
      toast.success('Invoice deleted');
      fetchInvoices();
    } catch {
      toast.error('Failed to delete invoice');
    }
  };

  const openCreateModal = () => {
    setEditingInvoice(null);
    setFormClientId('');
    setFormAmount('');
    setFormDueDate('');
    fetchClients();
    setModalOpen(true);
  };

  const openEditModal = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormClientId(invoice.client_id);
    setFormAmount(String(invoice.amount));
    // Convert ISO date to YYYY-MM-DD for the date input
    setFormDueDate(invoice.due_date.split('T')[0]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingInvoice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingInvoice && !formClientId) {
      toast.error('Please select a client');
      return;
    }
    if (!formAmount || parseFloat(formAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!formDueDate) {
      toast.error('Please select a due date');
      return;
    }

    setSubmitting(true);
    try {
      if (editingInvoice) {
        await api.put(`/api/v1/invoices/${editingInvoice.id}`, {
          amount: parseFloat(formAmount),
          due_date: new Date(formDueDate).toISOString(),
        });
        toast.success('Invoice updated');
      } else {
        await api.post('/api/v1/invoices', {
          client_id: formClientId,
          amount: parseFloat(formAmount),
          due_date: new Date(formDueDate).toISOString(),
        });
        toast.success('Invoice created');
      }
      closeModal();
      fetchInvoices();
    } catch {
      toast.error(editingInvoice ? 'Failed to update invoice' : 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Invoices</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white rounded-lg text-sm font-medium transition-colors"
        >
          New Invoice
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5c7cfa] placeholder-zinc-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5c7cfa]" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white/[0.04] border border-white/10 rounded-xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-3 text-left text-sm font-medium text-zinc-400">ID</th>
                  <th className="p-3 text-left text-sm font-medium text-zinc-400">Amount</th>
                  <th className="p-3 text-left text-sm font-medium text-zinc-400">Due Date</th>
                  <th className="p-3 text-left text-sm font-medium text-zinc-400">Status</th>
                  <th className="p-3 text-left text-sm font-medium text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
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
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => openEditModal(inv)}
                        className="text-[#5c7cfa] hover:text-[#4c6ef5] text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-zinc-500">
                      No invoices found. Create your first invoice to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {total > 20 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-zinc-700 text-white rounded disabled:opacity-50 hover:bg-white/5 transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-zinc-400">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={invoices.length < 20}
                className="px-3 py-1 border border-zinc-700 text-white rounded disabled:opacity-50 hover:bg-white/5 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Create / Edit Invoice Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingInvoice ? 'Edit Invoice' : 'New Invoice'}
        footer={
          <div className="flex gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit as unknown as () => void}
              disabled={submitting}
              className="px-4 py-2 bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingInvoice ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Client Select - only shown on create */}
          {!editingInvoice && (
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Client</label>
              <select
                value={formClientId}
                onChange={(e) => setFormClientId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]"
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5c7cfa] placeholder-zinc-500"
              required
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Due Date</label>
            <input
              type="date"
              value={formDueDate}
              onChange={(e) => setFormDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5c7cfa] [color-scheme:dark]"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
