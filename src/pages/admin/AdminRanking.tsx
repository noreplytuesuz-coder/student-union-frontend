import { useLanguage } from '@/app/providers';
import { Trophy, Medal } from 'lucide-react';
import { Card, Skeleton } from '@/shared/ui';
import { cn, getImageUrl } from '@/shared/lib/utils';
import { useRanking, type RankingUser } from '@/entities/ranking';

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function AdminRanking() {
  const { t } = useLanguage();
  const { data, isLoading, isError } = useRanking({ limit: 100 });
  const ranking = data?.ranking ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-yellow-400/15 flex items-center justify-center neo-border">
          <Trophy size={22} className="text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">{t('Leader')} {t('board')}</h2>
          <p className="text-sm text-muted-foreground font-sans">
            {t('ranking.admin.subtitle')}
          </p>
        </div>
      </div>

      {isError ? (
        <p className="text-sm text-muted-foreground font-sans">{t('Error loading data')}</p>
      ) : isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="flex items-center gap-4 p-4 animate-pulse" neo={false}>
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
            </Card>
          ))}
        </div>
      ) : ranking.length === 0 ? (
        <p className="text-sm text-muted-foreground font-sans">{t('events.empty')}</p>
      ) : (
        <Card className="overflow-hidden neo-border neo-shadow" neo={false}>
          <div className="grid grid-cols-[3rem_1fr_auto] gap-4 px-5 py-3 border-b border-gray-200 dark:border-white/10 text-xs font-mono uppercase text-muted-foreground">
            <span>#</span>
            <span>{t('Member')}</span>
            <span className="flex items-center gap-1">
              <Medal size={12} className="text-yellow-500" />
              {t('PTS')}
            </span>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-white/10">
            {ranking.map((student: RankingUser, i: number) => {
              const rank = i + 1;
              const top = rank <= 3;
              return (
                <div
                  key={student._id}
                  className={cn(
                    'grid grid-cols-[3rem_1fr_auto] gap-4 px-5 py-3 items-center transition-colors hover:bg-gray-50 dark:hover:bg-white/5',
                    top && 'bg-yellow-400/5',
                  )}
                >
                  <span
                    className={cn(
                      'font-display text-lg font-black text-center',
                      rank === 1 && 'text-yellow-500',
                      rank === 2 && 'text-gray-400',
                      rank === 3 && 'text-orange-500',
                      rank > 3 && 'text-muted-foreground',
                    )}
                  >
                    #{rank}
                  </span>

                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 shrink-0 overflow-hidden rounded-full neo-border bg-primary/10 flex items-center justify-center font-display text-base font-black text-primary">
                      {student.image ? (
                        <img
                          src={getImageUrl(student.image)}
                          alt={student.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials(student.name)
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-base truncate">{student.name}</h3>
                      <p className="font-sans text-sm text-muted-foreground truncate">
                        {student.major ?? student.email}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-lg font-bold">{student.points}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
