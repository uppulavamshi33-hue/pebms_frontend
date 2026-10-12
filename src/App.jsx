import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import MonthlyTrendsChart from './components/MonthlyTrendsChart';
import CategoryDistribution from './components/CategoryDistribution';
import BudgetTracker from './components/BudgetTracker';
import TransactionLedger from './components/TransactionLedger';
import ModalIncome from './components/ModalIncome';
import ModalExpense from './components/ModalExpense';
import ModalBudget from './components/ModalBudget';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { api } from './services/api';
import './App.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function App() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  const [theme, setTheme] = useState(() => localStorage.getItem('pebms_theme') || 'dark');
  const [user, setUser] = useState(() => api.getCurrentStoredUser());
  const [dashboard, setDashboard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pebms_theme', theme);
  }, [theme]);

  // Ensure default demo session on initial visit if not logged in
  useEffect(() => {
    if (!localStorage.getItem('pebms_token')) {
      api.loginDemo()
        .then((res) => {
          setUser(res.user);
        })
        .catch((e) => {
          console.warn('Initial demo login fallback:', e);
        });
    }
  }, []);

  // Fetch Dashboard & Transactions data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [dashData, txData] = await Promise.all([
        api.getDashboard(selectedMonth, selectedYear),
        api.getTransactions(null, null, 'ALL', 'ALL')
      ]);
      setDashboard(dashData);
      setTransactions(txData);
    } catch (err) {
      console.error('Error loading data:', err);
      showToast('Error connecting to backend API', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadData();
  }, [loadData, user]);

  // Authentication Handlers
  const handleAuthSuccess = async (actionType, credentials) => {
    let authRes;
    if (actionType === 'register') {
      authRes = await api.register(credentials.name, credentials.email, credentials.password);
      showToast(`Welcome, ${authRes.user.name}! Account created.`);
    } else if (actionType === 'login') {
      authRes = await api.login(credentials.email, credentials.password);
      showToast(`Welcome back, ${authRes.user.name}!`);
    } else if (actionType === 'demo') {
      authRes = await api.loginDemo();
      showToast('Logged in as Student Demo account!');
    }
    setUser(authRes.user);
    loadData();
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    showToast('Signed out successfully', 'info');
    // Open auth modal for next login
    setAuthModalOpen(true);
  };

  // Income Handlers (CRUD: Create, Read, Update, Delete)
  const handleSaveIncome = async (data) => {
    try {
      if (data.id) {
        await api.updateIncome(data.id, data);
        showToast('Income updated successfully!');
      } else {
        await api.createIncome(data);
        showToast('Income stream recorded!');
      }
      setIncomeModalOpen(false);
      setEditingIncome(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to save income', 'error');
    }
  };

  // Expense Handlers (CRUD: Create, Read, Update, Delete)
  const handleSaveExpense = async (data) => {
    try {
      if (data.id) {
        await api.updateExpense(data.id, data);
        showToast('Expense updated successfully!');
      } else {
        await api.createExpense(data);
        showToast('Expense recorded successfully!');
      }
      setExpenseModalOpen(false);
      setEditingExpense(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to save expense', 'error');
    }
  };

  // Budget Handlers (CRUD: Create, Read, Update, Delete)
  const handleSaveBudget = async (data) => {
    try {
      await api.saveBudget(data);
      showToast(`Budget for ${data.category} updated!`);
      setBudgetModalOpen(false);
      setEditingBudget(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to update budget', 'error');
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Delete this category budget limit?')) return;
    try {
      await api.deleteBudget(id);
      showToast('Budget limit removed');
      loadData();
    } catch (err) {
      showToast('Failed to delete budget', 'error');
    }
  };

  // Transaction Actions (Edit / Delete)
  const handleEditTransaction = (tx) => {
    if (tx.type === 'INCOME') {
      setEditingIncome(tx);
      setIncomeModalOpen(true);
    } else {
      setEditingExpense(tx);
      setExpenseModalOpen(true);
    }
  };

  const handleDeleteTransaction = async (tx) => {
    if (!window.confirm(`Delete ${tx.type.toLowerCase()} "${tx.title}" of $${tx.amount}?`)) return;
    try {
      if (tx.type === 'INCOME') {
        await api.deleteIncome(tx.id);
      } else {
        await api.deleteExpense(tx.id);
      }
      showToast(`${tx.title} deleted successfully`);
      loadData();
    } catch (err) {
      showToast('Failed to delete transaction', 'error');
    }
  };

  // Seed Data Handler
  const handleSeedData = async () => {
    if (!window.confirm('Reset database with complete demo financial records across months?')) return;
    try {
      await api.seedSampleData();
      showToast('Demo data reloaded with rich student income & expense records!');
      loadData();
    } catch (err) {
      showToast('Failed to reload sample data', 'error');
    }
  };

  const selectedMonthName = MONTH_NAMES[selectedMonth - 1] || 'Month';

  // Extract all unique categories for ledger filtering
  const allCategories = Array.from(new Set(transactions.map(t => t.category).filter(Boolean)));

  return (
    <div className="app-wrapper">
      <Header
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        onOpenIncomeModal={() => { setEditingIncome(null); setIncomeModalOpen(true); }}
        onOpenExpenseModal={() => { setEditingExpense(null); setExpenseModalOpen(true); }}
        onOpenBudgetModal={() => { setEditingBudget(null); setBudgetModalOpen(true); }}
        onSeedData={handleSeedData}
        theme={theme}
        setTheme={setTheme}
        user={user}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {loading && !dashboard ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading financial dashboard data...
        </div>
      ) : (
        <>
          {/* 1. Metric KPI Cards */}
          <MetricCards dashboard={dashboard} />

          {/* 2. Charts Row: Annual Monthly Trends & Category Breakdown */}
          <div className="charts-grid">
            <MonthlyTrendsChart
              trends={dashboard?.monthlyTrends || []}
              selectedMonth={selectedMonth}
              onSelectMonth={setSelectedMonth}
              selectedYear={selectedYear}
            />

            <CategoryDistribution
              expenseBreakdown={dashboard?.expenseCategoryBreakdown || []}
              incomeBreakdown={dashboard?.incomeCategoryBreakdown || []}
              selectedMonthName={selectedMonthName}
              selectedYear={selectedYear}
            />
          </div>

          {/* 3. Monthly Budget Control Section (Full CRUD) */}
          <BudgetTracker
            budgetStatuses={dashboard?.budgetStatuses || []}
            onOpenBudgetModal={(budgetToEdit) => {
              setEditingBudget(budgetToEdit || null);
              setBudgetModalOpen(true);
            }}
            onDeleteBudget={handleDeleteBudget}
            selectedMonthName={selectedMonthName}
            selectedYear={selectedYear}
          />

          {/* 4. Complete Transaction History & Ledger (Full CRUD) */}
          <TransactionLedger
            transactions={transactions}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            categories={allCategories}
          />
        </>
      )}

      {/* Modals */}
      <ModalIncome
        isOpen={incomeModalOpen}
        onClose={() => { setIncomeModalOpen(false); setEditingIncome(null); }}
        onSave={handleSaveIncome}
        editingIncome={editingIncome}
      />

      <ModalExpense
        isOpen={expenseModalOpen}
        onClose={() => { setExpenseModalOpen(false); setEditingExpense(null); }}
        onSave={handleSaveExpense}
        editingExpense={editingExpense}
      />

      <ModalBudget
        isOpen={budgetModalOpen}
        onClose={() => { setBudgetModalOpen(false); setEditingBudget(null); }}
        onSave={handleSaveBudget}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        editingBudget={editingBudget}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
