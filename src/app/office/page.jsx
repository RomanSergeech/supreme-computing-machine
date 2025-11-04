'use client';

import OfficeHeader from '@/components/Office/OfficeHeader';
import OfficeNavTabs from '@/components/Office/OfficeNav';

import OverviewPage from '@/components/Office/overview/OverviewPage';
import UsersPage from '@/components/Office/users/UsersPage';
// import ApplicationsPage from '@/components/Office/applications/ApplicationsPage';
// import WebsitesPage from '@/components/Office/websites/WebsitesPage';
// import TimelinesPage from '@/components/Office/timelines/TimelinesPage';
import SettingsPage from '@/components/Office/settings/SettingsPage';
import { PrivateRoute } from '@/components/common/PrivateRoute'

const tabComponents = {
  overview: OverviewPage,
  users: UsersPage,
  // applications: ApplicationsPage,
  // websites: WebsitesPage,
  // timelines: TimelinesPage,
  settings: SettingsPage,
};

export default function OfficeCombinedPage() {
  return (
    <PrivateRoute>
      <OfficeHeader />
      <OfficeNavTabs defaultTab="overview">
        {({ activeTab }) => {
          const Component = tabComponents[activeTab];
          const isSettings = activeTab === 'settings';

          return isSettings ? (
            <div className="settingsPage">
              <main>
                <Component />
              </main>
            </div>
          ) : (
              <Component />
          );
        }}
      </OfficeNavTabs>
    </PrivateRoute>
  );
}

