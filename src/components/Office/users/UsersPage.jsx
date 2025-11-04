'use client';

import { useState } from 'react';
import UsersControls from '@/components/Office/users/UsersControls';
import SectionContainer from '@/components/Office/SectionContainer';
import UsersTable from '@/components/Office/users/UsersTable';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: '', timeFrom: null, timeTo: null });

  return (
    <main>
      <SectionContainer titleKey="sectionSystemUsers">
        <UsersControls
          onSearch={setSearchQuery}
          onFilterChange={setFilters}
        />
        <UsersTable
          searchQuery={searchQuery}
          filters={filters}
        />
      </SectionContainer>
    </main>
  );
}
