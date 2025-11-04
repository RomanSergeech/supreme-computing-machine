import { useTranslations } from 'next-intl';

export function useFormatDuration() {
  const t = useTranslations('common');

  return (totalMinutes = 0) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return t('minutesOnly', { minutes });
    }

    if (minutes === 0) {
      return t('hoursOnly', { hours });
    }

    return t('hoursMinutes', { hours, minutes });
  };
}
