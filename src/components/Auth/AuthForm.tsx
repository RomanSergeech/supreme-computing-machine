'use client'
import Link from 'next/link';
import InputField from './InputField';
import Checkbox from './Checkbox';
import SubmitButton from './SubmitButton';
import { useTranslations } from 'next-intl';

import styles from './AuthForm.module.css';

export const enum EFormFields {
  name='name',
  email='email',
  password='password',
  confirmPassword='confirmPassword',
  terms='terms'
}

export const enum ELoginFormFields {
  email='email',
  password='password',
  remember='remember'
}

interface AuthFormProps {
  type: 'register'|'login',
  onSubmit: ( e: React.FormEvent<HTMLFormElement> ) => void
}
export default function AuthForm({ type = 'login', onSubmit }: AuthFormProps) {

  const t = useTranslations();

  const isLogin = type === 'login';
  const prefix = `auth.${type}`;

  return (
    <form className={styles.form} onSubmit={onSubmit}>

      {!isLogin && (
        <InputField
          id={EFormFields.name}
          label={t(`${prefix}.nameLabel`)}
          placeholder={t(`${prefix}.namePlaceholder`)}
          name={EFormFields.name}
        />
      )}

      <InputField
        id={EFormFields.email}
        label={t(`${prefix}.emailLabel`)}
        placeholder={t(`${prefix}.emailPlaceholder`)}
        name={EFormFields.email}
      />

      <InputField
        id={EFormFields.password}
        label={t(`${prefix}.passwordLabel`)}
        placeholder={t(`${prefix}.passwordPlaceholder`)}
        name={EFormFields.password}
      />

      {!isLogin && (
        <InputField
          id={EFormFields.confirmPassword}
          label={t(`${prefix}.confirmPasswordLabel`)}
          placeholder={t(`${prefix}.confirmPasswordPlaceholder`)}
          name={EFormFields.confirmPassword}
        />
      )}

      {isLogin ? (
        <div className={styles.formOptions}>
          <Checkbox
            label={t('auth.login.rememberMe')}
            name={ELoginFormFields.remember}
          />
          <Link className={styles.link} href={`/forgot-password`}>
            {t('auth.login.forgotPassword')}
          </Link>
        </div>
      ) : (
        <Checkbox
          label={
            <>
              {t('auth.register.agree')}{' '}
              <Link className={styles.link} href={`/terms`}>
                {t('auth.register.terms')}
              </Link>
            </>
          }
          name={EFormFields.terms}
        />
      )}

      <SubmitButton>
        {t(`${prefix}.submit`)}
      </SubmitButton>

      <div className={styles.footerText}>
        {isLogin ? (
          <>
            <p>{t('auth.login.noAccount')}{' '}
              <Link className={styles.link} href={`/registration`}>
                {t('auth.register.noAccount')}
              </Link>
            </p>
          </>
        ) : (
          <>
            <p>{t('auth.register.hasAccount')}{' '}
              <Link className={styles.link} href={`/login`}>
                {t('auth.login.hasAccount')}
              </Link>
            </p>
          </>
        )}
      </div>
    </form>
  );
}
