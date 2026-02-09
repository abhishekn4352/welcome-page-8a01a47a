import React from 'react';
import { DateUtils, DateRange, DateRangeType } from '@/utils/dateUtils';
import { Calendar, X } from 'lucide-react';

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onChange: (dateRange: DateRange) => void;
  isDark?: boolean;
}

const quickDateOptions: DateRangeType[] = [
  'Today',
  'This Week',
  'Last Week',
  'This Month',
  'Last Month',
  'This Year',
  'Last Year'
];

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dateRange,
  onChange,
  isDark = false
}) => {
  const handleQuickSelect = (type: DateRangeType) => {
    const newRange = DateUtils.getDateRange(type);
    onChange(newRange);
  };

  const handleClear = () => {
    onChange({ from: null, to: null, type: '' });
  };

  const handleCustomFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    onChange({
      from: newDate,
      to: dateRange.to,
      type: 'Custom'
    });
  };

  const handleCustomToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    onChange({
      from: dateRange.from,
      to: newDate,
      type: 'Custom'
    });
  };

  return (
    <div className={`rounded-lg p-4 border ${
      isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 rounded flex items-center justify-center ${
          isDark ? 'bg-blue-900/30' : 'bg-blue-100'
        }`}>
          <Calendar className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        <div>
          <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Date Range
          </h4>
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
            Select a date range for the report
          </p>
        </div>
      </div>

      {/* Quick Date Selection */}
      <div className="space-y-3 mb-6">
        <label className={`block text-sm font-medium ${
          isDark ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Quick Date Selection
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickDateOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleQuickSelect(option)}
              className={`px-3 py-2.5 text-xs font-medium rounded-md transition-all duration-200 border ${
                dateRange.type === option
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : isDark
                  ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className={`px-3 py-2.5 text-xs font-medium rounded-md transition-all duration-200 border ${
              isDark
                ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <X className="w-4 h-4 inline mr-1" />
            Clear
          </button>
        </div>
      </div>

      {/* Custom Date Range */}
      <div className={`space-y-4 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        <label className={`block text-sm font-medium ${
          isDark ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Custom Date Range
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={`block text-xs font-medium ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`}>
              From Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateRange.from ? DateUtils.formatForSQL(dateRange.from) : ''}
                onChange={handleCustomFromChange}
                className={`w-full px-4 py-2.5 pr-10 rounded-md border text-sm transition-colors ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 placeholder-slate-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              <Calendar className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                isDark ? 'text-slate-500' : 'text-gray-400'
              }`} />
            </div>
          </div>
          <div className="space-y-2">
            <label className={`block text-xs font-medium ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`}>
              To Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateRange.to ? DateUtils.formatForSQL(dateRange.to) : ''}
                onChange={handleCustomToChange}
                className={`w-full px-4 py-2.5 pr-10 rounded-md border text-sm transition-colors ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 placeholder-slate-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              <Calendar className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                isDark ? 'text-slate-500' : 'text-gray-400'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Range Display */}
      {dateRange.from && dateRange.to && (
        <div className={`mt-6 p-4 rounded-lg border ${
          isDark 
            ? 'bg-blue-900/20 border-blue-800 text-blue-300' 
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          <p className="text-sm font-medium">Selected Range:</p>
          <p className="text-sm mt-1">
            {DateUtils.formatForDisplay(dateRange.from)} - {DateUtils.formatForDisplay(dateRange.to)}
          </p>
        </div>
      )}
    </div>
  );
};
