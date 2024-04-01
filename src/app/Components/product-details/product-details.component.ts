import { Component, EventEmitter, OnChanges, OnInit, SimpleChanges, input, output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ProductServiceService } from '../../services/product-service.service';
import { Iproduct } from '../../models/iproduct';
import { ProductStateService } from '../../services/product-state.service';
import { ReviewComponent } from '../review/review.component';
import { SafeBase64Pipe } from '../../pipes/safe-base64.pipe';
import { Observable } from 'rxjs';
//paypal
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgxPayPalModule } from 'ngx-paypal';
import { PaypalService } from '../../services/paypal.service';
import { IcreatrOrder } from '../../models/icreatr-order';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ICartService } from '../../services/icart.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AddressSharedService } from '../../services/address-shared.service';
@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [CommonModule, ReviewComponent,SafeBase64Pipe,TranslateModule,NgxPayPalModule,FormsModule,RouterLink]
})
export class ProductDetailsComponent implements OnInit {
  public Quantity: number = 1;
  public UserId: string = "";
  // "82b5b776-9a7a-4556-99e6-983e9509064d;
  adressId:number = 0;

  public order: IcreatrOrder = { userID: "", orderQuantities: [],addressId:0};
  public total: number = 0
  lang: string = 'en';
  public isAddressSubmitted: boolean = false;

  public currentProduct: Iproduct = {
    id: 0,
    itemscolor: [],
    productimages: [],
    nameAr: '',
    nameEn: '',
    brandNameAr: '',
    brandNameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    colors: [],
    itemimages: [],
    productDescription: '',
    price: 0
  };

  payPalConfig: IPayPalConfig | undefined;
  currentId: number = 0;
  constructor(private activatedrouter: ActivatedRoute
    , private location: Location, private route: Router,
    private _ProductServiceService: ProductServiceService,
    private _PaypalService: PaypalService,
     private _AuthService: AuthService,
     private _Cart:ICartService,
     private translate: TranslateService,
     private productStateService: ProductStateService
     ,private router:Router,private addressshared:AddressSharedService) {
    this.setUserid();
    this._PaypalService.updateOrderData.subscribe({
      next: (data) => {

        this.order.userID = this.UserId;
        this.order.orderQuantities = [];
        this.order.addressId=this.adressId;

        this.order.orderQuantities.push({
          quantity: this.Quantity,
          productID: this.currentId,
          unitAmount: Number(this.currentProduct.price)
        });
        this._PaypalService.create = this.order;

      }
    })
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'en'; // Initialize language from localStorage
    this.translate.use(this.lang);
    // Subscribe to language changes
    this.translate.onLangChange.subscribe(langChangeEvent => {
      this.lang = langChangeEvent.lang;
    });

    //paypal
    this._PaypalService.initConfig();
    this.addressshared.addressSubmitted$.subscribe(submitted => {
      this.isAddressSubmitted = submitted;
    });

    // this.activatedrouter.paramMap.subscribe((paramMap) => {
    //   this.currentId = Number(paramMap.get('id'));
    //   this._ProductServiceService.getProductById(this.currentId).subscribe({
    //     next: (res) => {
    //       this.currentProduct = res;
    //       // console.log(this.currentProduct.productimages[0])
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     }
    //   });
    // });
    this.activatedrouter.paramMap.subscribe((paramMap) => {
      this.currentId = Number(paramMap.get('id'));
      this._ProductServiceService.getProductById(this.currentId).subscribe({
        next: (res) => {
          this.currentProduct = res;
          this.productStateService.changeProductId(this.currentId); // Update product ID state
        },
        error: (err) => console.log(err)
      });
    });

    // this.setUserid()
    this.payPalConfig = this._PaypalService.payPalConfig;
  }
  // addToOrder(currentProduct:Iproduct){
  //   this._Cart.addtoOrder(currentProduct);
  // }  
  addToCart(product: Iproduct, quantity: number) {
    this._Cart.addtoOrder(product, quantity);
  }

  getTotalPrice() {
    return this._Cart.getTotalPrice();
  }

  removeItem(productId: number) {
    this._Cart.removeOrderItem(productId);
  }

  clearCart() {
    this._Cart.removeAllOrder();
  }
  buy(value: string) {
    this.Quantity = Number(value);
  }


  createorder

    (): void {

  }

  setUserid() {
    this._AuthService.getCurrentUserId().subscribe(user => {
      this.UserId = user.userId;
      this.getaddressidbyuserid(this.UserId);
      //console.log(this.UserId)
    })
  }

  getProductName(product: Iproduct): string {
    return this.lang === 'en' ? product.nameEn : product.nameAr;
  }

  getProductDescription(product: Iproduct): string {
    return this.lang === 'en' ? product.descriptionEn : product.descriptionAr;
  }

  getBrandName(product: Iproduct): string {
    return this.lang === 'en' ? product.brandNameEn : product.brandNameAr;
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

  }





