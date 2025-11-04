'use client';

import Tabs from '@/components/common/Tabs';
import { useTranslations } from 'next-intl';

export default function UserTabs({ children }) {
  const t = useTranslations('userTabs');

  const userTabs = [
    { value: 'overview', label: t('overview') },
    { value: 'apps', label: t('apps') },
    { value: 'websites', label: t('websites') },
    { value: 'timeline', label: t('timeline') },
    { value: 'analytics', label: t('analytics') },
  ];

  return (
    <Tabs
      tabs={userTabs}
      defaultTab="overview"
      render={children}
    />
  );
}
