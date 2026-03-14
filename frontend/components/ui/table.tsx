import React from 'react';
import clsx from 'clsx';

interface TableProps {
  columns: { key: string; label: string; render?: (value: any) => React.ReactNode }[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getColor = (status: string) => {
    if (status === 'active') return 'bg-green-500';
    if (status === 'inactive') return 'bg-red-500';
    if (status === 'pending') return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <span className={clsx('inline-flex items-center px-2 py-1 text-xs font-medium rounded-full', getColor(status))}>
      {status}
    </span>
  );
};

const Table: React.FC<TableProps> = ({ columns, data, loading = false, emptyMessage }) => {
  if (loading && data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0 && !loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        {emptyMessage || 'No data available'}
      </div>
    );
  }

  return (
    <table className="w-full border-collapse border border-white/10">
      <thead>
        <tr className="bg-white/5">
          {columns.map((column, index) => (
            <th key={index} className="border border-white/10 px-4 py-2 text-left">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-white/5">
            {columns.map((column, colIndex) => (
              <td key={colIndex} className="border border-white/10 px-4 py-2">
                {column.render ? column.render(row[column.key]) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;