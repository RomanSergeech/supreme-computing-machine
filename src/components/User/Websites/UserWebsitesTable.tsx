'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import Table from '@/components/common/Table';
import TableControls from '@/components/common/TableControls';
import { useFormatDuration } from '@/shared/utils/useFormatDuration';
import ProgressBar from '../../common/ProgressBar';
import CategoryLabel from '../../common/CategoryLabel';
import { TActivitySummary, TWorkerStats } from '@/shared/types/office.types'

const rawData = [
  { website: 'github.com', category: "productive", usageMinutes: 135, visits: 23, lastVisit: '5 minutes ago', productivity: 'high', usagePercent: 70 },
  { website: 'stackoverflow.com', category: "productive", usageMinutes: 92, visits: 15, lastVisit: '12 minutes ago', productivity: 'high', usagePercent: 10 },
  { website: 'youtube.com', category: "neutral", usageMinutes: 45, visits: 8, lastVisit: '1 hour ago', productivity: 'medium', usagePercent: 20 },
  { website: 'twitter.com', category: "distracting", usageMinutes: 28, visits: 12, lastVisit: '30 minutes ago', productivity: 'low', usagePercent: 66 },
];


interface Props {
  user: TWorkerStats
}
export default function WebsitesTable({ user }: Props) {
  const t = useTranslations('websitesTable');
  const formatDuration = useFormatDuration();

  const [draftSearch, setDraftSearch] = useState('');
  const [draftCategory, setDraftCategory] = useState('');
  const [draftMinTime, setDraftMinTime] = useState('');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minTime, setMinTime] = useState('');

  const categories = [
    { value: 'productive', label: t('categories.productive') },
    { value: 'neutral', label: t('categories.neutral') },
    { value: 'distracting', label: t('categories.distracting') },
  ];

  const filteredData = useMemo(() => {
    return user.sitesActivity?.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(draftSearch.toLowerCase());
      const matchesCategory = selectedCategory ? item.productivity === selectedCategory : true;
      const matchesMinTime = minTime ? Math.round(item.duration / 60) >= Number(minTime) : true;
      return matchesSearch && matchesCategory && matchesMinTime;
    });
  }, [user.sitesActivity, draftSearch, selectedCategory, minTime]);


  const columns = [
    { key: 'website', label: t('columns.website') },
    { key: 'category', label: t('columns.category') },
    { key: 'timeSpent', label: t('columns.timeSpent') },
    { key: 'usagePercent', label: t('columns.usagePercent') },
    { key: 'visits', label: t('columns.visits') },
  ];

  const renderCell = (key: string, value: any, row: TActivitySummary) => {
    if (key === 'website') return row.name;
    if (key === 'category') return <CategoryLabel category={row.productivity || 'neutral'} />;
    if (key === 'timeSpent') return formatDuration(Math.round(row.duration / 60));
    if (key === 'usagePercent') return <ProgressBar percent={row.usagePercent} />;
    if (key === 'visits') return row.sessions;
    return value;
  };

  return (
    <div>
      <TableControls
        search={{
          value: draftSearch,
          onChange: setDraftSearch,
          placeholder: t('searchPlaceholder', { defaultValue: 'Search websites...' }),
        }}
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
          // Apply теперь нужен только для фильтров категории и времени
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
      />

      <Table columns={columns} data={filteredData} renderCell={renderCell} />
    </div>
  );
}
