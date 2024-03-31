import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import{ProductServiceService} from '../../services/product-service.service';
import { Iproduct } from '../../models/iproduct'
import { Observable } from 'rxjs';
import { SafeBase64Pipe } from "../../pipes/safe-base64.pipe";
import { ICartService } from '../../services/icart.service';


@Component({
  selector: 'app-cartdetails',
  standalone: true,
  imports: [SafeBase64Pipe,CommonModule,RouterLink],
  templateUrl: './cartdetails.component.html',
  styleUrl: './cartdetails.component.css'
})
export class CartdetailsComponent  implements OnInit{
  currentProduct: Iproduct = {
    id: 0,
    itemscolor: [],
    productimages: [],
    nameEn: '',
    nameAr: '',
    brandNameAr: '',
    brandNameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    productDescription: '',
    colors: [],
    itemimages: [],
    StockQuantity: 0,
    quantity: 0,
    price: 0
  };
  // currentproudect:Iproduct|null=null;
  currentId:number=0;
constructor(private activatedrouter: ActivatedRoute
  ,private location:Location,private route: Router
  ,private _ProductServiceService:ProductServiceService
  ,private _Cart:ICartService) {

}
ngOnInit(): void {
  this.activatedrouter.paramMap.subscribe((paramMap) => {
    this.currentId = Number(paramMap.get('id'));
    this._ProductServiceService.getProductById(this.currentId).subscribe({
      next: (res) => {
        this.currentProduct = res;
       // console.log(this.currentProduct.productimages[0])
      
      },
      error: (err) => {
        console.log(err);
      }
    });
  });
 
}
addToOrder(currentProduct: Iproduct, quantity: string): void {
  this._Cart.addtoOrder(currentProduct, Number(quantity));
}

}

