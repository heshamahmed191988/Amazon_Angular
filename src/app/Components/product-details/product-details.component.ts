import { Component, EventEmitter, OnChanges, OnInit, SimpleChanges, input, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ProductServiceService } from '../../services/product-service.service';
import { Iproduct } from '../../models/iproduct'
import { Observable } from 'rxjs';
import { SafeBase64Pipe } from "../../pipes/safe-base64.pipe";
//paypal
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgxPayPalModule } from 'ngx-paypal';
import { PaypalService } from '../../services/paypal.service';
import { IcreatrOrder } from '../../models/icreatr-order';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  imports: [SafeBase64Pipe, CommonModule, NgxPayPalModule, FormsModule]
})
export class ProductDetailsComponent implements OnInit {
  public Quantity: number = 1;
  public UserId: string = "";
  // "b52e9fa3-7d3c-495b-83e4-38bcbd60710c";
  public order: IcreatrOrder = { userID: "", orderQuantities: [] }
  public total: number = 0


  currentProduct: Iproduct = {
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
  payPalConfig: IPayPalConfig | undefined;
  currentId: number = 0;
  constructor(private activatedrouter: ActivatedRoute
    , private location: Location, private route: Router,
    private _ProductServiceService: ProductServiceService,
    private _PaypalService: PaypalService, private _AuthService: AuthService) {
      this.setUserid();
    this._PaypalService.updateOrderData.subscribe({
      next: (data) => {
        this.order.userID = this.UserId;
        this.order.orderQuantities = [];
        this.order.orderQuantities.push({ quantity: this.Quantity, productID: this.currentId });
        this._PaypalService.create = this.order;

      }
    })
  }

  ngOnInit(): void {
    //paypal
    this._PaypalService.initConfig();

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
    // this.setUserid()
    this.payPalConfig = this._PaypalService.payPalConfig;
  }
  
  
  buy(value: string) {
    this.Quantity = Number(value);
  } 
  
  
  createorder

    (): void {
   
  }

  setUserid(){
    this._AuthService.getCurrentUserId().subscribe(user =>{
       this.UserId = user.userId
       console.log(this.UserId)
    })
  }
}




