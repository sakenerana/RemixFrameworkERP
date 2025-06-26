export interface ActivityReport {
    key: React.Key;
    date: string;
    name: string;
    actions: string;
    type: string;
    item: string;
    notes: number;

    users: {
        first_name: string;
        middle_name?: string;
        last_name: string;
    }
}