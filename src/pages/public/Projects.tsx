import { useState } from "react";
import { useLanguage } from "@/app/providers/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects, type Project, type ProjectStatus } from "@/entities/project";
import { Avatar, Badge, Skeleton } from "@/shared/ui";
import { getImageUrl } from "@/shared/lib/utils";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "in-progress", label: "Ongoing" },
  { key: "completed", label: "Completed" },
  { key: "planning", label: "Planned" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

const STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: "Planned",
  "in-progress": "Ongoing",
  completed: "Completed",
};

// Per-status pill + avatar + bar styling, matching the design tokens.
const STATUS_STYLES: Record<
  ProjectStatus,
  { wrap: string; text: string; bar: string }
> = {
  planning: {
    wrap: "bg-yellow-500/10 border-yellow-500/20",
    text: "text-yellow-500",
    bar: "bg-yellow-500",
  },
  "in-progress": {
    wrap: "bg-green-500/10 border-green-500/20",
    text: "text-green-500",
    bar: "bg-gradient-hero",
  },
  completed: {
    wrap: "bg-primary/10 border-primary/20",
    text: "text-primary",
    bar: "bg-primary",
  },
};

export function Projects() {
  const { t } = useLanguage();
  const { data: projects, isLoading, isError } = useProjects();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = projects?.filter((p) => filter === "all" || p.status === filter) ?? [];

  return (
    <div className="flex flex-col gap-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-12">
      {/* Hero */}
      <section className="text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center neo-border neo-shadow mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap text-primary" aria-hidden="true"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>
        </div>
        <h1 className="font-display text-5xl sm:text-7xl font-black uppercase tracking-tight mb-4">
          We Build <span className="text-gradient">Things</span>
        </h1>
        <p className="font-sans text-muted-foreground text-lg max-w-2xl">
          {t("Explore the projects and campaigns driving change across our campus community.")}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2 rounded-full font-heading text-sm font-bold transition-all neo-border ${
                filter === f.key
                  ? "bg-gradient-hero text-white neo-shadow"
                  : "glass hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              {t(f.label)}
            </button>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section className="flex flex-col gap-8">
        {isLoading ? (
          <div className="flex flex-col gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 md:h-80 rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-20">{t("Failed to load projects...")}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">{t("No projects found.")}</div>
        ) : (
          filtered.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} onClick={() => setSelected(project)} />
          ))
        )}
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-[var(--bg-color)] rounded-3xl neo-border shadow-2xl overflow-hidden relative"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[110] w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>

              <div className="flex-1 overflow-y-auto">
                {/* Cover */}
                <div className="relative h-64 sm:h-80 w-full flex-shrink-0">
                  <img
                    alt={selected.title}
                    className="w-full h-full object-cover"
                    src={selected.image ? getImageUrl(selected.image) : FALLBACK}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    {selected.tags && selected.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selected.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/40 text-white text-xs font-bold font-mono rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                      {selected.title}
                    </h2>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-bold mb-4">{t("About this project")}</h3>
                    <p className="text-muted-foreground font-sans leading-relaxed mb-8">
                      {selected.description}
                    </p>

                    <h3 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check text-primary"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                      {t("Outcomes & Goals")}
                    </h3>
                    {selected.outcomes && selected.outcomes.length > 0 ? (
                      <ul className="space-y-3 font-sans text-muted-foreground">
                        {selected.outcomes.map((outcome, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right text-secondary mt-0.5 flex-shrink-0"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">{t("No outcomes added yet.")}</p>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6">
                    <div className="rounded-2xl overflow-hidden glass p-6 bg-gray-50 dark:bg-white/5">
                      <h4 className="font-heading font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                        {t("Current Status")}
                      </h4>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`size-3.5 rounded-full ${STATUS_DOT_BG[selected.status]} animate-pulse`} />
                        <span className={`font-mono font-bold text-lg ${STATUS_TEXT[selected.status]}`}>
                          {STATUS_LABELS[selected.status]}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                        <div className={`h-full ${STATUS_BAR[selected.status]}`} style={{ width: `${selected.progress || 0}%` }} />
                      </div>
                      <span className="font-mono text-sm font-bold">{selected.progress || 0}% Complete</span>
                    </div>

                    <div className="rounded-2xl overflow-hidden glass p-6 bg-gray-50 dark:bg-white/5">
                      <h4 className="font-heading font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                        {t("Core Team")}
                      </h4>
                      {selected.team && selected.team.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {selected.team.map((member, i) => (
                            <Avatar
                              key={i}
                              name={member.name}
                              image={member.image}
                              className="neo-border h-12 w-12"
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">{t("No team members yet.")}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const { t } = useLanguage();
  const styles = STATUS_STYLES[project.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div
        onClick={onClick}
        className="rounded-2xl glass p-0 overflow-hidden group cursor-pointer"
      >
        <div className="flex flex-col md:flex-row h-full neo-border rounded-2xl overflow-hidden bg-[var(--bg-color)]">
          {/* Cover */}
          <div className="w-full md:w-[40%] h-64 md:h-auto relative overflow-hidden border-b md:border-b-0 md:border-r neo-border">
            <img
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src={project.image ? getImageUrl(project.image) : FALLBACK}
            />
            {project.tags && project.tags.length > 0 && (
              <div className="absolute top-4 left-4 flex gap-2">
                {project.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md text-black dark:text-white text-xs font-bold font-mono rounded-full neo-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="w-full md:w-[60%] p-6 sm:p-8 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${styles.wrap}`}>
                {project.status === "completed" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-circle-check ${styles.text}`} aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                ) : project.status === "planning" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-clock ${styles.text}`} aria-hidden="true"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-circle fill-current ${styles.text} animate-pulse`} aria-hidden="true"><circle cx="12" cy="12" r="10" /></svg>
                )}
                <span className={`font-mono font-bold text-xs uppercase tracking-wider ${styles.text}`}>
                  {STATUS_LABELS[project.status]}
                </span>
              </div>

              {project.team && project.team.length > 0 && (
                <div className="flex -space-x-3">
                  {project.team.slice(0, 4).map((member, i) => (
                    <Avatar
                      key={i}
                      name={member.name}
                      image={member.image}
                      className="neo-border h-8 w-8"
                    />
                  ))}
                </div>
              )}
            </div>

            <h2 className="font-display text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
              {project.title}
            </h2>
            <p className="text-muted-foreground font-sans mb-6 line-clamp-2">{project.description}</p>

            <div className="mt-auto">
              <div className="flex justify-between items-end mb-2">
                <span className="font-heading font-bold text-sm">{t("Progress")}</span>
                <span className="font-mono font-bold text-xl">{project.progress || 0}%</span>
              </div>
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden neo-border border-transparent group-hover:border-gray-300 dark:group-hover:border-gray-700 transition-colors">
                <div className={`h-full ${styles.bar}`} style={{ width: `${project.progress || 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const STATUS_DOT_BG: Record<ProjectStatus, string> = {
  planning: "bg-yellow-500",
  "in-progress": "bg-green-500",
  completed: "bg-primary",
};
const STATUS_TEXT: Record<ProjectStatus, string> = {
  planning: "text-yellow-500",
  "in-progress": "text-green-500",
  completed: "text-primary",
};
const STATUS_BAR: Record<ProjectStatus, string> = {
  planning: "bg-yellow-500",
  "in-progress": "bg-gradient-hero",
  completed: "bg-primary",
};

const FALLBACK = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2013";
