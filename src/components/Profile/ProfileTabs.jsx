'use client';

import { useSearchParams } from 'next/navigation';
import Tabs from '@/components/common/Tabs';
import { useTranslations } from 'next-intl';


export default function ProfileTabs({ children }) {
  const t = useTranslations('profileTabs');
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const profileTabs = [
    { value: 'profile', label: t('profile') },
    { value: 'subscription', label: t('subscription') },
    { value: 'settings', label: t('settings') },
  ];

  return (
    <Tabs
      tabs={profileTabs}
      defaultTab={activeTab}
      render={children}
    />
  );
}
