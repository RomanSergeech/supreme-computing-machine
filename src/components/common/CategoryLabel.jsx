import styles from './CategoryLabel.module.css';
import { useTranslations } from 'next-intl';

export default function CategoryLabel({ category }) {
  const t = useTranslations('websitesTable');
  return (
    <span className={`${styles.label} ${styles[category]}`}>
      {t(`categories.${category}`)}
    </span>
  );
}
