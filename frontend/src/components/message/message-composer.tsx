'use client';

import { useActionState, useRef, useState } from 'react';
import { Loader2Icon, SendIcon, SmileIcon } from 'lucide-react';
import { Popover } from 'radix-ui';
import { idleState } from '@/server/actions/action-state';
import { sendMessageAction } from '@/server/actions/message.actions';
import { FormAlert } from '@/components/common/form-alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const emojis = [
  '😀',
  '😂',
  '😊',
  '😍',
  '😎',
  '🤔',
  '😢',
  '😭',
  '😅',
  '🥳',
  '😉',
  '😴',
  '👍',
  '👎',
  '👏',
  '🙌',
  '❤️',
  '🔥',
  '🎮',
  '🎉',
  '💜',
  '✨',
  '🏆',
  '👋',
];

export function MessageComposer({ username }: { username: string }) {
  const [content, setContent] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selection = useRef({ start: 0, end: 0 });
  const [state, action, pending] = useActionState(
    async (previous: typeof idleState, data: FormData) => {
      const next = await sendMessageAction(previous, data);
      if (next.status === 'success') {
        setContent('');
        selection.current = { start: 0, end: 0 };
      }
      return next;
    },
    idleState,
  );
  return (
    <form
      action={action}
      className="space-y-3 border-t border-border p-4 sm:px-6"
    >
      <input type="hidden" name="username" value={username} />
      <Label htmlFor="message-content" className="sr-only">
        Mensagem para @{username}
      </Label>
      <div className="flex items-end gap-2 rounded-xl bg-muted p-2">
        <Popover.Root open={emojiOpen} onOpenChange={setEmojiOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              aria-label="Escolher emoji"
              disabled={pending}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <SmileIcon className="size-5" aria-hidden />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="top"
              align="start"
              sideOffset={8}
              aria-label="Emojis"
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                textareaRef.current?.focus();
              }}
              className="z-50 grid w-64 grid-cols-6 gap-1 rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-lg"
            >
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  aria-label={`Inserir ${emoji}`}
                  className="flex size-9 items-center justify-center rounded-lg text-xl hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                  onClick={() => {
                    const { start, end } = selection.current;
                    const next =
                      content.slice(0, start) + emoji + content.slice(end);
                    if (next.length > 2000) return;
                    setContent(next);
                    const cursor = start + emoji.length;
                    selection.current = { start: cursor, end: cursor };
                    setEmojiOpen(false);
                    requestAnimationFrame(() => {
                      textareaRef.current?.focus();
                      textareaRef.current?.setSelectionRange(cursor, cursor);
                    });
                  }}
                >
                  {emoji}
                </button>
              ))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <Textarea
          ref={textareaRef}
          id="message-content"
          name="content"
          value={content}
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              if (!pending && content.trim())
                event.currentTarget.form?.requestSubmit();
            }
          }}
          onChange={(event) => {
            setContent(event.target.value);
            selection.current = {
              start: event.target.selectionStart,
              end: event.target.selectionEnd,
            };
          }}
          onSelect={(event) => {
            selection.current = {
              start: event.currentTarget.selectionStart,
              end: event.currentTarget.selectionEnd,
            };
          }}
          required
          maxLength={2000}
          rows={1}
          disabled={pending}
          aria-invalid={Boolean(state.fieldErrors?.content)}
          aria-describedby="message-feedback"
          placeholder="Combine a próxima partida…"
          className="min-h-10 resize-none border-0 bg-transparent px-2 py-2.5 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <Button
          type="submit"
          size="icon-lg"
          aria-label="Enviar mensagem"
          aria-busy={pending}
          disabled={pending}
          className="shrink-0 rounded-lg"
        >
          {pending ? (
            <Loader2Icon className="animate-spin" aria-hidden />
          ) : (
            <SendIcon aria-hidden />
          )}
        </Button>
      </div>
      <div id="message-feedback">
        {state.status === 'error' && <FormAlert state={state} />}
        {state.fieldErrors?.content?.map((error) => (
          <p key={error} className="text-sm text-destructive">
            {error}
          </p>
        ))}
      </div>
    </form>
  );
}
