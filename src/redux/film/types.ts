export type Film = {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    sizes: number[];
    types: number[];
    rating: number;
};

export enum Status {
    LOADING = 'loading',
    SUCCESS = 'completed',
    ERROR = 'error',
}

export type SearchFilmParams = {
    sortBy: string;
    order: string;
    category: string;
    search: string;
    currentPage: string;
};

export interface FilmSliceState {
    items: Film[];
    status: Status;
}