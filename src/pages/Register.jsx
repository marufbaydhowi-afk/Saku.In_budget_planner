import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StorageManager } from '../utils/storage';
import sakuLogo from '../assets/Saku.In_logo.png';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    // Validations
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setAlert({ type: 'error', message: 'Semua kolom wajib diisi.' });
      return;
    }
    if (!formData.email.includes('@')) {
      setAlert({ type: 'error', message: 'Format email tidak valid.' });
      return;
    }
    if (formData.password.length < 6) {
      setAlert({ type: 'error', message: 'Password minimal terdiri dari 6 karakter.' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: 'error', message: 'Konfirmasi password tidak cocok.' });
      return;
    }
    if (!formData.agreeTerms) {
      setAlert({ type: 'error', message: 'Anda harus menyetujui Syarat & Ketentuan.' });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = StorageManager.registerUser({
        name: formData.name,
        email: formData.email.toLowerCase(),
        password: formData.password
      });

      if (result.success) {
        setAlert({ type: 'success', message: 'Akun berhasil terdaftar! Mengalihkan ke halaman login...' });
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      } else {
        setAlert({ type: 'error', message: result.message });
        setLoading(false);
      }
    }, 800);
  };

  const benefits = [
    {
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: 'Data Privat & Aman',
      desc: 'Seluruh data keuangan disimpan lokal di perangkatmu.',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
      title: 'Target Keuangan',
      desc: 'Atur budget bulanan agar tidak boros dan hemat pangkal kaya.',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: 'Ringan & Cepat',
      desc: 'Akses tanpa lemot kapan saja langsung dari browser.',
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12
                      bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-28 -left-16 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/3 left-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-xl" />

        {/* Brand logo */}
        <div className="relative flex items-center gap-3 z-10">
          <img src={sakuLogo} alt="Saku.In Logo" className="w-11 h-11 rounded-2xl object-contain" />
          <div>
            <div className="text-white font-extrabold text-xl tracking-tight">Saku.In</div>
            <div className="text-white/50 text-xs font-semibold">Budget Planner Mahasiswa</div>
          </div>
        </div>

        {/* Interactive Visual Element */}
        <div className="relative z-10 my-auto max-w-md">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-8">
            Mulai Langkah Awal<br />
            Menuju{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
              Kebebasan Finansial
            </span>
          </h1>

          <div className="space-y-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg flex-shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{b.title}</h4>
                  <p className="text-white/60 text-xs mt-1 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/40 text-xs relative z-10">
          © 2026 Saku.In
        </p>
      </div>

      {/* ── Right panel (Form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md my-auto animate-fade-up">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-6">
            <img src={sakuLogo} alt="Saku.In Logo" className="w-14 h-14 rounded-2xl object-contain mb-3" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Saku.In</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Budget Planner Mahasiswa</p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-card-lg border border-slate-100 dark:border-slate-800 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Daftar Akun Baru </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Buat akun untuk memulai pencatatan keuanganmu</p>
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
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap Anda"
                    className="input pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

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
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
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
                    placeholder="Min. 6 karakter"
                    className="input pl-10 pr-10"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Ulangi password"
                    className="input pl-10 pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPass ? (
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

              {/* Agree to terms */}
              <div className="flex items-start gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 rounded accent-primary-600 cursor-pointer"
                  disabled={loading}
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer font-medium leading-relaxed">
                  Saya menyetujui <span className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Syarat & Ketentuan</span> serta <span className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Kebijakan Privasi</span> Saku.In
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
                    Mendaftar…
                  </span>
                ) : 'Daftar Sekarang'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                Masuk di sini
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
