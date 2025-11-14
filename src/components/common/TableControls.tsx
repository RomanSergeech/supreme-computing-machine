'use client';

import { useState } from 'react';
import styles from './TableControls.module.css';
import { useTranslations } from 'next-intl';


interface Props {
  search?: any
  filters?: any[]
  showFilters?: any
  showExport?: any
  onApplyFilters?: any
  onResetFilters?: any
}
export default function TableControls({
  search,
  showFilters = false,
  showExport = false,
  filters = [],
  onApplyFilters,
  onResetFilters,
}: Props) {
  const t = useTranslations('tableControls');
  const hasSearch = search !== null && typeof search === 'object';
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className={styles.controls}>
      {hasSearch && (
        <div className={`${styles.searchContainer} ${styles.rowOnMobile}`}>
          <div className={styles.searchInputWrapper}>
            <svg
              className={`${styles.searchIcon} lucide lucide-search`}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input
              type="text"
              placeholder={search.placeholder || 'Поиск...'}
              value={search.value || ''}
              onChange={(e) => search.onChange?.(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      )}

      <div className={styles.rowOnMobile}>
        {showFilters && (
          <div className={styles.filterDropdownWrapper}>
            <button
              className={styles.filterBtn}
              onClick={() => setFiltersOpen((prev) => !prev)}
            >
              <svg
                className="lucide lucide-filter"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              {t('filters')}
            </button>
          </div>
        )}

        {showExport && (
          <button className={styles.exportBtn}>
            <svg
              className="lucide lucide-download"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t('export')}
          </button>
        )}
      </div>

      {filtersOpen && (
        <div className={styles.filtersMenu}>
          {filters.map((filter) => (
            <div key={filter.key} className={styles.filterField}>
              <label>{filter.label}</label>
              {filter.type === 'select' ? (
                <select
                  value={filter.value || ''}
                  onChange={(e) => filter.onChange?.(e.target.value)}
                >
                  <option value="">—</option>
                  {filter.options?.map((opt: { value: string, label: string }) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={filter.type}
                  value={filter.value || ''}
                  onChange={(e) => filter.onChange?.(e.target.value)}
                />
              )}
            </div>
          ))}

          <div className={styles.filterActions}>
            <button className={styles.applyBtn} onClick={onApplyFilters}>
              {t('apply')}
            </button>
            <button className={styles.resetBtn} onClick={onResetFilters}>
              {t('reset')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
