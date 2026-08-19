export interface User {
  id: string;
  keycloakId: string;
  username: string;
  name: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageInfo {
  pageNumber: number;
  pageSize: number;
  total: number;
}

export interface PageResponse<T> {
  content: T[];
  pageable: PageInfo;
}

export interface UserSearchQuery {
  username?: string;
  name?: string;
  createdBefore?: string;
  createdAfter?: string;
  pageNumber?: number;
  pageSize?: number;
  orderBy?:
    | 'id'
    | '-id'
    | 'username'
    | '-username'
    | 'name'
    | '-name'
    | 'createdAt'
    | '-createdAt'
    | 'updatedAt'
    | '-updatedAt';
}

export interface UserUpdateRequest {
  username: string;
  name?: string | null;
  description?: string | null;
}

export interface GameResponse {
  url: string;
}
