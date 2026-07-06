import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { StorageManager, formatRupiah, calculateTotals } from '../utils/storage';
import Navbar from '../components/Navbar';
import {
  WalletIcon, ArrowUpIcon, ArrowDownIcon, TrophyIcon,
  CheckCircleIcon, ExclamationTriangleIcon, ShieldExclamationIcon,
  ChartBarIcon
} from '../components/Icons';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [totals, setTotals]           = useState({ income: 0, expense: 0, balance: 0 });
  const [largestCat, setLargestCat]   = useState('-');
  const [recent, setRecent]           = useState([]);
  const [budget, setBudget]           = useState(0);
  const [budgetInput, setBudgetInput] = useState('');
  const [budgetMsg, setBudgetMsg]     = useState(null);
  const [chartData, setChartData]     = useState(null);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => { load(); }, []);

  const load = () => {
    const t = calculateTotals();
    setTotals(t);

    const all = StorageManager.getTransactions();

    // Largest category
    const catMap = {};
    all.filter(x => x.type === 'expense').forEach(x => {
      catMap[x.category] = (catMap[x.category] || 0) + x.amount;
    });
    const largest = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
    setLargestCat(largest ? largest[0] : '-');

    setRecent([...all].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));

    const b = StorageManager.getBudget();
    setBudget(b);
    setBudgetInput(b || '');

    // Chart: income vs expense per month
    const monthly = {};
    all.forEach(x => {
      const d = new Date(x.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthly[key]) monthly[key] = { income: 0, expense: 0 };
      monthly[key][x.type] += x.amount;
    });
    const months = Object.keys(monthly).sort();
    setChartData({
      labels: months,
      datasets: [
        {
          label: 'Pemasukan',
          data: months.map(m => monthly[m].income),
          backgroundColor: 'rgba(16,185,129,0.75)',
          borderColor: '#10b981',
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: 'Pengeluaran',
          data: months.map(m => monthly[m].expense),
          backgroundColor: 'rgba(244,63,94,0.75)',
          borderColor: '#f43f5e',
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    });
  };

  const saveBudget = () => {
    const val = Number(budgetInput);
    if (!val || val <= 0) {
      setBudgetMsg({ type: 'error', text: 'Masukkan nominal budget yang valid.' });
      return;
    }
    StorageManager.saveBudget(val);
    setBudget(val);
    setBudgetMsg({ type: 'success', text: 'Budget berhasil disimpan!' });
    setTimeout(() => setBudgetMsg(null), 3000);
  };

  const budgetPct = budget > 0 ? Math.min((totals.expense / budget) * 100, 100) : 0;
  const budgetStatus = budgetPct >= 100 ? 'danger' : budgetPct >= 80 ? 'warning' : 'safe';
  const barColor = { danger: 'bg-rose-500', warning: 'bg-amber-500', safe: 'bg-emerald-500' };

  const statCards = [
    { label: 'Total Saldo', value: formatRupiah(totals.balance), gradient: 'from-primary-600 to-violet-600', shadow: 'shadow-glow-primary', icon: <WalletIcon className="w-5 h-5" /> },
    { label: 'Pemasukan',   value: formatRupiah(totals.income),  gradient: 'from-emerald-500 to-teal-500',    shadow: 'shadow-glow-green',   icon: <ArrowUpIcon className="w-5 h-5" /> },
    { label: 'Pengeluaran', value: formatRupiah(totals.expense), gradient: 'from-rose-500 to-orange-500',     shadow: 'shadow-glow-red',     icon: <ArrowDownIcon className="w-5 h-5" /> },
    { label: 'Kategori Terbesar', value: largestCat,             gradient: 'from-violet-600 to-pink-600',     shadow: 'shadow-glow-purple',  icon: <TrophyIcon className="w-5 h-5" /> },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { font: { family: 'Plus Jakarta Sans', weight: '600' }, boxRadius: 4 } },
      tooltip: {
        callbacks: {
          label: ctx => ` ${formatRupiah(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 12 } } },
      y: { grid: { color: 'rgba(0,0,0,.05)' }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, callback: v => `Rp ${(v / 1000000).toFixed(1)}jt` } },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar title="Dashboard" userEmail={userEmail} />

      <div className="p-8 space-y-6 animate-fade-up">
        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map(s => (
            <div key={s.label} className={`stat-card bg-gradient-to-br ${s.gradient} ${s.shadow}`}>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">{s.icon}</div>
                <p className="text-white/75 text-[10px] font-bold uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-xl font-extrabold tracking-tight leading-tight">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Budget + Chart row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Budget card */}
          <div className="lg:col-span-2 card p-6">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-4">Budget Bulanan</h3>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">Rp</span>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={e => setBudgetInput(e.target.value)}
                  placeholder="0"
                  className="input pl-8"
                />
              </div>
              <button onClick={saveBudget} className="btn-primary px-4 flex-shrink-0">Simpan</button>
            </div>

            {budgetMsg && (
              <div className={`mb-4 ${budgetMsg.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                {budgetMsg.type === 'success' ? <CheckCircleIcon className="w-4 h-4 inline-block mr-1" /> : <ExclamationTriangleIcon className="w-4 h-4 inline-block mr-1" />} {budgetMsg.text}
              </div>
            )}

            {budget > 0 && (
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  <span>Terpakai {Math.round(budgetPct)}%</span>
                  <span>{formatRupiah(totals.expense)} / {formatRupiah(budget)}</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${barColor[budgetStatus]}`} style={{ width: `${budgetPct}%` }} />
                </div>
                <p className={`text-xs font-bold mt-2 ${
                  budgetStatus === 'danger' ? 'text-rose-500' :
                  budgetStatus === 'warning' ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {budgetStatus === 'danger' ? <><ShieldExclamationIcon className="w-4 h-4 inline-block mr-1" /> Budget habis!</> :
                   budgetStatus === 'warning' ? <><ExclamationTriangleIcon className="w-4 h-4 inline-block mr-1" /> Budget hampir habis</> :
                   <><CheckCircleIcon className="w-4 h-4 inline-block mr-1" /> Budget aman</>}
                </p>
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sisa budget</p>
                  <p className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                    {formatRupiah(Math.max(budget - totals.expense, 0))}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="lg:col-span-3 card p-6">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-4">
              Pemasukan vs Pengeluaran
            </h3>
            {chartData && chartData.labels.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <ChartBarIcon className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm">Belum ada data untuk ditampilkan</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Recent transactions ── */}
        <div className="card">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Transaksi Terbaru</h3>
          </div>
          <div className="table-wrapper">
            <table className="w-full">
              <thead>
                <tr>
                  {['Nama', 'Kategori', 'Tipe', 'Jumlah', 'Tanggal'].map(h => (
                    <th key={h} className="table-head">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.length > 0 ? recent.map(t => (
                  <tr key={t.id} className="table-row">
                    <td className="table-cell font-semibold text-slate-900 dark:text-slate-100">{t.name}</td>
                    <td className="table-cell">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {t.category}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={t.type === 'income' ? 'badge-income' : 'badge-expense'}>
                        {t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                      </span>
                    </td>
                    <td className={`table-cell font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                    </td>
                    <td className="table-cell text-slate-400">{t.date}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400 text-sm">
                      Belum ada transaksi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
