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

export interface ConsumableCheck {
    id: number;
    consumable_id: number;
    status_id: number;
    check_status: string;
    notes?: string;
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
    // Add other fields from your consumables_check table
}

export interface Consumable {
    key: React.Key;
    id: number;
    name: string;
    category: string;
    model_no: string;
    item_no: string;
    qty: number;
    min_qty: number;
    total: number;
    remaining: string;
    location: string;
    order_no: string;
    purchase_date: string;
    purchase_cost: string;
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
    consumables_check: [{
        count: number;
        // If you need the actual records:
        data?: ConsumableCheck[];
    }];

    // Computed fields
    count?: number; // If you need to store count separately
    filter?: any; // Only if needed for frontend filtering
    check_status?: string; // Derived status from consumables_check

    consumables: {
        id: number;
        name: string;
        consumable_id: number;
        status_id: number;
        check_status: string;
        notes?: string;
        created_at?: string;
        updated_at?: string | null;
        deleted_at?: string | null;
        // Add other fields from your consumables_check table
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