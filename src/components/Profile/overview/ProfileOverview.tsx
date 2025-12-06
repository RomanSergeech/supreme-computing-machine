'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/shared/store/user.store'
import { getFormData, showAlert } from '@/shared/utils'

import styles from './ProfileOverview.module.css';
import { TUser } from '@/shared/types/user.types'

const FORM_FILEDS = {
  fullName:'fullName',
  email:'email',
  phone:'phone',
  position:'position',
  department:'department',
  location:'location',
  registeredAt:'registeredAt',
}

type TFormFields = keyof typeof FORM_FILEDS

export default function ProfileOverview() {

  const userStore = useUserStore(state => state.user)

  const [isEditing, setIsEditing] = useState(false)
  
  const [user, setUser] = useState<Record<TFormFields, string|null>>({
    fullName: `${userStore?.u_name} ${userStore?.u_family}`,
    email: userStore?.u_email || '',
    phone: userStore?.u_phone || '',
    position: '',
    department: '',
    location: userStore?.u_city || '',
    registeredAt: '',
  })

  useEffect(() => {
    setUser({
      fullName: `${userStore?.u_name} ${userStore?.u_family}`,
      email: userStore?.u_email || '',
      phone: userStore?.u_phone || '',
      position: '',
      department: '',
      location: userStore?.u_city || '',
      registeredAt: '',
    })
  }, [userStore])
  
  const t = useTranslations('profileOverview')

  const PROFILE_FIELDS: { label: string, field: TFormFields }[] = [
    { label: t('fullName'), field: 'fullName' },
    { label: 'Email', field: 'email' },
    { label: t('phone'), field: 'phone' },
    { label: t('position'), field: 'position' },
    { label: t('department'), field: 'department' },
    { label: t('location'), field: 'location' },
  ]

  const handleChange = ( field: string ) => ( e: React.ChangeEvent<HTMLInputElement> ) => {
    setUser((prev) => ({ ...prev, [field]: e.target.value }));
  }

  const onSubmit = ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault()

    if ( !isEditing ) {
      setIsEditing(prev => !prev)
      return
    }

    const f = getFormData<Record<TFormFields, string>>(e.currentTarget)

    const data: Partial<TUser> = {}

    if ( f.email !== userStore?.u_email ) {
      data.u_email = f.email
    }
    if ( f.fullName.split(' ')[0] !== userStore?.u_name ) {
      data.u_name = f.fullName.split(' ')[0]
    }
    if ( f.fullName.split(' ')[1] !== userStore?.u_family ) {
      data.u_family = f.fullName.split(' ')[1]
    }
    if ( f.phone !== (userStore?.u_phone || '') ) {
      data.u_phone = f.phone
    }
    if ( f.location !== (userStore?.u_city || '') ) {
      data.u_city = f.location
    }

    useUserStore.getState().editUser(data)
      .then(() => {
        setIsEditing(false)
      })
  }

  return (
    <div className={styles.overviewContainer}>
      <form onSubmit={onSubmit} className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{t('title')}</span>
          </div>
          <div>
            <button
              type='submit'
              className={styles.editButton}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
              </svg>
              {isEditing ? t('save') : t('edit')}
            </button>
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.profileContent}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>АС</div>
            </div>

            <div className={styles.infoGrid}>
              {PROFILE_FIELDS.map(({ label, field }) => (
                <div className={styles.infoItem} key={field}>
                  <label>{label}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name={FORM_FILEDS[field]}
                      value={user[field] || ''}
                      onChange={handleChange(field)}
                      className={styles.input}
                    />
                  ) : (
                    <p>{user[field] || '_'}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.footer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="16" height="16" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
            </svg>
            <span>{t('registeredAt', { date: user.registeredAt || '_' })}</span>
          </div>
        </div>

      </form>
    </div>
  );
}
