import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StorageManager, formatRupiah, calculateTotals } from '../utils/storage';
import Navbar from '../components/Navbar';
import {
  ChartBarIcon, CreditCardIcon, TagIcon, TrendingUpIcon,
  BanknotesIcon
} from '../components/Icons';

export default function Home() {
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [recentTransactions, setRecent] = useState([]);
  const [topCategories, setTopCats] = useState([]);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const t = calculateTotals();
    setTotals(t);

    const all = StorageManager.getTransactions();
    setRecent([...all].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6));

    const catMap = {};
    all.filter(x => x.type === 'expense').forEach(x => {
      catMap[x.category] = (catMap[x.category] || 0) + x.amount;
    });
    setTopCats(
      Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([cat, amount]) => ({ cat, amount }))
    );
  }, []);

  const stats = [
    {
      label: 'Total Saldo',
      value: formatRupiah(totals.balance),
      gradient: 'from-primary-600 to-violet-600',
      shadow: 'shadow-glow-primary',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
    },
    {
      label: 'Pemasukan',
      value: formatRupiah(totals.income),
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-glow-green',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
    },
    {
      label: 'Pengeluaran',
      value: formatRupiah(totals.expense),
      gradient: 'from-rose-500 to-orange-500',
      shadow: 'shadow-glow-red',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      ),
    },
  ];

  const quickLinks = [
    { to: '/dashboard', label: 'Dashboard', desc: 'Lihat ringkasan keuangan', color: 'from-primary-500 to-violet-500', icon: <ChartBarIcon className="w-5 h-5 text-white" /> },
    { to: '/transaksi', label: 'Transaksi', desc: 'Tambah transaksi baru', color: 'from-emerald-500 to-teal-500', icon: <CreditCardIcon className="w-5 h-5 text-white" /> },
    { to: '/kategori', label: 'Kategori', desc: 'Kelola kategori', color: 'from-amber-500 to-orange-500', icon: <TagIcon className="w-5 h-5 text-white" /> },
    { to: '/analisis', label: 'Analisis', desc: 'Lihat grafik & statistik', color: 'from-rose-500 to-pink-500', icon: <TrendingUpIcon className="w-5 h-5 text-white" /> },
  ];

  const userName = localStorage.getItem('userName') || (userEmail ? userEmail.split('@')[0] : 'User');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar title="Home" userEmail={userEmail} />

      <div className="p-8 space-y-8 animate-fade-up">
        {/* ── Hero ── */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-violet-700 p-8 text-white shadow-glow-primary">
          <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/8" />
          <div className="absolute bottom-0 left-1/3 w-36 h-36 rounded-full bg-white/5" />
          <div className="relative z-10">
            <p className="text-primary-200 text-sm font-semibold mb-1">Selamat datang kembali </p>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2 capitalize">{userName}</h2>
            <p className="text-primary-100/80 max-w-sm">
              Kelola keuanganmu dengan mudah. Catat setiap transaksi dan pantau perkembanganmu.
            </p>
            <div className="flex gap-3 mt-6 flex-wrap">
              <Link
                to="/transaksi"
                className="bg-white text-primary-700 font-bold px-5 py-2.5 rounded-xl text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              >
                + Tambah Transaksi
              </Link>
              <Link
                to="/dashboard"
                className="bg-white/15 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/25 transition-all duration-200 backdrop-blur-sm"
              >
                Lihat Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((s) => (
            <div key={s.label} className={`stat-card bg-gradient-to-br ${s.gradient} ${s.shadow}`}>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <p className="text-white/75 text-xs font-bold uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-2xl font-extrabold tracking-tight">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick links + Top category ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Quick links */}
          <div className="lg:col-span-2 card p-6">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-4">Menu Cepat</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((q) => (
                <Link
                  key={q.to}
                  to={q.to}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-card transition-all duration-200 group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${q.color} flex items-center justify-center flex-shrink-0 group-hover:-translate-y-0.5 transition-transform duration-200`}>
                    {q.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{q.label}</div>
                    <div className="text-xs text-slate-500 truncate">{q.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top categories */}
          <div className="card p-6">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-4">Pengeluaran Terbesar</h3>
            {topCategories.length > 0 ? (
              <div className="space-y-3">
                {topCategories.map(({ cat, amount }, i) => {
                  const maxAmt = topCategories[0].amount;
                  const pct = Math.round((amount / maxAmt) * 100);
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{cat}</span>
                        <span className="text-slate-500">{formatRupiah(amount)}</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${i === 0 ? 'bg-rose-500' : 'bg-primary-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <BanknotesIcon className="w-8 h-8 text-slate-400 mb-2 mx-auto" />
                <p className="text-sm">Belum ada data pengeluaran</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Recent transactions ── */}
        <div className="card">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Transaksi Terbaru</h3>
            <Link to="/transaksi" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
              Lihat semua →
            </Link>
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
                {recentTransactions.length > 0 ? recentTransactions.map(t => (
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
