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

export interface AssetsCheck {
    id: number;
    accessory_id: number;
    status_id: number;
    check_status: string;
    notes?: string;
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
    // Add other fields from your assets_check table
}

export interface Asset {
    key: React.Key;
    id: number;
    name: string;
    device_image: string;
    asset_tag: any;
    serial_no: string;
    model: string;
    category: string;
    checked_out_to: string;
    location: string;
    order_no: string;
    purchase_cost: number;
    purchase_date: Date;
    current_value: number;
    accounting_code: string;
    installed: string;
    status_type: string;
    qty: number;
    min_qty: number;
    size: string;
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
    assets_check: [{
        count: number;
        name: string;
        asset_tag: string;
        // If you need the actual records:
        data?: AssetsCheck[];
    }];

    // Computed fields
    count?: number; // If you need to store count separately
    filter?: any; // Only if needed for frontend filtering
    check_status?: string; // Derived status from assets_check

    assets: {
        id: number;
        name: string;
        assets_id: number;
        status_id: number;
        check_status: string;
        notes?: string;
        created_at?: string;
        updated_at?: string | null;
        deleted_at?: string | null;
        // Add other fields from your assets_check table
    };

    asset_model: {
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
}