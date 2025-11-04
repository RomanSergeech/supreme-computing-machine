'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './CategoryTree.module.css';

/**
 * Recursive CategoryTree component.
 * Props:
 *  - categories: array
 *  - onSelect(node)
 */

function Node({ node, onSelect }) {
  const t = useTranslations('categories');
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.node}>
      <div className={styles.nodeHeader}>
        <button
          className={styles.toggle}
          onClick={() => setOpen((s)=>!s)}
          aria-label={open ? t('collapse') : t('expand')}
        >
          {node.children && node.children.length ? (open ? '▾' : '▸') : '•'}
        </button>
        <div className={styles.nodeMain} onClick={() => onSelect?.(node)}>
          <span className={styles.name}>{node.name}</span>
          <span className={styles.badge} style={{ background: node.color }} />
          <span className={styles.prod}>{t(`productivity.${node.productivity}`)}</span>
        </div>
      </div>
      {open && node.children && node.children.length > 0 && (
        <div className={styles.children}>
          {node.children.map((c) => <Node key={c.id} node={c} onSelect={onSelect} />)}
        </div>
      )}
    </div>
  );
}

export default function CategoryTree({ categories = [], onSelect }) {
  return (
    <div className={styles.tree}>
      {categories.map((c) => <Node key={c.id} node={c} onSelect={onSelect} />)}
    </div>
  );
}
