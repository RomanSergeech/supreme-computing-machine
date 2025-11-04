'use client';
import styles from './SectionContainer.module.css';
import { useTranslations } from 'next-intl';

export default function SectionContainer({ titleKey, children }) {
  const t = useTranslations('sections');

  return (
    <div className={styles.mainContent}>
      <div className={styles.section}>
        {titleKey && (
          <div className={styles.header}>
            <h3>{t(titleKey)}</h3>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}