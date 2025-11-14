'use client';

import { TWorkerStats } from '@/shared/types/office.types'
import styles from './UserAnalytics.module.css';
import { useTranslations } from 'next-intl';
import { useFormatDuration } from '@/shared/utils'


const timeSlots = ['09:00 - 12:00', '12:00 - 15:00', '15:00 - 18:00']


interface Props {
  user: TWorkerStats
}
export default function UserAnalytics({ user }: Props) {
  const t = useTranslations('userAnalytics');

  const formatDuration = useFormatDuration();

  const productivityByTime = timeSlots.map(el => user.productivityByTimeSlots?.find(slot => slot.timeSlot === el))

  const appUsage = [
    { label: t('productiveApps'), time: formatDuration(Math.round(user.totalDurationByProductivityForApps?.productive || 0)) },
    { label: t('neutralApps'), time: formatDuration(Math.round(user.totalDurationByProductivityForApps?.neutral || 0)) },
    { label: t('distractingApps'), time: formatDuration(Math.round(user.totalDurationByProductivityForApps?.distracting || 0)) },
  ];

  const teamStats = [
    {
      value: (user.teamProductivityOverview?.percent || 0)+'%',
      label: t('betterThanAvg'),
      color: styles.textGreen,
    },
    {
      value: formatDuration(user.teamProductivityOverview?.duration || 0),
      label: t('avgDailyTime'),
      color: styles.textBlue,
    },
    {
      value: (user.teamProductivityOverview?.top || 0)+'-е',
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
              {productivityByTime.map(el => (
                <div key={el?.timeSlot} className={styles.progressRow}>
                  <span className="text-sm">{el?.timeSlot}</span>
                  <div className="flex items-center space-x-2">
                    <div className={styles.progressBarContainer}>
                      <div
                        className={styles.progressBarFill}
                        style={{ transform: `translateX(-${100 - (el?.productivity.productive || 100)}%)` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{(el?.productivity.productive || 0)}%</span>
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
                <div className={styles.activityStat}>{user.productivity}%</div>
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
