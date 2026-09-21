'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { FormField } from '@/components/form-field';
import { FormPageScaffold } from '@/components/form-page-scaffold';
import { UserRolePicker } from '@/components/user-role-picker';
import { useToast } from '@/providers/toast-provider';
import { USER_STATUSES, userSchema, type UserFormValues } from '@/schemas/user.schema';
import { usersResource } from '@/services/users';

export default function NewUserPage() {
  const t = useTranslations('users');
  const tCommon = useTranslations('common');
  const tStatus = useTranslations('status');
  const toast = useToast();
  const router = useRouter();
  const create = usersResource.useCreate();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      status: 'ATIVO',
      profileNames: ['ATENDENTE'],
    },
  });

  async function onSubmit(values: UserFormValues) {
    try {
      const user = await create.mutateAsync(values);
      toast.success(tCommon('success'));
      router.push(`/users/${user.id}`);
    } catch {
      toast.error(tCommon('error'));
    }
  }

  return (
    <FormPageScaffold title={t('new')} subtitle={t('rolesHint')}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField label={t('name')}>
          <input className="input-soft w-full" {...form.register('name')} />
        </FormField>
        <FormField label={t('email')}>
          <input className="input-soft w-full" type="email" {...form.register('email')} />
        </FormField>
        <FormField label={t('phone')}>
          <input className="input-soft w-full" {...form.register('phone')} />
        </FormField>
        <FormField label={t('password')}>
          <input className="input-soft w-full" type="password" {...form.register('password')} />
        </FormField>
        <FormField label={t('status')}>
          <select className="input-soft w-full" {...form.register('status')}>
            {USER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {tStatus(status)}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label={t('roles')}>
          <Controller
            control={form.control}
            name="profileNames"
            render={({ field }) => (
              <UserRolePicker value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>
        <button type="submit" className="btn-primary" disabled={create.isPending}>
          {tCommon('create')}
        </button>
      </form>
    </FormPageScaffold>
  );
}
