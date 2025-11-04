'use client';

import { useTranslations } from 'next-intl';
import styles from './ProfileSubscription.module.css';
import RenewSubscriptionModal from './RenewSubscriptionModal';
import ChangePlanModal from './ChangePlanModal';
import { useState } from 'react';
import { useUserStore } from '@/shared/store/user.store'
import { TSubscription } from '@/shared/types/user.types'
import { useStaticStore } from '@/shared/store/static.store'
import { TSubscriptionStatuses } from '@/shared/types/static.types'

export default function ProfileSubscription() {

  const subscription = useUserStore(state => state.subscription)

  const [showRenew, setShowRenew] = useState(false);
  const [showChange, setShowChange] = useState(false);

  return (
      <div className={styles.container}>
          <div className={styles.cardsWrapper}>

              <Subscription
                subscription={subscription[0]}
                setShowRenew={setShowRenew}
                setShowChange={setShowChange}
              />

              {/* <div className={styles.usageCard}>
                  <div className={styles.usageCardHeader}>
                      <div className={styles.usageCardTitle}>{t('usage.title')}</div>
                  </div>
                  <div className={styles.usageCardBody}>
                      {[
                          { key: 'users', value: '15 / ∞', barClass: '' },
                          { key: 'storage', value: '2.1 ГБ / ∞', barClass: styles.storage },
                          { key: 'api', value: '1,247 / ∞', barClass: styles.api },
                      ].map(({ key, value, barClass }) => (
                          <div className={styles.usageRow} key={key}>
                              <div className={styles.usageRowHeader}>
                                  <span>{t(`usage.${key}`)}</span>
                                  <span>{value}</span>
                              </div>
                              <div className={styles.progressBar}>
                                  <div className={`${styles.progressValue} ${barClass}`} />
                              </div>
                          </div>
                      ))}
                      <div className={styles.usageActions}>
                          <button className={styles.usageButton}>{t('usage.details')}</button>
                      </div>
                  </div>
              </div> */}
          </div>

          <PaymentsList
            subscriptions={subscription}
          />

          {showRenew &&
            <RenewSubscriptionModal
              subscription={subscription[0]}
              onClose={() => setShowRenew(false)}
            />
          }

          {showChange &&
            <ChangePlanModal onClose={() => setShowChange(false)} />
          }

      </div>
  );
}

interface SubscriptionProps {
  subscription: TSubscription | null
  setShowRenew: React.Dispatch<React.SetStateAction<boolean>>
  setShowChange: React.Dispatch<React.SetStateAction<boolean>>
}
const Subscription = ({ subscription, setShowRenew, setShowChange }: SubscriptionProps) => {

  const subscription_statuses = useStaticStore(state => state.subscription_statuses)
  const tariffs = useStaticStore(state => state.tariffs)
  const tariff_duration_classes = useStaticStore(state => state.tariff_duration_classes)

  const t = useTranslations('profileSubscription') as any

  const tariff = tariffs[subscription?.tariff || '0']

  return (
    <div className={styles.subscriptionCard}>
      <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
              >
                  <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                  <path d="M5 21h14" />
              </svg>
              <span>{t('currentSubscription')}</span>
          </div>
      </div>
      <div className={styles.cardBody}>
          <div className={styles.subscriptionInfo}>
              <div>
                  <div className={styles.badges}>
                      <span className={styles.badge} data-color='purple' >
                        {tariff['ru']}
                      </span>
                      <span
                        className={styles.badge}
                        data-color={subscription?.paid ? 'green' : subscription ? 'yellow' : 'red'}
                      >
                        {getSubscriptionStatus(subscription, subscription_statuses)}
                      </span>
                  </div>
                  <p className={styles.price}>{Math.round(+tariff.price)} {tariff.currency}</p>
                  <p className={styles.perYear}>{tariff_duration_classes[tariff.duration_class]['ru']}</p>
              </div>
              {subscription &&
                <div className={styles.subscriptionDates}>
                  <p className={styles.label}>{t('validUntil')}</p>
                  <p className={styles.value}>{subscription.cancellation_date}</p>
                  {/* <p className={styles.label}>{t('daysLeft', { days: -217 })}</p> */}
                </div>
              }
          </div>

          {/* <div className={styles.featuresBlock}>
              <h4 className={styles.featuresTitle}>{t('includedFeatures')}</h4>
              <div className={styles.featuresGrid}>
                  {t.raw('features', { returnObjects: true }).map((feature: string, index: number) => (
                      <div key={index} className={styles.featureItem}>
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24" height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                          >
                              <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <span>{feature}</span>
                      </div>
                  ))}
              </div>
          </div> */}

          <div className={styles.actions}>
            {subscription &&
              <button onClick={() => setShowRenew(true)} className={styles.primaryButton}>{t('renew')}</button>
            }
            <button onClick={() => setShowChange(true)} className={styles.secondaryButton}>
              {t('changePlan')}
            </button>
          </div>
      </div>
    </div>
  )
}

interface PaymentsListProps {
  subscriptions: TSubscription[]
}
const PaymentsList = ({ subscriptions }: PaymentsListProps) => {

  const tariffs = useStaticStore(state => state.tariffs)
  const subscription_statuses = useStaticStore(state => state.subscription_statuses)

  const t = useTranslations('profileSubscription')

  const subscriptionsArr = subscriptions.reduce<{ plan: string, period: string, amount: string, status: string }[]>((acc, sub) => {
    const tariff = tariffs[sub?.tariff || '0']
    acc.push({
      plan: tariff.ru,
      period: sub.cancellation_date,
      amount: tariff?.price + ' ' + tariff?.currency,
      status: getSubscriptionStatus(sub, subscription_statuses),
    })
    return acc
  }, [])

  return (
    <div className={styles.cardFull}>
      <div className={styles.card}>
          <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>{t('paymentHistory.title')}</div>
          </div>
          <div className={styles.cardBody}>
              <div className={styles.paymentList}>
                  {subscriptionsArr.map((payment, idx) => (
                      <div key={idx} className={styles.paymentItem}>
                          <div>
                              <p className={styles.paymentPlan}>{payment.plan}</p>
                              <p className={styles.paymentPeriod}>{payment.period}</p>
                          </div>
                          <div className={styles.paymentRight}>
                              <p className={styles.paymentAmount}>{payment.amount}</p>
                              <div className={styles.paymentStatus}>{payment.status}</div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  )
}

const getSubscriptionStatus = ( sub: TSubscription | null, subscription_statuses: TSubscriptionStatuses ): string => {

  if ( sub?.paid === false ) return 'Не оплачено'

  if ( sub?.subs_status ) return subscription_statuses[sub?.subs_status || '1']['ru']

  return 'Закончена'
}