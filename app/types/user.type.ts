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
    group_id: number;
    office_id: number;
    access: any;
    permissions: any;
    departments: any;
    status_labels: any;
    count: any;
    actions: string;
}