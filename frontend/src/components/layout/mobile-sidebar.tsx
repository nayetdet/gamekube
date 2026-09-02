'use client';

import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Sidebar, type SidebarProps } from './sidebar';

export function MobileSidebar(props: Omit<SidebarProps, 'onNavigate'>) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Abrir navegação"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navegação</SheetTitle>
        <SheetDescription className="sr-only">
          Navegue entre as seções do app.
        </SheetDescription>
        <Sidebar {...props} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
