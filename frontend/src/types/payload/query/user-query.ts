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
