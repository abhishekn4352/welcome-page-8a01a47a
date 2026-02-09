import { api } from '@/services/api';

export interface ReportRecord {
  id?: number;
  reportName?: string;
  description?: string;
  isSql?: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  rpt_builder2_lines?: ReportLine[];
}

export interface ReportLine {
  id: number;
  model: string; // JSON string containing ReportLineModel
}

export interface ReportLineModel {
  sql_str?: string;
  url?: string;
  date_param_req?: string; // "Yes" or "No"
  std_param_html?: string; // JSON string of field names
  adhoc_param_html?: string; // JSON string of field names
  sureConnectId?: number | null;
}

export interface AdhocCondition {
  andor: string;
  fields_name: string;
  condition: string;
  value: string;
}

class ReportRunnerService {
  private baseURL = '/Rpt_builder2/Rpt_builder2';
  private linesURL = '/Rpt_builder2_lines/Rpt_builder2_lines';

  // List all reports
  getAllReports() {
    return api.get<any>(this.baseURL);
  }

  // Get report details by id
  getReportById(id: number) {
    return api.get<ReportRecord>(`${this.baseURL}/${id}`);
  }

  // Get report data rows by id (legacy method)
  getReportDataById(id: number) {
    return api.get<any>(`${this.linesURL}/${id}`);
  }

  // Execute SQL query with parameters
  getMasterData(query: string) {
    return api.get<any>('/api/master-query-data', { params: { sql_query: query } });
  }

  // Get standard parameters HTML configuration
  getStdParamById(id: number) {
    return api.get<any>(`/Rpt_builder2/html/build_report2/${id}`);
  }

  // Get column details from URL
  getColumnDetailsByUrl(url: string) {
    return api.get<any>(`/Rpt_builder2_lines/geturlkeybyurl?url=${encodeURIComponent(url)}`);
  }

  // Fetch all data from URL
  getAllDetailsByUrl(url: string) {
    return api.get<any>(`/Rpt_builder2_lines/fetch_data_url?url=${encodeURIComponent(url)}`);
  }

  // Get report builder line details by ID
  getLineDetailsById(id: number) {
    return api.get<any>(`${this.linesURL}/${id}`);
  }

  // Update report builder line data
  updateLineData(data: any, id: number) {
    return api.put<any>(`/Rpt_builder2_lines/update/${id}`, data);
  }

  // Delete report by ID
  deleteById(id: number) {
    return api.delete<any>(`${this.baseURL}/${id}`);
  }

  // Update report data
  updateData(data: any, id: number) {
    return api.put<any>(`${this.baseURL}/${id}`, data);
  }

  // Download file in specified format
  async downloadFile(format: string, dataList: any[], filename: string = 'report') {
    try {
      const response = await fetch(`/api/rbbuilder/fileconverter/downloadFile/${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataList),
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
}

export const reportRunnerService = new ReportRunnerService();
