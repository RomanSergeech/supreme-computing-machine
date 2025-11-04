'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from './UsersTable.module.css';
import Table from '@/components/common/Table';
import { useState } from 'react';
import { useFormatDuration } from '@/shared/utils/useFormatDuration';

export default function UsersTable({ searchQuery = '', filters = {} }) {
  const t = useTranslations('UsersTable');
  const router = useRouter();
  const formatDuration = useFormatDuration();

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [data] = useState([
    {
      id: '1',
      name: 'Алексей Иванов',
      email: 'alexey@example.com',
      initials: 'АИ',
      status: 'Online',
      activeMinutes: 465,
      productivePercent: 60,
      productivity: 74,
      lastActivity: '21:27:10',
      storageGB: 2.5,
    },
    {
      id: '2',
      name: 'Мария Петрова',
      email: 'maria@example.com',
      initials: 'МП',
      status: 'Idle',
      activeMinutes: 372,
      productivePercent: 60,
      productivity: 74,
      lastActivity: '21:27:10',
      storageGB: 5.8,
    },
    {
      id: '3',
      name: 'Дмитрий Сидоров',
      email: 'dmitry@example.com',
      initials: 'ДС',
      status: 'Offline',
      activeMinutes: 273,
      productivePercent: 60,
      productivity: 74,
      lastActivity: '21:27:10',
      storageGB: 1.2,
    },
  ]);

  const filteredData = data.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      !filters.status || row.status === filters.status;

    const matchesTimeFrom =
      filters.timeFrom === null || row.activeMinutes >= filters.timeFrom;

    const matchesTimeTo =
      filters.timeTo === null || row.activeMinutes <= filters.timeTo;

    return matchesSearch && matchesStatus && matchesTimeFrom && matchesTimeTo;
  });

  const toggleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
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
    { key: 'productivePercent', label: t('productiveTime') },
    { key: 'productivity', label: t('productivity') },
    { key: 'storageGB', label: t('storage') }, // новая колонка
    { key: 'lastActivity', label: t('lastActivity') },
  ];

  const renderCell = (key, value, row) => {
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
          <div className={styles.userAvatar}>{row.initials}</div>
          <div className={styles.userText}>
            <span>{row.name}</span>
            <span className={styles.userEmail}>{row.email}</span>
          </div>
        </div>
      );
    }

    if (key === 'status') {
      const statusClass = {
        Online: styles.statusOnline,
        Idle: styles.statusIdle,
        Offline: styles.statusOffline,
      }[value] || '';

      const localizedStatus = {
        Online: t('online'),
        Idle: t('idle'),
        Offline: t('offline'),
      }[value] || value;
      return <span className={`${styles.status} ${statusClass}`}>{localizedStatus}</span>;
    }

    if (key === 'activeTime') {
      return formatDuration(row.activeMinutes);
    }

    if (key === 'productivePercent') {
      return (
        <div className={styles.usageSlot}>
          <div
            className={styles.progressbar}
            style={{ width: `${value}%` }}
          />
          <span>{value}%</span>
        </div>
      );
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

    if (key === 'storageGB') {
      return `${value} ГБ`;
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
        renderRow={(row, rowIdx, rowContent) => {
          return (
            <tr
              key={rowIdx}
              onClick={(e) => {
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
