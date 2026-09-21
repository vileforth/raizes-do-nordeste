'use client';

import { useTranslations } from 'next-intl';
import { USER_ROLES } from '@/schemas/user.schema';

type Props = {
  value: string[];
  onChange: (roles: string[]) => void;
};

export function UserRolePicker({ value, onChange }: Props) {
  const t = useTranslations('status');

  function toggle(role: string) {
    if (value.includes(role)) {
      onChange(value.filter((item) => item !== role));
      return;
    }
    onChange([...value, role]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {USER_ROLES.map((role) => {
        const checked = value.includes(role);
        return (
          <label
            key={role}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              checked
                ? 'border-[var(--raizes-petrol)] bg-[var(--raizes-petrol)] text-white'
                : 'border-black/10 bg-white text-[var(--raizes-petrol)]'
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={() => toggle(role)}
            />
            {t(role)}
          </label>
        );
      })}
    </div>
  );
}
