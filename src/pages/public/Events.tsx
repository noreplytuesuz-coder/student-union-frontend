import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Filter, MapPin, Clock, Users, CheckCircle2, Calendar, Search } from "lucide-react";
import { Button, Card, Skeleton, Input, Dropdown } from "@/shared/ui";
import { useLanguage } from "@/app/providers";
import { cn, formatDate, getImageUrl } from "@/shared/lib/utils";
import { useEvents, type EventType } from "@/entities/event";

const CATEGORY_PLACEHOLDER = "all";

const TYPE_OPTIONS: { value: EventType | typeof CATEGORY_PLACEHOLDER; label: string }[] = [
  { value: CATEGORY_PLACEHOLDER, label: "All" },
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
  { value: "competition", label: "Competition" },
  { value: "cultural", label: "Cultural" },
  { value: "sports", label: "Sports" },
  { value: "volunteer", label: "Volunteer" },
  { value: "other", label: "Other" },
];

export function Events() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<EventType | typeof CATEGORY_PLACEHOLDER>(CATEGORY_PLACEHOLDER);

  const { data, isLoading, isError } = useEvents({
    search: search || undefined,
    type: type !== CATEGORY_PLACEHOLDER ? type : undefined,
  });

  const events = data?.events ?? [];

  return (
    <div className="flex flex-col gap-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <section className="text-center pt-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl sm:text-7xl font-black mb-6 uppercase tracking-tight"
        >
          {t("events.title")}
        </motion.h1>
        <p className="font-sans text-muted-foreground text-lg max-w-2xl mx-auto mb-8">{t("events.subtitle")}</p>
      </section>

      {/* Filters & Actions */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-color)] rounded-full shrink-0 neo-border">
            <Filter size={18} />
            <span className="font-heading text-sm font-bold">{t("events.filter")}</span>
          </div>
          <div className="relative flex-1 md:flex-none">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("events.search")}
              className="pl-9 w-full md:w-64"
            />
          </div>
          <Dropdown
            value={type}
            onChange={(v) => setType(v as EventType | typeof CATEGORY_PLACEHOLDER)}
            options={TYPE_OPTIONS.map((opt) => ({ label: t(opt.label), value: String(opt.value) }))}
            className="md:w-48"
          />
        </div>
        <Link to="/calendar" className="shrink-0 w-full md:w-auto">
          <Button variant="primary" className="gap-2 w-full md:w-auto">
            <Calendar size={18} />
            {t("nav.calendar")}
          </Button>
        </Link>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isError ? (
          <p className="col-span-full text-center text-muted-foreground font-sans">{t("Error loading data")}</p>
        ) : isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`skeleton-${i}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="p-0 h-full flex flex-col relative overflow-visible z-10">
                {/* Date Badge Skeleton */}
                <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl neo-border neo-shadow z-20 rotate-[-5deg] bg-[var(--bg-color)] overflow-hidden">
                  <Skeleton className="w-full h-full rounded-none" />
                </div>

                {/* Image Skeleton */}
                <div className="relative h-56 border-b neo-border overflow-hidden">
                  <Skeleton className="w-full h-full rounded-none" />
                </div>

                {/* Content Skeleton */}
                <div className="p-6 flex flex-col flex-1 gap-4 bg-[var(--bg-color)]">
                  <Skeleton className="h-8 w-3/4 mb-2" />

                  <div className="flex flex-col gap-2 mt-auto">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>

                  <Skeleton className="h-11 w-full mt-4 rounded-full" />
                </div>
              </Card>
            </motion.div>
          ))
        ) : events.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground font-sans">{t("events.empty")}</p>
        ) : (
          <AnimatePresence mode="popLayout">
            {events.map((event) => {
              const img =
                getImageUrl(event.image) ??
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop";
              const day = event.date ? new Date(event.date).getDate() : "—";
              const month = event.date
                ? new Date(event.date).toLocaleDateString("en-US", { month: "short" }).toUpperCase()
                : "—";
              return (
                <motion.div
                  key={event._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Card className="p-0 h-full flex flex-col group relative overflow-visible z-10 hover:z-20">
                    {/* Date Badge */}
                    <div
                      className={cn(
                        "absolute -top-4 -left-4 bg-primary text-white font-black font-display p-3 rounded-xl neo-border neo-shadow z-20 rotate-[-5deg] group-hover:rotate-0 transition-transform",
                      )}
                    >
                      {month}
                      <br />
                      <span className="text-2xl leading-none">{day}</span>
                    </div>

                    {/* Image */}
                    <div className="relative h-56 overflow-hidden border-b neo-border">
                      <img
                        loading="lazy"
                        src={img}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/40 text-white text-xs font-bold font-mono rounded-full">
                          {event.type}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1 gap-4 bg-[var(--bg-color)]">
                      <h3 className="font-display text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>

                      <div className="flex flex-col gap-2 mt-auto text-sm font-sans text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-primary" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-secondary" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-cyan-500" />
                          <span>
                            {event.participations.length}/{event.capacity} going
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Link to={`/events/${event._id}`} className="flex-1">
                          <Button className="w-full" variant="secondary">
                            {t("View Details")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </section>
    </div>
  );
}
