export interface StatsUser {
  _id: string;
  name: string;
  image?: string;
}

export interface StatsResponse {
  students: number;
  events: number;
  projects: number;
  profiles: StatsProfiles;
}

export interface StatsProfiles {
  images: StatsUser[];
  count: number;
}
