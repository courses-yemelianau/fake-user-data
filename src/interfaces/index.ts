export interface Record {
    name: string;
    address: string;
    phone: string;
}

export interface UserData extends Record {
    index: number;
    identifier: string;
}
