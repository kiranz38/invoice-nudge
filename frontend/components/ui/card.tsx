import React from 'react';

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  change?: { value: number; type: 'up' | 'down' };
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, change }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col">
      <div className="mb-2 flex items-center">
        {icon}
        <span className="ml-2 text-sm font-medium text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <div className={`mt-2 text-sm flex items-center ${change.type === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          <span>{change.type === 'up' ? '↑' : '↓'}</span>
          <span className="ml-1">{change.value}%</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;