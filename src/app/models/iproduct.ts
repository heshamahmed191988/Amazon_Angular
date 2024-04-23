export interface Iproduct {
    id: number;
    itemscolor?: string[];
    productImages?: string[];
    productimages?: string[];
    nameAr: string;
    nameEn: string;
    brandNameAr:string;
    brandNameEn:string;
    descriptionAr:string;
    descriptionEn:string;
    productDescription?: string;
    colors?: string[];
    itemimages?: string[];
    stockQuantity?:number;
    quantity?: number; 
    price: number;
    rating?:number;
    categoryId?: number;
    brandName?:string;
    categoryNameEn?:string;
    categoryNameAr?:string;
    isExpanded?: boolean;

    //BrandName?:string;
}
