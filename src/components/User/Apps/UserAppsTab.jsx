'use client';

import GenericListPage from '@/components/common/GenericListPage';
import UserAppsControls from '@/components/User/Apps/UserAppsControls';
import UserAppsTable from '@/components/User/Apps/UserAppsTable';

export default function UserAppsTab() {
  return (
    <GenericListPage
      titleKey="sectionUserApps"
      Table={UserAppsTable}
    />
  );
}
