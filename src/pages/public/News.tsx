import { useLanguage } from '@/app/providers';
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Flame, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, Button, Badge, Skeleton } from '@/shared/ui';
import { getImageUrl, formatDate } from '@/shared/lib/utils';
import { Link } from 'react-router-dom';
import { useNews } from '@/entities/news';

const FALLBACK = 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069';

export function News() {
  const { t } = useLanguage();
  const { data, isLoading, isError } = useNews();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const news = useMemo(() => data?.news ?? [], [data]);

  const topics = useMemo(() => {
    const set = new Set<string>();
    news.forEach((a) => (a.tags ?? []).forEach((tag) => set.add(tag)));
    return ['All', ...Array.from(set).sort()];
  }, [news]);

  const filtered = useMemo(() => {
    return news.filter((article) => {
      const matchesCategory =
        activeCategory === 'All' || (article.tags ?? []).includes(activeCategory);
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.subTitle ?? '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [news, activeCategory, searchQuery]);

  const featured = filtered[0];
  const grid = filtered.slice(1);

  return (
    <div className="flex flex-col gap-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-12">
      {/* Header & Search */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
              <Flame size={20} />
            </div>
            <span className="font-heading font-bold text-secondary uppercase tracking-widest text-sm">
              {t('Latest Updates')}
            </span>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-7xl font-black uppercase tracking-tight">
            {t("What's")} <span className="text-gradient">{t('Happening')}</span>
          </h1>
        </div>

        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder={t('Search news...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 neo-border focus:outline-none focus:ring-2 focus:ring-primary transition-all font-sans"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-32 flex flex-col gap-2">
            <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              {t('Topics')}
            </h3>
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pt-2 px-1 pb-4 lg:p-1 lg:-m-1 no-scrollbar">
              {topics.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-3 rounded-xl font-heading text-sm font-semibold text-left transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-gradient-hero text-white neo-shadow neo-border'
                      : 'glass hover:bg-gray-100 dark:hover:bg-white/10 neo-border'
                  }`}
                >
                  {t(cat)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-8">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-8"
              >
                <Card className="w-full h-[400px] rounded-2xl p-0 flex flex-col" neo={false}>
                  <Skeleton className="w-full h-full rounded-2xl" />
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <Card key={i} className="w-full h-80 rounded-2xl p-0 flex flex-col" neo={false}>
                      <Skeleton className="w-full h-full rounded-2xl" />
                    </Card>
                  ))}
                </div>
              </motion.div>
            ) : isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center text-muted-foreground font-sans"
              >
                {t('Failed to load news. Please try again later.')}
              </motion.div>
            ) : filtered.length > 0 ? (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-8"
              >
                {/* Featured Article */}
                {featured && (
                  <Link to={`/news/${featured._id}`} className="block w-full">
                    <Card className="p-0 overflow-hidden group cursor-pointer" neo={false}>
                      <div className="flex flex-col md:flex-row h-full neo-border rounded-2xl overflow-hidden">
                        <div className="w-full md:w-3/5 h-64 md:h-[400px] relative overflow-hidden">
                          <img
                            loading="lazy"
                            src={getImageUrl(featured.image) ?? FALLBACK}
                            alt={featured.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="w-full md:w-2/5 p-8 flex flex-col justify-center bg-[var(--bg-color)]">
                          <Badge className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold font-mono rounded-full mb-4 w-fit uppercase neo-shadow">
                            {t(featured.tags?.[0] ?? 'News')}
                          </Badge>
                          <h2 className="font-display text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                            {featured.title}
                          </h2>
                          <p className="text-muted-foreground font-sans mb-6 line-clamp-3">
                            {featured.subTitle}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-white/10">
                            <span className="font-mono text-xs text-muted-foreground">
                              {formatDate(featured.date)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-white/10 group-hover:bg-primary group-hover:text-white pointer-events-none"
                            >
                              <ArrowRight size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )}

                {/* Grid */}
                {grid.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {grid.map((article, i) => (
                      <motion.div
                        key={article._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Link to={`/news/${article._id}`} className="block h-full">
                          <Card className="p-0 h-full flex flex-col group cursor-pointer" neo={false}>
                            <div className="relative h-48 overflow-hidden border-b neo-border rounded-t-2xl">
                              <img
                                loading="lazy"
                                src={getImageUrl(article.image) ?? FALLBACK}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md text-xs font-bold font-mono rounded-full neo-border">
                                  {t(article.tags?.[0] ?? 'News')}
                                </span>
                              </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1 bg-[var(--bg-color)] rounded-b-2xl neo-border border-t-0">
                              <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                                {article.title}
                              </h3>
                              <p className="text-sm text-muted-foreground font-sans mb-6 line-clamp-2">
                                {article.subTitle}
                              </p>
                              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-white/10">
                                <span className="font-mono text-[10px] text-muted-foreground uppercase">
                                  {formatDate(article.date)}
                                </span>
                                <span className="font-mono text-[10px] text-primary font-bold uppercase group-hover:underline">
                                  {t('Read More')}
                                </span>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6">
                  <Search size={32} className="text-muted-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">{t('No articles found')}</h3>
                <p className="text-muted-foreground font-sans max-w-md">
                  {t("We couldn't find any news matching your criteria. Try adjusting your filters or search query.")}
                </p>
                <Button
                  variant="secondary"
                  className="mt-6"
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                >
                  {t('Clear Filters')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
