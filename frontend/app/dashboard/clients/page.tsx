'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import Modal from '@/components/ui/modal';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface PaginatedResponse {
  items: Client[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

interface ClientForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const emptyForm: ClientForm = { name: '', email: '', phone: '', address: '' };

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState<ClientForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: '20' });
      if (search.trim()) params.set('search', search.trim());
      const res = await api.get<PaginatedResponse>(`/api/v1/clients?${params}`);
      setClients(res.items);
      setTotalPages(res.pages);
    } catch {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Debounce search — reset to page 1 on search change
  useEffect(() => {
    setPage(1);
  }, [search]);

  const openCreateModal = () => {
    setEditingClient(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setForm({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      address: client.address || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingClient(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setSubmitting(true);
    try {
      const body: Record<string, string> = { name: form.name, email: form.email };
      if (form.phone.trim()) body.phone = form.phone;
      if (form.address.trim()) body.address = form.address;

      if (editingClient) {
        await api.put(`/api/v1/clients/${editingClient.id}`, body);
        toast.success('Client updated');
      } else {
        await api.post('/api/v1/clients', body);
        toast.success('Client created');
      }
      closeModal();
      fetchClients();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/v1/clients/${deleteId}`);
      toast.success('Client deleted');
      setDeleteId(null);
      fetchClients();
    } catch {
      toast.error('Failed to delete client');
    }
  };

  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5c7cfa]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white text-sm font-medium rounded-lg transition"
        >
          Add Client
        </button>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white/[0.04] border border-white/10 rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-3 text-left text-sm font-medium text-zinc-400">Name</th>
              <th className="p-3 text-left text-sm font-medium text-zinc-400">Email</th>
              <th className="p-3 text-left text-sm font-medium text-zinc-400">Phone</th>
              <th className="p-3 text-right text-sm font-medium text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-3 text-sm text-white">{client.name}</td>
                <td className="p-3 text-sm text-white">{client.email}</td>
                <td className="p-3 text-sm text-zinc-400">{client.phone || '-'}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => openEditModal(client)}
                    className="text-sm text-[#5c7cfa] hover:text-[#4c6ef5] mr-3 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(client.id)}
                    className="text-sm text-red-400 hover:text-red-300 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-zinc-500">
                  No clients found. Add your first client to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-lg bg-white/[0.06] border border-white/10 text-zinc-400 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span className="text-sm text-zinc-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-lg bg-white/[0.06] border border-white/10 text-zinc-400 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingClient ? 'Edit Client' : 'Add Client'}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]"
                placeholder="Client name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]"
                placeholder="client@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]"
                placeholder="Client address"
                rows={2}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white text-sm font-medium rounded-lg disabled:opacity-50 transition"
            >
              {submitting ? 'Saving...' : editingClient ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Client">
        <p className="text-gray-600 text-sm">
          Are you sure you want to delete this client? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteId(null)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
