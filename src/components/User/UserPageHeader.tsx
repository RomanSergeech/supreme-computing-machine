'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import { useTranslations } from 'next-intl';
import EmployeeInfo from './EmployeeInfo';
import { useState } from 'react';
import DateRangeDropdown from '@/components/common/DateRangeDropdown';
import styles from './UserPageHeader.module.css';
import { TWorkerStats } from '@/shared/types/office.types'

interface Props {
  employee: TWorkerStats
  dateRange: {
    from: Date;
    to: Date;
  }
  onDateChange: React.Dispatch<React.SetStateAction<{
    from: Date;
    to: Date;
  }>>
}
export default function UserPageHeader({ employee, dateRange, onDateChange }: Props) {
    const router = useRouter();
    const t = useTranslations('userProfile');
    const [range, setRange] = useState({
        from: undefined,
        to: undefined,
    });

    return (
        <Header
            leftContent={
                <div className={styles.leftBlock}>
                    <button onClick={() => router.back()} className={styles.backButton}>
                        ← {t('back')}
                    </button>
                </div>
            }
        >

            <div className={styles.rightBlock}>
                <div className={styles.dateRangeDropdown}>
                    <DateRangeDropdown dateRange={range} onDateRangeChange={setRange} />
                </div>
                <div className={styles.status}>
                    {/* <span
                      className={`${styles.statusDot} ${employee.isActive ? styles.active : styles.inactive}`}
                    />
                    {employee.isActive ? t('status.active') : t('status.inactive')} */}
                </div>

                <EmployeeInfo employee={employee} />
            </div>
        </Header>
    );
}
