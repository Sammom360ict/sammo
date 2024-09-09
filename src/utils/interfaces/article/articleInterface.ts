export interface ICreateArticlePayload {
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  thumbnail_details?: string;
}

export interface IArticleFilterQuery {
  title?: string;
  status?: boolean;
  limit?: number;
  skip?: number;
  deleted?: string;
}

export interface ISingleArticleParams {
  id?: number;
  slug?: string;
}

export interface IUpdateArticlePayload {
  title?: string;
  slug?: string;
  content?: string;
  thumbnail?: string;
  thumbnail_details?: string;
  status?: boolean;
  deleted?: boolean;
}
