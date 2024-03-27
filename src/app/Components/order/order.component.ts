import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output ,ViewChild,ElementRef, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProductsComponent } from '../products/products.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { Iproduct } from '../../models/iproduct';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule,FormsModule,ProductsComponent,ProductDetailsComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit{
  // public totalITeam:number=0
  public grandToltal! :number 
  public product:Iproduct[]=[]
  constructor(private _Cart:CartService){
 }


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
