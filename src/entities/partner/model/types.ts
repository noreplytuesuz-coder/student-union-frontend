export interface Partner {
  _id: string;
  name: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
}

export type CreatePartnerDto = {
  name: string;
  logo: string;
};

export type UpdatePartnerDto = Partial<CreatePartnerDto>;
