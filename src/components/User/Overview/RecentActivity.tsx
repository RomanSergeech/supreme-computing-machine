'use client';

import { useTranslations, useLocale } from 'next-intl';
import styles from './RecentActivity.module.css';
import { useFormatDuration } from '@/shared/utils/useFormatDuration';
import { TWorkerStats } from '@/shared/types/office.types'


interface Props {
  user: TWorkerStats
}
export default function RecentActivity({ user }: Props) {
  const t = useTranslations('userOverview.recentActivity');
  const formatDuration = useFormatDuration();
  const locale = useLocale();

  const activity = user.weeklyActivityOverview;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{t('title')}</div>
        <button className={styles.exportButton}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-download h-4 w-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg> {t('export')}</button>
      </div>

      <div className={styles.body}>
        {activity?.map((item, i) => {
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
                    {formatDuration(item.duration)}
                  </p>
                  <p className={styles.label}>{item.topApp} • {item.topSite}</p>
                </div>
              </div>

              <div className={styles.right}>
                <div className={styles.productivity}>
                  ⚡{' '}
                  <span className={styles.productivityPercent}>
                    {item.productivity.productive}%
                  </span>
                </div>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{
                      backgroundColor: '#22c55e',
                      width: `${item.productivity.productive}%`,
                    }}
                  />
                  <div
                    className={styles.bar}
                    style={{
                      backgroundColor: '#3b82f6',
                      width: `${item.productivity.neutral}%`,
                    }}
                  />
                  <div
                    className={styles.bar}
                    style={{
                      backgroundColor: '#ef4444',
                      width: `${item.productivity.distracting}%`,
                    }}
                  />
                  <div
                    className={styles.bar}
                    style={{
                      backgroundColor: '#9ca3af',
                      width: `${item.productivity.afk}%`,
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
