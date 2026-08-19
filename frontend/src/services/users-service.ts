import { apiClient } from '@/lib/api-client';
import type {
  PageResponse,
  User,
  UserSearchQuery,
  UserUpdateRequest,
} from '@/types/api';

function queryString(query: UserSearchQuery) {
  const search = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value));
  });
  const value = search.toString();
  return value ? `?${value}` : '';
}

export const usersService = {
  getSelf: () => apiClient.get<User>('/v1/users/me'),
  getByUsername: (username: string) =>
    apiClient.get<User>(`/v1/users/${encodeURIComponent(username)}`),
  search: (query: UserSearchQuery) =>
    apiClient.get<PageResponse<User>>(`/v1/users${queryString(query)}`),
  update: (username: string, request: UserUpdateRequest) =>
    apiClient.put<void>(`/v1/users/${encodeURIComponent(username)}`, request),
  resetEmail: (username: string) =>
    apiClient.post<void>(
      `/v1/users/${encodeURIComponent(username)}/reset-email`,
    ),
  delete: (username: string) =>
    apiClient.delete<void>(`/v1/users/${encodeURIComponent(username)}`),
};
