import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output ,ViewChild,ElementRef, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProductsComponent } from '../products/products.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { Iproduct } from '../../models/iproduct';
import { ICartService } from '../../services/icart.service';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule,ProductsComponent,ProductDetailsComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  // public totalITeam:number=0
  public grandToltal! :number 
  public product:Iproduct[]=[]
  constructor(private _Cart:ICartService){}
//To calc NUmber on vart items we shoud do it in navbar
ngOnInit(): void {
  //  this._Cart.getProduct()
  //  .subscribe(res=>{
  //   this.totalITeam=res.length;

  //  })
  this._Cart.getProduct()
  .subscribe(res=>{
    this.product=res
    this.grandToltal=this._Cart.getTotalPrice()

  })
 }

 Remove(item:Iproduct){
  this._Cart.removeOrderIteam(item)
 }
 emptyOrder(){
  this._Cart.removeallOrder();
 }

}


