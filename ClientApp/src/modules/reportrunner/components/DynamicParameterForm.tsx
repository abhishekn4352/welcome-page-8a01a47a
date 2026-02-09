import React from 'react';
import { Settings, Info, PencilIcon } from 'lucide-react';

interface DynamicParameterFormProps {
  parameters: string[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  isDark?: boolean;
}

export const DynamicParameterForm: React.FC<DynamicParameterFormProps> = ({
  parameters,
  values,
  onChange,
  isDark = false
}) => {
  const handleChange = (paramName: string, value: string) => {
    onChange({
      ...values,
      [paramName]: value
    });
  };

  const formatParamName = (param: string): string => {
    return param
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!parameters || parameters.length === 0) {
    return (
      <div className={`rounded-lg p-4 border ${
        isDark 
          ? 'bg-slate-800/50 border-slate-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-8 h-8 rounded flex items-center justify-center ${
            isDark ? 'bg-green-900/30' : 'bg-green-100'
          }`}>
            <Settings className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Standard Parameters
          </h4>
        </div>
        <div className={`flex flex-col items-center justify-center py-8 rounded-lg ${
          isDark ? 'bg-slate-700/30' : 'bg-gray-50'
        }`}>
          <Info className={`w-8 h-8 mb-3 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            No standard parameters defined for this report
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-4 border ${
      isDark 
        ? 'bg-slate-800/50 border-slate-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 rounded flex items-center justify-center ${
          isDark ? 'bg-green-900/30' : 'bg-green-100'
        }`}>
          <Settings className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
        </div>
        <div>
          <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Standard Parameters
          </h4>
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
            Enter values for the standard parameters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {parameters.map((param) => (
          <div key={param} className="space-y-2">
            <label className={`block text-sm font-medium ${
              isDark ? 'text-slate-300' : 'text-gray-700'
            }`}>
              {formatParamName(param)}
            </label>
            <div className="relative">
              <input
                type="text"
                value={values[param] || ''}
                onChange={(e) => handleChange(param, e.target.value)}
                placeholder={`Enter ${formatParamName(param).toLowerCase()}...`}
                className={`w-full px-4 py-2.5 pr-10 rounded-md border text-sm transition-colors ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 placeholder-slate-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? 'text-slate-500' : 'text-gray-400'
              }`}>
                <PencilIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
