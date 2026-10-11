import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { initials } from '../utils/helpers.js';

export const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Research' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ name }) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_LINKS.map((l) => l.id));

  const linkClass = (id) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      active === id ? 'text-brand dark:text-brand-light' : 'text-muted hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur dark:border-line-dark dark:bg-surface-dark/95">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4" aria-label="Main">
        <a href="#top" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded bg-brand text-sm font-bold text-white" aria-hidden="true">
            {initials(name || 'Portfolio')}
          </span>
          <span className="hidden sm:inline">{name || 'Portfolio'}</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={linkClass(l.id)} aria-current={active === l.id ? 'true' : undefined}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={toggle} className="btn-ghost !p-2" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="btn-ghost !p-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line px-4 py-2 dark:border-line-dark md:hidden">
          <div className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} className={linkClass(l.id)}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
