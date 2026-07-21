import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/app/providers";

import { useCreateProject, useDeleteProject, useProjects, useUpdateProject } from "@/entities/project";
import type { CreateProjectDto, Project, ProjectStatus } from "@/entities/project";
import { Badge, Button, Card, Dropdown, FileUpload, Input, Modal, Skeleton, Textarea } from "@/shared/ui";
import { TeamPicker } from "@/widgets/team-picker";

const STATUSES: ProjectStatus[] = ["planning", "in-progress", "completed"];
const STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: "Planned",
  "in-progress": "Ongoing",
  completed: "Completed",
};
const MAX_TAGS = 3;
const MAX_OUTCOMES = 3;

interface FormState {
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  image: string;
  tags: string[];
  team: string[];
  outcomes: string[];
}

const emptyForm: FormState = {
  title: "",
  description: "",
  status: "planning",
  progress: 0,
  image: "",
  tags: [],
  team: [],
  outcomes: ["", "", ""],
};

export function AdminProjects() {
  const { t } = useLanguage();
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setTagInput("");
    setIsOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      description: project.description,
      status: project.status,
      progress: project.progress,
      image: project.image ?? "",
      tags: [...(project.tags ?? [])],
      team: Array.isArray(project.team)
        ? (project.team as unknown as { _id: string }[]).map((m) => m._id)
        : [],
      outcomes: [
        ...(project.outcomes ?? []),
        ...Array.from({ length: MAX_OUTCOMES - (project.outcomes ?? []).length }, () => ""),
      ].slice(0, MAX_OUTCOMES),
    });
    setTagInput("");
    setIsOpen(true);
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value || form.tags.some((tag) => tag.toLowerCase() === value.toLowerCase()) || form.tags.length >= MAX_TAGS) {
      setTagInput("");
      return;
    }
    setForm((prev) => ({ ...prev, tags: [...prev.tags, value] }));
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const setOutcome = (index: number, value: string) => {
    setForm((prev) => {
      const outcomes = [...prev.outcomes];
      outcomes[index] = value;
      return { ...prev, outcomes };
    });
  };

  const handleSubmit = () => {
    const dto: CreateProjectDto = {
      title: form.title,
      description: form.description,
      status: form.status,
      progress: Number(form.progress),
      image: form.image || undefined,
      tags: form.tags,
      team: form.team,
      outcomes: form.outcomes.map((o) => o.trim()).filter(Boolean),
    };

    if (editingId) updateProject.mutate({ id: editingId, data: dto });
    else createProject.mutate(dto);
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (!confirmDeleteId) return;
    deleteProject.mutate(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">{t("Admin")} · {t("Projects")}</h1>
          <p className="text-muted-foreground text-sm">{t("Manage organization projects and track their progress.")}</p>
        </div>
        <Button onClick={openCreate}>{t("Add Project")}</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : !projects || projects.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-muted-foreground">{t("No projects yet.")}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project._id} className="p-5 flex flex-col gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant={project.status === "completed" ? "primary" : project.status === "in-progress" ? "success" : "neutral"}>
                    {STATUS_LABELS[project.status]}
                  </Badge>
                  <span className="font-mono text-sm text-muted-foreground">{project.progress}%</span>
                </div>
                <h3 className="font-heading font-bold text-lg leading-tight mb-1">{project.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
              </div>

              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-hero" style={{ width: `${project.progress}%` }} />
              </div>

              <div className="flex items-center gap-2 mt-1">
                <Button variant="outline" size="sm" onClick={() => openEdit(project)}>{t("Edit")}</Button>
                <Button variant="danger" size="sm" onClick={() => setConfirmDeleteId(project._id)}>{t("Delete")}</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={editingId ? t("Edit Project") : t("Add Project")}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        disableClose={imageUploading}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={imageUploading}>{t("Cancel")}</Button>
            <Button
              onClick={handleSubmit}
              disabled={createProject.isPending || updateProject.isPending || imageUploading}
            >
              {imageUploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : editingId ? (
                t("Save Changes")
              ) : (
                t("Save")
              )}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">{t("Title")}</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder={t("Project title")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t("Brief description of the project")}</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder={t("About this project")}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("Status")}</label>
              <Dropdown
                value={form.status}
                onChange={(v) => setForm((p) => ({ ...p, status: v as ProjectStatus }))}
                options={STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("Progress")} (%)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.progress}
                onChange={(e) => setForm((p) => ({ ...p, progress: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t("Project Image")}</label>
            <FileUpload
              entityType="projects"
              value={form.image}
              onChange={(key) => setForm((p) => ({ ...p, image: key as string }))}
              onUploadStateChange={setImageUploading}
              accept="image/*"
              label={t("Project Image")}
              t={t}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t("Tags (Max3)")}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map((tag, i) => (
                <Badge key={i} variant="primary" className="gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(i)} className="ml-1 hover:text-red-400">×</button>
                </Badge>
              ))}
              {form.tags.length === 0 && (
                <span className="text-sm text-muted-foreground">{t("No tags added yet.")}</span>
              )}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag();
                } else if (e.key === "Backspace" && !tagInput && form.tags.length) {
                  removeTag(form.tags.length - 1);
                }
              }}
              placeholder={t("Add a tag and press Enter")}
              disabled={form.tags.length >= MAX_TAGS}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t("Core Team (Max 4)")}</label>
            <TeamPicker value={form.team} onChange={(ids) => setForm((p) => ({ ...p, team: ids }))} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t("Outcomes & Goals")}</label>
            <div className="space-y-2">
              {form.outcomes.map((outcome, i) => (
                <Input
                  key={i}
                  value={outcome}
                  onChange={(e) => setOutcome(i, e.target.value)}
                  placeholder={`${t("Outcomes & Goals")} ${i + 1}`}
                />
              ))}
              {form.outcomes.filter((o) => o.trim()).length === 0 && (
                <span className="text-sm text-muted-foreground">{t("No outcomes added yet.")}</span>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={t("Delete")}
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>{t("Cancel")}</Button>
            <Button variant="danger" onClick={handleDelete}>{t("Delete")}</Button>
          </div>
        }
      >
        <p className="text-muted-foreground">{t("Delete this project?")}</p>
      </Modal>
    </div>
  );
}
