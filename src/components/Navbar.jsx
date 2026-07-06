import React from 'react';

export default function Navbar({ title, userEmail, darkMode, toggleDarkMode }) {
  const userName = localStorage.getItem('userName') || (userEmail ? userEmail.split('@')[0] : 'User');
  const initials = userName ? userName[0].toUpperCase() : 'U';

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* User badge */}
        {userEmail && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-1.5 pr-3 py-1" title={userEmail}>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {initials}
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 max-w-[140px] truncate capitalize">
              {userName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
