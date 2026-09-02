import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PageStepProps = {
  href: string | null;
  label: string;
  icon: LucideIcon;
  trailingIcon?: boolean;
};

export function PageStep({
  href,
  label,
  icon: Icon,
  trailingIcon,
}: PageStepProps) {
  const content = trailingIcon ? (
    <>
      {label}
      <Icon aria-hidden />
    </>
  ) : (
    <>
      <Icon aria-hidden />
      {label}
    </>
  );

  if (!href) {
    return (
      <Button variant="outline" size="sm" disabled>
        {content}
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href={href}>{content}</Link>
    </Button>
  );
}
