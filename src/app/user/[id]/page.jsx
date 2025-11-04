'use client';

import { useState, useEffect } from 'react';
import UserPageHeader from '@/components/User/UserPageHeader';
import { notFound } from 'next/navigation';
import UserStats from '@/components/User/UserStats';
import UserTabs from '@/components/User/UserTabs';
import UserOverview from '@/components/User/Overview/UserOverview';
import UserWebsitesTab from '@/components/User/Websites/UserWebsitesTab';
import UserAppsTab from '@/components/User/Apps/UserAppsTab';
import UserAnalytics from '@/components/User/Analytics/UserAnalytics';
import UserTimeline from '@/components/User/Timeline/UserTimeline';

export default function UserPage({ params }) {
  const { id } = params;

  const [employee, setEmployee] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date('2025-07-01'),
    to: new Date('2025-07-05'),
  });

  useEffect(() => {
    getUserData(id).then((user) => {
      if (!user) notFound();
      else setEmployee(user);
    });
  }, [id]);

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
        onDateRangeChange={setDateRange}
      />
      <div style={{ boxSizing: 'border-box', maxWidth: '1200px', margin: '0 auto', marginTop: '2rem' }}>
        <UserStats />
              <UserTabs>
        {({ activeTab }) => {
          const Component = tabComponents[activeTab];
          return (
                <Component />
          );
        }}
      </UserTabs>
      </div>
    </main>
  );
}

async function getUserData(id) {
  return {
    id,
    name: 'Иван Иванов',
    role: 'Frontend-разработчик',
    avatar: "src/components/secret/final_creeper_face_64x64.svg",
    isActive: true,
  };
}
