'use client';

import styles from './SubscriptionModal.module.css';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useUserStore } from '@/shared/store/user.store'
import { useStaticStore } from '@/shared/store/static.store'
import { useRouter } from 'next/navigation'

interface ChangePlanModalProps {
  onClose: () => void
}
export default function ChangePlanModal({ onClose }: ChangePlanModalProps) {

  const tariffs = useStaticStore(state => state.tariffs)
  const payment_services = useStaticStore(state => state.payment_services)

  const t = useTranslations('profileSubscription.changeplanmodal');

  const router = useRouter();

  const plans = [
    { id: 'corporate', label: 'Корпоративный', price: 50000 },
    { id: 'professional', label: 'Профессиональный', price: 25000 },
    { id: 'basic', label: 'Базовый', price: 10000 },
  ];

  // const linkedCards = [];

  const [selectedPlan, setSelectedPlan] = useState<string>('1');
  const [paymentMethod, setPaymentMethod] = useState(1);
  // const [showAddCard, setShowAddCard] = useState(false);

  const payHandler = () => {
    useUserStore.getState().createSubscription({
      tariff: selectedPlan
    }, {
      sum: tariffs[selectedPlan].price,
      currency: tariffs[selectedPlan].currency,
      payment_service: ''+paymentMethod
    })
      .then(link => {
        console.log(link);
        if ( link ) router.push(link)
        onClose()
      })
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{t('title')}</h3>

        <select
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          className={styles.select}
        >
          {Object.values(tariffs).map((tariff, i) => (
            <option key={i+1} value={i+1}>
              {tariff.ru} — {tariff.price} {tariff.currency}
            </option>
          ))}
        </select>

        <h4>{t('paymentMethods')}</h4>
        {/* {linkedCards.map((card) => (
          <div
            key={card.id}
            className={`${styles.method} ${paymentMethod === card.id ? styles.active : ''}`}
            onClick={() => setPaymentMethod(card.id)}
          >
            {card.bank} — {card.masked}
          </div>
        ))} */}
        {Object.values(payment_services).map((el, i) => (
          <div
            key={i}
            className={`${styles.method} ${paymentMethod === i+1 ? styles.active : ''}`}
            onClick={() => setPaymentMethod(i+1)}
          >
            {el['ru']}
          </div>
        ))}

        <div className={styles.actions}>
          {/* <button className={styles.secondary} onClick={() => setShowAddCard(true)}>
            {t('addCard')}
          </button> */}
          <button
            className={styles.primary}
            onClick={payHandler}
          >
            {t('pay')}
          </button>
        </div>
      </div>
      {/* {showAddCard && <AddCardModal onClose={() => setShowAddCard(false)} />} */}
    </div>
  );
}
