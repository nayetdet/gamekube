'use client';

import { useActionState, useState } from 'react';
import type { User } from '@/entities/user/user.entity';
import { idleState, type ActionState } from '@/server/actions/action-state';
import { updateUserAction } from '@/server/actions/user.actions';
import { useActionToast } from '@/hooks/use-action-toast';
import { ProfileFieldEditor } from './profile-field-editor';
import { ProfileFieldRow } from './profile-field-row';
import { profileFields, type ProfileFieldName } from './profile-fields';

export function ProfileDetails({ user }: { user: User }) {
  const [editing, setEditing] = useState<ProfileFieldName | null>(null);

  const [state, action] = useActionState(
    async (previous: ActionState, formData: FormData) => {
      const next = await updateUserAction(previous, formData);
      if (next.status === 'success') setEditing(null);
      return next;
    },
    idleState,
  );

  useActionToast(state);

  return (
    <form action={action}>
      <input type="hidden" name="currentUsername" value={user.username} />

      <dl className="divide-y divide-border">
        {profileFields.map((field) =>
          editing === field.name ? (
            <ProfileFieldEditor
              key={field.name}
              field={field}
              value={user[field.name] ?? ''}
              errors={state.fieldErrors?.[field.name]}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <ProfileFieldRow
              key={field.name}
              field={field}
              value={user[field.name] ?? ''}
              locked={editing !== null}
              onEdit={() => setEditing(field.name)}
            />
          ),
        )}
      </dl>
    </form>
  );
}
