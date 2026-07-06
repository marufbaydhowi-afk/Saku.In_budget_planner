import React, { useEffect, useState } from 'react';
import { StorageManager } from '../utils/storage';
import Navbar from '../components/Navbar';
import { CheckCircleIcon, ExclamationTriangleIcon, TagIcon } from '../components/Icons';

export default function Kategori() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const cats = StorageManager.getCategories();
    setCategories(cats);
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) {
      showAlert('danger', 'Nama kategori tidak boleh kosong.');
      return;
    }

    if (categories.some(cat => cat.toLowerCase() === trimmed.toLowerCase())) {
      showAlert('danger', `Kategori "${trimmed}" sudah terdaftar.`);
      return;
    }

    StorageManager.addCategory(trimmed);
    loadCategories();
    setNewCategory('');
    showAlert('success', 'Kategori baru berhasil ditambahkan!');
  };

  const handleDeleteCategory = (category) => {
    // Check if there are transactions using this category
    const transactions = StorageManager.getTransactions();
    const isUsed = transactions.some(t => t.category === category);

    if (isUsed) {
      showAlert('danger', `Kategori "${category}" tidak dapat dihapus karena sedang digunakan dalam transaksi.`);
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${category}"?`)) {
      StorageManager.deleteCategory(category);
      loadCategories();
      showAlert('success', `Kategori "${category}" berhasil dihapus.`);
    }
  };

  const userEmail = localStorage.getItem('userEmail');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar title="Manajemen Kategori" userEmail={userEmail} />

      <div className="p-8 space-y-8 animate-fade-up">
        {/* Alerts */}
        {alert && (
          <div className={`${alert.type === 'success' ? 'alert-success' : 'alert-danger'} animate-fade-in`}>
            <span>{alert.type === 'success' ? <CheckCircleIcon className="w-4 h-4" /> : <ExclamationTriangleIcon className="w-4 h-4" />}</span>
            {alert.message}
          </div>
        )}

        {/* Form and Counter Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg mb-4">Tambah Kategori Baru</h3>
            <form onSubmit={handleAddCategory} className="flex gap-3">
              <input
                type="text"
                placeholder="Misal: Kesehatan, Belanja bulanan, Tabungan"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="input flex-1"
              />
              <button type="submit" className="btn-primary px-6 flex-shrink-0">
                Tambah
              </button>
            </form>
          </div>

          <div className="card p-6 flex flex-col justify-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-none shadow-glow-purple">
            <div className="relative z-10 text-center">
              <p className="text-white/75 text-xs font-bold uppercase tracking-widest mb-1">Total Kategori</p>
              <h3 className="text-4xl font-extrabold tracking-tight">{categories.length}</h3>
              <p className="text-white/60 text-xs mt-2">Dapat digunakan untuk mengelompokkan pengeluaran & pemasukan Anda.</p>
            </div>
          </div>
        </div>

        {/* Categories Cards Visual List */}
        <div className="card p-6">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg mb-6">Daftar Kategori</h3>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-primary-200 dark:hover:border-primary-800 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-slate-800 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 text-sm flex-shrink-0">
                      {category[0].toUpperCase()}
                    </div>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300 truncate">
                      {category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                    title="Hapus Kategori"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <TagIcon className="w-10 h-10 text-slate-400 mb-2 mx-auto" />
              <p className="text-sm font-medium">Belum ada kategori terdaftar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
