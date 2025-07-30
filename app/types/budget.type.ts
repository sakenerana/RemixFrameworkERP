import { Moment } from "moment";

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

export interface Budget {
    key: React.Key;
    id: number;
    name: string;
    type: string;
    qty: number;
    notes: string;
    action: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    start_date: any;
    end_date: any;
    budget: number;
    user_id: number;
    date?: [Moment, Moment];
    status_id: number;

    // Relationships
    status_labels: StatusLabel;
    departments: Department;
}