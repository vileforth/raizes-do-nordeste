import { getTranslations } from 'next-intl/server';
import { AuthShell } from '../_components/auth-shell';

export default async function PrivacyPage() {
  const t = await getTranslations('privacy');
  const sections = [
    { title: t('purposeTitle'), body: t('purpose') },
    { title: t('legalTitle'), body: t('legal') },
    { title: t('dataTitle'), body: t('data') },
    { title: t('retentionTitle'), body: t('retention') },
    { title: t('rightsTitle'), body: t('rights') },
    { title: t('contactTitle'), body: t('contact') },
    { title: t('limitsTitle'), body: t('limits') },
  ];

  return (
    <AuthShell
      backHref="/register"
      backLabel={t('backToRegister')}
      title={t('title')}
      subtitle={t('subtitle')}
    >
      <dl className="space-y-4 text-sm leading-relaxed text-[var(--raizes-text-primary)]">
        {sections.map((section) => (
          <div key={section.title}>
            <dt className="t-eyebrow">{section.title}</dt>
            <dd className="mt-1 text-[var(--raizes-text-secondary)]">{section.body}</dd>
          </div>
        ))}
      </dl>
    </AuthShell>
  );
}
