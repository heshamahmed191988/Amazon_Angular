export interface FilterCriteria {
    Name?: string;
    CategoryId?: number;
    Brand: string;
    MinPrice?: number;
    MaxPrice?: number;
    PriceSortOrder?: PriceSortOrder;
}

export enum PriceSortOrder {
    None,
    asc,
    desc
}
