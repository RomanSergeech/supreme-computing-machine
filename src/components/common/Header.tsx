'use client';
import { useTranslations } from 'next-intl';
import styles from './Header.module.css';
import Link from 'next/link';
import { ReactNode } from 'react'

interface HeaderProps {
  children: ReactNode
  leftContent?: any
  logoLink?: any
  headerActionsClassName?: any
  headerActionsStyle?: any
}
const Header = ({ children, leftContent = null, logoLink = null, headerActionsClassName = '', headerActionsStyle = {} }: HeaderProps) => {

  const t = useTranslations('landing');

  const logo = (
    <>
      <div className={styles.logoIcon}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      </div>
      <h1 className={styles.logoTitle}>{t('header.logo')}</h1>
    </>
  );

  return (
    <header className={styles.CommonHeader}>
      <div className={`${styles.container} ${styles.headerContent}`}>
        <div className={styles.logoSection}>
          {leftContent && <div className={styles.leftContent}>{leftContent}</div>}

          {logoLink ? (
            <Link href={logoLink} className={styles.logoSection}>
              {logo}
            </Link>
          ) : (
            <div className={styles.logoSection}>
              {logo}
            </div>
          )}
        </div>

        {/* headerActions: allow external className / style through props */}
        <div
          className={`${styles.headerActions} ${headerActionsClassName}`}
          style={headerActionsStyle}
        >
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;
