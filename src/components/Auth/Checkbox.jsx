import styles from './Checkbox.module.css';

export default function Checkbox({ name, label }) {
  return (
      <label className={styles.checkboxLabel}>
        <input type="checkbox" name={name} />
        {label}
      </label>
  );
}
