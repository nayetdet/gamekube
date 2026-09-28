import type { User } from '@/entities/user/user.entity';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProfileDetails } from './profile-details';

type ProfileCardProps = {
  user: User;
  title: string;
  description: string;
};

export function ProfileCard({ user, title, description }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="py-0">
        <ProfileDetails user={user} />
      </CardContent>
    </Card>
  );
}
