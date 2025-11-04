'use client';

import { useTranslations } from 'next-intl';
import TableControls from '@/components/common/TableControls';
import { useState } from 'react';
import CategoryLabel from '../../common/CategoryLabel';

export default function UsersControls({ onSearch, onFilterChange }) {
  const t = useTranslations("UsersTable");

  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');

  const handleSearchChange = (value) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const applyFilters = () => {
    onFilterChange?.({
      status: statusFilter,
      timeFrom: timeFrom !== '' ? parseInt(timeFrom) : null,
      timeTo: timeTo !== '' ? parseInt(timeTo) : null,
    });
  };

  const resetFilters = () => {
    setStatusFilter('');
    setTimeFrom('');
    setTimeTo('');
    onFilterChange?.({ status: '', timeFrom: null, timeTo: null });
  };

  return (
    <TableControls
      search={{
        value: searchValue,
        onChange: handleSearchChange,
        placeholder: t('tableSearchUsers'),
      }}
      showFilters={true}
      showExport={true}
      filters={[
        {
          key: 'status',
          label: t('status'),
          type: 'select',
          value: statusFilter,
          onChange: setStatusFilter,
          options: [
            { label: t('online'), value: 'Online' },
            { label: t('idle'), value: 'Idle' },
            { label: t('offline'), value: 'Offline' },
          ],
        },
        {
          key: 'timeFrom',
          label: t('activeTimeFrom'),
          type: 'number',
          value: timeFrom,
          onChange: setTimeFrom,
        },
        {
          key: 'timeTo',
          label: t('activeTimeTo'),
          type: 'number',
          value: timeTo,
          onChange: setTimeTo,
        },
      ]}
      onApplyFilters={applyFilters}
      onResetFilters={resetFilters}
    />
  );
}
