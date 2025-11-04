'use client';

import GenericListPage from '@/components/common/GenericListPage';
import UserWebsitesControls from '@/components/User/Websites/UserWebsitesControls';
import UserWebsitesTable from '@/components/User/Websites/UserWebsitesTable';
import { useState } from 'react';

export default function UserWebsitesTab() {
  const [filters, setFilters] = useState({ search: '', category: '', minTime: '' });

  return (
    <GenericListPage
      titleKey="sectionUserWebsites"
      Table={(props) => <UserWebsitesTable {...props} filters={filters} />}
    />
  );
}
