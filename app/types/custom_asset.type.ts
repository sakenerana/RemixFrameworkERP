// Define your interfaces
interface User {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    // other user properties
}

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

export interface Location {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
}

export interface Supplier {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
}

export interface Manufacturer {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
}

export interface Category {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
}

export interface AssetModel {
    category_id: number;
    created_at: string;
    department_id: number;
    depreciation_id: number;
    eol: number;
    id: number;
    manufacturer_id: number;
    min_qty: number;
    model_no: string;
    name: string;
    notes: string;
    status_id: number;
    supplier_id?: number;
    user_id: number;
    updated_at?: string | null;
    deleted_at?: string | null;
}

export interface CustomAsset {
    company_name?: string;
    company_id?: number;
    location_id?: number;
    default_location?: string;
    department_id?: number;
    supplier_id?: number;
    model?: string;
    asset_model_id?: number;
    manufacturer_id?: number;
    category_id?: number;
    status_id?: number;
    status_name?: string;
    status_created_at?: string;
    order_number?: string;
    pruchase_date_from?: string;
    pruchase_date_to?: string;
    created_at_from?: string;
    created_at_to?: string;
    checkout_from?: string;
    checkout_to?: string;
    last_checkin_from?: string;
    last_checkin_to?: string;
    expected_checkin_from?: string;
    expected_checkin_to?: string;
    eol_from?: string;
    eol_to?: string;
    last_audit_from?: string;
    last_audit_to?: string;
    next_audit_from?: string;
    next_audit_to?: string;
    archived_assets?: string;
    deleted_assets?: string;
    notes?: string;

    users: User;
    status_labels: StatusLabel;
    departments: Department;
    asset_model: AssetModel;
    locations: Location;
    suppliers: Supplier;
    manufacturers: Manufacturer;
    categories: Category;

}