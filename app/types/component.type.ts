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

export interface ComponentCheck {
    id: number;
    component_id: number;
    status_id: number;
    check_status: string;
    notes?: string;
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
    // Add other fields from your components_check table
}

export interface Component {
    key: React.Key;
    id: number;
    name: string;
    serial_no: string;
    category: string;
    model_no: string;
    qty: number;
    min_qty: number;
    remaining: string;
    location: string;
    total: number;
    order_no: string;
    purchase_date: any;
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
    components_check: [{
        count: number;
        // If you need the actual records:
        data?: ComponentCheck[];
    }];

    // Computed fields
    count?: number; // If you need to store count separately
    filter?: any; // Only if needed for frontend filtering
    check_status?: string; // Derived status from components_check

    components: {
        id: number;
        name: string;
        component_id: number;
        status_id: number;
        check_status: string;
        notes?: string;
        created_at?: string;
        updated_at?: string | null;
        deleted_at?: string | null;
        // Add other fields from your components_check table
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