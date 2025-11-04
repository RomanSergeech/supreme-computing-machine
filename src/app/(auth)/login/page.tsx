'use client';

import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/Auth/AuthLayout';
import AuthForm, { ELoginFormFields } from '@/components/Auth/AuthForm';
import { useTranslations } from 'next-intl';
import { getFormData, showAlert } from '@/shared/utils'
import { useAuthStore } from '@/shared/store/auth.store'

export default function LoginPage() {

  const t = useTranslations();
  const router = useRouter();

  const handleLogin = ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    const formData = getFormData<Record<`${ELoginFormFields}`, string>>(e.currentTarget)

    if ( Object.values(formData).some(el => el === null) ) {
      showAlert({ text: ["There are empty fields"] }, 2000)
      return
    }

    const data = new FormData()

    data.set('login', formData.email)
    data.set('password', formData.password)
    data.set('type', 'e-mail')

    useAuthStore.getState().login(data)
      .then(() => {
        router.push('/office')
      })
      .catch(err => showAlert({
        text: [err.message] || ['Error'],
        textBtn: 'Close'
      }, 3000))
  };

  return (
    <AuthLayout
      logo={t('auth.branding')}
      title={t('auth.login.title')}
      subtitle={t('auth.login.subtitle')}
    >
      <AuthForm type="login" onSubmit={handleLogin} />
    </AuthLayout>
  );
}
