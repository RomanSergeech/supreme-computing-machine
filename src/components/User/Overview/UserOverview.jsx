'use client';

import styles from './UserOverview.module.css';
import RecentActivity from './RecentActivity';
import { useTranslations } from 'next-intl';
import { useFormatDuration } from '@/shared/utils/useFormatDuration';

export default function UserOverview() {
  const t = useTranslations('userOverview');
  const formatDuration = useFormatDuration();

  return (
    <div className={styles.container}>
      {/* Карточка: текущая активность */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>{t('currentActivity')}</div>
        <div className={styles.cardBody}>
          <div className={styles.activityRow}>
            <div className={styles.iconPlaceholder} />
            <div>
              <p className={styles.label}>VS Code</p>
              <p className={styles.subtext}>{t('activeNow')}</p>
            </div>
          </div>
          <div className={styles.activityRow}>
            <div className={styles.iconPlaceholder} />
            <div>
              <p className={styles.label}>github.com</p>
              <p className={styles.subtext}>{t('lastWebsite')}</p>
            </div>
          </div>
          <div className={styles.footer}>
            {t('lastActivity')}: 09:29:16
          </div>
        </div>
      </div>

      {/* Карточка: разбивка времени */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>{t('timeBreakdown')}</div>
        <div className={styles.cardBody}>
          {[
            { key: 'productive', color: '#22c55e', minutes: 360, width: '75%' },
            { key: 'neutral', color: '#3b82f6', minutes: 90, width: '18.75%' },
            { key: 'distracting', color: '#ef4444', minutes: 30, width: '6.25%' },
            { key: 'idle', color: '#9ca3af', minutes: 60, width: '12.5%' },
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
        <RecentActivity />
      </div>
    </div>
  );
}
