'use client';
import { useEffect, useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('ru'); // по умолчанию
  const wrapperRef = useRef(null);

  // 📌 При монтировании компонента считываем локаль из cookie
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/);
    if (match) {
      setCurrentLocale(match[1]);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeLanguage = (locale) => {
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
      setCurrentLocale(locale); // 👈 обновляем локаль сразу
      router.refresh();
    });
    setOpen(false);
  };

  return (
    <div className={styles.languageSelector} ref={wrapperRef}>
      <button className={styles.languageBtn} onClick={() => setOpen(!open)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        <span className={styles.languageFlag}>{currentLocale === 'en' ? '🇺🇸' : '🇷🇺'}</span>
        <span className={styles.languageCode}>{currentLocale.toUpperCase()}</span>
      </button>

      {open && (
        <div className={styles.languageMenu}>
          <button
            className={`${styles.languageOption} ${currentLocale === 'ru' ? styles.active : ''}`}
            onClick={() => changeLanguage('ru')}
            disabled={isPending}
          >
            <span className={styles.languageFlag}>🇷🇺</span>
            <span className={styles.languageName}>Русский</span>
            {currentLocale === 'ru' && <span className={styles.languageCheck}>✓</span>}
          </button>

          <button
            className={`${styles.languageOption} ${currentLocale === 'en' ? styles.active : ''}`}
            onClick={() => changeLanguage('en')}
            disabled={isPending}
          >
            <span className={styles.languageFlag}>🇺🇸</span>
            <span className={styles.languageName}>English</span>
            {currentLocale === 'en' && <span className={styles.languageCheck}>✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
