import styles from './EmployeeInfo.module.css';

export default function EmployeeInfo({ employee }) {
  return (
    <div className={styles.wrapper}>
      <img src={employee.avatar} alt="avatar" className={styles.avatar} />
      <div className={styles.textBlock}>
        <div className={styles.name}>{employee.name}</div>
        <div className={styles.role}>{employee.role}</div>
      </div>
    </div>
  );
}
