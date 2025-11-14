//@ts-nocheck
'use client';

import GenericListPage from '@/components/common/GenericListPage';
import UserWebsitesControls from '@/components/User/Websites/UserWebsitesControls';
import UserWebsitesTable from '@/components/User/Websites/UserWebsitesTable';
import { TWorkerStats } from '@/shared/types/office.types'
import { useState } from 'react';


interface Props {
  user: TWorkerStats
}
export default function UserWebsitesTab({ user }: Props) {
  const [filters, setFilters] = useState({ search: '', category: '', minTime: '' });

  return (
    <GenericListPage
      titleKey="sectionUserWebsites"
      Table={(props) => <UserWebsitesTable {...props} filters={filters} user={user} />}
    />
  );
}
