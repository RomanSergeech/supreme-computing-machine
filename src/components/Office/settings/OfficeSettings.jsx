'use client';

import { useTranslations } from 'next-intl';
import styles from './OfficeSettings.module.css';
import Categorization from './Categorization';

export default function OfficeSettings() {
  const t = useTranslations('settings');

  return (
    <div className={styles.settingsOverview}>
      {/* GENERAL SETTINGS */}
      <div className={`${styles.settingsCard} ${styles.general}`}>
        <div className={styles.settingIcon}>
          {/* Palette icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
          </svg>
        </div>
        <div className={styles.settingContent}>
          <h3>{t('general.title')}</h3>
          <div className={styles.settingOptions}>
            {['idleTimeout', 'screenshotTimeout', 'storagePeriod'].map((key) => (
              <div key={key} className={styles.settingToggleItem}>
                <div className={styles.toggleInfo}>
                  <h4>{t(`general.options.${key}.title`)}</h4>
                  <p>{t(`general.options.${key}.description`)}</p>
                </div>
                <div className={styles.settingInputGroup}>
                  <input className={styles.settingNumber} type="number" defaultValue="10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIZATION RULES */}
      <div className={`${styles.settingsCard} ${styles.categorization}`}>
        <div className={styles.settingIcon}>
          {/* Tag icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>
            <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </svg>
        </div>
        <div className={styles.settingContent}>
          <h3>{t('categorization.title')}</h3>
          <Categorization />
        </div>
      </div>

      {/* PRIVACY */}
      <div className={`${styles.settingsCard} ${styles.privacy}`}>
        <div className={styles.settingIcon}>
          {/* Lock icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div className={styles.settingContent}>
          <h3>{t('privacy.title')}</h3>
          <div className={styles.settingOptions}>
            {['windowTitles', 'websiteURLs', 'incognito'].map((key) => (
              <div key={key} className={styles.settingToggleItem}>
                <div className={styles.toggleInfo}>
                  <h4>{t(`privacy.options.${key}.title`)}</h4>
                  <p>{t(`privacy.options.${key}.description`)}</p>
                </div>
                <button className={styles.toggleTag}>Enabled</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
