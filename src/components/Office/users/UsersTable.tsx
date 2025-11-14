'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from './UsersTable.module.css';
import Table from '@/components/common/Table';
import { useState } from 'react';
import { useFormatDuration } from '@/shared/utils/useFormatDuration';
import { useOfficeStore } from '@/shared/store/office.store'
import { TFilters } from './UsersPage'
import { TWorkerStats } from '@/shared/types/office.types'

export default function UsersTable({ searchQuery = '', filters }: { searchQuery: string, filters: TFilters }) {

  const users = useOfficeStore(state => state.users)

  const [selectedUsers, setSelectedUsers] = useState<number[]>([])

  const t = useTranslations('UsersTable');

  const router = useRouter();
  const formatDuration = useFormatDuration();

  const filteredData = users.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      !filters.status || row.status === filters.status;

    const matchesTimeFrom =
      filters.timeFrom === null || row.lastActivityTime.toLocaleDateString() >= filters.timeFrom;

    const matchesTimeTo =
      filters.timeTo === null || row.lastActivityTime.toLocaleDateString() <= filters.timeTo;

    return matchesSearch && matchesStatus && matchesTimeFrom && matchesTimeTo;
  });

  const toggleSelect = ( id: number ) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    )
  };

  const selectAll = () => {
    if (selectedUsers.length === filteredData.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredData.map((row) => row.id));
    }
  };

  const columns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          checked={selectedUsers.length === filteredData.length && filteredData.length > 0}
          onChange={selectAll}
        />
      ),
      className: styles.checkboxColumn,
    },
    { key: 'name', label: t('name') },
    { key: 'status', label: t('status') },
    { key: 'activeTime', label: t('activeTime') },
    { key: 'productivity', label: t('productivity') },
    { key: 'lastActivity', label: t('lastActivity') },
  ];

  const renderCell = ( key: string, value: string|number|React.ReactElement, row: TWorkerStats ) => {
    if (key === 'select') {
      return (
        <div onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selectedUsers.includes(row.id)}
            onChange={() => toggleSelect(row.id)}
          />
        </div>
      );
    }
    if (key === 'name') {
      return (
        <div className={styles.userInfo}>
          {/* <div className={styles.userAvatar}>{row.name}</div> */}
          <div className={styles.userText}>
            <span>{row.name}</span>
          </div>
        </div>
      );
    }
    if (key === 'status') {
      const statusClass = {
        Online: styles.statusOnline,
        Idle: styles.statusIdle,
        Offline: styles.statusOffline,
      }[value as string] || '';
      const localizedStatus = {
        Online: t('online'),
        Idle: t('idle'),
        Offline: t('offline'),
      }[value as string] || value;
      return <span className={`${styles.status} ${statusClass}`}>{localizedStatus}</span>;
    }
    if (key === 'activeTime') {
      return formatDuration(row.activeTime);
    }
    if (key === 'productivity') {
      return (
        <div className={styles.productivitySlot}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
          </svg>
          <span>{value}%</span>
        </div>
      );
    }
    if (key === 'lastActivity') {
      return `${row.lastActivityTime.toLocaleTimeString()}, ${row.lastActivityTime.toLocaleDateString()}`
    }
    return value;
  };

  return (
    <div>
      {selectedUsers.length > 0 && (
        <div className={styles.bulkActions}>
          <button
            className={styles.deleteButton}
            onClick={() => {
              console.log('Удалить пользователей:', selectedUsers);
              // тут будет реальный вызов API
            }}
          >
            {t('deleteSelected')}
          </button>
          <button
            className={styles.deleteButton} 
            onClick={() => {
              setSelectedUsers([]); 
              console.log('Очистить информацию');
            }}
          >
            {t('clearSelected')}
          </button>
        </div>
      )}
      <Table
        columns={columns}
        data={filteredData}
        renderCell={renderCell}
        renderRow={(row: TWorkerStats, rowIdx: number, rowContent: string) => {
          return (
            <tr
              key={rowIdx}
              onClick={(e) => {
                //@ts-ignore
                const td = e.target.closest('td');
                const cellIndex = td?.cellIndex;
                if (cellIndex === 0) return;
                router.push(`/user/${row.id}`);
              }}
              className={styles.clickableRow}
            >
              {rowContent}
            </tr>
          );
        }}
      />
    </div>
  );
}
