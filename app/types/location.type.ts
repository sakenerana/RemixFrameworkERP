export interface Location {
    key: React.Key;
    id: number;
    name: string;
    image: string;
    parent: string;
    current_location: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    status_labels: any;
    action: string;
}