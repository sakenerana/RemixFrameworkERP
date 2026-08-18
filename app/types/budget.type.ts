import { Moment } from "moment";
import { type Dayjs } from "dayjs";

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
    budget_code?: string[] | string | null;
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
    start_date: string | null;
    end_date: string | null;
    budget: number;
    user_id: number;
    date?: [Moment, Moment];
    status_id: number;
    department_id: number;
    office_id: number;

    // Relationships
    status_labels: StatusLabel;
    departments: Department;
}

export interface UnbudgetedRequisitionPayload {
    date: Dayjs;
    department_id: number;
    amount: number;
    notes: string;
    status_id: number;
    office_id: number;
}
