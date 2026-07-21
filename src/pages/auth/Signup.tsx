import { useLanguage } from '@/app/providers';
import React from 'react';
import { motion } from 'motion/react';
import { Card } from '@/shared/ui/Card';
import { SignupForm } from '@/features/auth';

export function Signup() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <SignupForm />
        </Card>
      </motion.div>
    </div>
  );
}
