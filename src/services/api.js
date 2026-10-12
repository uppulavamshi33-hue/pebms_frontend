const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('pebms_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Authentication
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid email or password');
    }
    const data = await res.json();
    localStorage.setItem('pebms_token', data.token);
    localStorage.setItem('pebms_user', JSON.stringify(data.user));
    return data;
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }
    const data = await res.json();
    localStorage.setItem('pebms_token', data.token);
    localStorage.setItem('pebms_user', JSON.stringify(data.user));
    return data;
  },

  async loginDemo() {
    const res = await fetch(`${API_BASE}/auth/demo`, { method: 'POST' });
    if (!res.ok) throw new Error('Demo login failed');
    const data = await res.json();
    localStorage.setItem('pebms_token', data.token);
    localStorage.setItem('pebms_user', JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem('pebms_token');
    localStorage.removeItem('pebms_user');
  },

  getCurrentStoredUser() {
    try {
      const u = localStorage.getItem('pebms_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  // Dashboard & Analytics
  async getDashboard(month, year) {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const res = await fetch(`${API_BASE}/analytics/dashboard?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
  },

  async getMonthlyTrends(year) {
    const res = await fetch(`${API_BASE}/analytics/monthly-trends?year=${year}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch monthly trends');
    return res.json();
  },

  async getCategoryBreakdown(type = 'EXPENSE', month, year) {
    const params = new URLSearchParams({ type });
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const res = await fetch(`${API_BASE}/analytics/category-breakdown?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch category breakdown');
    return res.json();
  },

  async getTransactions(startDate, endDate, type, category) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (type) params.append('type', type);
    if (category) params.append('category', category);
    const res = await fetch(`${API_BASE}/analytics/transactions?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  // Incomes (CRUD)
  async getIncomes(startDate, endDate, category) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (category) params.append('category', category);
    const res = await fetch(`${API_BASE}/incomes?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch incomes');
    return res.json();
  },

  async createIncome(data) {
    const res = await fetch(`${API_BASE}/incomes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create income');
    return res.json();
  },

  async updateIncome(id, data) {
    const res = await fetch(`${API_BASE}/incomes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update income');
    return res.json();
  },

  async deleteIncome(id) {
    const res = await fetch(`${API_BASE}/incomes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete income');
    return true;
  },

  // Expenses (CRUD)
  async getExpenses(startDate, endDate, category) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (category) params.append('category', category);
    const res = await fetch(`${API_BASE}/expenses?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch expenses');
    return res.json();
  },

  async createExpense(data) {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create expense');
    return res.json();
  },

  async updateExpense(id, data) {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update expense');
    return res.json();
  },

  async deleteExpense(id) {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete expense');
    return true;
  },

  // Budgets (CRUD)
  async getBudgets(month, year) {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const res = await fetch(`${API_BASE}/budgets?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch budgets');
    return res.json();
  },

  async getBudgetStatuses(month, year) {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const res = await fetch(`${API_BASE}/budgets/status?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch budget statuses');
    return res.json();
  },

  async saveBudget(data) {
    const res = await fetch(`${API_BASE}/budgets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save budget');
    return res.json();
  },

  async deleteBudget(id) {
    const res = await fetch(`${API_BASE}/budgets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete budget');
    return true;
  },

  // Data Seeding & CSV Export
  async seedSampleData() {
    const res = await fetch(`${API_BASE}/data/seed?overwrite=true`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to reseed sample data');
    return res.json();
  },

  getCsvExportUrl(type, category) {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (category) params.append('category', category);
    return `${API_BASE}/data/export/csv?${params.toString()}`;
  }
};
