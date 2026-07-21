import { useLanguage } from '@/app/providers';
import React from 'react';
import { motion } from 'motion/react';
import { JoinUsForm } from '@/features/submission';

export function JoinUs() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full pt-12">
      <section className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl sm:text-7xl font-black mb-6 uppercase tracking-tight"
        >
          {t("Be Part Of")} <br className="hidden sm:block" />
          <span className="text-gradient">{t("Something Bigger")}</span>
        </motion.h1>
      </section>

      <JoinUsForm />
    </div>
  );
}
