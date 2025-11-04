'use client'
import { useTranslations } from 'next-intl';
import styles from './HowItWorksSection.module.css';

const HowItWorksSection = () => {
  const t = useTranslations('landing');
  const steps = [1, 2, 3].map(i => ({
    title: t(`howItWorks.step${i}.title`),
    description: t(`howItWorks.step${i}.description`)
  }));

  return (
    <section className={styles.howItWorksSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>{t('howItWorks.title')}</h2>
          <p>{t('howItWorks.description')}</p>
        </div>
        
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepContent}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;