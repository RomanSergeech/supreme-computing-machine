'use client';

import { ReactNode, useState } from 'react'
import { TTab } from '@/shared/types/profile.types'

import styles from './Tabs.module.css';

interface TabsProps {
  tabs: TTab[]
  defaultTab: TTab['value'] | ''
  render: ( data: { activeTab: TTab['value'] } ) => ReactNode
}
export default function Tabs({ tabs = [], defaultTab = '', render }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabsRow}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`${styles.tab} ${
              activeTab === tab.value ? styles.active : ''
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {render({ activeTab })}
      </div>
    </div>
  );
}
