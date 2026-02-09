import React from 'react';
import { AdhocCondition } from '../services/reportRunnerService';
import { Plus, Trash2, Filter } from 'lucide-react';

interface AdhocParameterBuilderProps {
  conditions: AdhocCondition[];
  availableFields: string[];
  onChange: (conditions: AdhocCondition[]) => void;
  isDark?: boolean;
}

const AND_OR_OPTIONS = ['AND', 'OR', 'NOT'];
const CONDITION_OPTIONS = ['=', '!=', '<', '>', '<=', '>=', 'LIKE', 'BETWEEN', 'IN'];

export const AdhocParameterBuilder: React.FC<AdhocParameterBuilderProps> = ({
  conditions,
  availableFields,
  onChange,
  isDark = false
}) => {
  const handleAddCondition = () => {
    const newCondition: AdhocCondition = {
      andor: 'AND',
      fields_name: '',
      condition: '=',
      value: ''
    };
    onChange([...conditions, newCondition]);
  };

  const handleRemoveCondition = (index: number) => {
    if (conditions.length > 1) {
      const newConditions = conditions.filter((_, i) => i !== index);
      onChange(newConditions);
    }
  };

  const handleUpdateCondition = (index: number, field: keyof AdhocCondition, value: string) => {
    const newConditions = conditions.map((cond, i) => 
      i === index ? { ...cond, [field]: value } : cond
    );
    onChange(newConditions);
  };

  return (
    <div className={`rounded-lg p-4 border ${
      isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center ${
            isDark ? 'bg-red-900/30' : 'bg-red-100'
          }`}>
            <Filter className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <div>
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Adhoc Parameters
            </h4>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
              Add filter conditions to refine your report data
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddCondition}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          Add Condition
        </button>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto rounded-lg border ${isDark ? 'border-slate-700' : 'border-gray-200'}">
        <table className="w-full">
          <thead className={isDark ? 'bg-slate-700' : 'bg-gray-50'}>
            <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                AND/OR
              </th>
              <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Field Name
              </th>
              <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Condition
              </th>
              <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Value
              </th>
              <th className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-200'}`}>
            {conditions.map((condition, index) => (
              <tr key={index} className={isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}>
                {/* AND/OR Dropdown */}
                <td className="px-4 py-3">
                  <select
                    value={condition.andor}
                    onChange={(e) => handleUpdateCondition(index, 'andor', e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border text-sm font-medium ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    {AND_OR_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>

                {/* Field Name Dropdown/Input */}
                <td className="px-4 py-3">
                  {availableFields.length > 0 ? (
                    <select
                      value={condition.fields_name}
                      onChange={(e) => handleUpdateCondition(index, 'fields_name', e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border text-sm ${
                        isDark
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    >
                      <option value="">Select field...</option>
                      {availableFields.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={condition.fields_name}
                      onChange={(e) => handleUpdateCondition(index, 'fields_name', e.target.value)}
                      placeholder="Field name..."
                      className={`w-full px-3 py-2 rounded-md border text-sm ${
                        isDark
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 placeholder-slate-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                  )}
                </td>

                {/* Condition Dropdown */}
                <td className="px-4 py-3">
                  <select
                    value={condition.condition}
                    onChange={(e) => handleUpdateCondition(index, 'condition', e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border text-sm ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    {CONDITION_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>

                {/* Value Input */}
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => handleUpdateCondition(index, 'value', e.target.value)}
                    placeholder="Value..."
                    className={`w-full px-3 py-2 rounded-md border text-sm ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 placeholder-slate-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(index)}
                    disabled={conditions.length === 1}
                    className={`p-2 rounded-md transition-colors ${
                      conditions.length === 1
                        ? isDark
                          ? 'text-slate-600 cursor-not-allowed'
                          : 'text-gray-300 cursor-not-allowed'
                        : isDark
                        ? 'text-red-400 hover:bg-red-900/20'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
