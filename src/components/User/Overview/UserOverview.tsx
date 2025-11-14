'use client';

import styles from './UserOverview.module.css';
import RecentActivity from './RecentActivity';
import { useTranslations } from 'next-intl';
import { useFormatDuration } from '@/shared/utils/useFormatDuration';
import { TWorkerStats } from '@/shared/types/office.types'


interface Props {
  user: TWorkerStats
}
export default function UserOverview({ user }: Props) {

  const t = useTranslations('userOverview');
  const formatDuration = useFormatDuration();

  return (
    <div className={styles.container}>
      {/* Карточка: текущая активность */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>{t('currentActivity')}</div>
        <div className={styles.cardBody}>
          <div className={styles.activityRow}>
            <div>
              <p className={styles.label}>{user.lastActiveApp}</p>
              <p className={styles.subtext}>{t('activeNow')}</p>
            </div>
          </div>
          <div className={styles.activityRow}>
            <div>
              <p className={styles.label}>{user.lastActiveSite}</p>
              <p className={styles.subtext}>{t('lastWebsite')}</p>
            </div>
          </div>
          <div className={styles.footer}>
            {t('lastActivity')}: {`${user.lastActivityTime.toLocaleTimeString()}, ${user.lastActivityTime.toLocaleDateString()}`}
          </div>
        </div>
      </div>

      {/* Карточка: разбивка времени */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>{t('timeBreakdown')}</div>
        <div className={styles.cardBody}>
          {[
            { key: 'productive', color: '#22c55e', minutes: user.productivityDurationToday?.productive.duration, width: user.productivityDurationToday?.productive.percent+'%' },
            { key: 'neutral', color: '#3b82f6', minutes: user.productivityDurationToday?.neutral.duration, width: user.productivityDurationToday?.neutral.percent+'%' },
            { key: 'distracting', color: '#ef4444', minutes: user.productivityDurationToday?.distracting.duration, width: user.productivityDurationToday?.distracting.percent+'%' },
            { key: 'idle', color: '#9ca3af', minutes: user.productivityDurationToday?.afk.duration, width: user.productivityDurationToday?.afk.percent+'%' },
          ].map((item, i) => (
            <div key={i}>
              <div className={styles.barLabel}>
                <span className={styles.barColorLabel}>
                  <span
                    style={{ backgroundColor: item.color }}
                    className={styles.barColorDot}
                  />
                  {t(`labels.${item.key}`)}
                </span>
                <span>{formatDuration(item.minutes)}</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: item.width, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bigCard}>
        <RecentActivity user={user} />
      </div>
    </div>
  );
}
