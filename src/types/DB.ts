export interface Place {
    id: string;
    place_id: number;
    description: string;
    dimension: string;
    expand: { trades: Trade[] };
    image: string;
    x: number;
    y: number;
    z: number;
    trades: string | string[];
}

export interface Trade {
    id: string;
    giving: string;
    receiving: string;
}
