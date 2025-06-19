export interface License {
    key: React.Key;
    id: number;
    name: string;
    category_id: number;
    manufacturer_id: number;
    supplier_id: number;
    depreciation_id: number;
    seats: number;
    order_number: string;
    purchase_cost: number;
    purchase_date: Date;
    purchase_order_no: number;
    product_key: any[];
    expiration_date: Date;
    termination_date: Date;
    license_email: string;
    license_name: string;
    manufacturer: string;
    min_qty: number;
    total: number;
    avail: string;
    notes: string;
    action: string;
    status_labels: any;
    check_status: string;
}