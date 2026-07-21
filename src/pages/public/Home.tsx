import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { ArrowRight, Calendar, Users, Zap, Star } from 'lucide-react';
import { Button, Card, Skeleton } from '@/shared/ui';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/app/providers';
import { cn } from '@/shared/lib/utils';
import { useEvents } from '@/entities/event';
import { useRanking } from '@/entities/ranking';

export function Home() {
  const { t, language } = useLanguage();
  const [featuredLimit] = useState(3);

  const { data: eventsData, isLoading: eventsLoading } = useEvents({ limit: featuredLimit });
  const { data: rankingData, isLoading: rankingLoading } = useRanking();

  const events = eventsData?.events ?? [];
  const memberCount = rankingData?.count;

  const stats = [
    {
      label: t('home.stats.activeMembers'),
      value: memberCount != null ? `${memberCount.toLocaleString()}` : '—',
      icon: Users,
      color: 'text-primary',
    },
    {
      label: t('home.stats.eventsHosted'),
      value: eventsData?.pagination?.total != null ? `${eventsData.pagination.total}` : '—',
      icon: Calendar,
      color: 'text-secondary',
    },
    {
      label: t('home.stats.projectsBuilt'),
      value: `${rankingData?.ranking.length ?? 0}`,
      icon: Zap,
      color: 'text-cyan-500',
    },
  ];

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="flex flex-col gap-32 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col gap-6 z-10"
          >
            <h1
              className={cn(
                'font-display font-black leading-[1.1] tracking-tight break-words',
                language === 'ru'
                  ? 'text-4xl sm:text-5xl lg:text-6xl'
                  : 'text-5xl sm:text-6xl lg:text-7xl xl:text-8xl'
              )}
            >
              {t('home.hero.title1')} <br />
              {t('home.hero.title2')} <span className="text-gradient">{t('home.hero.title3')}</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground font-sans max-w-lg">
              {t('home.hero.subtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to="/join">
                <Button size="lg" className="gap-2">
                  {t('home.hero.joinBtn')} <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="secondary" size="lg">
                  {t('home.hero.exploreBtn')}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            style={{ y, opacity }}
            className="relative hidden lg:block h-[600px] w-full z-0 overflow-hidden"
          >
            {/* Vertical Bent 3D Image Marquee */}
            <div className="absolute inset-0 flex items-center justify-center [perspective:1200px] rounded-3xl">
              <div
                className="relative flex gap-6 h-[200%] w-[120%] scale-[1.15] translate-y-20 translate-x-10"
                style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg) rotateY(-20deg) rotateZ(10deg)' }}
              >
                {/* Col 1 */}
                <motion.div
                  animate={{ y: ['0%', '-50%'] }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="flex flex-col gap-6 h-max"
                >
                  {[
                    '1540575467063-178a50c2df87',
                    '1491438590914-bc09fcaaf77a',
                    '1541339907198-e08756dedf3f',
                    '1517245386807-bb43f82c33c4',
                    '1511629091441-ee46146481b6',
                  ].map((id, i) => (
                    <div key={`c1-${i}`} className="w-64 h-44 rounded-2xl overflow-hidden shrink-0">
                      <img
                        loading="lazy"
                        src={`https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`}
                        alt="Campus"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {/* Duplicates for seamless loop */}
                  {[
                    '1540575467063-178a50c2df87',
                    '1491438590914-bc09fcaaf77a',
                    '1541339907198-e08756dedf3f',
                    '1517245386807-bb43f82c33c4',
                    '1511629091441-ee46146481b6',
                  ].map((id, i) => (
                    <div key={`c1-dup-${i}`} className="w-64 h-44 rounded-2xl overflow-hidden shrink-0">
                      <img
                        loading="lazy"
                        src={`https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`}
                        alt="Campus"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </motion.div>

                {/* Col 2 (moves opposite direction) */}
                <motion.div
                  animate={{ y: ['-50%', '0%'] }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="flex flex-col gap-6 h-max"
                >
                  {[
                    '1522202176988-66273c2fd55f',
                    '1498243691581-b145c3f54a5a',
                    '1504384764586-bb4cdc1707b0',
                    '1503676260728-1c00da094a0b',
                    '1543269865-cbf427effbad',
                  ].map((id, i) => (
                    <div key={`c2-${i}`} className="w-64 h-44 rounded-2xl overflow-hidden shrink-0">
                      <img
                        loading="lazy"
                        src={`https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`}
                        alt="Campus"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {/* Duplicates for seamless loop */}
                  {[
                    '1522202176988-66273c2fd55f',
                    '1498243691581-b145c3f54a5a',
                    '1504384764586-bb4cdc1707b0',
                    '1503676260728-1c00da094a0b',
                    '1543269865-cbf427effbad',
                  ].map((id, i) => (
                    <div key={`c2-dup-${i}`} className="w-64 h-44 rounded-2xl overflow-hidden shrink-0">
                      <img
                        loading="lazy"
                        src={`https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`}
                        alt="Campus"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </motion.div>

                {/* Col 3 */}
                <motion.div
                  animate={{ y: ['0%', '-50%'] }}
                  transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                  className="flex flex-col gap-6 h-max"
                >
                  {[
                    '1540575467063-178a50c2df87',
                    '1498243691581-b145c3f54a5a',
                    '1491438590914-bc09fcaaf77a',
                    '1517245386807-bb43f82c33c4',
                    '1503676260728-1c00da094a0b',
                  ].map((id, i) => (
                    <div key={`c3-${i}`} className="w-64 h-44 rounded-2xl overflow-hidden shrink-0">
                      <img
                        loading="lazy"
                        src={`https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`}
                        alt="Campus"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {/* Duplicates for seamless loop */}
                  {[
                    '1540575467063-178a50c2df87',
                    '1498243691581-b145c3f54a5a',
                    '1491438590914-bc09fcaaf77a',
                    '1517245386807-bb43f82c33c4',
                    '1503676260728-1c00da094a0b',
                  ].map((id, i) => (
                    <div key={`c3-dup-${i}`} className="w-64 h-44 rounded-2xl overflow-hidden shrink-0">
                      <img
                        loading="lazy"
                        src={`https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`}
                        alt="Campus"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="flex items-center gap-6 p-8 group">
                <div
                  className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center glass neo-border',
                    stat.color,
                    'group-hover:scale-110 transition-transform'
                  )}
                >
                  <stat.icon size={32} />
                </div>
                <div>
                  {eventsLoading || rankingLoading ? (
                    <Skeleton className="h-10 w-24 mb-1" />
                  ) : (
                    <h3 className="font-display text-4xl font-bold">{stat.value}</h3>
                  )}
                  <p className="font-heading text-muted-foreground">{stat.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">
              {t('home.featured.title')} <span className="text-gradient">{t('home.featured.titleHighlight')}</span>
            </h2>
            <p className="font-sans text-muted-foreground max-w-2xl text-lg">
              {t('home.featured.subtitle')}
            </p>
          </div>
          <Link to="/events" className="shrink-0">
            <Button variant="outline" className="gap-2">
              {t('home.featured.all')} <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {eventsLoading ? (
            Array.from({ length: featuredLimit }).map((_, i) => (
              <Card key={`feat-skel-${i}`} className="p-0 overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-6 flex flex-col gap-4">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </Card>
            ))
          ) : events.length === 0 ? (
            <p className="col-span-full text-muted-foreground font-sans">{t('events.empty')}</p>
          ) : (
            events.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link to={`/events/${event._id}`}>
                  <Card className="p-0 overflow-hidden h-full group hover:neo-shadow transition-all">
                    <div className="relative h-48 overflow-hidden border-b neo-border">
                      <img
                        loading="lazy"
                        src={event.image ?? 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/40 text-white text-xs font-bold font-mono rounded-full">
                          {event.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col gap-3 bg-[var(--bg-color)]">
                      <h3 className="font-display text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
                        <Calendar size={16} className="text-secondary" />
                        <span>{event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
                        <Users size={16} className="text-cyan-500" />
                        <span>{event.participations.length} going</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* What We Do - Bento Box */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-12">
          <div className="text-center">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              {t('WHAT WE')} <span className="text-gradient">{t('DO')}</span>
            </h2>
            <p className="font-sans text-muted-foreground max-w-2xl mx-auto text-lg">
              {t('We provide the platform, you bring the energy. From massive parties to intense hackathons, we\'ve got you covered.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-6 h-[800px] md:h-[600px]">
            {/* Bento 1 */}
            <motion.div
              whileHover={{ scale: 0.98 }}
              className="md:col-span-8 md:row-span-1 rounded-3xl neo-border neo-shadow overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-0" />
              <img
                loading="lazy"
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
                alt="Events"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 z-10 text-white">
                <span className="inline-block px-3 py-1 bg-primary text-xs font-bold font-mono rounded-full mb-3 uppercase tracking-wider">
                  {t('Epic Events')}
                </span>
                <h3 className="font-display text-3xl font-bold mb-2">{t('Massive Gatherings')}</h3>
                <p className="font-sans text-white/80 max-w-md">
                  {t('Unforgettable nights, cultural fests, and workshops that actually matter.')}
                </p>
              </div>
            </motion.div>

            {/* Bento 2 */}
            <motion.div
              whileHover={{ scale: 0.98 }}
              className="md:col-span-4 md:row-span-2 rounded-3xl neo-border neo-shadow overflow-hidden relative bg-gradient-hero group"
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              <div className="h-full flex flex-col p-8 z-10 text-white justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-xs font-bold font-mono rounded-full mb-3 uppercase tracking-wider neo-border">
                    {t('Community')}
                  </span>
                  <h3 className="font-display text-3xl font-bold mb-2">{t('Find Your Tribe')}</h3>
                </div>
                <div className="flex -space-x-4 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 border-white bg-gray-300"
                      style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`, backgroundSize: 'cover' }}
                    />
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-white/30 backdrop-blur-md flex items-center justify-center font-bold text-sm z-0">
                    +2k
                  </div>
                </div>
                <p className="font-sans text-white/90 font-medium">
                  {t('Join diverse clubs, sports teams, and interest groups. There\'s a spot for everyone here.')}
                </p>
              </div>
            </motion.div>

            {/* Bento 3 */}
            <motion.div
              whileHover={{ scale: 0.98 }}
              className="md:col-span-8 md:row-span-1 rounded-3xl neo-border neo-shadow overflow-hidden relative bg-[var(--color-bg-dark)] text-white group"
            >
              <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 group-hover:opacity-50 transition-opacity">
                {/* Decorative grid */}
                <div
                  className="w-full h-full"
                  style={{ backgroundImage: 'radial-gradient(#39FF14 2px, transparent 2px)', backgroundSize: '24px 24px' }}
                />
              </div>
              <div className="absolute inset-0 p-8 z-10 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 bg-green-500 text-black text-xs font-bold font-mono rounded-full mb-3 uppercase tracking-wider w-fit">
                  {t('Innovation')}
                </span>
                <h3 className="font-display text-3xl font-bold mb-2">{t('Student Projects')}</h3>
                <p className="font-sans text-gray-400 max-w-md mb-6">
                  {t('Got an idea? We provide funding, mentorship, and a platform to launch your startup, app, or movement.')}
                </p>
                <Button
                  variant="ghost"
                  className="w-fit border-2 border-white text-white hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black"
                >
                  {t('View Projects')}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee Partners */}
      <section className="py-12 bg-black text-white neo-border-y overflow-hidden flex flex-col gap-6 relative group">
        <h3 className="text-center font-sans text-sm tracking-widest text-muted-foreground">{t('TRUSTED BY OUR PARTNERS')}</h3>
        <div className="flex w-fit animate-[marquee_20s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity">
          <div className="flex gap-16 pr-16 items-center">
            {['GOOGLE', 'NOTION', 'DISCORD', 'FIGMA', 'SPOTIFY', 'GITHUB', 'VERCEL', 'STRIPE'].map((brand, i) => (
              <span key={i} className="font-display text-4xl font-black">
                {brand}
              </span>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex gap-16 pr-16 items-center" aria-hidden="true">
            {['GOOGLE', 'NOTION', 'DISCORD', 'FIGMA', 'SPOTIFY', 'GITHUB', 'VERCEL', 'STRIPE'].map((brand, i) => (
              <span key={`dup-${i}`} className="font-display text-4xl font-black">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
