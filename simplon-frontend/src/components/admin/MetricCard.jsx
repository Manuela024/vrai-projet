// import React from 'react';

// const MetricCard = ({ title, value, trend, icon, color = 'blue' }) => {
//   const colors = {
//     blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
//     green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400', 
//     red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
//     orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
//   };

//   return (
//     <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 shadow-sm">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
//             {title}
//           </p>
//           <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
//             {value}
//           </p>
//           {trend && (
//             <p className={`text-sm mt-1 ${
//               typeof trend === 'string' && trend.includes('+') 
//                 ? 'text-green-600 dark:text-green-400' 
//                 : 'text-red-600 dark:text-red-400'
//             }`}>
//               {trend}
//             </p>
//           )}
//         </div>
//         <div className={`p-3 rounded-lg ${colors[color]}`}>
//           <span className="material-symbols-outlined text-2xl">
//             {icon}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MetricCard;

import React from 'react';

const MetricCard = ({ title, value, trend, icon, color, description }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      icon: 'text-blue-500',
      trendBg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      icon: 'text-green-500',
      trendBg: 'bg-green-100 dark:bg-green-900/30'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-600 dark:text-orange-400',
      icon: 'text-orange-500',
      trendBg: 'bg-orange-100 dark:bg-orange-900/30'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      icon: 'text-red-500',
      trendBg: 'bg-red-100 dark:bg-red-900/30'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      icon: 'text-purple-500',
      trendBg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      text: 'text-cyan-600 dark:text-cyan-400',
      icon: 'text-cyan-500',
      trendBg: 'bg-cyan-100 dark:bg-cyan-900/30'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-[#001F3F] dark:text-white mb-2">
            {value}
          </p>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors.trendBg} ${colors.text}`}>
            {trend}
          </div>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {description}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors.bg}`}>
          <span className={`material-symbols-outlined text-xl ${colors.icon}`}>
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;