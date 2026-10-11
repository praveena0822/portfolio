import { Link, NavLink } from 'react-router-dom';
import { ExternalLink, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { ADMIN_SECTIONS } from '../utils/resources.js';

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white dark:border-line-dark dark:bg-surface-dark">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <p className="font-semibold">Admin dashboard</p>
          <div className="flex items-center gap-1">
            <span className="mr-2 hidden text-sm text-muted dark:text-muted-dark sm:inline">{admin?.email}</span>
            <Link to="/" target="_blank" className="btn-ghost !px-3"><ExternalLink size={16} aria-hidden="true" /><span className="hidden sm:inline">View site</span><span className="sr-only sm:hidden">View site</span></Link>
            <button onClick={toggle} className="btn-ghost !p-2" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button onClick={logout} className="btn-ghost !px-3"><LogOut size={16} aria-hidden="true" />Log out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 md:grid-cols-[13rem_1fr]">
        <nav aria-label="Admin sections" className="md:sticky md:top-4 md:self-start">
          <ul className="flex gap-1 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
            {ADMIN_SECTIONS.map((s) => (
              <li key={s.id} className="shrink-0">
                <NavLink
                  to={`/admin/${s.id}`}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand text-white' : 'text-ink hover:bg-black/5 dark:text-ink-dark dark:hover:bg-white/10'}`
                  }
                >
                  {s.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <main className="card min-w-0">{children}</main>
      </div>
    </div>
  );
}
