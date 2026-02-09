import { api } from '@/services/api';

export interface DynamicFormComponent {
  label: string;
  type: 'textfield' | 'textarea' | 'dropdown' | 'checkbox' | 'date' | 'togglebutton' | 'autocomplete';
  mapping: string;
  mandatory: string | boolean;
  readonly: string | boolean;
  drop_values?: string | null;
}

export interface FormSetup {
  form_id?: number;
  form_name?: string;
  form_desc?: string;
  related_to?: string;
  page_event?: string;
  button_caption?: string;
  accountId?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  components?: DynamicFormComponent[];
  // Legacy support
  id?: number;
  name?: string;
  description?: string;
}

export interface DynamicFormRecord {
  id?: number;
  form_id?: number;
  [key: string]: any; // Dynamic component fields
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface PaginatedResponse<T> {
  items?: T[];
  content?: T[];
  total?: number;
  page?: number;
  size?: number;
}

class DynamicFormDataService {
  private formSetupURL = '/api/form_setup';
  private transactionURL = '/api/dynamic_transaction';

  // ===== FORM SETUP ENDPOINTS =====
  
  // Get all forms with pagination
  getAllForms(page: number = 0, size: number = 1000) {
    return api.get<PaginatedResponse<FormSetup>>(`${this.formSetupURL}?page=${page}&size=${size}`);
  }

  // Get form configuration by ID
  getFormById(id: number | null) {
    if (!id) return Promise.reject(new Error('Form ID is required'));
    return api.get<FormSetup>(`${this.formSetupURL}/${id}`);
  }

  // Create form setup
  createFormSetup(form: Partial<FormSetup>) {
    return api.post<FormSetup>(this.formSetupURL, form);
  }

  // Update form setup
  updateFormSetup(id: number, form: Partial<FormSetup>) {
    return api.put<FormSetup>(`${this.formSetupURL}/${id}`, form);
  }

  // Delete form setup
  deleteFormSetup(id: number) {
    return api.delete(`${this.formSetupURL}/${id}`);
  }

  // ===== DYNAMIC TRANSACTION (DATA) ENDPOINTS =====
  
  // Fetch all dynamic form data records for a form
  getAllDynamicFormData(formId?: number) {
    if (formId) {
      return api.get<DynamicFormRecord[]>(`${this.transactionURL}?form_id=${formId}`);
    }
    return api.get<DynamicFormRecord[]>(this.transactionURL);
  }

  // Get dynamic form data by ID
  getDynamicFormDataById(id: number) {
    return api.get<DynamicFormRecord>(`${this.transactionURL}/${id}`);
  }

  // Create new dynamic form record
  createDynamicFormData(data: DynamicFormRecord) {
    return api.post<DynamicFormRecord>(this.transactionURL, data);
  }

  // Update dynamic form record
  updateDynamicFormData(id: number, data: DynamicFormRecord, formId?: number) {
    const url = formId 
      ? `${this.transactionURL}/${id}?form_id=${formId}`
      : `${this.transactionURL}/${id}`;
    return api.put<DynamicFormRecord>(url, data);
  }

  // Delete dynamic form record
  deleteDynamicFormData(id: number) {
    return api.delete(`${this.transactionURL}/${id}`);
  }

  // Build dynamic form structure
  buildDynamicForm(formId: number) {
    return api.get<FormSetup>(`/api/dynamic_form_build?form_id=${formId}`);
  }
}

export const dynamicFormDataService = new DynamicFormDataService();
