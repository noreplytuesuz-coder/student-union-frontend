/** Minimal author reference returned for populated `createdBy`. */
export interface AuthorRef {
  name: string;
  email: string;
}

export interface Doc {
  _id: string;
  title: string;
  description: string;
  file: string;
  createdBy: string | AuthorRef;
  createdAt: string;
  updatedAt: string;
}

export type CreateDocumentDto = {
  title: string;
  description: string;
  file: string;
};

export type UpdateDocumentDto = Partial<CreateDocumentDto>;
