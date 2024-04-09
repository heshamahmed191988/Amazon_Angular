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
import { Router } from '@angular/router';
import { AddressSharedService } from '../../services/address-shared.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule,ProductsComponent,ProductDetailsComponent,NgxPayPalModule,TranslateModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  // public totalITeam:number=0
  public grandToltal! :number
  public isAddressSubmitted: boolean = false;
    adressId:number = 0;
  public product:Iproduct[]=[]
  payPalConfig: IPayPalConfig | undefined;
   UserId: string = "";
   public isCartEmpty: boolean = true;

  //82b5b776-9a7a-4556-99e6-983e9509064d
  public order: IcreatrOrder = { userID: "", orderQuantities: [],addressId:0}

  constructor(private _Cart:ICartService,private _PaypalService: PaypalService, private _AuthService: AuthService
    ,private router:Router,private addressshared:AddressSharedService)
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
            this.order.addressId=this.adressId;
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
  this.addressshared.addressSubmitted$.subscribe(submitted => {
    this.isAddressSubmitted = submitted;
  });

  this._Cart.getProduct().subscribe(res => {
    this.product = res;
    this.grandToltal = this._Cart.getTotalPrice();
    // Update the isCartEmpty based on the products list
    this.isCartEmpty = res.length === 0;
  });
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
this._Cart.removeOrderItem(item.id);
console.log('Cart is now empty.');

}
emptyOrder(): void {
this._Cart.removeAllOrder(); // Clears the entire cart
}


setUserid() {
  this._AuthService.getCurrentUserId().subscribe({
    next: (user) => {
      this.UserId = user.userId;
      // Now that we have the UserId, let's fetch the addressId
      this.getaddressidbyuserid(this.UserId);
    },
    error: (error) => console.log(error)
  });
}

gottoAddress() {
  this.getaddressidbyuserid(this.UserId);
  this.router.navigate(['/address']);
}

getaddressidbyuserid(userid: string) {
  if (!userid) return;

  this._AuthService.GetAddressIdByUserId(userid).subscribe({
    next: (data) => {
      // Assuming 'data' correctly represents the address ID you need
      this.adressId = +data; // Correctly update adressId with the received data
      this.order.addressId = this.adressId; // Now update the order with the correct address ID
    },
    error: (error) => console.log(error)
  });
}

goBack() {
  window.history.back();
}

increaseQuantity(item: any) {
  item.quantity++;
}

decreaseQuantity(item: any) {
  if (item.quantity > 1) {
    item.quantity--;
  }
}


}