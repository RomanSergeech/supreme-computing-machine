'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFormatDuration } from '@/shared/utils/useFormatDuration';
import { useOfficeStore } from '@/shared/store/office.store'
import { TTopApp, TTopSite } from '@/shared/types/office.types'

import styles from './OverviewContent.module.css';


function isAppsType(type: 'apps' | 'sites'): type is 'apps' {
  return type === 'apps'
}


export default function OverviewContent() {

  const commonTime = useOfficeStore(state => state.commonTime)
  const productiveTime = useOfficeStore(state => state.productiveTime)
  const averageProductivity = useOfficeStore(state => state.averageProductivity)
  const averageDistracting = useOfficeStore(state => state.averageDistracting)
  const averageNeutral = useOfficeStore(state => state.averageNeutral)
  const topApps = useOfficeStore(state => state.topApps)
  const topSites = useOfficeStore(state => state.topSites)

  const t = useTranslations('overview');
  const formatDuration = useFormatDuration();

  const [appsExpanded, setAppsExpanded] = useState(false);
  const [sitesExpanded, setSitesExpanded] = useState(false);
  const [appsCollapsing, setAppsCollapsing] = useState(false);
  const [sitesCollapsing, setSitesCollapsing] = useState(false);

  useEffect(() => {
    useOfficeStore.getState().getOverviewData()
  }, [])

  const cards = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: t('totalTime'),
      value: formatDuration(commonTime),
      // change: t('timeChange'),
      // positive: true
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      ),
      title: t('avgProductivity'),
      value: averageProductivity+'%',
      change: null
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
      title: t('activeEmployees'),
      value: '0',
      change: t('currentlyActive'),
      positive: null
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-3" />
        </svg>
      ),
      title: t('productiveTime'),
      value: formatDuration(productiveTime),
      // change: t('productivePercentage'),
      // positive: false
    }
  ];

  const toggleExpand = ( type: string ) => {
    if (type === 'apps') {
      if (appsExpanded) {
        setAppsCollapsing(true);
        setTimeout(() => {
          setAppsExpanded(false);
          setAppsCollapsing(false);
        }, 300);
      } else {
        setAppsExpanded(true);
      }
    } else {
      if (sitesExpanded) {
        setSitesCollapsing(true);
        setTimeout(() => {
          setSitesExpanded(false);
          setSitesCollapsing(false);
        }, 300);
      } else {
        setSitesExpanded(true);
      }
    }
  };

  type TRenderActivityList = <T extends 'apps'|'sites'>(
    items: (T extends 'apps' ? TTopApp : TTopSite)[],
    type: T,
    expanded: any,
    collapsing: any
  ) => ReactElement

  const renderActivityList: TRenderActivityList = <T extends 'apps'|'sites'>(
    items: (T extends 'apps' ? TTopApp : TTopSite)[],
    type: T,
    expanded: any,
    collapsing: any
  ) => {
    const visibleItems = expanded ? items : items.slice(0, 3);
    return (
      <div
        className={`${styles.activityList} 
        ${expanded ? styles.expanded : ''} 
        ${collapsing ? styles.collapsing : ''}`}
      >
        {visibleItems.map(( item, index ) => (
          <div key={index} className={styles.activityItem}>
            <div className={styles.activityApp}>
              <span className={styles.activityAppName}>{item.name}</span>
              <span className={styles.activityAppTime}>
                {isAppsType(type)
                  ? t('usersUsed', { count: (item as TTopApp).users.length })
                  : t('siteVisits', { count: Object.values((item as TTopSite).visits).reduce((acc, n) => { acc += n; return acc }) })}
              </span>
            </div>
            <div className={styles.activityDuration}>
              {formatDuration(item.duration)}{' '}
              <span
                className={`${styles.productivity} ${item.productivity === 'productive'
                    ? styles.high
                    : item.productivity === 'distracting'
                      ? styles.low
                      : styles.medium
                  }`}
              >
                {item.productivity === 'productive'
                  ? t('productive')
                  : item.productivity === 'distracting'
                    ? t('distracting')
                    : t('neutral')}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.overviewGrid}>

        <div className={styles.cardsContainer}>
          {cards.map((card, idx) => (
            <div key={idx} className={styles.statCard}>
              <div className={styles.statIcon}>{card.icon}</div>
              <div className={styles.statContent}>
                <h3>{card.title}</h3>
                <p className={styles.statValue}>{card.value}</p>
                {card.change && (
                  <span
                    className={`${styles.statChange} ${card.positive === true
                        ? styles.positive
                        : card.positive === false
                          ? styles.negative
                          : styles.neutral
                      }`}
                  >
                    {card.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Топ приложений */}
        <div className={styles.recentCard}>
          <h3 className={styles.statValue}>{t('topAppsTitle')}</h3>
          {renderActivityList(topApps, 'apps', appsExpanded, appsCollapsing)}
          <button
            className={styles.expandButton}
            onClick={() => toggleExpand('apps')}
          >
            {appsExpanded ? t('collapse') : t('expand')}
          </button>
        </div>

        {/* Топ сайтов */}
        <div className={styles.recentCard}>
          <h3 className={styles.statValue}>{t('topSitesTitle')}</h3>
          {renderActivityList(topSites, 'sites', sitesExpanded, sitesCollapsing)}
          <button
            className={styles.expandButton}
            onClick={() => toggleExpand('sites')}
          >
            {sitesExpanded ? t('collapse') : t('expand')}
          </button>
        </div>

        <div className={styles.productivityProgress}>
          <h3 className={styles.statValue}>{t('productivityTitle')}</h3>
          <div className={styles.statContent}>
            <p>{t('productiveActivity')}</p>
            <span className={`${styles.statChange} ${styles.neutral}`}>
              {formatDuration(productiveTime)}
            </span>
          </div>
          <div
            className={styles.progressBarFull}
            style={{ marginTop: '0.6rem' }}
          >
            <div
              className={styles.progressBarFill}
              style={{ width: averageProductivity+'%' }}
            ></div>
          </div>
          <div className={styles.productivityItems}>
            <div className={styles.productivityItem}>
              <span className={`${styles.productivity} ${styles.high}`}>{averageProductivity}%</span>
              <span className={styles.productivityTitle}>{t('productive')}</span>
            </div>
            <div className={styles.productivityItem}>
              <span className={`${styles.productivity} ${styles.medium}`}>{averageNeutral}%</span>
              <span className={styles.productivityTitle}>{t('neutral')}</span>
            </div>
            <div className={styles.productivityItem}>
              <span className={`${styles.productivity} ${styles.low}`}>{averageDistracting}%</span>
              <span className={styles.productivityTitle}>{t('distracting')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
