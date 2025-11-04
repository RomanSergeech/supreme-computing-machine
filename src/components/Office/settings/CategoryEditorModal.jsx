'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import CategoryTree from './CategoryTree';
import styles from './CategoryEditorModal.module.css';

/**
 * Simple category editor modal:
 * - shows CategoryTree (click node to edit)
 * - sidebar for edit/add/delete selected node
 */

export default function CategoryEditorModal({ categories = [], onClose, onUpdateCategory, onAddCategory, onDeleteCategory }) {
  const t = useTranslations('categories');

  const [selected, setSelected] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#cccccc');
  const [productivity, setProductivity] = useState('neutral');

  const handleSelect = (node) => {
    setSelected(node);
    setName(node.name || '');
    setColor(node.color || '#cccccc');
    setProductivity(node.productivity || 'neutral');
  };

  const handleSave = () => {
    if (!selected) return;
    onUpdateCategory?.({ id: selected.id, name, color, productivity });
    setSelected(null);
  };

  const handleAddChild = () => {
    const node = { id: `c_${Date.now()}`, name: name || 'New', color, productivity, children: [] };
    onAddCategory?.(selected?.id || null, node);
    setName('');
  };

  const handleDelete = () => {
    if (!selected) return;
    if (!confirm(t('deleteCategoryConfirm'))) return;
    onDeleteCategory?.(selected.id);
    setSelected(null);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{t('categoriesTitle')}</h3>
          <button className={styles.close} onClick={onClose} aria-label={t('close')}>✕</button>
        </div>

        <div className={styles.content}>
          <div className={styles.treeCol}>
            <CategoryTree categories={categories} onSelect={handleSelect} />
          </div>

          <div className={styles.editCol}>
            <label className={styles.label}>{t('name')}</label>
            <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />

            <label className={styles.label}>{t('color')}</label>
            <input type="color" className={styles.input} value={color} onChange={(e) => setColor(e.target.value)} />

            <label className={styles.label}>{t('productivityTitle')}</label>
            <select className={styles.input} value={productivity} onChange={(e)=>setProductivity(e.target.value)}>
              <option value="distracting">{t('productivity.distracting')}</option>
              <option value="neutral">{t('productivity.neutral')}</option>
              <option value="productive">{t('productivity.productive')}</option>
            </select>

            <div className={styles.actions}>
              <button className={styles.btn} onClick={handleSave} disabled={!selected}>{t('save')}</button>
              <button className={styles.btn} onClick={handleAddChild}>{t('addChild')}</button>
              <button className={styles.danger} onClick={handleDelete} disabled={!selected}>{t('delete')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
