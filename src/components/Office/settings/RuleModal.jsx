'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './RuleModal.module.css';

/**
 * RuleModal: create/edit a rule.
 * Props:
 *  - initial: existing rule or null
 *  - categories: array
 *  - onSave(rule)
 *  - onDelete(id)
 *  - onClose()
 *  - onOpenCategoryEditor() -> open category editor modal
 */

export default function RuleModal({ initial = null, categories = [], onSave, onDelete, onClose, onOpenCategoryEditor }) {
  const t = useTranslations('categories');

  const [name, setName] = useState(initial?.name || '');
  const [pattern, setPattern] = useState(initial?.pattern || '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId || '');
  const [productivity, setProductivity] = useState(initial?.productivity || 'neutral');
  const [sourceType, setSourceType] = useState(initial?.sourceType || 'site');

  useEffect(() => {
    setName(initial?.name || '');
    setPattern(initial?.pattern || '');
    setCategoryId(initial?.categoryId || '');
    setProductivity(initial?.productivity || 'neutral');
    setSourceType(initial?.sourceType || 'site');
  }, [initial]);

  const handleSave = () => {
    if (!name.trim() || !pattern.trim()) {
      alert(t('fillNameAndPattern'));
      return;
    }
    onSave?.({
      id: initial?.id,
      name,
      pattern,
      categoryId,
      productivity,
      sourceType,
    });
  };

  const handleDelete = () => {
    if (!initial?.id) { onClose?.(); return; }
    if (!confirm(t('deleteRuleConfirm'))) return;
    onDelete?.(initial.id);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{initial?.id ? t('editRule') : t('addRuleModalTitle')}</h3>
          <div className={styles.headerActions}>
            <button className={styles.small} onClick={onOpenCategoryEditor}>{t('editCategories')}</button>
            <button className={styles.close} onClick={onClose} aria-label={t('close')}>✕</button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.row}>
            <label className={styles.label}>{t('name')}</label>
            <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className={styles.row}>
            <label className={styles.label}>{t('pattern')}</label>
            <input className={styles.input} value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder={t('patternPlaceholder')} />
          </div>

          <div className={styles.row}>
            <label className={styles.label}>{t('type')}</label>
            <select className={styles.select} value={sourceType} onChange={(e) => setSourceType(e.target.value)}>
              <option value="site">{t('site')}</option>
              <option value="program">{t('program')}</option>
            </select>
          </div>

          <div className={styles.row}>
            <label className={styles.label}>{t('category')}</label>
            <select className={styles.select} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">{t('none')}</option>
              {flattenCategories(categories).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <label className={styles.label}>{t('productivityTitle')}</label>
            <select className={styles.select} value={productivity} onChange={(e) => setProductivity(e.target.value)}>
              <option value="distracting">{t('productivity.distracting')}</option>
              <option value="neutral">{t('productivity.neutral')}</option>
              <option value="productive">{t('productivity.productive')}</option>
            </select>
          </div>
        </div>

        <div className={styles.footer}>
          <div>
            <button className={styles.danger} onClick={handleDelete}>{initial?.id ? t('delete') : t('cancel')}</button>
          </div>
          <div>
            <button className={`${styles.btn} ${styles.primary}`} onClick={handleSave}>{t('save')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// helper to flatten categories tree
function flattenCategories(list = []) {
  const out = [];
  function walk(nodes) {
    nodes.forEach((n) => {
      out.push({ id: n.id, name: n.name });
      if (n.children && n.children.length) walk(n.children);
    });
  }
  walk(list);
  return out;
}
