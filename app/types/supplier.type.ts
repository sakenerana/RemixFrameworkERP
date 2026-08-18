interface StatusLabel {
  id?: number;
  name?: string;
}

export interface Supplier {
  key: React.Key;
  id: number;
  name: string;
  image: string | null;
  url: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  fax: string;
  notes: string;
  status_labels: StatusLabel;
  check_status: string;
  actions: React.ReactNode;
}

