'use client';

import { useState, useMemo } from 'react';
import Table from '@/components/common/Table';
import TableControls from '@/components/common/TableControls';
import { useTranslations } from 'next-intl';
import { useFormatDuration } from '@/shared/utils/useFormatDuration';
import ProgressBar from '@/components/common/ProgressBar';
import CategoryLabel from '@/components/common/CategoryLabel';
import { TActivitySummary, TWorkerStats } from '@/shared/types/office.types'

interface Props {
  user: TWorkerStats
}
export default function ApplicationsTable({ user }: Props) {

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

  const rawData = useMemo(() => user?.appsActivity || [], [user?.appsActivity]);

  const categories = [
    { value: 'productive', label: t('categories.productive') },
    { value: 'neutral', label: t('categories.neutral') },
    { value: 'distracting', label: t('categories.distracting') },
  ];

  const filteredData = useMemo(() => {
    return rawData?.filter((row) => {
      const matchesSearch = row.name.toLowerCase().includes(draftSearch.toLowerCase());
      const matchesCategory = selectedCategory ? row.productivity === selectedCategory : true;
      const matchesMinTime = minTime ? Math.round(row.duration / 60) >= Number(minTime) : true;
      return matchesSearch && matchesCategory && matchesMinTime;
    });
  }, [draftSearch, selectedCategory, minTime, rawData]);

  const renderCell = (key: string, value: any, row: TActivitySummary) => {
    if (key === 'category') return <CategoryLabel category={row.productivity} />;
    if (key === 'usageTime') return formatDuration(Math.round(row.duration / 60));
    if (key === 'usagePercent') return <ProgressBar percent={row.usagePercent} />;
    return value;
  };

  return (
    <div>
      <TableControls
        // search={{ value: draftSearch, onChange: setDraftSearch,placeholder: t('searchPlaceholder', { defaultValue: 'Search websites...' }) }}
        // filters={[
        //   {
        //     key: 'category',
        //     label: t('filter.category'),
        //     type: 'select',
        //     value: draftCategory,
        //     onChange: setDraftCategory,
        //     options: categories
        //   },
        //   {
        //     key: 'minTime',
        //     label: t('filter.minTime'),
        //     type: 'number',
        //     value: draftMinTime,
        //     onChange: setDraftMinTime
        //   }
        // ]}
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
        // showExport={true}
      />
      <Table
        columns={columns}
        data={filteredData}
        renderCell={renderCell}
      />
    </div>
  );
}
