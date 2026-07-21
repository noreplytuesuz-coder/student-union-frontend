import { useLanguage } from '@/app/providers';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar as CalendarIcon, X } from 'lucide-react';
import { Card, Button } from '@/shared/ui';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { useEventCalendar, type EventType } from '@/entities/event';

const TYPE_COLOR: Record<EventType, string> = {
  workshop: 'bg-cyan-500',
  seminar: 'bg-secondary',
  competition: 'bg-yellow-500',
  cultural: 'bg-yellow-500',
  sports: 'bg-green-500',
  volunteer: 'bg-primary',
  other: 'bg-secondary',
};

function typeColor(type: EventType): string {
  return TYPE_COLOR[type] ?? 'bg-primary';
}

export function Calendar() {
  const { t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const month = currentMonth.getMonth() + 1;
  const year = currentMonth.getFullYear();
  const navigate = useNavigate();
  const { data, isLoading } = useEventCalendar(year, month);

  const calendarEvents = data?.events ?? [];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const eventsForDay = (day: Date) =>
    calendarEvents.filter((e) => isSameDay(new Date(e.date), day));

  const onDateClick = (day: Date, dayEvents: typeof calendarEvents) => {
    setSelectedDate(day);
    if (dayEvents.length > 0) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-4xl font-bold flex items-center gap-4">
          <CalendarIcon className="text-primary" size={36} />
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={goToToday} className="font-mono uppercase text-xs">
            {t('Today')}
          </Button>
          <div className="flex bg-gray-100 dark:bg-white/10 rounded-full neo-border overflow-hidden">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-white dark:hover:bg-gray-800 focus:outline-none focus:bg-white dark:focus:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="w-px bg-gray-300 dark:bg-gray-700" />
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-white dark:hover:bg-gray-800 focus:outline-none focus:bg-white dark:focus:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = 'EEE';
    const days = [];
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-mono font-bold text-xs uppercase text-muted-foreground py-2">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

        const dayEvents = eventsForDay(day);
        days.push(
          <div
            key={day.toString()}
            onClick={() => onDateClick(cloneDay, dayEvents)}
            className={cn(
              'min-h-[100px] p-2 border border-gray-200 dark:border-white/5 transition-all cursor-pointer relative group',
              !isCurrentMonth
                ? 'opacity-40 bg-gray-50/50 dark:bg-black/20'
                : 'bg-transparent hover:bg-gray-50 dark:hover:bg-white/5',
              isSelected ? 'ring-2 ring-inset ring-primary bg-primary/5 dark:bg-primary/10' : ''
            )}
          >
            <div className="flex justify-between items-start">
              <span
                className={cn(
                  'font-heading text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full',
                  isToday ? 'bg-primary text-white neo-shadow' : 'text-current'
                )}
              >
                {formattedDate}
              </span>

              {dayEvents.length > 0 && (
                <span className="text-[10px] font-mono text-muted-foreground hidden sm:block">
                  {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-col gap-1 hidden sm:flex">
              {dayEvents.map((event, idx) => (
                <div
                  key={idx}
                  className={cn(
                    typeColor(event.type),
                    'px-2 py-1 rounded text-white text-[10px] font-bold font-mono truncate neo-border border-transparent group-hover:border-white/20 transition-colors'
                  )}
                >
                  {event.title}
                </div>
              ))}
            </div>

            {/* Event Dots for Mobile */}
            <div className="mt-2 flex flex-wrap gap-1 sm:hidden">
              {dayEvents.map((event, idx) => (
                <div key={`dot-${idx}`} className={cn('w-2 h-2 rounded-full neo-shadow', typeColor(event.type))} />
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return (
      <div className="rounded-xl overflow-hidden neo-border neo-shadow glass bg-white/50 dark:bg-gray-900/50">
        {rows}
      </div>
    );
  };

  const renderSkeleton = () => {
    return (
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="py-2 flex justify-center">
              <div className="w-8 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="rounded-xl overflow-hidden neo-border neo-shadow glass bg-white/50 dark:bg-gray-900/50">
          {Array.from({ length: 6 }).map((_, week) => (
            <div key={week} className="grid grid-cols-7">
              {Array.from({ length: 7 }).map((_, day) => (
                <div
                  key={day}
                  className="min-h-[100px] p-2 border border-gray-200 dark:border-white/5"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 mb-2" />
                  {/* Faux event chips on a couple of random days */}
                  {week === 1 && (day === 2 || day === 4) && (
                    <div className="hidden sm:block w-full h-4 bg-gray-200 dark:bg-gray-800 rounded mb-1" />
                  )}
                  {week === 3 && day === 5 && (
                    <div className="hidden sm:block w-full h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Side panel placeholder */}
        <div className="mt-4 hidden lg:flex justify-end">
          <div className="w-[350px] h-64 rounded-xl neo-border neo-shadow bg-gray-200/60 dark:bg-gray-800/60" />
        </div>
      </div>
    );
  };

  const selectedDayEvents = selectedDate ? eventsForDay(selectedDate) : [];

  return (
    <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-12 relative overflow-hidden">
      {/* Legend */}
      <div
        className={cn(
          'flex flex-wrap gap-4 items-center justify-end font-mono text-xs font-bold text-muted-foreground mb-[-1rem] transition-all duration-500',
          isSidebarOpen ? 'lg:mr-[350px]' : ''
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500" /> {t('Workshop')}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary" /> {t('Seminar')}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" /> {t('Cultural')}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" /> {t('Sports')}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" /> {t('Other')}
        </div>
      </div>

      <div className={cn('transition-all duration-500', isSidebarOpen ? 'lg:mr-[350px]' : '')}>
        {isLoading ? (
          renderSkeleton()
        ) : (
          <>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            {calendarEvents.length === 0 && (
              <p className="mt-6 text-center font-sans text-muted-foreground">
                {t('No events this month.')}
              </p>
            )}
          </>
        )}
      </div>

      {/* Side Panel for Event Details */}
      <AnimatePresence>
        {isSidebarOpen && selectedDate && !isLoading && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[350px] bg-[var(--bg-color)] z-50 border-l-2 border-[var(--text-color)] shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-[var(--text-color)] border-dashed">
                  <h3 className="font-display text-2xl font-bold">{format(selectedDate, 'MMM d, yyyy')}</h3>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {selectedDayEvents.length > 0 ? (
                    selectedDayEvents.map((event, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className="p-5" neo={false}>
                          <div className={cn('w-fit px-2 py-1 rounded text-white text-[10px] font-bold font-mono uppercase mb-3 neo-shadow', typeColor(event.type))}>
                            {event.type}
                          </div>
                          <h4 className="font-heading font-bold text-lg mb-4">{event.title}</h4>
                          <div className="flex flex-col gap-2 text-sm text-muted-foreground font-sans">
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-primary" /> {format(new Date(event.date), 'HH:mm')}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-secondary" /> {event.location}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-4"
                            variant="secondary"
                            onClick={() => navigate(`/events/${event._id}`)}
                          >
                            {t('View Full Details')}
                          </Button>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground font-mono text-sm">
                      {t('No events scheduled for this day.')}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
