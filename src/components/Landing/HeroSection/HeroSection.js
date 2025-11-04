// components/HeroSection/HeroSection.js
'use client'
import { useTranslations } from 'next-intl';
import styles from './HeroSection.module.css';
import Link from 'next/link';

const HeroSection = () => {
  const t = useTranslations('landing');

  const stats = ['rating', 'users'];

  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h2 className={styles.heroTitle}>
              {t.rich('hero.title', {
                highlight: (chunks) => <span className={styles.highlight}>{chunks}</span>
              })}
            </h2>
            <p className={styles.heroDescription}>{t('hero.description')}</p>

            <div className={styles.heroActions}>
              <Link href="/registration" className={`${styles.btnPrimary} ${styles.btn} ${styles.large}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                {t('hero.tryFree')}
              </Link>
              <Link href="/demo" className={`${styles.btnSecondary} ${styles.btn} ${styles.large}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>
                {t('hero.seeDemo')}
              </Link>
            </div>

            <div className={styles.heroStats}>
              {stats.map((item) => (
                <div key={item} className={styles.statItem}>
                  {item === 'rating' ? (
                    // ⭐️ Рейтинг
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                  ) : item === 'users' ? (
                    // 👥 Пользователи
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="lucide lucide-users">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ) : null}

                  <span>{t(`hero.stats.${item}`)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.dashboardPreview}>
              <div className={styles.previewHeader}>
                <div className={styles.previewDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className={styles.previewTitle}>{t('hero.dashboardTitle')}</div>
              </div>
              <div className={styles.previewContent}>
                <div className={styles.previewStats}>
                  {[1, 2].map((item) => (
                    <div key={item} className={styles.previewStat}>
                      <div className={styles.statIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z" />
                        </svg>
                      </div>
                      <div>
                        <span className={styles.statValue}>{t(`hero.stat${item}`)}</span>
                        <span className={styles.statLabel}>{t(`hero.label${item}`)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;