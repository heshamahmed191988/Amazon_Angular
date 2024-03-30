import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output ,ViewChild,ElementRef, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProductsComponent } from '../products/products.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { Iproduct } from '../../models/iproduct';
import { ICartService } from '../../services/icart.service';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgxPayPalModule } from 'ngx-paypal';
import { PaypalService } from '../../services/paypal.service';
import { IcreatrOrder } from '../../models/icreatr-order';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule,ProductsComponent,ProductDetailsComponent,NgxPayPalModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  // public totalITeam:number=0
  public grandToltal! :number
  public product:Iproduct[]=[]
  payPalConfig: IPayPalConfig | undefined;
  public UserId: string = "2c534a51-7abd-46dc-86e6-eb6a97cdbf5c";
  public order: IcreatrOrder = { userID: "", orderQuantities: [] }

  constructor(private _Cart:ICartService,private _PaypalService: PaypalService, private _AuthService: AuthService)
  {
    this.setUserid();
    console.log(this.UserId);
    this._Cart.getProduct()
.subscribe(res=>{
  this.product=res
  this.grandToltal=this._Cart.getTotalPrice()
  })
    console.log(this.product)
    this._PaypalService.updateOrderData.subscribe(
      {
        next:(res)=>{
            this.order.userID = this.UserId;
            this.order.orderQuantities = [];
            for(const item of this.product)
            {
              const Quantity = item.quantity !== undefined ? item.quantity : 0;
              this.order.orderQuantities.push({
                quantity:Quantity,
                productID:item.id,
                unitAmount: Number(item.price)
              }
            )
          }
        }
      }
    )
    this._PaypalService.create = this.order;
  }

//To calc NUmber on vart items we shoud do it in navbar
ngOnInit(): void {
  this._PaypalService.initConfig();
  //  this._Cart.getProduct()
  //  .subscribe(res=>{
  //   this.totalITeam=res.length;
//  })
// this._Cart.getProduct()
// .subscribe(res=>{
//   this.product=res
//   this.grandToltal=this._Cart.getTotalPrice()


// })
this.payPalConfig = this._PaypalService.payPalConfig;
}

Remove(item: Iproduct): void {
this._Cart.removeOrderItem(item.id); // Adjusted to use the product's ID
}
emptyOrder(): void {
this._Cart.removeAllOrder(); // Clears the entire cart
}


setUserid() {
  this._AuthService.getCurrentUserId().subscribe(user => {
    this.UserId = user.userId
    //console.log(this.UserId)
  })
}

}
