import { AdhocCondition } from '../services/reportRunnerService';
import { DateUtils } from '@/utils/dateUtils';

export class ReportQueryBuilder {
  /**
   * Build SQL query with dynamic parameters
   */
  static buildQuery(
    baseQuery: string,
    options: {
      dynamicParams?: Record<string, any>;
      dateParams?: {
        fromDate: Date | null;
        toDate: Date | null;
        dateField: string;
      };
      adhocConditions?: AdhocCondition[];
    }
  ): string {
    let query = baseQuery;

    // Add dynamic form parameters
    if (options.dynamicParams) {
      Object.entries(options.dynamicParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          query += ` AND ${key} = '${value}'`;
        }
      });
    }

    // Add date parameters
    if (options.dateParams && options.dateParams.fromDate && options.dateParams.toDate) {
      const fromDateStr = DateUtils.formatForSQL(options.dateParams.fromDate);
      const toDateStr = DateUtils.formatForSQL(options.dateParams.toDate);
      query += ` AND ${options.dateParams.dateField} BETWEEN '${fromDateStr}' AND '${toDateStr}'`;
    }

    // Add adhoc conditions
    if (options.adhocConditions && options.adhocConditions.length > 0) {
      const validConditions = options.adhocConditions.filter(
        c => c.fields_name && c.fields_name.trim() !== ''
      );

      validConditions.forEach(condition => {
        const { andor, fields_name, condition: op, value } = condition;
        query += ` ${andor} ${fields_name} ${op} '${value}'`;
      });
    }

    return query;
  }

  /**
   * Extract date field name from adhoc parameters
   */
  static extractDateField(adhocParamHtml: string[]): string {
    const defaultField = 'created_at';

    if (!adhocParamHtml || adhocParamHtml.length === 0) {
      return defaultField;
    }

    // Look for common date field patterns
    for (const field of adhocParamHtml) {
      const fieldLower = field.toLowerCase();
      if (fieldLower.includes('created_at') || fieldLower.includes('a.created_at')) {
        return field;
      }
      if (fieldLower.includes('createdat') || fieldLower.includes('a.createdat')) {
        return field;
      }
      if (fieldLower.includes('date')) {
        return field;
      }
    }

    return defaultField;
  }

  /**
   * Format adhoc condition for display
   */
  static formatCondition(condition: AdhocCondition): string {
    return `${condition.andor} ${condition.fields_name} ${condition.condition} '${condition.value}'`;
  }

  /**
   * Validate adhoc condition
   */
  static isValidCondition(condition: AdhocCondition): boolean {
    return !!(
      condition.fields_name &&
      condition.fields_name.trim() !== '' &&
      condition.condition &&
      condition.value !== undefined &&
      condition.value !== null
    );
  }
}
