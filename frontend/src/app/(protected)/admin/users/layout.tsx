import { AuthGuard } from '@/components/auth/auth-guard';

export default function UsersAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard requireAdmin>{children}</AuthGuard>;
}
