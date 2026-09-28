export type ProfileFieldName = 'name' | 'username' | 'description';

export type ProfileField = {
  name: ProfileFieldName;
  label: string;
  hint: string;
  empty: string;
  prefix?: string;
  mono?: boolean;
  multiline?: boolean;
  minLength?: number;
  maxLength: number;
  required?: boolean;
};

export const profileFields: readonly ProfileField[] = [
  {
    name: 'name',
    label: 'Nome de exibição',
    hint: 'Exibido nas listas no lugar do nome de usuário.',
    empty: 'Ainda sem nome de exibição.',
    maxLength: 100,
  },
  {
    name: 'username',
    label: 'Nome de usuário',
    hint: 'Também é o nome que você usa para entrar.',
    empty: '—',
    prefix: '@',
    mono: true,
    minLength: 3,
    maxLength: 50,
    required: true,
  },
  {
    name: 'description',
    label: 'Bio',
    hint: 'Até 1000 caracteres.',
    empty: 'Ainda sem bio.',
    multiline: true,
    maxLength: 1000,
  },
];
