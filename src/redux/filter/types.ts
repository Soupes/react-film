export enum SortPropertyEnum {
    'RATING_DESC' = 'rating',
    'RATING_ASC' = '-rating',
    'PRICE_DESC' = 'price',
    'NAME_DESC' = 'name',
}

export type Sort = {
    name: string;
    sortProperty: SortPropertyEnum;
};

export interface FilterSliceState {
    searchValue: string;
    categoryId: number;
    currentPage: number;
    sort: Sort;
}