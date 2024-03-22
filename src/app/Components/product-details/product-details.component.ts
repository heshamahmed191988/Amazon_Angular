import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaticProductsService } from '../../services/static-products.service';
import { Iproduct } from '../../models/iproduct';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  productid:number = 0;
  productIds:Number[]= [];
  product:Iproduct|null = null;
constructor(private activatedrouter: ActivatedRoute,private productsService: StaticProductsService
  ,private location:Location,private route: Router) {

}
ngOnInit() {
//  this.productid=Number(this.activatedrouter.snapshot.paramMap.get('id'));
this.activatedrouter.paramMap.subscribe((pramas)=>{
this.productid=Number(pramas.get('id'));
this.product=this.productsService.getProductById(this.productid)//to get the id 

})
this.productIds=this.productsService.getProductIds();
}
goback() {
this.location.back()
}

goprevious()
{
  let productIds=this.productsService.getProductIds();
  let index=productIds.indexOf(this.productid);
  this.route.navigateByUrl(`/Details/${productIds[--index]}`); 
}

gonext(){
  let productIds=this.productsService.getProductIds();
  let index=productIds.indexOf(this.productid);
  this.route.navigateByUrl(`/Details/${productIds[++index]}`); 
}
}
