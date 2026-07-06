import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StorageManager } from '../utils/storage';
import sakuLogo from '../assets/Saku.In_logo.png';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    if (!formData.email || !formData.password) {
      setAlert({ type: 'error', message: 'Email dan password harus diisi.' });
      return;
    }
    if (!formData.email.includes('@')) {
      setAlert({ type: 'error', message: 'Format email tidak valid.' });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = StorageManager.authenticateUser(
        formData.email.toLowerCase(),
        formData.password
      );

      if (result.success) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', result.user.email);
        // Also save userName for sidebar/home greeting
        localStorage.setItem('userName', result.user.name);

        setAlert({ type: 'success', message: 'Login berhasil! Mengalihkan...' });

        setTimeout(() => {
          onLogin();
          navigate('/');
        }, 1000);
      } else {
        setAlert({ type: 'error', message: result.message });
        setLoading(false);
      }
    }, 800);
  };

  const features = [
    {
      text: 'Catat pemasukan & pengeluaran secara teratur',
      icon: (
        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      text: 'Analisis laporan keuangan visual & interaktif',
      icon: (
        <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
    {
      text: 'Kelola kategori khusus sesuai kebutuhanmu',
      icon: (
        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
    },
    {
      text: 'Nyaman di mata dengan dukungan Dark Mode',
      icon: (
        <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* ── Left panel (Hero / Decoration) ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12
                      bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-28 -left-16 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 right-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl" />

        {/* Brand */}
        <div className="relative flex items-center gap-3 z-10">
          <img src={sakuLogo} alt="Saku.In Logo" className="w-11 h-11 rounded-2xl object-contain" />
          <div>
            <div className="text-white font-extrabold text-xl tracking-tight">Saku.In</div>
            <div className="text-white/50 text-xs font-semibold">Budget Planner Mahasiswa</div>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative z-10 my-auto">
          <h1 className="text-5xl font-extrabold text-white leading-[1.15] tracking-tight mb-6">
            Kelola <br />
            Keuanganmu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
              Jauh Lebih Bijak
            </span>
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-6">
            Kendalikan masa depan finansialmu. Catat pengeluaran harian, rencanakan tabungan, dan capai kebebasan finansial tanpa cemas.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 grid grid-cols-2 gap-3.5 border-t border-white/5 pt-8">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 text-white/80 text-xs font-semibold">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <span className="leading-snug">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel (Form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md my-auto animate-fade-up">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-6">
            <img src={sakuLogo} alt="Saku.In Logo" className="w-14 h-14 rounded-2xl object-contain mb-3" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Saku.In</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Budget Planner Mahasiswa</p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-card-lg border border-slate-100 dark:border-slate-800 p-8 sm:p-10">
            <div className="mb-7">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Selamat Datang </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Masuk ke akun kamu untuk melanjutkan pengelolaan</p>
            </div>

            {/* Alert */}
            {alert.message && (
              <div className={`mb-5 p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 transition-all duration-300 ${alert.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/55 dark:border-emerald-500/20'
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/55 dark:border-rose-500/20'
                }`}>
                <span className="text-sm">{alert.type === 'success' ? '✅' : '⚠️'}</span>
                <span>{alert.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contoh@email.com"
                    className="input pl-10"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Fitur reset password belum tersedia secara lokal.')}
                    className="text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    className="input pl-10 pr-10"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-primary-600 cursor-pointer"
                  disabled={loading}
                />
                <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer font-semibold select-none">
                  Ingat saya di perangkat ini
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base rounded-xl font-bold disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Masuk…
                  </span>
                ) : 'Masuk'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Belum punya akun?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>



          <p className="text-center text-xs text-slate-400 mt-6">
            © 2026 Saku.In — Budget Planner
          </p>
        </div>
      </div>
    </div>
  );
}
