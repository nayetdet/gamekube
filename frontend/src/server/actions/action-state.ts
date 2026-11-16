import { unstable_rethrow } from 'next/navigation';
import type { $ZodIssue } from 'zod/v4/core';
import { describeError, type StatusMessages } from '@/lib/error-messages';

export type FieldErrors = Record<string, string[]>;

export type ActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  fieldErrors?: FieldErrors;
};

export const idleState: ActionState = { status: 'idle', message: '' };

export function succeeded(message: string): ActionState {
  return { status: 'success', message };
}

export function failed(
  message: string,
  fieldErrors?: FieldErrors,
): ActionState {
  return { status: 'error', message, fieldErrors };
}

export function invalid(issues: readonly $ZodIssue[]): ActionState {
  const fieldErrors: FieldErrors = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? 'form');
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return failed('Revise os campos destacados.', fieldErrors);
}

export async function attempt<T extends ActionState>(
  work: () => Promise<T>,
  messages?: StatusMessages,
): Promise<T | ActionState> {
  try {
    return await work();
  } catch (error) {
    unstable_rethrow(error);
    return failed(describeError(error, messages));
  }
}
