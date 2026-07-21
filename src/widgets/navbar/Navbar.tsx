import { useLanguage } from '@/app/providers/LanguageContext';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useSessionStore } from '@/entities/session';
import { useSignOut } from '@/entities/session';
import { Button, Avatar } from '@/shared/ui';
import { LanguageSwitcher } from '@/widgets/language-switcher';
import { cn } from '@/shared/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { LogOut, Menu, Moon, Sun, Trophy, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, setTheme } = useTheme();
  const user = useSessionStore((s) => s.user);
  const isAuthenticated = useSessionStore((s) => s.user != null);
  const signOut = useSignOut();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [location]);

  const { t } = useLanguage();
  const isAdmin = user?.role === 'user';

  const navLinks = [
    { name: t('nav.events'), path: '/events' },
    { name: t('nav.news'), path: '/news' },
    { name: t('nav.ranking'), path: '/ranking' },
    { name: t('nav.projects'), path: '/projects' },
    { name: t('nav.members'), path: '/students' },
    ...(isAdmin ? [{ name: t('nav.admin'), path: '/admin' }] : []),
  ];

  const handleLogout = () =>
    signOut.mutate(undefined, { onSuccess: () => navigate('/') });

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
          isScrolled ? 'py-4' : 'py-6',
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              'flex items-center justify-between rounded-full px-6 py-3 transition-all duration-300',
              isScrolled ? 'glass neo-border neo-shadow' : 'bg-transparent',
            )}
          >
            <NavLink to="/" className="group flex items-center gap-2">
              <div className="neo-border -rotate-6 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white transition-transform group-hover:-rotate-12">
                <img
                  loading="lazy"
                  src="/src/assets/images/student_union_logo_1783505615366.jpg"
                  alt="Student Union Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden font-display text-xl font-bold sm:block">
                STUDENT <span className="text-gradient">UNION</span>
              </span>
            </NavLink>

            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      'relative overflow-hidden rounded-full px-4 py-2 font-heading text-sm font-semibold transition-all group',
                      isActive
                        ? 'text-[var(--color-primary)]'
                        : 'hover:bg-gray-100 dark:hover:bg-white/10',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{link.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20"
                          initial={false}
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isAuthenticated ? (
                <div className="hidden items-center gap-2 sm:flex">
                  {user?.isVerified && (
                    <NavLink
                      to="/ranking"
                      className="neo-border flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold hover:opacity-80"
                      title={t('Points')}
                    >
                      <Trophy size={14} className="text-amber-500" />
                      {user.points}
                    </NavLink>
                  )}
                  <NavLink
                    to="/profile"
                    className="mr-2 flex items-center hover:opacity-80"
                    title={isAdmin ? 'Admin' : 'Profile'}
                  >
                    <Avatar
                      name={user?.name ?? ''}
                      image={user?.image}
                      className="neo-border h-8 w-8"
                      fallbackClassName="text-xs"
                    />
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 hover:text-white dark:bg-white/10"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="hidden items-center gap-2 sm:flex">
                  <NavLink to="/login">
                    <Button size="sm" variant="outline">
                      {t('nav.signIn')}
                    </Button>
                  </NavLink>
                  <NavLink to="/signup">
                    <Button size="sm">{t('nav.signUp')}</Button>
                  </NavLink>
                </div>
              )}

              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[var(--bg-color)]"
          >
            <div className="flex items-center justify-between border-b neo-border p-6">
              <div className="flex items-center gap-2">
                <div className="neo-border -rotate-6 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white">
                  <img
                    loading="lazy"
                    src="/src/assets/images/student_union_logo_1783505615366.jpg"
                    alt="Student Union Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="font-display text-xl font-bold">
                  STUDENT <span className="text-gradient">UNION</span>
                </span>
              </div>
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <NavLink
                    to={link.path}
                    className="block border-b border-dashed py-4 font-display text-3xl font-bold neo-border"
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-col gap-4"
              >
                {isAuthenticated ? (
                  <>
                    <NavLink to="/profile" className="block w-full">
                      <Button size="lg" className="w-full">
                        {t('My Profile')}
                      </Button>
                    </NavLink>
                    <span className="text-center font-sans text-sm font-bold text-muted-foreground">
                      {t('Logged in as')} {isAdmin ? 'Admin' : 'Student'}
                    </span>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full text-red-500"
                      onClick={handleLogout}
                    >
                      {t('Sign Out')}
                    </Button>
                  </>
                ) : (
                  <>
                    <NavLink to="/signup" className="block w-full">
                      <Button size="lg" className="w-full">
                        {t('nav.signUp')}
                      </Button>
                    </NavLink>
                    <NavLink to="/login" className="block w-full">
                      <Button size="lg" variant="outline" className="w-full">
                        {t('nav.signIn')}
                      </Button>
                    </NavLink>
                  </>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
