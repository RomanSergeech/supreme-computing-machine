'use client';

import { useTranslations } from 'next-intl';
import Tabs from '@/components/common/Tabs';

export default function OfficeNavTabs({ children }) {
  const t = useTranslations('tabs');

  const officeTabs = [
    { value: 'overview', label: t('overview') },
    { value: 'users', label: t('users') },
    // { value: 'applications', label: t('applications') },
    // { value: 'websites', label: t('websites') },
    // { value: 'timelines', label: t('timelines') },
    { value: 'settings', label: t('settings') },
  ];

  return (
    <Tabs
      tabs={officeTabs}
      defaultTab="overview"
      render={children}
    />
  );
}
