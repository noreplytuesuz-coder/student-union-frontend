import { useLanguage } from '@/app/providers';
import { motion } from 'motion/react';
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

export function Ranking() {
  const { t } = useLanguage();
  const { data, isLoading, isError } = useRanking({ limit: 50 });

  const ranking = data?.ranking ?? [];
  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  const podiumOrder = [1, 0, 2].filter((i) => top3[i]);
  const podiumHeight = ['h-48', 'h-36', 'h-28'];
  const podiumColor = ['bg-yellow-400 text-black', 'bg-gray-300 text-black', 'bg-orange-400 text-white'];

  return (
    <div className="flex flex-col gap-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full pt-12">
      <section className="text-center flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center neo-border neo-shadow mb-6"
        >
          <Trophy size={40} className="text-black" />
        </motion.div>
        <h1 className="font-display text-5xl sm:text-7xl font-black mb-4 uppercase">
          {t('Leader')}
          <span className="text-gradient">{t('board')}</span>
        </h1>
        <p className="font-sans text-muted-foreground text-lg mb-8 max-w-xl">
          {t('The most active, engaged, and impactful students on campus. Earn points by attending events, joining projects, and leading initiatives.')}
        </p>
      </section>

      {isError ? (
        <p className="text-center text-muted-foreground font-sans">{t('Error loading data')}</p>
      ) : isLoading ? (
        <>
          {/* Podium skeleton */}
          <section className="flex justify-center items-end h-64 gap-2 sm:gap-6 mt-12 mb-8">
            {[2, 1, 3].map((rank) => (
              <div key={`skeleton-podium-${rank}`} className="flex flex-col items-center group relative animate-pulse">
                <div className="relative mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="w-16 h-4 bg-gray-200 dark:bg-gray-800 rounded hidden sm:block mb-2" />
                <div className={`w-20 sm:w-28 rounded-t-lg bg-gray-200 dark:bg-gray-800 ${podiumHeight[rank === 2 ? 1 : rank === 1 ? 0 : 2]}`} />
              </div>
            ))}
          </section>

          {/* List skeleton */}
          <section className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={`skeleton-list-${i}`} className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 animate-pulse" neo={false}>
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="w-12 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
              </Card>
            ))}
          </section>
        </>
      ) : ranking.length === 0 ? (
        <p className="text-center text-muted-foreground font-sans">{t('events.empty')}</p>
      ) : (
        <>
          {/* Podium for Top 3 */}
          {top3.length > 0 && (
            <section className="flex justify-center items-end h-64 gap-2 sm:gap-6 mt-12 mb-8">
              {podiumOrder.map((idx, i) => {
                const student = top3[idx];
                const rank = idx + 1;
                return (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2, type: 'spring' }}
                    className="flex flex-col items-center group relative z-10 hover:z-20"
                  >
                    <div className="relative mb-4">
                      <div
                        className={cn(
                          'absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-sm neo-border z-10',
                          podiumColor[idx]
                        )}
                      >
                        #{rank}
                      </div>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-full neo-border bg-primary/10 flex items-center justify-center font-display text-2xl font-black text-primary">
                        {student.image ? (
                          <img src={getImageUrl(student.image)} alt={student.name} loading="lazy" className="h-full w-full object-cover" />
                        ) : (
                          initials(student.name)
                        )}
                      </div>
                    </div>
                    <p className="font-heading font-bold text-sm hidden sm:block mb-2">{student.name.split(' ')[0]}</p>

                    <div
                      className={cn(
                        'w-20 sm:w-28 rounded-t-lg neo-border flex flex-col items-center justify-start pt-4 transition-all duration-500 group-hover:-translate-y-2',
                        podiumHeight[idx],
                        rank === 1 ? 'bg-gradient-hero' : 'bg-gray-100 dark:bg-white/10'
                      )}
                    >
                      <span className="font-mono font-bold text-lg">{student.points}</span>
                      <span className="text-[10px] uppercase tracking-wider opacity-60">{t('PTS')}</span>
                    </div>
                  </motion.div>
                );
              })}
            </section>
          )}

          {/* Ranking List */}
          <section className="flex flex-col gap-4">
            {rest.map((student: RankingUser, i: number) => {
              const rank = i + 4;
              return (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6" neo={false}>
                    <div className="font-display text-2xl font-bold text-muted-foreground w-8 text-center">#{rank}</div>
                    <div className="w-12 h-12 overflow-hidden rounded-full neo-border bg-primary/10 flex items-center justify-center font-display text-lg font-black text-primary shrink-0">
                      {student.image ? (
                        <img src={getImageUrl(student.image)} alt={student.name} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        initials(student.name)
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-lg">{student.name}</h3>
                      <p className="font-sans text-sm text-muted-foreground">{student.major ?? student.email}</p>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-mono text-xl font-bold">{student.points}</span>
                      <div className="flex items-center gap-1 text-xs font-bold font-heading uppercase">
                        <Medal size={12} className="text-yellow-500" />
                        <span className="text-yellow-600 dark:text-yellow-400">{t('PTS')}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}
