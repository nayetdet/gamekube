export interface UserResponse {
  id: string;
  keycloakId: string;
  username: string;
  name: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}