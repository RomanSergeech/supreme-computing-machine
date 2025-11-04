'use client';

import styles from './UserAnalytics.module.css';
import { useTranslations } from 'next-intl';

export default function UserAnalytics() {
  const t = useTranslations('userAnalytics');

  const productivityByTime = [
    { time: '09:00 - 12:00', percent: 85 },
    { time: '12:00 - 15:00', percent: 65 },
    { time: '15:00 - 18:00', percent: 78 },
  ];

  const appUsage = [
    { label: t('productiveApps'), time: '6ч 0м' },
    { label: t('neutralApps'), time: '1ч 30м' },
    { label: t('distractingApps'), time: '30м' },
  ];

  const teamStats = [
    {
      value: '+15%',
      label: t('betterThanAvg'),
      color: styles.textGreen,
    },
    {
      value: '8ч 0м',
      label: t('avgDailyTime'),
      color: styles.textBlue,
    },
    {
      value: '3-е',
      label: t('teamRank'),
      color: styles.textPurple,
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{t('title')}</h2>

      <div className={styles.cardsGrid}>
        <div className={styles.card}>
          <div className={styles.cardInner}>
            <div className={styles.cardTitle}>{t('timeProductivity')}</div>
          </div>
          <div className={styles.cardInner}>
            <div className="space-y-3">
              {productivityByTime.map(({ time, percent }) => (
                <div key={time} className={styles.progressRow}>
                  <span className="text-sm">{time}</span>
                  <div className="flex items-center space-x-2">
                    <div className={styles.progressBarContainer}>
                      <div
                        className={styles.progressBarFill}
                        style={{ transform: `translateX(-${100 - percent}%)` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardInner}>
            <div className={styles.cardTitle}>{t('activityDistribution')}</div>
          </div>
          <div className={styles.cardInner}>
            <div className="space-y-4">
              <div className="text-center">
                <div className={styles.activityStat}>75%</div>
                <div className={styles.activityLabel}>{t('productivity')}</div>
              </div>
              <div className={styles.activityBreakdown}>
                {appUsage.map(({ label, time }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span>{label}</span>
                    <span>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardTitle}>{t('compareWithTeam')}</div>
        </div>
        <div className={styles.cardInner}>
          <div className={styles.statsGrid}>
            {teamStats.map(({ value, label, color }) => (
              <div key={label} className={styles.statsItem}>
                <div className={`${styles.statsValue} ${color}`}>{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
