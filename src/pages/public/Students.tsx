import { useLanguage } from '@/app/providers';
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User, Mail, Award, Crown, Medal } from 'lucide-react';
import { Card, Badge, Skeleton, Button } from '@/shared/ui';
import { cn, getImageUrl } from '@/shared/lib/utils';
import { useRanking, RankingResponse } from '@/entities/ranking';

const FALLBACK = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070';

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

const rankAccent = (index: number) => {
  if (index === 0) return 'bg-yellow-400 text-black';
  if (index === 1) return 'bg-gray-300 text-black';
  if (index === 2) return 'bg-amber-600 text-white';
  return 'bg-primary/20 text-primary';
};

const rankIcon = (index: number) => {
  if (index === 0) return <Crown size={16} />;
  if (index === 1) return <Medal size={16} />;
  if (index === 2) return <Medal size={16} />;
  return null;
};

export function Students() {
  const { t } = useLanguage();
  const { data, isLoading, isError } = useRanking({ limit: 100 });
  const [searchQuery, setSearchQuery] = useState('');

  const ranking: RankingResponse['ranking'] = data?.ranking ?? [];

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return ranking.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.major ?? '').toLowerCase().includes(q),
    );
  }, [ranking, searchQuery]);

  return (
    <div className="flex flex-col gap-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-12 pb-24">
      <section className="text-center flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center neo-border neo-shadow mb-6"
        >
          <User size={40} className="text-primary" />
        </motion.div>
        <h1 className="font-display text-5xl sm:text-7xl font-black mb-4 uppercase">
          {t('Meet Our')} <span className="text-gradient">{t('Students')}</span>
        </h1>
        <p className="font-sans text-muted-foreground text-lg mb-8 max-w-xl">
          {t('The passionate members who make our student union thrive. Explore the brightest minds and dedicated leaders.')}
        </p>

        <div className="w-full max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder={t('Search students...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 neo-border focus:outline-none focus:ring-2 focus:ring-primary transition-all font-sans"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 9 }).map((_, i) => (
            <Card key={i} className="p-6 flex items-center gap-4" neo={false}>
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))
        ) : isError ? (
          <div className="col-span-full py-20 text-center text-muted-foreground font-sans">
            {t('Failed to load members. Please try again later.')}
          </div>
        ) : filtered.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filtered.map((student, i) => (
              <motion.div
                key={student._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: (i % 9) * 0.05 }}
              >
                <Card className="p-6 h-full flex flex-col items-center text-center group hover:border-primary transition-colors" neo={false}>
                  <div className="relative mb-4">
                    <div
                      className={cn(
                        'w-20 h-20 overflow-hidden rounded-full flex items-center justify-center font-display text-2xl font-bold neo-border neo-shadow',
                        i < 3 ? rankAccent(i) : 'bg-gradient-hero text-white',
                      )}
                    >
                      {student.image ? (
                        <img
                          src={getImageUrl(student.image)}
                          alt={student.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitials(student.name)
                      )}
                    </div>
                    <span
                      className={cn(
                        'absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold neo-border',
                        rankAccent(i),
                      )}
                    >
                      {rankIcon(i) ?? `#${i + 1}`}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors">
                    {student.name}
                  </h3>
                  {student.major && (
                    <span className="inline-block mt-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono uppercase neo-border">
                      {student.major}
                    </span>
                  )}

                  <div className="flex items-center gap-2 mt-4 text-muted-foreground text-sm font-mono">
                    <Mail size={14} />
                    <span className="truncate max-w-[180px]">{student.email}</span>
                  </div>

                  <div className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20">
                    <Award size={16} className="text-secondary" />
                    <span className="font-mono font-bold text-secondary">
                      {student.points} {t('pts')}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <User size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-muted-foreground font-sans">{t('No members found.')}</p>
          </div>
        )}
      </section>
    </div>
  );
}
