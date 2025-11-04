'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import { useTranslations } from 'next-intl';
import styles from './ProfileHeader.module.css'

export default function ProfileHeader() {
  const router = useRouter();
  const t = useTranslations('profile');

  return (
    <Header
      leftContent={
        <button onClick={() => router.back()} className={styles.backButton}>
          ← {t('back')}
        </button>
      }
    />
  );
}
