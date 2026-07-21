import { useLanguage } from '@/app/providers/LanguageContext';
import { Button, Dropdown, Input, Textarea } from '@/shared/ui';
import { useCreateContact } from '@/entities/contact';
import { CheckCircle2, Send } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

const SUBJECTS = [
  { value: 'general', label: '👋 General Inquiry' },
  { value: 'partnership', label: '🤝 Partnership / Sponsorship' },
  { value: 'event', label: '🎉 Event Collaboration' },
  { value: 'support', label: '💡 Feedback & Support' },
];

/** Public contact form. Submits a `Contact` message to the backend. */
export function ContactForm() {
  const { t } = useLanguage();
  const createContact = useCreateContact();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createContact.mutate({ firstName, lastName, email, subject, message });
  };

  if (createContact.isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-400 text-black neo-border neo-shadow">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="font-display text-2xl font-bold">{t("Message Sent!")}</h3>
        <p className="font-sans text-muted-foreground">
          {t("Thanks for reaching out. Our team will get back to you shortly.")}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            createContact.reset();
            setFirstName('');
            setLastName('');
            setEmail('');
            setSubject('');
            setMessage('');
          }}
        >
          {t('Send another')}
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <h3 className="mb-6 font-display text-2xl font-bold">{t('Send a Message')}</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="font-heading text-sm font-bold">{t('First Name')}</label>
            <Input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t('John')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-heading text-sm font-bold">{t('Last Name')}</label>
            <Input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t('Doe')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-heading text-sm font-bold">{t('Email Address')}</label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('john@university.edu')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-heading text-sm font-bold">{t('Subject')}</label>
          <Dropdown value={subject} onChange={(v) => setSubject(v)} placeholder={t('Select a subject')} options={SUBJECTS.map((s) => ({ label: t(s.label), value: s.value }))} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-heading text-sm font-bold">{t('Message')}</label>
          <Textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('How can we help?')}
          />
        </div>

        {createContact.isError && (
          <p className="text-sm text-red-500">{t('Something went wrong. Please try again.')}</p>
        )}

        <Button type="submit" disabled={createContact.isPending} className="mt-2 gap-2 self-start">
          {createContact.isPending ? t('Sending...') : t('Send Message')}
          <Send size={18} />
        </Button>
      </form>
    </>
  );
}
