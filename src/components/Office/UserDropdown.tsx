'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from './UserDropdown.module.css';
import { TUser } from '@/shared/types/user.types'
import { useAuthStore } from '@/shared/store/auth.store'
import Image from 'next/image'

export default function UserDropdown({ user }: { user: TUser }) {

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations('UserDropdown'); 

  useEffect(() => {
    const handleClickOutside = ( e: any ) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className={styles.avatarButton}>
        <div className={styles.avatarCircle}>
          {user.u_photo ? (
            <Image src={user.u_photo} alt="avatar" />
          ) : (
            user.u_name
          )}
        </div>
      </button>

      {open && (
        <div className={styles.dropdownMenu}>
          <div className={styles.userInfo}>
            <strong>{user.u_name}</strong>
            <span>{user.u_email}</span>
          </div>
          <button  onClick={() => router.push('/profile?tab=profile')}>{t('profile')}</button>
          <button  onClick={() => router.push('/profile?tab=settings')}>{t('settings')}</button>
          <button  onClick={useAuthStore.getState().logout}>{t('logout')}</button>
        </div>
      )}
    </div>
  );
}
