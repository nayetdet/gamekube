'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DownloadIcon, Loader2Icon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function SaveControls({ id }: { id: string }) {
  const [busy, setBusy] = useState<'download' | 'delete' | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();
  const url = `/api/games/${encodeURIComponent(id)}/save`;

  async function download() {
    setBusy('download');
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404)
          toast.info('Nenhum save encontrado para este jogo.');
        else if (response.status === 409)
          toast.error('Encerre o jogo antes de baixar o save.');
        else toast.error('Não foi possível baixar o save.');
        return;
      }
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${id}-save.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      toast.error('Não foi possível baixar o save.');
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    setBusy('delete');
    try {
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) {
        if (response.status === 404)
          toast.info('Nenhum save encontrado para este jogo.');
        else if (response.status === 409)
          toast.error('Encerre o jogo antes de excluir o save.');
        else toast.error('Não foi possível excluir o save.');
        return;
      }
      toast.success('Save excluído.');
      router.refresh();
    } catch {
      toast.error('Não foi possível excluir o save.');
    } finally {
      setBusy(null);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 w-full gap-1.5"
        disabled={busy !== null}
        aria-busy={busy === 'download'}
        onClick={download}
      >
        {busy === 'download' ? (
          <Loader2Icon className="animate-spin" aria-hidden />
        ) : (
          <DownloadIcon aria-hidden />
        )}
        Baixar save
      </Button>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 w-full gap-1.5 text-destructive hover:border-destructive/40 hover:text-destructive"
            disabled={busy !== null}
          >
            <Trash2Icon aria-hidden /> Excluir save
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir save?</AlertDialogTitle>
            <AlertDialogDescription>
              O progresso salvo neste jogo será removido. Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy !== null}>
              Cancelar
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={remove}
              disabled={busy !== null}
            >
              {busy === 'delete' && (
                <Loader2Icon className="animate-spin" aria-hidden />
              )}
              {busy === 'delete' ? 'Excluindo…' : 'Excluir save'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
