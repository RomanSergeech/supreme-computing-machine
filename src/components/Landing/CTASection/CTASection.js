'use client'
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import styles from './CTASection.module.css';

const CTASection = () => {
  const t = useTranslations('landing');

  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.ctaContent}>
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.description')}</p>
          
          <div className={styles.ctaActions}>
            <Link href="/registration" className={`${styles.btnPrimary} ${styles.btn} ${styles.large}`}>
              {t('cta.button')}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </Link>
          </div>
        
        </div>
      </div>
    </section>
  );
};

export default CTASection;