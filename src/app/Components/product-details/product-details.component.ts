import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import{ProductServiceService} from '../../services/product-service.service';
import { Iproduct } from '../../models/iproduct'
import { Observable } from 'rxjs';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  // currentproudect:Iproduct|null=null;
  currentProduct: Iproduct | null=null;
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
        console.log(this.currentProduct.productimages[0])
      },
      error: (err) => {
        console.log(err);
      }
    });
  });
}
}
