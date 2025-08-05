import { _mock } from './_mock';

// ----------------------------------------------------------------------

export interface BranchProps {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  manager: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  employeeCount: number;
}

export const _branches: BranchProps[] = Array.from({ length: 20 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.companyNames(index),
  code: `BR${String(index + 1).padStart(3, '0')}`,
  address: _mock.fullAddress(index),
  phone: _mock.phoneNumber(index),
  manager: _mock.fullName(index),
  status: index % 4 === 0 ? 'inactive' : 'active',
  createdAt: _mock.time(index),
  employeeCount: Math.floor(Math.random() * 100) + 10,
}));