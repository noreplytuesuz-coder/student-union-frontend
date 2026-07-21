import { useLanguage } from '@/app/providers/LanguageContext';
import { Button, Card, Dropdown, Input, Textarea } from '@/shared/ui';
import { useCreateSubmission } from '@/entities/submission';
import { useSessionStore } from '@/entities/session';
import { cn } from '@/shared/lib/utils';
import {
  CheckCircle2,
  Heart,
  Rocket,
  Send,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

const INTERESTS = [
  'Event Planning',
  'Graphic Design',
  'Web Dev',
  'Marketing',
  'Photography',
  'Public Speaking',
  'Fundraising',
  'Social Media',
  'Video Editing',
  'Writing',
];

const DEPARTMENTS = [
  { value: 'cs', label: 'Computer Science' },
  { value: 'eng', label: 'Engineering' },
  { value: 'art', label: 'Arts & Design' },
  { value: 'bus', label: 'Business' },
];

/**
 * Multi-step membership application form. Submits a `Submission` to the
 * backend with `{ name, email, department, interests, whyJoin }`.
 */
export function JoinUsForm() {
  const { t } = useLanguage();
  const createSubmission = useCreateSubmission();
  const sessionUser = useSessionStore((s) => s.user);

  const [step, setStep] = useState(1);
  const [step1Error, setStep1Error] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    whyJoin: '',
    interests: [] as string[],
  });

  // Auto-fill from the signed-in user (email + name) when the form is still
  // empty, so a logged-in member doesn't retype their details.
  useEffect(() => {
    if (!sessionUser) return;
    setForm((prev) => ({
      ...prev,
      email: prev.email || sessionUser.email || '',
      name: prev.name || sessionUser.name || '',
    }));
  }, [sessionUser]);

  // Grow the motivation textarea to fit its content on mount and autofill.
  useEffect(() => {
    if (whyJoinRef.current) autoGrow(whyJoinRef.current);
  }, []);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleInterest = (skill: string) =>
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(skill)
        ? prev.interests.filter((s) => s !== skill)
        : [...prev.interests, skill],
    }));

  const whyJoinRef = useRef<HTMLTextAreaElement>(null);
  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    // Step 1 gate: name, email and department are required before advancing.
    if (step === 1) {
      if (!form.name.trim() || !form.email.trim() || !form.department) {
        setStep1Error(true);
        return;
      }
      setStep1Error(false);
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSubmission.mutate({
      name: form.name,
      email: form.email,
      department: form.department,
      interests: form.interests.join(', '),
      whyJoin: form.whyJoin,
    });
  };

  useEffect(() => {
    if (createSubmission.isSuccess) setStep(4);
  }, [createSubmission.isSuccess]);

  return (
    <div className="flex w-full flex-col gap-12">
      {step < 4 && (
        <div className="relative mb-8 flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -z-10 h-1 w-full -translate-y-1/2 rounded-full bg-gray-200 dark:bg-white/10" />
          <div
            className="absolute left-0 top-1/2 -z-10 h-1 -translate-y-1/2 rounded-full bg-gradient-hero transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-lg font-bold neo-border ${
                step >= num
                  ? 'bg-primary text-white neo-shadow'
                  : 'bg-gray-100 text-muted-foreground dark:bg-gray-800'
              }`}
            >
              {num}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            onSubmit={next}
            className="w-full"
          >
            <Card className="flex flex-col gap-6 p-8">
              <h2 className="font-heading text-2xl font-bold">{t('Personal Info')}</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="font-heading text-sm font-bold">{t('Full Name')}</label>
                  <Input
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    required
                    placeholder={t('John Doe')}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-heading text-sm font-bold">{t('Email Address')}</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    required
                    placeholder={t('john@university.edu')}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-heading text-sm font-bold">{t('Department')}</label>
                  <Dropdown
                    value={form.department}
                    onChange={(v) => {
                      set('department', v);
                      if (step1Error) setStep1Error(false);
                    }}
                    placeholder={t('Select Department')}
                    options={DEPARTMENTS.map((d) => ({ label: t(d.label), value: d.value }))}
                  />
                  {step1Error && (
                    <p className="text-sm text-red-500">{t('Please fill in your name, email and department.')}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button type="submit" className="gap-2">
                  {t('Continue')} <Rocket size={18} />
                </Button>
              </div>
            </Card>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            onSubmit={next}
            className="w-full"
          >
            <Card className="flex flex-col gap-6 p-8">
              <h2 className="font-heading text-2xl font-bold">Interests & Skills</h2>
              <p className="font-sans text-muted-foreground">
                {t('Select all that apply. This helps us match you with the right projects.')}
              </p>
              <div className="flex flex-wrap gap-3">
                {INTERESTS.map((skill) => {
                  const active = form.interests.includes(skill);
                  return (
                    <label key={skill} className="cursor-pointer">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={active}
                        onChange={() => toggleInterest(skill)}
                      />
                      <div
                        className={cn(
                          'flex items-center rounded-full px-4 py-2 font-heading text-sm font-semibold transition-all',
                          active
                            ? 'neo-border neo-shadow bg-primary text-white'
                            : 'neo-border text-foreground hover:bg-gray-100 dark:hover:bg-white/10',
                        )}
                      >
                        {t(skill)}
                      </div>
                    </label>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-between">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                  {t('Back')}
                </Button>
                <Button type="submit" className="gap-2">
                  {t('Continue')} <Heart size={18} />
                </Button>
              </div>
            </Card>
          </motion.form>
        )}

        {step === 3 && (
          <motion.form
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            onSubmit={handleSubmit}
            className="w-full"
          >
            <Card className="flex flex-col gap-6 p-8">
              <h2 className="font-heading text-2xl font-bold">{t('Motivation')}</h2>
              <div className="flex flex-col gap-2">
                <label className="font-heading text-sm font-bold">
                  {t('Why do you want to join Student Union?')}
                </label>
                <Textarea
                  ref={whyJoinRef}
                  required
                  value={form.whyJoin}
                  onChange={(e) => {
                    set('whyJoin', e.target.value);
                    autoGrow(e.target);
                  }}
                  placeholder={t('Tell us your story...')}
                />
              </div>
              <div className="mt-4 flex justify-between">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                  {t('Back')}
                </Button>
                <Button
                  type="submit"
                  disabled={createSubmission.isPending}
                  className="w-40 gap-2"
                >
                  {createSubmission.isPending ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      {t('Submit')} <Zap size={18} />
                    </>
                  )}
                </Button>
              </div>
              {createSubmission.isError && (
                <p className="text-sm text-red-500">{t('Something went wrong. Please try again.')}</p>
              )}
            </Card>
          </motion.form>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex w-full flex-col items-center gap-6 py-12 text-center"
          >
            <div className="neo-border neo-shadow mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-400 text-black">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="font-display text-4xl font-bold sm:text-5xl">{t("YOU'RE ON THE LIST!")}</h2>
            <p className="max-w-lg font-sans text-lg text-muted-foreground">
              {t("We've received your application. Keep an eye on your university email, we'll reach out within 48 hours for the next steps.")}
            </p>
            <Button className="mt-8" onClick={() => (window.location.href = '/')}>
              {t('Return Home')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
