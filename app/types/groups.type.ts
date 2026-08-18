interface StatusLabel {
    id?: number;
    name?: string;
}

export interface Groups {
    key: React.Key;
    id: number;
    group: string;
    status_id: number;
    status_labels: StatusLabel;
    action: string;
}
