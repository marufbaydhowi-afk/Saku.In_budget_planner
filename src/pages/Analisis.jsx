import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, ArcElement, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { StorageManager, formatRupiah, calculateTotals } from '../utils/storage';
import Navbar from '../components/Navbar';
import {
  ChartBarIcon, ArrowDownIcon, ArrowUpIcon, FireIcon,
  PieChartIcon, TrendingUpIcon
} from '../components/Icons';

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  ArcElement, BarElement, Title, Tooltip, Legend
);

export default function Analisis() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    avgExpense: 0,
    avgIncome: 0,
    maxExpense: 0
  });
  const [pieData, setPieData] = useState(null);
  const [barData, setBarData] = useState(null);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    loadAnalisis();
  }, []);

  const loadAnalisis = () => {
    const transactions = StorageManager.getTransactions();
    const totals = calculateTotals();

    const expenses = transactions.filter(t => t.type === 'expense');
    const incomes = transactions.filter(t => t.type === 'income');

    const avgExpense = expenses.length > 0
      ? expenses.reduce((sum, t) => sum + t.amount, 0) / expenses.length
      : 0;

    const avgIncome = incomes.length > 0
      ? incomes.reduce((sum, t) => sum + t.amount, 0) / incomes.length
      : 0;

    const maxExpense = expenses.length > 0
      ? Math.max(...expenses.map(t => t.amount))
      : 0;

    setStats({
      totalTransactions: transactions.length,
      avgExpense: Math.round(avgExpense),
      avgIncome: Math.round(avgIncome),
      maxExpense
    });

    // ── Pie Chart (Expenses by Category) ──
    const expensesByCategory = {};
    expenses.forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });

    // Modern color palette
    const colors = [
      'rgba(99, 102, 241, 0.8)',  // indigo
      'rgba(244, 63, 94, 0.8)',   // rose
      'rgba(16, 185, 129, 0.8)',  // emerald
      'rgba(245, 158, 11, 0.8)',  // amber
      'rgba(139, 92, 246, 0.8)',  // purple
      'rgba(20, 184, 166, 0.8)',  // teal
      'rgba(249, 115, 22, 0.8)',  // orange
      'rgba(100, 116, 139, 0.8)'  // slate
    ];
    const borderColors = [
      '#6366f1', '#f43f5e', '#10b981', '#f59e0b',
      '#8b5cf6', '#14b8a6', '#f97316', '#64748b'
    ];

    setPieData({
      labels: Object.keys(expensesByCategory),
      datasets: [
        {
          label: 'Pengeluaran',
          data: Object.values(expensesByCategory),
          backgroundColor: colors.slice(0, Object.keys(expensesByCategory).length),
          borderColor: borderColors.slice(0, Object.keys(expensesByCategory).length),
          borderWidth: 1.5,
        },
      ],
    });

    // ── Bar Chart (Income vs Expense by Month) ──
    const monthlyData = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        monthlyData[monthKey].income += t.amount;
      } else {
        monthlyData[monthKey].expense += t.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    setBarData({
      labels: sortedMonths,
      datasets: [
        {
          label: 'Pemasukan',
          data: sortedMonths.map(m => monthlyData[m].income),
          backgroundColor: 'rgba(16, 185, 129, 0.75)',
          borderColor: '#10b981',
          borderWidth: 1.5,
          borderRadius: 6,
        },
        {
          label: 'Pengeluaran',
          data: sortedMonths.map(m => monthlyData[m].expense),
          backgroundColor: 'rgba(244, 63, 94, 0.75)',
          borderColor: '#f43f5e',
          borderWidth: 1.5,
          borderRadius: 6,
        },
      ],
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { font: { family: 'Plus Jakarta Sans', weight: '600' } }
      },
      tooltip: {
        callbacks: {
          label: ctx => ` ${formatRupiah(ctx.raw)}`,
        }
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans' } } },
      y: { grid: { color: 'rgba(0,0,0,.05)' }, ticks: { font: { family: 'Plus Jakarta Sans' }, callback: v => `Rp ${(v / 1000000).toFixed(1)}jt` } }
    }
  };

  const hasData = stats.totalTransactions > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar title="Analisis Keuangan" userEmail={userEmail} />

      <div className="p-8 space-y-8 animate-fade-up">
        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="stat-card bg-gradient-to-br from-indigo-600 to-primary-600 shadow-glow-primary">
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2"><ChartBarIcon className="w-5 h-5" /></div>
              <p className="text-white/75 text-xs font-bold uppercase tracking-widest mb-1">Total Transaksi</p>
              <p className="text-2xl font-extrabold tracking-tight">{stats.totalTransactions} Transaksi</p>
            </div>
          </div>
          <div className="stat-card bg-gradient-to-br from-rose-500 to-orange-500 shadow-glow-red">
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2"><ArrowDownIcon className="w-5 h-5" /></div>
              <p className="text-white/75 text-xs font-bold uppercase tracking-widest mb-1">Rata-rata Pengeluaran</p>
              <p className="text-2xl font-extrabold tracking-tight">{formatRupiah(stats.avgExpense)}</p>
            </div>
          </div>
          <div className="stat-card bg-gradient-to-br from-emerald-500 to-teal-500 shadow-glow-green">
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2"><ArrowUpIcon className="w-5 h-5" /></div>
              <p className="text-white/75 text-xs font-bold uppercase tracking-widest mb-1">Rata-rata Pemasukan</p>
              <p className="text-2xl font-extrabold tracking-tight">{formatRupiah(stats.avgIncome)}</p>
            </div>
          </div>
          <div className="stat-card bg-gradient-to-br from-purple-600 to-pink-600 shadow-glow-purple">
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2"><FireIcon className="w-5 h-5" /></div>
              <p className="text-white/75 text-xs font-bold uppercase tracking-widest mb-1">Pengeluaran Terbesar</p>
              <p className="text-2xl font-extrabold tracking-tight">{formatRupiah(stats.maxExpense)}</p>
            </div>
          </div>
        </div>

        {/* Charts Container */}
        {hasData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Composition Pie Chart */}
            <div className="card p-6 flex flex-col h-[400px]">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-4 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" /> Komposisi Pengeluaran
              </h3>
              <div className="relative flex-1 min-h-0">
                {pieData && <Pie data={pieData} options={chartOptions} />}
              </div>
            </div>

            {/* Income vs Expense Bar Chart */}
            <div className="card p-6 flex flex-col h-[400px]">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-4 flex items-center gap-2">
                <TrendingUpIcon className="w-5 h-5" /> Perbandingan Bulanan
              </h3>
              <div className="relative flex-1 min-h-0">
                {barData && <Bar data={barData} options={barChartOptions} />}
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-12 text-center text-slate-400">
            <TrendingUpIcon className="w-12 h-12 text-slate-300 mb-3 mx-auto" />
            <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">Belum Ada Data Analisis</h4>
            <p className="text-sm max-w-sm mx-auto mt-2">
              Silakan tambahkan data transaksi pemasukan atau pengeluaran terlebih dahulu agar grafik analisis dapat dimuat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
