interface StatusLabel {
    id?: number;
    name?: string;
}

interface UserDepartment {
    id?: number;
    department?: string;
}

interface UserOffice {
    id: number;
    name: string;
}

export interface User {
    key: React.Key;
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    username: string;
    department_id: number;
    group_id: number;
    office_id: number;
    access: number[] | string | null;
    permissions: number[] | string | null;
    departments?: UserDepartment | null;
    status_labels?: StatusLabel | null;
    status_id: number;
    count?: number | null;
    auth_id?: string | null;
    actions: string;
    office?: UserOffice | null;
}
