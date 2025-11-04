'use client'

import Header from '@/components/common/Header';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './LandingHeader.module.css';

export default function LandingHeader() {
  const t = useTranslations('landing');

  return (
    <Header headerActionsClassName={styles.headerActionsGrid}>
      <Link href="/login" className={`${styles.btn} ${styles.btnSecondary} ${styles.loginCell}`}>
        {t('header.login')}
      </Link>
            <div className={styles.langCell}>
        <LanguageSwitcher />
      </div>

      <Link href="/registration" className={`${styles.btn} ${styles.btnPrimary} ${styles.signupCell}`}>
        {t('header.signup')}
      </Link>
    </Header>
  );
}

