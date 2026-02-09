export type DateRangeType = 'Today' | 'This Week' | 'Last Week' | 'This Month' | 'Last Month' | 'This Year' | 'Last Year' | 'Custom' | '';

export interface DateRange {
  from: Date | null;
  to: Date | null;
  type: DateRangeType;
}

export class DateUtils {
  static formatForSQL(date: Date | null): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static formatForDisplay(date: Date | null): string {
    if (!date) return '';
    return date.toLocaleDateString();
  }

  static calculateToday(): DateRange {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      from: today,
      to: today,
      type: 'Today'
    };
  }

  static calculateThisWeek(): DateRange {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

    const from = new Date(currentDate);
    from.setDate(currentDate.getDate() - daysToMonday);
    from.setHours(0, 0, 0, 0);

    const to = new Date(from);
    to.setDate(from.getDate() + 6);
    to.setHours(23, 59, 59, 999);

    return { from, to, type: 'This Week' };
  }

  static calculateLastWeek(): DateRange {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

    const from = new Date(currentDate);
    from.setDate(currentDate.getDate() - daysToMonday - 7);
    from.setHours(0, 0, 0, 0);

    const to = new Date(from);
    to.setDate(from.getDate() + 6);
    to.setHours(23, 59, 59, 999);

    return { from, to, type: 'Last Week' };
  }

  static calculateThisMonth(): DateRange {
    const currentDate = new Date();
    const from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    from.setHours(0, 0, 0, 0);
    
    const to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    to.setHours(23, 59, 59, 999);

    return { from, to, type: 'This Month' };
  }

  static calculateLastMonth(): DateRange {
    const currentDate = new Date();
    const from = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    from.setHours(0, 0, 0, 0);
    
    const to = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    to.setHours(23, 59, 59, 999);

    return { from, to, type: 'Last Month' };
  }

  static calculateThisYear(): DateRange {
    const currentDate = new Date();
    const from = new Date(currentDate.getFullYear(), 0, 1);
    from.setHours(0, 0, 0, 0);
    
    const to = new Date(currentDate.getFullYear(), 11, 31);
    to.setHours(23, 59, 59, 999);

    return { from, to, type: 'This Year' };
  }

  static calculateLastYear(): DateRange {
    const currentDate = new Date();
    const from = new Date(currentDate.getFullYear() - 1, 0, 1);
    from.setHours(0, 0, 0, 0);
    
    const to = new Date(currentDate.getFullYear() - 1, 11, 31);
    to.setHours(23, 59, 59, 999);

    return { from, to, type: 'Last Year' };
  }

  static getDateRange(type: DateRangeType): DateRange {
    switch (type) {
      case 'Today':
        return this.calculateToday();
      case 'This Week':
        return this.calculateThisWeek();
      case 'Last Week':
        return this.calculateLastWeek();
      case 'This Month':
        return this.calculateThisMonth();
      case 'Last Month':
        return this.calculateLastMonth();
      case 'This Year':
        return this.calculateThisYear();
      case 'Last Year':
        return this.calculateLastYear();
      default:
        return { from: null, to: null, type: '' };
    }
  }
}
