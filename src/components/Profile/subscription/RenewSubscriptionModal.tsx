'use client';

import styles from './SubscriptionModal.module.css';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import AddCardModal from './AddCardModal';
import { useStaticStore } from '@/shared/store/static.store'
import { TSubscription } from '@/shared/types/user.types'
import { useUserStore } from '@/shared/store/user.store'
import { useRouter } from 'next/navigation'

interface RenewSubscriptionModalProps {
  subscription: TSubscription
  onClose: () => void
}
export default function RenewSubscriptionModal({ subscription, onClose }: RenewSubscriptionModalProps) {

  const tariffs = useStaticStore(state => state.tariffs)
  const payment_services = useStaticStore(state => state.payment_services)

  const [paymentMethod, setPaymentMethod] = useState(1);
  const [showAddCard, setShowAddCard] = useState(false);

  const router = useRouter();

  const t = useTranslations('profileSubscription.renewsubscriptionmodal');

  const tariff = tariffs[subscription?.tariff || '0']

  const payHandler = () => {
    useUserStore.getState().createPayment({
      sum: tariffs[subscription?.tariff]?.price,
      currency: tariffs[subscription?.tariff]?.currency,
      payment_service: ''+paymentMethod,
      subs_id: subscription.subs_id
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

        <p className={styles.price}>{tariff?.price} {tariff?.currency}</p>

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
          {/* <button className={styles.secondary} onClick={() => setShowAddCard(true)}>{t('addCard')}</button> */}
          <button onClick={payHandler} className={styles.primary}>{t('pay')}</button>
        </div>
      </div>
      {showAddCard && <AddCardModal onClose={() => setShowAddCard(false)} />}
    </div>
  );
}
