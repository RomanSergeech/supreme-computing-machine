'use client'
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import styles from './Footer.module.css';
// import CreeperHead from "@/components/secret/boom"

const Footer = () => {
  const t = useTranslations('landing');

  const linkGroups = Object.entries(t.raw('Footer.links')).map(([key, group]) => ({
    key,
    title: group.title,
    items: Object.keys(group.items)
  }));

  return (
    <footer className={styles.landingFooter}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logoSection}>
              <div className={styles.logoIcon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              </div>
              <h1 className={styles.logoTitle}>{t('Footer.brand.title')}</h1>
            </div>
            <p>{t('Footer.brand.description')}</p>
          </div>

          <div className={styles.footerLinks}>
            {linkGroups.map((group) => (
              <div key={group.key} className={styles.linkGroup}>
                <h4>{group.title}</h4>
                {group.items.map((itemKey) => (
                  <Link key={itemKey} href={`/${itemKey}`}>
                    {t(`Footer.links.${group.key}.items.${itemKey}`)}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} {t('Footer.copyright')}</p>
        </div>
        {/* <CreeperHead/> */}
      </div>

    </footer>
  );
};


export default Footer;