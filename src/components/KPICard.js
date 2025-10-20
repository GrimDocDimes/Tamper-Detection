import React from 'react';
import { useNavigate } from 'react-router-dom';

const KPICard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend, onClick, navigateTo }) => {
  const navigate = useNavigate();
  
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    gray: 'bg-gray-50 text-gray-600'
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (navigateTo) {
      navigate(navigateTo);
    }
  };

  const isClickable = onClick || navigateTo;

  return (
    <div 
      className={`bg-white overflow-hidden shadow rounded-lg ${
        isClickable ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-gray-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {trend && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.direction === 'up' ? '↗' : '↘'} {trend.value}
                  </div>
                )}
              </dd>
              {subtitle && (
                <dd className="text-sm text-gray-600 mt-1">{subtitle}</dd>
              )}
            </dl>
          </div>
          {isClickable && (
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
