'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './ProfileSettings.module.css';

export default function ProfileSettings() {
  const t = useTranslations('profileSettings');

  const [language, setLanguage] = useState('ru');
  const [timezone, setTimezone] = useState('UTC+3');
  const [dateFormat, setDateFormat] = useState('DD.MM.YYYY');
  const [timeFormat, setTimeFormat] = useState('24h');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [reportNotif, setReportNotif] = useState(true);
  const [alertNotif, setAlertNotif] = useState(true);

  const toggle = (stateSetter, currentValue) => () => stateSetter(!currentValue);

  return (
    <div className={styles.container}>

      <div className={`${styles.card} ${styles.fullWidth}`}>
        <div className={styles.cardHeader}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          <span className={styles.cardTitle}>{t('localization.title')}</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.formGroup}>
            <label>{t('localization.language')}</label>
            <button className={styles.combobox} onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}>
              <span>{language === 'ru' ? t('localization.ru') : t('localization.en')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
          <div className={styles.formGroup}>
            <label>{t('localization.timezone')}</label>
            <button className={styles.combobox} onClick={() => setTimezone(timezone === 'UTC+3' ? 'UTC+0' : 'UTC+3')}>
              <span>{timezone}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
          <div className={styles.formGroup}>
            <label>{t('localization.dateFormat')}</label>
            <button className={styles.combobox} onClick={() => setDateFormat(dateFormat === 'DD.MM.YYYY' ? 'MM/DD/YYYY' : 'DD.MM.YYYY')}>
              <span>{dateFormat} ({t('localization.datePreview')})</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
          <div className={styles.formGroup}>
            <label>{t('localization.timeFormat')}</label>
            <button className={styles.combobox} onClick={() => setTimeFormat(timeFormat === '24h' ? '12h' : '24h')}>
              <span>{timeFormat === '24h' ? t('localization.time24') : t('localization.time12')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* <div className={styles.card}>
        <div className={styles.cardHeader}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className={styles.cardTitle}>{t('notifications.title')}</span>
        </div>
        <div className={styles.cardBody}>
          {[
            { key: 'email', state: emailNotif, setter: setEmailNotif },
            { key: 'push', state: pushNotif, setter: setPushNotif },
            { key: 'reports', state: reportNotif, setter: setReportNotif },
            { key: 'alerts', state: alertNotif, setter: setAlertNotif }
          ].map(({ key, state, setter }) => (
            <div key={key} className={styles.switchRow}>
              <div>
                <label>{t(`notifications.${key}.label`)}</label>
                <p>{t(`notifications.${key}.desc`)}</p>
              </div>
              <button
                className={`${styles.switch} ${state ? styles.checked : ''}`}
                onClick={toggle(setter, state)}
                aria-pressed={state}
              >
                <span className={styles.knob} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.card} ${styles.fullWidth}`}>
        <div className={styles.cardHeader}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          </svg>
          <span className={styles.cardTitle}>{t('security.title')}</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.securityActions}>
            <button className={styles.actionButton}>{t('security.changePassword')}</button>
            <button className={styles.actionButton}>{t('security.setup2FA')}</button>
          </div>
          <div className={styles.sessionsSection}>
            <h4>{t('security.sessions')}</h4>
            <div className={styles.sessionItem}>
              <div>
                <p>{t('security.currentSession')}</p>
                <p className={styles.sessionDesc}>{t('security.sessionDesc')}</p>
              </div>
              <span className={styles.badgeActive}>{t('security.active')}</span>
            </div>
          </div>
        </div>
      </div> */}

      <div className={styles.saveSection}>
        <button className={styles.saveButton} onClick={() => alert('Saved!')}>
          {t('save')}
        </button>
      </div>

    </div>
  );
}
