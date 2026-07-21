export interface RankingUser {
  _id: string;
  name: string;
  email: string;
  points: number;
  major?: string;
  image?: string;
}

export interface RankingResponse {
  ranking: RankingUser[];
  count: number;
}

export interface RankingParams {
  limit?: number;
}
