'use client';

import { useTranslations } from 'next-intl';
import styles from './UserTimelineCard.module.css';

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function getIconByType(type) {
  if (type === 'app') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="3" rx="2"></rect>
        <line x1="8" x2="16" y1="21" y2="21"></line>
        <line x1="12" x2="12" y1="17" y2="21"></line>
      </svg>
    );
  }
  if (type === 'website') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
        <path d="M2 12h20"></path>
      </svg>
    );
  }
  return null;
}

export default function UserTimelineCard({ user }) {
  const t = useTranslations('officeUserTimeline');

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>{getInitials(user.name)}</div>
        <div>
          <h4 className={styles.username}>{user.name}</h4>
          <span className={styles.totalTime}>
            {t('totalTime')}: {user.totalTime}
          </span>
        </div>
      </div>

      <div className={styles.activitiesList}>
        {user.activities.map((activity, idx) => (
          <div key={idx} className={styles.activityItem}>
            <div className={styles.activityInfo}>
              <div className={styles.icon}>{getIconByType(activity.type)}</div>
              <div className={styles.details}>
                <span className={styles.name}>{activity.name}</span>
                <span className={styles.time}>{activity.time}</span>
              </div>
            </div>
            <span className={`${styles.category} ${styles[activity.category]}`}>
              {t(`categories.${activity.category}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
