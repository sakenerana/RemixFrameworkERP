export interface Department {
  key: string;
  id: number;
  department: string;
  budget_code?: string[] | string | null;
  status_labels: any;
  action: string;
}

