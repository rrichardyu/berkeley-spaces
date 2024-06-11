export interface Filters {
    start_t: string[];
    end_t: string[];
    date: string;
    buildings: string[];
    features: string[];
    categories: string[];
    status: string[];
    [key: string]: unknown;
}

export interface Preferences {
    start_t: string[];
    end_t: string[];
    date: string;
    buildings: string[];
    features: string[];
    categories: string[];
    [key: string]: unknown;
}

export interface RoomSchedulerResult {
    start_t: string;
    end_t: string;
    room: {
        id: number;
        display_name: string;
        reservation_status: string;
    };
}