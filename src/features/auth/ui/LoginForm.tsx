import { useLanguage } from '@/app/providers/LanguageContext';
import { Button, Input } from '@/shared/ui';
import { useSignIn } from '@/entities/session';
import { GoogleButton } from './GoogleButton';
import { Lock, LogIn, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function LoginForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const signIn = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn.mutate(
      { email, password },
      {
        onSuccess: (user) => {
          navigate(user.role === 'user' ? '/admin' : '/');
        },
      },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 neo-border">
          <LogIn size={32} className="text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold">{t('Welcome Back')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('Sign in to your Student Union account')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block font-heading text-sm font-bold">{t('Email Address')}</label>
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              placeholder={t('student@university.edu')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-heading text-sm font-bold">{t('Password')}</label>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              placeholder="••••••••"
            />
          </div>
        </div>

        {signIn.isError && (
          <div className="text-sm text-red-500">{t('Invalid credentials. Please try again.')}</div>
        )}

        <Button type="submit" variant="primary" className="w-full py-3" disabled={signIn.isPending}>
          {signIn.isPending ? t('Signing In...') : t('Sign In')}
        </Button>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-border/40" />
          <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">{t('Or')}</span>
          <span className="h-px flex-1 bg-border/40" />
        </div>

        <GoogleButton mode="signin" />
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t("Don't have an account?")}{' '}
        <Link to="/signup" className="font-bold text-primary hover:underline">
          {t('Sign up here')}
        </Link>
      </p>
    </motion.div>
  );
}
