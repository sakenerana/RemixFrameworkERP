export interface Consumable {
    key: React.Key;
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
    check_status: string;
}