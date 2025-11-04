'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/shared/store/auth.store'
import AuthLayout from '@/components/Auth/AuthLayout';
import AuthForm, { EFormFields } from '@/components/Auth/AuthForm';
import { getFormData, showAlert } from '@/shared/utils'

export default function RegistrationPage() {

  const t = useTranslations();

  const router = useRouter();

  const handleRegister = ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    const formData = getFormData<Record<`${EFormFields}`, string>>(e.currentTarget)

    if ( Object.values(formData).some(el => el === null) ) {
      console.log('There are empty fields');
      return
    }

    if ( formData.password !== formData.confirmPassword ) {
      showAlert({ text: ["Passwords don't match"] }, 2000)
      return
    }

    if ( formData.terms !== 'on' ) {
      showAlert({ text: ["We cannot register you without the consent of terms"] }, 2000)
      return
    }

    const data = new FormData()

    data.set('u_name', formData.name)
    data.set('u_email', formData.email)
    data.set('u_role', '2')
    data.set('password', formData.password)

    useAuthStore.getState().register(data)
      .then(() => {
        router.push('/login')
      })
      .catch(err => showAlert({
        text: [err.message] || ['Error'],
        textBtn: 'Close'
      }, 3000))
  };

  return (
    <AuthLayout
      logo={t('auth.branding')}
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
    >
      <AuthForm type="register" onSubmit={handleRegister} />
    </AuthLayout>
  );
}
