'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import Table from '@/components/common/Table';
import TableControls from '@/components/common/TableControls';
import { useFormatDuration } from '@/shared/utils/useFormatDuration';
import ProgressBar from '../../common/ProgressBar';
import CategoryLabel from '../../common/CategoryLabel';

const rawData = [
  { website: 'github.com', category: "productive", usageMinutes: 135, visits: 23, lastVisit: '5 minutes ago', productivity: 'high', usagePercent: 70 },
  { website: 'stackoverflow.com', category: "productive", usageMinutes: 92, visits: 15, lastVisit: '12 minutes ago', productivity: 'high', usagePercent: 10 },
  { website: 'youtube.com', category: "neutral", usageMinutes: 45, visits: 8, lastVisit: '1 hour ago', productivity: 'medium', usagePercent: 20 },
  { website: 'twitter.com', category: "distracting", usageMinutes: 28, visits: 12, lastVisit: '30 minutes ago', productivity: 'low', usagePercent: 66 },
];

export default function WebsitesTable() {
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
    return rawData.filter((item) => {
      const matchesSearch = item.website.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesMinTime = minTime ? item.usageMinutes >= Number(minTime) : true;
      return matchesSearch && matchesCategory && matchesMinTime;
    });
  }, [search, selectedCategory, minTime]);

  const columns = [
    { key: 'website', label: t('columns.website') },
    { key: 'category', label: t('columns.category') },
    { key: 'timeSpent', label: t('columns.timeSpent') },
    { key: 'usagePercent', label: t('columns.usagePercent') },
    { key: 'visits', label: t('columns.visits') },
  ];

  const renderCell = (key, value, row) => {
    if (key === 'category') return <CategoryLabel category={value} />;
    if (key === 'timeSpent') return formatDuration(row.usageMinutes);
    if (key === 'usagePercent') return <ProgressBar percent={row.usagePercent} />;
    return value;
  };

  return (
    <div>
      <TableControls
        search={{ value: draftSearch, onChange: setDraftSearch }}
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
          setSearch(draftSearch);
          setSelectedCategory(draftCategory);
          setMinTime(draftMinTime);
        }}
        onResetFilters={() => {
          setDraftSearch('');
          setDraftCategory('');
          setDraftMinTime('');
          setSearch('');
          setSelectedCategory('');
          setMinTime('');
        }}
      />
      <Table columns={columns} data={filteredData} renderCell={renderCell} />
    </div>
  );
}
