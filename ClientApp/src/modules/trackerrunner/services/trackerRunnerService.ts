import { api } from '@/services/api';

export interface TrackerRecord {
  id?: number;
  name?: string;
  description?: string;
  accountId?: number | string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class TrackerRunnerService {
  private baseURL = '/Trackerrunner/Trackerrunner';

  // List all trackers
  getAllTrackers() {
    return api.get<any>(this.baseURL);
  }

  // Get tracker details by id
  getTrackerById(id: number) {
    return api.get<TrackerRecord>(`${this.baseURL}/${id}`);
  }

  // Get tracker data rows by id
  getTrackerDataById(id: number) {
    return api.get<any>(`/TrackerBuilder/geturlbyId/${id}`);
  }
}

export const trackerRunnerService = new TrackerRunnerService();
