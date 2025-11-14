'use client';

import { useState, useEffect, use } from 'react';
import UserPageHeader from '@/components/User/UserPageHeader';
import { notFound } from 'next/navigation';
import UserStats from '@/components/User/UserStats';
import UserTabs from '@/components/User/UserTabs';
import UserOverview from '@/components/User/Overview/UserOverview';
import UserWebsitesTab from '@/components/User/Websites/UserWebsitesTab';
import UserAppsTab from '@/components/User/Apps/UserAppsTab';
import UserAnalytics from '@/components/User/Analytics/UserAnalytics';
import UserTimeline from '@/components/User/Timeline/UserTimeline';
import { useOfficeStore } from '@/shared/store/office.store'
import { TWorkerStats } from '@/shared/types/office.types'
import { TUser } from '@/shared/types/user.types'

export default function UserPage({ params }: { params: Promise<{ id: string }> }) {

  const users = useOfficeStore(state => state.users)

  const { id } = use(params)

  const [employee, setEmployee] = useState<TWorkerStats|null>(null)

  const [dateRange, setDateRange] = useState({
    from: new Date('2025-07-01'),
    to: new Date('2025-07-05'),
  });

  useEffect(() => {
    const user = users.find(u => u.id === +id)
    if ( user ) {
      setEmployee(user);
    } else if ( !users || users.length === 0 ) {
      useOfficeStore.getState().getOverviewData()
    }
  }, [id, users]);

  if (!employee) return null;

  const tabComponents = {
    overview: UserOverview,
    apps: UserAppsTab,
    websites: UserWebsitesTab,
    timeline: UserTimeline,
    analytics: UserAnalytics,
  };

  return (
    <main>
      <UserPageHeader
        employee={employee}
        dateRange={dateRange}
        onDateChange={setDateRange}
      />
      <div style={{ boxSizing: 'border-box', maxWidth: '1200px', margin: '0 auto', marginTop: '2rem' }}>
        <UserStats user={employee} />
        <UserTabs>
          {({ activeTab }: { activeTab: keyof typeof tabComponents }) => {
            const Component = tabComponents[activeTab];
            return (
              <Component user={employee} />
            );
          }}
        </UserTabs>
      </div>
    </main>
  );
}
