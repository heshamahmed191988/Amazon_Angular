import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import{ProductServiceService} from '../../services/product-service.service';
import { Iproduct } from '../../models/iproduct'
import { Observable } from 'rxjs';
import { SafeBase64Pipe } from "../../pipes/safe-base64.pipe";
@Component({
    selector: 'app-product-details',
    standalone: true,
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.css',
    imports: [SafeBase64Pipe,CommonModule]
})
export class ProductDetailsComponent implements OnInit{
  currentProduct: Iproduct = {
    // default values for all properties
    id: 0,
    itemscolor: [],
    productimages: [],
    name: '',
    colors: [],
    itemimages: [],
    description: '',
    productDescription: '',
    price: 0
  };
  // currentproudect:Iproduct|null=null;
  currentId:number=0;
constructor(private activatedrouter: ActivatedRoute
  ,private location:Location,private route: Router,private _ProductServiceService:ProductServiceService) {

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
}
