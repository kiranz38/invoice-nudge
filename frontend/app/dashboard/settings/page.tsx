'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api, removeToken } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState({ name: '', email: '', businessName: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await api.get<{ name: string; email: string; business_name: string }>('/api/v1/auth/me');
        setProfile({ name: user.name || '', email: user.email, businessName: user.business_name || '' });
      } catch {
        // handled by api client
      }
    };
    loadProfile();
  }, []);

  const handleProfileSave = async () => {
    try {
      await api.put('/api/v1/auth/me', { name: profile.name, business_name: profile.businessName });
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await api.post('/api/v1/auth/change-password', {
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      });
      toast.success('Password changed');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.error('Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/api/v1/auth/me');
      removeToken();
      toast.success('Account deleted');
      router.push('/');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Profile */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-bold mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <input
              type="text"
              value={profile.businessName}
              onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]"
            />
          </div>
          <button
            onClick={handleProfileSave}
            className="bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white py-2 px-4 rounded-md transition"
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-bold mb-4">Change Password</h2>
        <div className="space-y-4">
          {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="password"
                value={passwordForm[field]}
                onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]"
              />
            </div>
          ))}
          <button
            onClick={handlePasswordSubmit}
            className="bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white py-2 px-4 rounded-md transition"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 p-6 rounded-lg shadow border border-red-200">
        <h2 className="text-lg font-bold mb-2 text-red-700">Danger Zone</h2>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition"
        >
          Delete Account
        </button>
        {showDeleteConfirm && (
          <div className="mt-4 p-4 bg-white rounded border border-red-200">
            <p className="text-sm text-gray-700 mb-4">Are you sure? This action is irreversible.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}