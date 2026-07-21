/** Minimal author reference returned for populated `createdBy`. */
export interface AuthorRef {
  name: string;
  email: string;
  image?: string;
}

export type ProjectStatus = 'planning' | 'in-progress' | 'completed';

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  image?: string;
  tags: string[];
  team: AuthorRef[];
  outcomes: string[];
  createdBy: string | AuthorRef;
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectDto = {
  title: string;
  description: string;
  status?: ProjectStatus;
  progress?: number;
  image?: string;
  tags?: string[];
  team?: string[];
  outcomes?: string[];
};

export type UpdateProjectDto = Partial<CreateProjectDto>;
