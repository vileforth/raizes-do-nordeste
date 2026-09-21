'use client';

import { useRouter } from 'next/navigation';
import { DeleteAction } from '@/components/delete-action';

type Props = {
  id: string;
  href: string;
  useRemove: () => { mutateAsync: (id: string) => Promise<unknown> };
};

export function ResourceDeleteButton({ id, href, useRemove }: Props) {
  const router = useRouter();
  const remove = useRemove();
  return (
    <DeleteAction
      onRemove={() => remove.mutateAsync(id)}
      onDeleted={() => router.push(href)}
    />
  );
}
