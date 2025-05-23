export interface User {
    key: React.Key;
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    department_id: number;
    group: string;
    departments: any;
    status_labels: any;
    actions: string;
}