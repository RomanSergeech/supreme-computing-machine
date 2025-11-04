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
  const formatDuration = useFormatDuration();

  const [draftSearch, setDraftSearch] = useState('');
  const [draftCategory, setDraftCategory] = useState('');
  const [draftMinTime, setDraftMinTime] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');
  const [minTime, setMinTime] = useState('');

  const columns = [
    { key: 'name', label: t('columns.name') },
    { key: 'category', label: t('columns.category') },
    { key: 'usageTime', label: t('columns.usageTime') },
    { key: 'usagePercent', label: t('columns.usagePercent') },
    { key: 'sessions', label: t('columns.sessions') },
  ];

  const rawData = useMemo(() => [
    { name: 'Visual Studio Code', category: 'productive', usageMinutes: 225, usagePercent: 44, sessions: 8 },
    { name: 'Google Chrome', category: 'distracting', usageMinutes: 132, usagePercent: 25, sessions: 12 },
    { name: 'Slack', category: 'neutral', usageMinutes: 83, usagePercent: 16, sessions: 6 },
    { name: 'Notion', category: 'productive', usageMinutes: 45, usagePercent: 9, sessions: 3 },
    { name: 'Spotify', category: 'distracting', usageMinutes: 32, usagePercent: 6, sessions: 2 },
    { name: 'Excel', category: 'productive', usageMinutes: 28, usagePercent: 5, sessions: 1 },
  ], []);

  const categories = [
    { value: 'productive', label: t('categories.productive') },
    { value: 'neutral', label: t('categories.neutral') },
    { value: 'distracting', label: t('categories.distracting') },
  ];

  const filteredData = useMemo(() => {
    return rawData.filter((row) => {
      const matchesSearch = row.name.toLowerCase().includes(draftSearch.toLowerCase());
      const matchesCategory = selectedCategory ? row.category === selectedCategory : true;
      const matchesMinTime = minTime ? row.usageMinutes >= Number(minTime) : true;
      return matchesSearch && matchesCategory && matchesMinTime;
    });
  }, [draftSearch, selectedCategory, minTime]);

  const renderCell = (key, value, row) => {
    if (key === 'category') return <CategoryLabel category={value} />;
    if (key === 'usageTime') return formatDuration(row.usageMinutes);
    if (key === 'usagePercent') return <ProgressBar percent={row.usagePercent} />;
    return value;
  };

  return (
    <div>
      <TableControls
        search={{ value: draftSearch, onChange: setDraftSearch,placeholder: t('searchPlaceholder', { defaultValue: 'Search websites...' }) }}
        filters={[
          {
            key: 'category',
            label: t('filter.category'),
            type: 'select',
            value: draftCategory,
            onChange: setDraftCategory,
            options: categories
          },
          {
            key: 'minTime',
            label: t('filter.minTime'),
            type: 'number',
            value: draftMinTime,
            onChange: setDraftMinTime
          }
        ]}
        onApplyFilters={() => {
          setSelectedCategory(draftCategory);
          setMinTime(draftMinTime);
        }}
        onResetFilters={() => {
          setDraftSearch('');
          setDraftCategory('');
          setDraftMinTime('');
          setSelectedCategory('');
          setMinTime('');
        }}
        showExport={true}
      />
      <Table columns={columns} data={filteredData} renderCell={renderCell} />
    </div>
  );
}
