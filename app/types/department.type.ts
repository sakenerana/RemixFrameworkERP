interface StatusLabel {
  id?: number;
  name?: string;
}

export interface Department {
  key: string;
  id: number;
  department: string;
  budget_code?: string[] | string | null;
  status_labels?: StatusLabel | null;
  action: string;
}

