'use client';

import { ReactElement } from 'react'
import styles from './Table.module.css';


interface Props {
  columns: { key: string, label: string | ReactElement }[]
  data: any[] | undefined
  renderCell: (key: string, value: string|number|React.ReactElement, row: any) => string|number|React.ReactElement
  renderRow?: any
}
export default function Table({ columns, data, renderCell, renderRow }: Props) {
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
          {data?.map((row, rowIdx) => {
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
