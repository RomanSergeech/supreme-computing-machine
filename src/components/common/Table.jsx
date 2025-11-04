'use client';

import styles from './Table.module.css';

export default function Table({ columns, data, renderCell, renderRow }) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => {
            const rowContent = (
              <>
                {columns.map((col) => (
                  <td key={col.key} data-label={col.label}>
                    {renderCell ? renderCell(col.key, row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </>
            );

            return renderRow ? (
              renderRow(row, rowIdx, rowContent)
            ) : (
              <tr key={rowIdx}>{rowContent}</tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
