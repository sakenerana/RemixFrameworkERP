export interface Consumable {
    key: React.Key;
    id: number;
    name: string;
    category: string;
    model_no: string;
    item_no: string;
    min_qty: number;
    total: number;
    remaining: string;
    location: string;
    order_no: string;
    purchase_date: string;
    purchase_cost: string;
    action: string;
    status_labels: any;
    check_status: string;
}