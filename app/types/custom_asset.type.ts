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

export interface CustomAssetReportFilters {
    location_id?: number;
    department_id?: number;
    supplier_id?: number;
    asset_model_id?: number;
    manufacturer_id?: number;
    category_id?: number;
    status_id?: number;
    check_list?: string[];
}

export interface CustomAssetReportSource {
    id: number;
    created_at?: string;
    name?: string;
    order_no?: string;
    purchase_date?: string | null;
    purchase_cost?: number;
    qty?: number;
    min_qty?: number;
    notes?: string | null;
    status_labels?: Pick<StatusLabel, "name"> | null;
    users?: Partial<User> | null;
    departments?: Partial<Department> | null;
    asset_model?: Partial<AssetModel> | null;
    locations?: Partial<Location> | null;
}

export interface CustomAssetReportRow {
    asset_id: number;
    created_at?: string;
    asset_name?: string;
    order_no?: string;
    purchase_date?: string | null;
    purchase_cost?: number;
    qty?: number;
    min_qty?: number;
    asset_notes?: string | null;
    asset_status?: string;
    user_id?: number;
    user_fname?: string;
    user_mname?: string;
    user_lname?: string;
    user_email?: string;
    department_id?: number;
    department_name?: string;
    model_id?: number;
    model_name?: string;
    location_id?: number;
    location_name?: string;
    supplier_id?: number;
    manufacturer_id?: number;
    category_id?: number;
}
