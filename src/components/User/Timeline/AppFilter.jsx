'use client';

import styles from './AppFilter.module.css';

export default function AppFilter({
  selected = [],
  onChange,
  options = [],
  label = '',
}) {
  const toggleOption = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={styles.container}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.options}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.option} ${
              selected.includes(option.value) ? styles.active : ''
            }`}
            onClick={() => toggleOption(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
