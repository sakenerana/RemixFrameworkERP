export interface StatusLabel {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface Department {
  id: number;
  department: string;
  status_id?: number;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface AccessoriesCheck {
  id: number;
  accessory_id: number;
  status_id: number;
  check_status: string;
  notes?: string;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  // Add other fields from your accessories_check table
}

export interface Accessories {
  key: React.Key;
  item_image: string;
  id: number;
  name: string;
  asset_category: string;
  model_no: string;
  location: string;
  qty: number;
  min_qty: number;
  total: string;
  checked_out: string;
  purchase_cost: number;
  action?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  department_id?: number;
  user_id?: number;

  // Relationships
  status_labels: StatusLabel;
  departments: Department;
  accessories_check: [{
    count: number;
    // If you need the actual records:
    data?: AccessoriesCheck[];
  }];

  // Computed fields
  count?: number; // If you need to store count separately
  filter?: any; // Only if needed for frontend filtering
  check_status?: string; // Derived status from accessories_check

  accessories: {
    id: number;
    name: string;
    accessory_id: number;
    status_id: number;
    check_status: string;
    notes?: string;
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
    // Add other fields from your accessories_check table
  };

  categories: {
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
    department_id?: number;
    id: number;
    name: string;
    notes: string;
    qty: number;
    status_id: number;
    type: string;
  }
}