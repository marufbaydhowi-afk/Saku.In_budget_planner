import React, { useEffect, useState } from 'react';
import { StorageManager, formatRupiah } from '../utils/storage';
import Navbar from '../components/Navbar';
import {
  CheckCircleIcon, ExclamationTriangleIcon,
  ChartBarIcon, ArrowUpIcon, ArrowDownIcon,
  PencilSquareIcon, PlusIcon, ArchiveBoxIcon
} from '../components/Icons';

export default function Transaksi() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [categoryList, setCategoryList] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, []);

  const loadTransactions = () => {
    const trans = StorageManager.getTransactions();
    setTransactions(trans);
  };

  const loadCategories = () => {
    const cats = StorageManager.getCategories();
    setCategoryList(cats);
    if (cats.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: cats[0] }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name] : name === 'amount' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || formData.amount === '' || formData.amount <= 0 || !formData.category || !formData.date) {
      showAlert('danger', 'Lengkapi semua data transaksi dengan benar.');
      return;
    }

    if (editingId) {
      StorageManager.updateTransaction(editingId, formData);
      setEditingId(null);
      showAlert('success', 'Transaksi berhasil diperbarui!');
    } else {
      StorageManager.addTransaction(formData);
      showAlert('success', 'Transaksi berhasil ditambahkan!');
    }

    loadTransactions();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      type: 'expense',
      category: categoryList[0] || '',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
  };

  const handleEdit = (transaction) => {
    setFormData({
      name: transaction.name,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date
    });
    setEditingId(transaction.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      StorageManager.deleteTransaction(id);
      loadTransactions();
      showAlert('success', 'Transaksi berhasil dihapus.');
    }
  };

  const handleExportCSV = () => {
    let csv = "Nama,Kategori,Jenis,Jumlah,Tanggal\n";
    transactions.forEach(t => {
      csv += `${t.name},${t.category},${t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'},${t.amount},${t.date}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transaksi_saku_in.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and Sort Logic
  let displayTransactions = transactions.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  if (sortBy === 'newest') {
    displayTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === 'oldest') {
    displayTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === 'highest') {
    displayTransactions.sort((a, b) => b.amount - a.amount);
  } else if (sortBy === 'lowest') {
    displayTransactions.sort((a, b) => a.amount - b.amount);
  }

  const incomeTotal = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expenseTotal = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const userEmail = localStorage.getItem('userEmail');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar title="Transaksi Keuangan" userEmail={userEmail} />

      <div className="p-8 space-y-8 animate-fade-up">
        {/* Alerts */}
        {alert && (
          <div className={`${alert.type === 'success' ? 'alert-success' : 'alert-danger'} animate-fade-in`}>
            <span>{alert.type === 'success' ? <CheckCircleIcon className="w-4 h-4" /> : <ExclamationTriangleIcon className="w-4 h-4" />}</span>
            {alert.message}
          </div>
        )}

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="stat-card bg-gradient-to-br from-primary-600 to-indigo-600 shadow-glow-primary">
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2"><ChartBarIcon className="w-5 h-5" /></div>
              <p className="text-white/75 text-xs font-bold uppercase tracking-widest mb-1">Total Transaksi</p>
              <p className="text-2xl font-extrabold tracking-tight">{transactions.length} Item</p>
            </div>
          </div>
          <div className="stat-card bg-gradient-to-br from-emerald-500 to-teal-500 shadow-glow-green">
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2"><ArrowUpIcon className="w-5 h-5" /></div>
              <p className="text-white/75 text-xs font-bold uppercase tracking-widest mb-1">Total Pemasukan</p>
              <p className="text-2xl font-extrabold tracking-tight">{formatRupiah(incomeTotal)}</p>
            </div>
          </div>
          <div className="stat-card bg-gradient-to-br from-rose-500 to-orange-500 shadow-glow-red">
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2"><ArrowDownIcon className="w-5 h-5" /></div>
              <p className="text-white/75 text-xs font-bold uppercase tracking-widest mb-1">Total Pengeluaran</p>
              <p className="text-2xl font-extrabold tracking-tight">{formatRupiah(expenseTotal)}</p>
            </div>
          </div>
        </div>

        {/* ── Transaksi Form ── */}
        <div className="card p-6">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg mb-6 flex items-center gap-2">
            <span className="flex items-center">{editingId ? <PencilSquareIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}</span>
            {editingId ? 'Ubah Transaksi' : 'Tambah Transaksi Baru'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nama Transaksi</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Misal: Uang Saku, Makan Siang"
                  className="input"
                />
              </div>
              <div>
                <label className="form-label">Jumlah (Nominal)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Rp</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="input pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Jenis</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-select input"
                >
                  <option value="expense">Pengeluaran</option>
                  <option value="income">Pemasukan</option>
                </select>
              </div>
              <div>
                <label className="form-label">Kategori</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select input"
                >
                  {categoryList.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Tanggal</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1 py-3 text-base">
                {editingId ? 'Perbarui Transaksi' : 'Simpan Transaksi'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn-secondary px-6">
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── Transaction List with Filter & Sort ── */}
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">Daftar Transaksi</h3>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="btn-success text-xs font-semibold py-2 px-3 flex items-center gap-1.5"
                title="Ekspor ke CSV"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          {/* Search, Filter, Sort Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Cari nama atau kategori..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input pl-9"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="input form-select"
              >
                <option value="all">Semua Jenis</option>
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="input form-select"
              >
                <option value="newest">Tanggal (Terbaru)</option>
                <option value="oldest">Tanggal (Terlama)</option>
                <option value="highest">Nominal Terbesar</option>
                <option value="lowest">Nominal Terkecil</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Nama Transaksi</th>
                  <th className="table-head">Kategori</th>
                  <th className="table-head">Tipe</th>
                  <th className="table-head">Jumlah</th>
                  <th className="table-head">Tanggal</th>
                  <th className="table-head text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayTransactions.length > 0 ? (
                  displayTransactions.map((t) => (
                    <tr key={t.id} className="table-row">
                      <td className="table-cell font-semibold text-slate-900 dark:text-slate-100">{t.name}</td>
                      <td className="table-cell">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
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
                      <td className="table-cell text-center">
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => handleEdit(t)}
                            className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all"
                            title="Edit Transaksi"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                            title="Hapus Transaksi"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      <ArchiveBoxIcon className="w-8 h-8 text-slate-400 mb-2 mx-auto" />
                      <p className="text-sm font-medium">Tidak ada transaksi yang cocok dengan pencarian.</p>
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
