'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './DateRangeDropdown.module.css';

export default function DateRangeDropdown({ dateRange, onDateRangeChange }) {
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const wrapperRef = useRef(null);

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

  const handleDayClick = (day) => {
    const { from, to } = dateRange;
    if (!from || (from && to)) {
      onDateRangeChange({ from: day, to: undefined });
    } else {
      if (day < from) {
        onDateRangeChange({ from: day, to: from });
      } else {
        onDateRangeChange({ from, to: day });
        setOpen(false);
      }
    }
  };

  const isSameDay = (d1, d2) => d1?.toDateString() === d2?.toDateString();
  const isInRange = (day) => {
    const { from, to } = dateRange;
    return from && to && day >= from && day <= to;
  };

  const getDaysOfMonth = (month) => {
    const year = month.getFullYear();
    const m = month.getMonth();
    const firstDay = new Date(year, m, 1);
    const lastDay = new Date(year, m + 1, 0);
    const days = [];

    let startDay = firstDay.getDay();
    if (startDay === 0) startDay = 7; // Sunday -> end of week
    for (let i = 1; i < startDay; i++) days.push(null);

    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, m, d));
    }

    return days;
  };

  const formatDate = (date) =>
    date ? date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) : '';

  const renderRangeLabel = () => {
    if (!dateRange.from) return t('selectPeriod');
    if (dateRange.to)
      return `${formatDate(dateRange.from)} — ${formatDate(dateRange.to)}`;
    return `${formatDate(dateRange.from)} — ...`;
  };

  const monthLabel = `${t(`months.${currentMonth.getMonth()}`)} ${currentMonth.getFullYear()}`;

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  const weekdayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button onClick={() => setOpen(!open)} className={styles.dateBtn}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2v4" /><path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
        </svg>
        <span className={styles.dateText}>{renderRangeLabel()}</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.monthNavigation}>
            <button onClick={() => changeMonth(-1)} className={styles.navButton}>‹</button>
            <strong>{monthLabel}</strong>
            <button onClick={() => changeMonth(1)} className={styles.navButton}>›</button>
          </div>

          <div className={styles.weekdays}>
            {weekdayKeys.map((key) => (
              <div key={key} className={styles.weekday}>
                {t(`weekdays.${key}`)}
              </div>
            ))}
          </div>

          <div className={styles.days}>
            {getDaysOfMonth(currentMonth).map((day, idx) => {
              if (!day) return <div key={idx} />;
              const selected = isSameDay(day, dateRange.from) || isSameDay(day, dateRange.to);
              const inRange = isInRange(day);
              return (
                <button
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  className={`${styles.dayButton} ${selected ? styles.selected : ''} ${inRange ? styles.inRange : ''}`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {(dateRange.from || dateRange.to) && (
            <button
              onClick={() => onDateRangeChange({ from: undefined, to: undefined })}
              className={styles.clearButton}
            >
              {t('clear')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
