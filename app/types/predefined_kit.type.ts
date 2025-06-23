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

export interface PredefinedCheck {
    id: number;
    predefined_id: number;
    status_id: number;
    check_status: string;
    notes?: string;
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
    // Add other fields from your predefined_check table
}

export interface PredefinedKit {
    key: React.Key; // For AntD table row key
    id: number;
    name: string;
    checkout_date?: Date | string | null;
    predefined_id: number;
    status_id: number;
    notes?: string;
    action?: string; // For table actions
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
    department_id?: number;
    user_id?: number;
    qty: number;
    min_qty: number;

    // Relationships
    status_labels: StatusLabel;
    departments: Department;
    predefined_check: [{
        count: number;
        // If you need the actual records:
        data?: PredefinedCheck[];
    }];

    // Computed fields
    count?: number; // If you need to store count separately
    filter?: any; // Only if needed for frontend filtering
    check_status?: string; // Derived status from predefined_check

    predefined: {
        id: number;
        name: string;
        predefined_id: number;
        status_id: number;
        check_status: string;
        notes?: string;
        created_at?: string;
        updated_at?: string | null;
        deleted_at?: string | null;
        // Add other fields from your predefined_check table
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