import { motion } from 'motion/react';
import { CalendarDays, Flame, Home, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function BottomNav() {
  const links = [
    { to: '/', label: 'Home', icon: <Home size={24} /> },
    { to: '/events', label: 'Events', icon: <CalendarDays size={24} /> },
    { to: '/news', label: 'News', icon: <Flame size={24} /> },
    { to: '/students', label: 'Members', icon: <Users size={24} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t neo-border bg-[var(--bg-color)]/90 px-6 pb-safe pt-2 backdrop-blur-xl md:hidden">
      <div className="flex h-16 items-center justify-between">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `relative flex h-full w-full flex-col items-center justify-center space-y-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {link.icon}
                <span className="font-heading text-[10px] font-bold uppercase tracking-wider">
                  {link.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -top-2 h-1 w-8 rounded-full bg-primary"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
