export interface Asset {
    key: React.Key;
    id: number;
    name: string;
    device_image: string;
    asset_tag: string;
    serial_no: string;
    model: string;
    category: string;
    checked_out_to: string;
    location: string;
    purchase_cost: number;
    current_value: number;
    accounting_code: string;
    installed: string;
    size: string;
    action: string;
    status_labels: any;
    check_status: string;
}