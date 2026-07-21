import { useLanguage } from '@/app/providers';
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/shared/ui';
import { cn, getImageUrl } from '@/shared/lib/utils';
import { useGalleries, Gallery as GalleryEntity } from '@/entities/gallery';

const FALLBACK = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070';

interface FlatImage {
  src: string;
  title: string;
  galleryId: string;
  galleryTitle: string;
}

export function Gallery() {
  const { t } = useLanguage();
  const { data, isLoading, isError } = useGalleries();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images: FlatImage[] = useMemo(() => {
    const list: FlatImage[] = [];
    (data ?? []).forEach((g: GalleryEntity) => {
      g.images.forEach((url) => {
        list.push({
          src: getImageUrl(url) ?? FALLBACK,
          title: g.title,
          galleryId: g._id,
          galleryTitle: g.title,
        });
      });
    });
    return list;
  }, [data]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="flex flex-col gap-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-12">
      <section className="text-center flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center neo-border neo-shadow mb-6"
        >
          <ImageIcon size={40} className="text-primary" />
        </motion.div>
        <h1 className="font-display text-5xl sm:text-7xl font-black mb-4 uppercase">
          {t('Photo')} <span className="text-gradient">{t('Gallery')}</span>
        </h1>
        <p className="font-sans text-muted-foreground text-lg mb-8 max-w-xl">
          {t('A collection of memories, projects, and the vibrant life happening around our campus every day.')}
        </p>
      </section>

      {/* Masonry Grid */}
      <section className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => {
              const h = i % 2 === 0 ? 'h-64' : 'h-80';
              return (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`relative break-inside-avoid rounded-2xl overflow-hidden neo-border neo-shadow ${h}`}
                >
                  <Skeleton className="w-full h-full rounded-none" />
                </motion.div>
              );
            })
          ) : isError ? (
            <div className="col-span-full text-center py-20 text-muted-foreground font-sans">
              {t('Failed to load gallery. Please try again later.')}
            </div>
          ) : images.length === 0 ? (
            <div className="col-span-full text-center py-20 text-muted-foreground font-sans">
              {t('No photos available yet.')}
            </div>
          ) : (
            images.map((photo, i) => (
              <motion.div
                key={`${photo.galleryId}-${i}`}
                layout
                whileHover={{ y: -4 }}
                className="relative break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer neo-border neo-shadow"
                onClick={() => openLightbox(i)}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-display text-xl font-bold">{photo.title}</h3>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && images[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <div className="absolute top-6 right-6">
              <button
                className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-primary transition-colors"
                onClick={closeLightbox}
              >
                <X size={24} />
              </button>
            </div>

            <button
              className="absolute left-4 sm:left-12 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-primary transition-colors"
              onClick={prevPhoto}
            >
              <ChevronLeft size={24} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0 }}
              className="w-full max-w-5xl max-h-[80vh] px-4 sm:px-12 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                loading="lazy"
                src={images[lightboxIndex].src}
                alt={images[lightboxIndex].title}
                className={cn('max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl neo-border')}
              />
              <div className="mt-4 text-center">
                <h3 className="text-white font-display text-2xl font-bold">{images[lightboxIndex].title}</h3>
                <p className="text-gray-500 font-sans text-sm mt-2">
                  {lightboxIndex + 1} / {images.length}
                </p>
              </div>
            </motion.div>

            <button
              className="absolute right-4 sm:right-12 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-primary transition-colors"
              onClick={nextPhoto}
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
