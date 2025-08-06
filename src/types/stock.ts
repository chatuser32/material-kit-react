export interface Company {
  id: number;
  name: string;
}

export interface Branch {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  company: Company;
}

export interface BranchFormData {
  code: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  companyId: number;
}