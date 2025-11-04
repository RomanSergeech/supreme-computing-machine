'use client'
import { useTranslations } from 'next-intl';
import styles from './BenefitsSection.module.css';

const BenefitsSection = () => {
  const t = useTranslations('landing');
  const benefits = [1, 2, 3, 4, 5, 6].map(i => t(`benefits.benefit${i}`));
  
  const stats = [
  { value: '10K+', label: t('benefits.stats.users') },
  { value: '500+', label: t('benefits.stats.companies') },
  { value: '99.9%', label: t('benefits.stats.uptime') },
  { value: '24/7', label: t('benefits.stats.support') }
];


  return (
    <section className={styles.benefitsSection}>
      <div className={styles.container}>
        <div className={styles.benefitsContent}>
          <div className={styles.benefitsText}>
            <h2>{t('benefits.title')}</h2>
            <p>{t('benefits.description')}</p>
            
            <div className={styles.benefitsList}>
              {benefits.map((benefit, index) => (
                <div key={index} className={styles.benefitItem}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statNumber}>{stat.value}</div>
                <div className={styles.statDescription}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;