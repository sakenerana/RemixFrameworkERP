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

export interface LicenseCheck {
    id: number;
    accessory_id: number;
    status_id: number;
    check_status: string;
    notes?: string;
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
    // Add other fields from your license_check table
}

export interface License {
    key: React.Key;
    id: number;
    name: string;
    category_id: number;
    type: string;
    manufacturer_id: number;
    supplier_id: number;
    depreciation_id: number;
    seats: number;
    order_number: string;
    purchase_cost: number;
    purchase_date: Date;
    purchase_order_no: number;
    product_key: any;
    expiration_date: Date;
    termination_date: Date;
    license_email: string;
    license_name: string;
    manufacturer: string;
    qty: number;
    min_qty: number;
    total: number;
    avail: string;
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
    license_check: [{
        count: number;
        name: string;
        product_key: string;
        // If you need the actual records:
        data?: LicenseCheck[];
    }];

    // Computed fields
    count?: number; // If you need to store count separately
    filter?: any; // Only if needed for frontend filtering
    check_status?: string; // Derived status from license_check

    license: {
        id: number;
        name: string;
        license_id: number;
        status_id: number;
        check_status: string;
        notes?: string;
        created_at?: string;
        updated_at?: string | null;
        deleted_at?: string | null;
        // Add other fields from your license_check table
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