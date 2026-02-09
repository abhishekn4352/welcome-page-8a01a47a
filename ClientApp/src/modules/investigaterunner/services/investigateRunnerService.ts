import { api } from '@/services/api';

export interface InvestigateRecord {
  id?: number;
  name?: string;
  description?: string;
  accountId?: number | string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class InvestigateRunnerService {
  private baseURL = '/Investigate/Investigate';

  // List all investigations
  getAllInvestigations() {
    return api.get<any>(this.baseURL);
  }

  // Get investigation details by id
  getInvestigationById(id: number) {
    return api.get<InvestigateRecord>(`${this.baseURL}/${id}`);
  }

  // Get investigation data rows by id
  getInvestigationDataById(id: number) {
    return api.get<any>(`${this.baseURL}/geturlbyId/${id}`);
  }
}

export const investigateRunnerService = new InvestigateRunnerService();
