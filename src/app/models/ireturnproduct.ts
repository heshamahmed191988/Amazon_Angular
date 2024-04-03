import { Iproduct } from './iproduct';
export interface Ireturnproduct {
  entities:{id: number;
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
    StockQuantity?:number;
    quantity?: number;
    price: number;
    rating?:number;}[]
  count:number

}
