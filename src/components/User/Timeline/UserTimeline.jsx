'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styles from './UserTimeline.module.css';
import DurationPicker from './DurationPicker';
import AppFilter from './AppFilter';
import TimelineCanvas from './TimelineCanvas';

export default function UserTimeline() {
    const t = useTranslations('userTimeline');

    const [selectedDuration, setSelectedDuration] = useState('1h');
    const [selectedAppTypes, setSelectedAppTypes] = useState(['productive', 'neutral', 'distracting']);

    const DURATION_OPTIONS = [
        { value: '15m', label: '15м' },
        { value: '30m', label: '30м' },
        { value: '1h', label: '1ч' },
        { value: '2h', label: '2ч' },
        { value: '3h', label: '3ч' },
        { value: '4h', label: '4ч' },
        { value: '6h', label: '6ч' },
        { value: '12h', label: '12ч' },
        { value: '24h', label: '24ч' },
        { value: '48h', label: '48ч' },
    ];

    const APP_TYPE_OPTIONS = [
        { value: 'productive', label: t('productive') },
        { value: 'neutral', label: t('neutral') },
        { value: 'distracting', label: t('distracting') },
    ];

    const deviceActivityData = [
  {
    device: 'MacBook Pro',
    icon: '💻',
    sessions: [
      {
        app: 'VS Code',
        start: '2025-08-06T09:00:00',
        end: '2025-08-06T11:30:00',
        type: 'productive',
      },
      {
        app: 'Chrome',
        start: '2025-08-06T12:00:00',
        end: '2025-08-06T13:15:00',
        type: 'neutral',
      },
      {
        app: 'Figma',
        start: '2025-08-06T14:00:00',
        end: '2025-08-06T15:30:00',
        type: 'productive',
      },
    ],
  },
  {
    device: 'iPhone 14',
    icon: '📱',
    sessions: [
      {
        app: 'YouTube',
        start: '2025-08-06T09:45:00',
        end: '2025-08-06T10:30:00',
        type: 'distracting',
      },
      {
        app: 'Telegram',
        start: '2025-08-06T13:00:00',
        end: '2025-08-06T13:20:00',
        type: 'neutral',
      },
    ],
  },
];


    return (
        <section className={styles.container}>
            <h2 className={styles.title}>{t('title')}</h2>

            <div className={styles.controls}>
                <DurationPicker
                    value={selectedDuration}
                    onChange={setSelectedDuration}
                    options={DURATION_OPTIONS}
                    label={t('selectDuration')}
                />
                <AppFilter
                    selected={selectedAppTypes}
                    onChange={setSelectedAppTypes}
                    options={APP_TYPE_OPTIONS}
                    label={t('filterApps')}
                />
            </div>

            <div className={styles.timeline}>
                <TimelineCanvas
                    data={deviceActivityData}
                    from={new Date('2025-08-06T08:00:00')}
                    to={new Date('2025-08-06T18:00:00')}
                    stepMinutes={60}
                />
            </div>
        </section>
    );
}
