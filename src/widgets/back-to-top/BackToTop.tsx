import { Button } from '@/shared/ui';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-4 z-50 md:bottom-8 md:right-8"
        >
          <Button
            size="icon"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="rounded-full shadow-lg"
          >
            <ArrowUp size={20} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
