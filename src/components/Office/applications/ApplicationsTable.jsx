'use client';

import { useState, useMemo } from 'react';
import Table from '@/components/common/Table';
import TableControls from '@/components/common/TableControls';
import { useTranslations } from 'next-intl';
import { useFormatDuration } from '@/shared/utils/useFormatDuration';
import ProgressBar from '@/components/common/ProgressBar';
import CategoryLabel from '@/components/common/CategoryLabel';

export default function ApplicationsTable({ users = [], initialData = [] }) {
  const t = useTranslations('ApplicationsTable');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const formatDuration = useFormatDuration();

  const columns = [
    { key: 'name', label: t('columns.name') },
    { key: 'category', label: t('columns.category') },
    { key: 'usageTime', label: t('columns.usageTime') },
    { key: 'usagePercent', label: t('columns.usagePercent') },
    { key: 'sessions', label: t('columns.sessions') },
  ];

  const rawData = useMemo(() => [
    {
      name: 'Visual Studio Code',
      category: 'productive',
      usageMinutes: 225,
      usagePercent: 44,
      sessions: 8,
    },
    {
      name: 'Google Chrome',
      category: 'distracting',
      usageMinutes: 132,
      usagePercent: 25,
      sessions: 12,
    },
    {
      name: 'Slack',
      category: 'neutral',
      usageMinutes: 83,
      usagePercent: 16,
      sessions: 6,
    },
    {
      name: 'Notion',
      category: 'productive',
      usageMinutes: 45,
      usagePercent: 9,
      sessions: 3,
    },
    {
      name: 'Spotify',
      category: 'distracting',
      usageMinutes: 32,
      usagePercent: 6,
      sessions: 2,
    },
    {
      name: 'Excel',
      category: 'productive',
      usageMinutes: 28,
      usagePercent: 5,
      sessions: 1,
    },
  ], []);


  const filteredData = rawData.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderCell = (key, value, row) => {
    if (key === 'category') {
      return <CategoryLabel category={value} />;
    }

    if (key === 'usageTime') {
      return formatDuration(row.usageMinutes);
    }

    if (key === 'usagePercent') {
      return(
      <ProgressBar percent={row.usagePercent} />)
    }

    return value;
  };

  return (
    <div>
      <TableControls
        search={{
          value: search,
          onChange: setSearch,
          placeholder: t('searchPlaceholder', { defaultValue: 'Search apps...' }),
        }}
        showFilters={true}
        showExport={true}
      />
      <Table
        columns={columns}
        data={filteredData}
        renderCell={renderCell}
      />
    </div>
  );
}
