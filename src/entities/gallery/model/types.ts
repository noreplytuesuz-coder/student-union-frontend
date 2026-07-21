/** Minimal author reference returned for populated `createdBy`. */
export interface AuthorRef {
  name: string;
  email: string;
}

export interface Gallery {
  _id: string;
  images: string[];
  title: string;
  createdBy: string | AuthorRef;
  createdAt: string;
  updatedAt: string;
}

export type CreateGalleryDto = {
  title: string;
  images: string[];
};

export type UpdateGalleryDto = Partial<CreateGalleryDto>;
