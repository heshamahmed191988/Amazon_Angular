import { Injectable } from '@angular/core';
import { Iproduct } from '../models/iproduct';

@Injectable({
  providedIn: 'root'
})
export class StaticProductsService {
products:Iproduct[];
  constructor()
   {

    this.products = [
      {ID:100,Name:'iphone',Quantity:1,Price:954,ImgUrl:'https://picsum.photos/200/100',CategoryID:1},
      {ID:200,Name:'dell laptop',Quantity:5,Price:1500,ImgUrl:'https://picsum.photos/200/100',CategoryID:2},
      {ID:300,Name:'samsung taplet',Quantity:0,Price:456,ImgUrl:'https://picsum.photos/200/100',CategoryID:3},
      {ID:400,Name:'oppo',Quantity:7,Price:924,ImgUrl:'https://picsum.photos/200/100',CategoryID:1},
      {ID:500,Name:'hp laptop',Quantity:1,Price:764,ImgUrl:'https://picsum.photos/200/100',CategoryID:2},
      {ID:600,Name:'hauwai tablet',Quantity:3,Price:700,ImgUrl:'https://picsum.photos/200/100',CategoryID:3},
    ]

   }

   getAllProducts() {
    return this.products;
   }

   getProductById(id: number):Iproduct|null {
     let product=this.products.find(p => p.ID === id);
    return product?product:null
   }

   getProductByCatId(catId:number):Iproduct[]{
    return this.products.filter(p => p.CategoryID === catId);
   }

   getProductIds():Number[]
   {
      return this.products.map((prd)=>prd.ID); 
   }
}
