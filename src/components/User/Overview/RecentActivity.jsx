'use client';

import { useTranslations, useLocale } from 'next-intl';
import styles from './RecentActivity.module.css';
import { useFormatDuration } from '@/shared/utils/useFormatDuration';

export default function RecentActivity() {
  const t = useTranslations('userOverview.recentActivity');
  const formatDuration = useFormatDuration();
  const locale = useLocale();

  const activity = [
    {
      timestamp: new Date('2025-08-06'), // среда
      durationMinutes: 480,
      label: 'VS Code • github.com',
      productivity: 75,
      bars: [75, 18.75, 6.25, 12.5],
    },
    {
      timestamp: new Date('2025-08-05'), // вторник
      durationMinutes: 420,
      label: 'Chrome • stackoverflow.com',
      productivity: 71,
      bars: [71.43, 21.43, 7.14, 14.29],
    },
    {
      timestamp: new Date('2025-08-04'), // понедельник
      durationMinutes: 540,
      label: 'VS Code • github.com',
      productivity: 72,
      bars: [72.22, 22.22, 5.56, 11.11],
    },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{t('title')}</div>
        <button className={styles.exportButton}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download h-4 w-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg> {t('export')}</button>
      </div>

      <div className={styles.body}>
        {activity.map((item, i) => {
          const day = item.timestamp.toLocaleDateString(locale, {
            weekday: 'short',
          });
          const date = item.timestamp.toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
          });

          return (
            <div className={styles.activityItem} key={i}>
              <div className={styles.left}>
                <div className={styles.dayDate}>
                  <p className={styles.day}>{day}</p>
                  <p className={styles.date}>{date}</p>
                </div>
                <div>
                  <p className={styles.duration}>
                    {formatDuration(item.durationMinutes)}
                  </p>
                  <p className={styles.label}>{item.label}</p>
                </div>
              </div>

              <div className={styles.right}>
                <div className={styles.productivity}>
                  ⚡{' '}
                  <span className={styles.productivityPercent}>
                    {item.productivity}%
                  </span>
                </div>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{
                      backgroundColor: '#22c55e',
                      width: `${item.bars[0]}%`,
                    }}
                  />
                  <div
                    className={styles.bar}
                    style={{
                      backgroundColor: '#3b82f6',
                      width: `${item.bars[1]}%`,
                    }}
                  />
                  <div
                    className={styles.bar}
                    style={{
                      backgroundColor: '#ef4444',
                      width: `${item.bars[2]}%`,
                    }}
                  />
                  <div
                    className={styles.bar}
                    style={{
                      backgroundColor: '#9ca3af',
                      width: `${item.bars[3]}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
