'use client';

import { useTranslations } from 'next-intl';
import { useFormatDuration } from '@/shared/utils/useFormatDuration';
import styles from './UserStats.module.css';
import { useOfficeStore } from '@/shared/store/office.store'
import { TWorkerStats } from '@/shared/types/office.types'

const mockStats = [
  {
    type: 'activeTimeToday',
    minutes: 480,
  },
  {
    type: 'productivityToday',
    percent: 75,
  },
  {
    type: 'weeklyTotal',
    minutes: 2400,
    goalMinutes: 2400,
  },
  {
    type: 'sessions',
    count: 156,
  },
  {
    type: 'idleTime',
    minutes: 60,
  },
];

const statIcons = {
  activeTimeToday: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
  ),
  productivityToday: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  weeklyTotal: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
  sessions: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  ),
  idleTime: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 2v2" />
      <path d="M14 2v2" />
      <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
      <path d="M6 2v2" />
    </svg>
  ),
};

interface Props {
  user: TWorkerStats
}
export default function UserStats({ user }: Props) {

  const t = useTranslations('userStats');
  const formatDuration = useFormatDuration();

  return (
    <div className={styles.grid}>
      {mockStats.map((stat, idx) => {
        let value = '';
        let sub = '';
        let valueClass = '';

        switch (stat.type) {
          case 'activeTimeToday':
            value = formatDuration(user.activityToday);
            sub = t('activeTimeToday.sub');
            break;

          case 'productivityToday':
            value = `${user.productivePercent}%`;
            sub = t('productivityToday.sub');
            valueClass = styles.yellow;
            break;

          case 'weeklyTotal':
            value = formatDuration(user.activityByWeek);
            sub = t('weeklyTotal.sub', {
              goal: formatDuration(stat.goalMinutes),
            });
            break;

          case 'sessions':
            value = `${0}`;
            sub = t('sessions.sub');
            break;

          case 'idleTime':
            value = formatDuration(user.afk);
            sub = t('idleTime.sub');
            break;

          default:
            break;
        }

        return (
          <div key={idx} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.label}>{t(`${stat.type}.label`)}</div>
              {/* <div className={styles.icon}>{statIcons[stat.type]}</div> */}
            </div>
            <div className={styles.body}>
              <div className={`${styles.value} ${valueClass}`}>{value}</div>
              <div className={styles.sub}>{sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
