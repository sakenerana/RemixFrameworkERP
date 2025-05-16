export interface Component {
    key: React.Key;
    name: string;
    serial_no: string;
    category: string;
    model_no: string;
    min_qty: number;
    remaining: string;
    location: string;
    total: number;
    order_no: string;
    purchase_date: string;
    purchase_cost: number;
    action: string;
    check_status: string;
}