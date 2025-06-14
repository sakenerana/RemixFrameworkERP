export interface License {
    key: React.Key;
    id: number;
    name: string;
    category_id: number;
    product_key: string;
    expiration_date: string;
    licensed_to_email: string;
    licensed_to_name: string;
    manufacturer: string;
    min_qty: number;
    total: number;
    avail: string;
    action: string;
    status_labels: any;
    check_status: string;
}