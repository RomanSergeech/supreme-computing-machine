'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import RuleModal from './RuleModal';
import CategoryEditorModal from './CategoryEditorModal';
import styles from './Categorization.module.css';

/**
 * Категоризация: показывает 2 аккордеона (Sites, Programs) с правилами,
 * кнопка Add rule открывает RuleModal (create), клик по правилу — edit modal.
 */

const initialCategories = [
  { id: 'work', name: 'Work', color: '#10b981', productivity: 'productive', children: [] },
  { id: 'media', name: 'Media', color: '#f97316', productivity: 'neutral', children: [] },
];

const initialRules = [
  { id: 'r1', name: 'YouTube', pattern: 'youtube.com', categoryId: 'media', productivity: 'distracting', sourceType: 'site' },
  { id: 'r2', name: 'GitHub', pattern: 'github.com', categoryId: 'work', productivity: 'productive', sourceType: 'site' },
  { id: 'r3', name: 'VS Code', pattern: 'Code', categoryId: 'work', productivity: 'productive', sourceType: 'program' },
];

export default function Categorization() {
  const t = useTranslations('categories');

  const [categories, setCategories] = useState(initialCategories);
  const [rules, setRules] = useState(initialRules);

  const [openSites, setOpenSites] = useState(true);
  const [openPrograms, setOpenPrograms] = useState(false);

  const [search, setSearch] = useState('');
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const [categoryEditorOpen, setCategoryEditorOpen] = useState(false);

  // helpers for category operations (simple)
  const findCategory = (id) => {
    const stack = [...categories];
    while (stack.length) {
      const n = stack.shift();
      if (n.id === id) return n;
      if (n.children && n.children.length) stack.push(...n.children);
    }
    return null;
  };

  const updateCategory = (updated) => {
    const walk = (list) => list.map((n) => {
      if (n.id === updated.id) return { ...n, ...updated };
      if (n.children) return { ...n, children: walk(n.children) };
      return n;
    });
    setCategories((prev) => walk(prev));
  };

  const addCategory = (parentId, node) => {
    node.id = node.id || `c_${Date.now()}`;
    if (!parentId) {
      setCategories((prev) => [...prev, node]);
      return;
    }
    const walk = (list) => list.map((n) => {
      if (n.id === parentId) return { ...n, children: [...(n.children||[]), node] };
      if (n.children) return { ...n, children: walk(n.children) };
      return n;
    });
    setCategories((prev) => walk(prev));
  };

  const deleteCategory = (id) => {
    const walk = (list) => list
      .filter((n) => n.id !== id)
      .map((n) => n.children ? { ...n, children: walk(n.children) } : n);
    setCategories((prev) => walk(prev));
  };

  const saveRule = (rule) => {
    if (rule.id) {
      setRules((prev) => prev.map((r) => r.id === rule.id ? { ...rule } : r));
    } else {
      rule.id = `r_${Date.now()}`;
      setRules((prev) => [rule, ...prev]);
    }
    setRuleModalOpen(false);
    setEditingRule(null);
  };

  const removeRule = (id) => {
    if (!confirm(t('deleteRuleConfirm'))) return;
    setRules((prev) => prev.filter((r) => r.id !== id));
    setRuleModalOpen(false);
    setEditingRule(null);
  };

  // filtered lists
  const sitesRules = useMemo(() => rules.filter((r) => r.sourceType === 'site'
    && ((r.name || '').toLowerCase().includes(search.toLowerCase()) || (r.pattern || '').toLowerCase().includes(search.toLowerCase()))
  ), [rules, search]);

  const programsRules = useMemo(() => rules.filter((r) => r.sourceType === 'program'
    && ((r.name || '').toLowerCase().includes(search.toLowerCase()) || (r.pattern || '').toLowerCase().includes(search.toLowerCase()))
  ), [rules, search]);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h3>{t('title')}</h3>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        <div className={styles.controls}>
          <input
            className={styles.search}
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t('searchPlaceholder')}
          />
          <button className={styles.addBtn} onClick={() => { setEditingRule(null); setRuleModalOpen(true); }}>{t('addRule')}</button>
        </div>
      </div>

      <div className={styles.rulesArea}>
        {/* Sites accordion */}
        <div className={styles.accordion}>
          <button
            className={styles.accordionHeader}
            onClick={() => setOpenSites((s) => !s)}
            aria-expanded={openSites}
            aria-controls="sites-accordion"
          >
            <span>{t('sites')}</span>
            <span className={styles.count}>{sitesRules.length}</span>
            <span className={styles.chev}>{openSites ? '▾' : '▸'}</span>
          </button>

          {openSites && (
            <div className={styles.accordionBody} id="sites-accordion">
              {sitesRules.length === 0 ? <div className={styles.empty}>{t('noSiteRules')}</div> : sitesRules.map((r) => (
                <div
                  key={r.id}
                  className={styles.ruleRow}
                  onClick={() => { setEditingRule(r); setRuleModalOpen(true); }}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.ruleInfo}>
                    <div className={styles.ruleName}>{r.name}</div>
                    <div className={styles.rulePattern}>{r.pattern}</div>
                  </div>
                  <div className={styles.ruleMeta}>
                    <div className={styles.prod}>{t(`productivity.${r.productivity}`)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Programs accordion */}
        <div className={styles.accordion}>
          <button
            className={styles.accordionHeader}
            onClick={() => setOpenPrograms((s) => !s)}
            aria-expanded={openPrograms}
            aria-controls="programs-accordion"
          >
            <span>{t('programs')}</span>
            <span className={styles.count}>{programsRules.length}</span>
            <span className={styles.chev}>{openPrograms ? '▾' : '▸'}</span>
          </button>

          {openPrograms && (
            <div className={styles.accordionBody} id="programs-accordion">
              {programsRules.length === 0 ? <div className={styles.empty}>{t('noProgramRules')}</div> : programsRules.map((r) => (
                <div
                  key={r.id}
                  className={styles.ruleRow}
                  onClick={() => { setEditingRule(r); setRuleModalOpen(true); }}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.ruleInfo}>
                    <div className={styles.ruleName}>{r.name}</div>
                    <div className={styles.rulePattern}>{r.pattern}</div>
                  </div>
                  <div className={styles.ruleMeta}>
                    <div className={styles.prod}>{t(`productivity.${r.productivity}`)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {ruleModalOpen && (
        <RuleModal
          initial={editingRule}
          categories={categories}
          onSave={saveRule}
          onDelete={removeRule}
          onClose={() => { setRuleModalOpen(false); setEditingRule(null); }}
          onOpenCategoryEditor={() => setCategoryEditorOpen(true)}
        />
      )}

      {categoryEditorOpen && (
        <CategoryEditorModal
          categories={categories}
          onClose={() => setCategoryEditorOpen(false)}
          onUpdateCategory={updateCategory}
          onAddCategory={addCategory}
          onDeleteCategory={(id) => {
            if (!confirm(t('deleteCategoryConfirm'))) return;
            deleteCategory(id);
          }}
        />
      )}
    </div>
  );
}
