import { useLanguage } from '@/app/providers';
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Button, Badge, Skeleton } from '@/shared/ui';
import { getImageUrl, formatDate } from '@/shared/lib/utils';
import { useNewsDetail } from '@/entities/news';

const FALLBACK = 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069';

export function NewsDetails() {
  const { t } = useLanguage();
  const { id } = useParams();
  const { data: article, isLoading, isError } = useNewsDetail(id);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full py-12">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="font-display text-4xl mb-4">{t('Article Not Found')}</h1>
        <Link to="/news">
          <Button variant="secondary">{t('Back to News')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />
      <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full py-12">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft size={20} />
          <span className="font-heading font-bold text-sm">{t('Back to News')}</span>
        </Link>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            {(article.tags ?? []).map((tag) => (
              <Badge
                key={tag}
                className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold font-mono rounded-full w-fit uppercase neo-shadow"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-mono text-sm border-y border-gray-200 dark:border-white/10 py-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(article.date)}</span>
            </div>
            {article.createdBy && typeof article.createdBy === 'object' && (
              <div className="flex items-center gap-2">
                <span>{article.createdBy.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full h-64 sm:h-96 md:h-[500px] rounded-2xl overflow-hidden neo-border">
          <img
            loading="lazy"
            src={getImageUrl(article.image) ?? FALLBACK}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose dark:prose-invert max-w-none font-sans mt-4 text-lg text-muted-foreground leading-relaxed">
          <p className="font-bold text-xl text-foreground mb-6">{article.subTitle}</p>
          {article.description
            .split('\n')
            .map((paragraph, idx) =>
              paragraph.trim() ? <p key={idx} className="mb-4">{paragraph}</p> : null,
            )}
        </div>
      </div>
    </>
  );
}
