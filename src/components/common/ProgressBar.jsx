import styles from './ProgressBar.module.css';

export default function ProgressBar({ percent = 0 }) {
  return (
    <div className={styles.progressWrapper}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span>{percent}%</span>
    </div>
  );
}
