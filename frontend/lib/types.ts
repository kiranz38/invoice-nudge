export interface User {
  id: string;
  email: string;
  name: string | null;
  business_name: string | null;
  is_active: boolean;
  stripe_customer_id: string | null;
  plan: string;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface DashboardStats {
  total_invoices: number;
  outstanding_amount: number;
  overdue_amount: number;
  collection_rate: number;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  user_id: string;
  amount: number;
  due_date: string;
  status: "pending" | "paid" | "overdue";
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  user_id: string;
  amount: number;
  payment_method: "credit_card" | "paypal";
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  invoice_id: string;
  user_id: string;
  sent_at: string;
  created_at: string;
  updated_at: string;
}