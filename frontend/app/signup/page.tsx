'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api, setToken } from '@/lib/api';
import { GoogleSignInButton } from '@/components/ui/google-button';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGoogleSuccess = useCallback(async (credential: string) => {
    try {
      const response = await api.post<{ access_token: string }>('/api/v1/auth/google', { token: credential });
      setToken(response.access_token);
      router.push('/dashboard');
    } catch {
      toast.error('Google sign-in failed. Please try again.');
    }
  }, [router]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await api.post<{ access_token: string }>('/api/v1/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setToken(response.access_token);
      router.push('/dashboard');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {(['name', 'email', 'password', 'confirmPassword'] as const).map((field) => (
            <div className="mb-4" key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-300 capitalize">
                {field === 'confirmPassword' ? 'Confirm Password' : field}
              </label>
              <input
                id={field}
                name={field}
                type={field.toLowerCase().includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]"
              />
              {errors[field] && <p className="text-red-400 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white py-2 px-4 rounded-md transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-zinc-700" />
          <span className="text-zinc-500 text-sm">or</span>
          <div className="flex-1 h-px bg-zinc-700" />
        </div>
        <GoogleSignInButton onSuccess={handleGoogleSuccess} />
        <p className="mt-4 text-center text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="text-[#5c7cfa] hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}