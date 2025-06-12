export interface AssetModel {
    key: React.Key;
    id: number;
    name: string;
    category_id: number;
    manufacturer_id: number;
    model_no: string;
    depreciation: string;
    min_qty: number;
    notes: string;
    action: string;
    status_id: number;
    status_labels: any;
    department_id: number;
    department: string;
}