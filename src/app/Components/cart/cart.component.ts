import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  OnInit,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ProductsComponent } from "../products/products.component";
import { ProductDetailsComponent } from "../product-details/product-details.component";
import { Iproduct } from "../../models/iproduct";
import { ICartService } from "../../services/icart.service";

import { IPayPalConfig, ICreateOrderRequest } from "ngx-paypal";
import { NgxPayPalModule } from "ngx-paypal";
import { PaypalService } from "../../services/paypal.service";
import { IcreatrOrder } from "../../models/icreatr-order";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AddressSharedService } from "../../services/address-shared.service";
import { TranslateModule } from "@ngx-translate/core";
import { ProductServiceService } from "../../services/product-service.service";
import { ProductStateService } from "../../services/product-state.service";

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductsComponent,
    ProductDetailsComponent,
    NgxPayPalModule,
    TranslateModule,
  ],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.css",
})
export class CartComponent implements OnInit {
  // public totalITeam:number=0
  public grandToltal!: number;
  public isAddressSubmitted: boolean = false;
  adressId: number = 0;
  public product: Iproduct[] = [];
  payPalConfig: IPayPalConfig | undefined;
  UserId: string = "";
  public isCartEmpty: boolean = true;
  randomProducts: Iproduct[] = [];
  lang: string = "en";
  public pageNumber: number = 1;
  public pageSize: number = 3;
  public currentProduct: Iproduct = {
    id: 0,
    itemscolor: [],
    productimages: [],
    nameAr: "",
    nameEn: "",
    brandNameAr: "",
    brandNameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    colors: [],
    itemimages: [],
    productDescription: "",
    price: 0,
    rating: 0,
  };
  Products: Iproduct[] = [];
  currentId: number = 0;
  allProducts: Iproduct[] = [];

  //82b5b776-9a7a-4556-99e6-983e9509064d
  public order: IcreatrOrder = {
    userID: "",
    orderQuantities: [],
    addressId: 0,
  };

  constructor(
    private _Cart: ICartService,
    private _PaypalService: PaypalService,
    private _AuthService: AuthService,
    private router: Router,
    private addressshared: AddressSharedService,
    private _ProductServiceService: ProductServiceService,
    private productStateService: ProductStateService,
    private activatedrouter: ActivatedRoute
  ) {
    this.setUserid();
    console.log(this.UserId);

    this._Cart.getProduct().subscribe((res) => {
      debugger;
      this.product = res;
      this.grandToltal = this._Cart.getTotalPrice();
    });
    console.log(this.product);
    this._PaypalService.updateOrderData.subscribe({
      next: (res) => {
        this.order.userID = this.UserId;
        this.order.orderQuantities = [];
        this.order.addressId = this.adressId;
        for (const item of this.product) {
          debugger;
          const Quantity = item.quantity !== undefined ? item.quantity : 0;
          this.order.orderQuantities.push({
            quantity: Quantity,
            productID: item.id,
            unitAmount: Number(item.price),
          }); 
        }
        this._PaypalService.create = this.order; 
      },
    });
  }

  //To calc NUmber on vart items we shoud do it in navbar
  ngOnInit(): void {
    this.addressshared.addressSubmitted$.subscribe((submitted) => {
      this.isAddressSubmitted = submitted;
    });
    this._PaypalService.initConfig();

    this._Cart.getProduct().subscribe((res) => {
      this.product = res;
      this.grandToltal = this._Cart.getTotalPrice();
      this.calculateGrandTotal();
      for (let product of res) {
        this.currentId = product.id;
      }
      // Update the isCartEmpty based on the products list
      this.isCartEmpty = res.length === 0;
    });

    // this._Cart.getProduct()
    // .subscribe(res=>{
    //   debugger
    //   this.product=res
    //   this.grandToltal=this._Cart.getTotalPrice()
    //   })

    this.activatedrouter.paramMap.subscribe((paramMap) => {
      this._ProductServiceService.getProductById(this.currentId).subscribe({
        next: (res) => {
          this.currentProduct = res;
          this.RandomProducts();
          this.productStateService.changeProductId(this.currentId); // Update product ID state
        },
        error: (err) => console.log(err),
      });
    });
    this.AllProducts();
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

  calculateGrandTotal(): void {
    this.grandToltal = 0;
    this.product.forEach((product) => {
      this.grandToltal += (product.quantity || 0) * product.price;
    });
  }

  Remove(item: Iproduct): void {
    this._Cart.removeOrderItem(item.id);
    console.log("Cart is now empty.");
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
      error: (error) => console.log(error),
    });
  }

  gottoAddress() {
    this.getaddressidbyuserid(this.UserId);
    this.router.navigate(["/address"]);
  }

  getaddressidbyuserid(userid: string) {
    if (!userid) return;

    this._AuthService.GetAddressIdByUserId(userid).subscribe({
      next: (data) => {
        // Assuming 'data' correctly represents the address ID you need
        this.adressId = +data; // Correctly update adressId with the received data
        this.order.addressId = this.adressId; // Now update the order with the correct address ID
      },
      error: (error) => console.log(error),
    });
  }

  goBack() {
    window.history.back();
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.calculateGrandTotal();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateGrandTotal();
    }
  }
  getProductDescription(product: Iproduct): string {
    return this.lang === "en" ? product.descriptionEn : product.descriptionAr;
  }
  RandomProducts(): void {
    this._ProductServiceService
      .getproudectsbycatogry(
        this.currentProduct.id,
        this.pageSize,
        this.pageNumber
      )
      .subscribe({
        next: (res: Iproduct[]) => {
          this.Products = res;
          this.randomProducts = this.getRandomProducts(this.Products);
        },
      });
  }

  getRandomProducts(products: Iproduct[]): Iproduct[] {
    let randomProducts: Iproduct[] = [];
    let maxIndex = Math.min(6, products.length);
    let randomIndices: number[] = [];
    while (randomIndices.length < maxIndex) {
      let randomIndex = Math.floor(Math.random() * products.length);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
        randomProducts.push(products[randomIndex]);
      }
    }
    return randomProducts;
  }
  AllProducts() {
    this._ProductServiceService
      .getAllProducts(this.pageSize, this.pageNumber)
      .subscribe((res) => {
        this.allProducts = res;
        console.log(this.allProducts);
      });
  }

  canIncreaseQuantity(item:any): boolean {
    return item.quantity < item.stockQuantity;
}
}
