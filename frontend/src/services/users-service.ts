import { apiClient } from '@/lib/api-client';
import type { UserResponse } from '@/types/payload/response/user-response';
import type { UserSearchQuery } from '@/types/payload/query/user-query';
import type { PageResponse } from '@/types/utils/page';
import type { UserUpdateRequest } from '@/types/payload/request/user-request';

function queryString(query: UserSearchQuery) {
  const search = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value));
  });
  const value = search.toString();
  return value ? `?${value}` : '';
}

export const usersService = {
  getSelf: () => apiClient.get<UserResponse>('/v1/users/me'),
  getByUsername: (username: string) =>
    apiClient.get<UserResponse>(`/v1/users/${encodeURIComponent(username)}`),
  search: (query: UserSearchQuery) =>
    apiClient.get<PageResponse<UserResponse>>(`/v1/users${queryString(query)}`),
  update: (username: string, request: UserUpdateRequest) =>
    apiClient.put<void>(`/v1/users/${encodeURIComponent(username)}`, request),
  resetEmail: (username: string) =>
    apiClient.post<void>(
      `/v1/users/${encodeURIComponent(username)}/reset-email`,
    ),
  delete: (username: string) =>
    apiClient.delete<void>(`/v1/users/${encodeURIComponent(username)}`),
};
