'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './AddCardModal.module.css';

export default function AddCardModal({ onClose }) {
  const t = useTranslations('profileSubscription.addcardmodal');

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = t('errors.cardNumber');
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      newErrors.expiry = t('errors.expiry');
    }
    if (!/^\d{3}$/.test(cvc)) {
      newErrors.cvc = t('errors.cvc');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log({
        cardNumber,
        expiry,
        cvc,
        isDefault,
      });
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{t('title')}</h3>

        <div className={styles.field}>
          <label>{t('cardNumber')}</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, '');
              value = value.slice(0, 16);
              const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
              setCardNumber(formatted);
            }}
            placeholder="1234 5678 9012 3456"
          />
          {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
        </div>

        <div className={styles.inlineFields}>
          <div className={styles.field}>
            <label>{t('expiry')}</label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              maxLength={5}
              placeholder="MM/YY"
            />
            {errors.expiry && <span className={styles.error}>{errors.expiry}</span>}
          </div>
          <div className={styles.field}>
            <label>{t('cvc')}</label>
            <input
              type="password"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
              maxLength={3}
              placeholder="123"
            />
            {errors.cvc && <span className={styles.error}>{errors.cvc}</span>}
          </div>
        </div>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={isDefault}
            onChange={() => setIsDefault(!isDefault)}
          />
          {t('setAsPrimary')}
        </label>

        <div className={styles.actions}>
          <button className={styles.secondary} onClick={onClose}>{t('cancel')}</button>
          <button className={styles.primary} onClick={handleSubmit}>{t('save')}</button>
        </div>
      </div>
    </div>
  );
}
