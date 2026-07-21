import { useLanguage } from '@/app/providers';
import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Instagram, Twitter, Linkedin, MessageSquare } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { ContactForm } from '@/features/submission';

export function Contact() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-12">
      <section className="text-center flex flex-col items-center mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center neo-border neo-shadow mb-6"
        >
          <MessageSquare size={40} className="text-primary" />
        </motion.div>
        <h1 className="font-display text-5xl sm:text-7xl font-black uppercase tracking-tight">
          {t("Get in")} <span className="text-gradient">{t("Touch")}</span>
        </h1>
        <p className="font-sans text-muted-foreground text-lg max-w-xl mt-4">
          {t("Have a question, partnership idea, or just want to say hi? Drop us a message and we'll get back to you ASAP.")}
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
        {/* Left Info Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8"
        >
          <Card className="flex flex-col gap-8 p-8 h-full bg-gradient-to-br from-gray-50 to-gray-200 dark:from-white/5 dark:to-white/10" neo={false}>
            <div>
              <h3 className="font-display text-2xl font-bold mb-6">{t("Contact Information")}</h3>
              <div className="flex flex-col gap-6 font-sans">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 neo-border">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold mb-1">{t("Visit Us")}</h4>
                    <p className="text-muted-foreground text-sm">{t("Student Union Building, Room 204")}<br />{t("University Campus, City 10001")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0 neo-border">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold mb-1">{t("Email Us")}</h4>
                    <p className="text-muted-foreground text-sm">hello@studentunion.edu<br />support@studentunion.edu</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 neo-border">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold mb-1">{t("Call Us")}</h4>
                    <p className="text-muted-foreground text-sm">+1 (555) 123-4567<br />{t("Mon-Fri, 9am - 5pm")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <h4 className="font-heading font-bold mb-4">{t("Follow Our Journey")}</h4>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-black dark:text-white flex items-center justify-center neo-border hover:bg-primary hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-black dark:text-white flex items-center justify-center neo-border hover:bg-secondary hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-black dark:text-white flex items-center justify-center neo-border hover:bg-cyan-500 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            {/* Embedded Map Placeholder */}
            <div className="h-48 rounded-xl neo-border overflow-hidden bg-gray-300 dark:bg-gray-700 relative">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-mono text-sm">
                [ Interactive Map ]
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <Card className="p-8 h-full">
            <ContactForm />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
