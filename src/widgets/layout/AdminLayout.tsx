import { useLanguage } from '@/app/providers/LanguageContext';
import { LogoutButton } from '@/features/auth';
import { useSessionStore } from '@/entities/session';
import { Button, Avatar } from '@/shared/ui';
import { ThemeToggle } from '@/widgets/theme-toggle';
import { LanguageSwitcher } from '@/widgets/language-switcher';
import {
  Calendar,
  ExternalLink,
  FileText,
  Home,
  Images,
  LayoutDashboard,
  Mail,
  Newspaper,
  Users,
  Handshake,
  Briefcase,
  Settings,
  PenLine,
  ClipboardList,
  Trophy,
} from 'lucide-react';
import { Link, Outlet, NavLink } from 'react-router-dom';

const ADMIN_NAV = [
  { to: '/admin', label: 'nav.dashboard', icon: <LayoutDashboard size={20} />, end: true },
  { to: '/admin/events', label: 'nav.events', icon: <Calendar size={20} /> },
  { to: '/admin/news', label: 'nav.news', icon: <Newspaper size={20} /> },
  { to: '/admin/projects', label: 'nav.projects', icon: <Briefcase size={20} /> },
  { to: '/admin/members', label: 'nav.members', icon: <Users size={20} /> },
  { to: '/admin/registrations', label: 'nav.registrations', icon: <ClipboardList size={20} /> },
  { to: '/admin/submissions', label: 'nav.submissions', icon: <PenLine size={20} /> },
  { to: '/admin/contacts', label: 'nav.contacts', icon: <Mail size={20} /> },
  { to: '/admin/documents', label: 'nav.documents', icon: <FileText size={20} /> },
  { to: '/admin/gallery', label: 'nav.gallery', icon: <Images size={20} /> },
  { to: '/admin/partners', label: 'nav.partners', icon: <Handshake size={20} /> },
  { to: '/admin/ranking', label: 'nav.ranking', icon: <Trophy size={20} /> },
  { to: '/admin/settings', label: 'nav.settings', icon: <Settings size={20} /> },
];

export function AdminLayout() {
  const { t } = useLanguage();
  const user = useSessionStore((s) => s.user);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r neo-border bg-[var(--bg-color)] lg:flex">
        <div className="flex h-16 items-center gap-2 border-b neo-border px-6">
          <div className="neo-border -rotate-6 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white">
            <img
              loading="lazy"
              src="/src/assets/images/student_union_logo_1783505615366.jpg"
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-display text-lg font-bold">
            {t('STUDENT ')}
            <span className="text-gradient">{t('UNION')}</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 font-heading text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              {t(item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="border-t neo-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <Avatar
              name={user?.name ?? 'Admin'}
              image={user?.image}
              className="neo-border h-9 w-9"
              fallbackClassName="text-sm"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b neo-border bg-[var(--bg-color)]/80 px-6 backdrop-blur-xl">
          <h1 className="font-display text-xl font-bold">{t('Admin Panel')}</h1>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              title="Back to site"
              className="flex h-10 items-center gap-2 rounded-full bg-gray-100 px-4 font-heading text-sm font-semibold hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
            >
              <Home size={18} />
              <span className="hidden sm:inline">{t('Back to site')}</span>
            </Link>
            <ThemeToggle />
            <LanguageSwitcher />
            <LogoutButton size="sm" className="lg:hidden" redirectTo="/" />
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile admin bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t neo-border bg-[var(--bg-color)] py-2 lg:hidden">
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 text-[10px] font-semibold ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            {item.icon}
            {t(item.label)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
