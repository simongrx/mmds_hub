import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: string;
}

// Tabla genérica reutilizable.
export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty = "No hay registros.",
}: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-mist/60">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 font-heading font-semibold text-ink/70 ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-ink/50"
              >
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-black/5 last:border-0 hover:bg-mist/40"
              >
                {columns.map((col, i) => (
                  <td key={i} className={`px-4 py-3 ${col.className ?? ""}`}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
