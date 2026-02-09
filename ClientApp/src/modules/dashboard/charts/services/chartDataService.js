/**
 * Chart Data Service - Backend Integration
 * Handles fetching chart data from the backend API
 */

import { dashboardService } from '../../services/dashboard.service';

export const chartDataService = {
  /**
   * Fetch chart data from backend
   * @param {Object} config - Chart configuration
   * @param {string} config.table - Database table name
   * @param {string} config.chartType - Type of chart
   * @param {string} config.xAxis - X-axis field
   * @param {string|string[]} config.yAxis - Y-axis field(s)
   * @param {number} config.connection - Database connection ID
   * @param {Object} filters - Applied filters
   * @returns {Promise<Array>} Formatted chart data
   */
  async fetchChartData(config, filters = {}) {
    try {
      if (!config.table || !config.chartType || !config.xAxis) {
        console.warn('[ChartDataService] Missing required config properties', config);
        return [];
      }

      const yAxis = Array.isArray(config.yAxis) 
        ? config.yAxis.join(',') 
        : config.yAxis || 'value';

      let filterStr = '';
      if (Object.keys(filters).length > 0) {
        const filterObj = Object.entries(filters)
          .filter(([_, value]) => value !== undefined && value !== null && value !== '')
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        
        if (Object.keys(filterObj).length > 0) {
          filterStr = JSON.stringify(filterObj);
        }
      }

      const response = await dashboardService.getChartData(
        config.table,
        config.chartType,
        config.xAxis,
        yAxis,
        config.connection ? Number(config.connection) : undefined,
        undefined,
        undefined,
        filterStr
      );

      if (!response) return [];
      return formatChartResponse(response);
    } catch (error) {
      console.error('[ChartDataService] Error fetching chart data:', error);
      throw error;
    }
  },

  /**
   * Transform backend response into chart format
   */
  formatResponse(response) {
    return formatChartResponse(response);
  }
};

/**
 * Format various backend response formats into standard chart data
 */
function formatChartResponse(response) {
  if (!response) return [];

  // Format 1: { chartLabels, chartData }
  if (response.chartLabels && Array.isArray(response.chartData)) {
    return response.chartLabels.map((label, index) => ({
      name: label,
      value: response.chartData[index] || 0
    }));
  }

  // Format 2: { labels, datasets }
  if (response.labels && Array.isArray(response.datasets)) {
    const dataset = response.datasets[0];
    return response.labels.map((label, index) => ({
      name: label,
      value: dataset?.data?.[index] || 0
    }));
  }

  // Format 3: Direct array response
  if (Array.isArray(response)) {
    return response;
  }

  // Format 4: Unknown - try to extract
  console.warn('[ChartDataService] Unknown response format:', response);
  return [];
}

/**
 * Aggregate data for grouped/stacked charts
 */
export const aggregateChartData = (data, groupByKey, valueKeys) => {
  const grouped = {};

  data.forEach(item => {
    const label = String(item[groupByKey]).trim();
    grouped[label] ||= { name: label };

    valueKeys.forEach(key => {
      grouped[label][key] = (grouped[label][key] || 0) + (Number(item[key]) || 0);
    });
  });

  return Object.values(grouped);
};

/**
 * Validate and clean chart data
 */
export const cleanChartData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.filter(item => item !== null && item !== undefined);
};
