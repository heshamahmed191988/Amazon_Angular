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
import { TranslateModule } from '@ngx-translate/core';
import { ReviewService } from '../../services/review.service';
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
    price: 0,
    rating:0,
  };

  payPalConfig: IPayPalConfig | undefined;
  currentId: number = 0;
  constructor(private activatedrouter: ActivatedRoute
    , private location: Location, private route: Router,
    private _ProductServiceService: ProductServiceService,
    private _PaypalService: PaypalService, private _AuthService: AuthService,private _Cart:ICartService,private productStateService: ProductStateService,private reviewService: ReviewService) {
    this.setUserid();
    this._PaypalService.updateOrderData.subscribe({
      next: (data) => {
      console.log(this.currentProduct.rating,"rrrr");
        this.order.userID = this.UserId;
        this.order.orderQuantities = [];
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
    //paypal
    this._PaypalService.initConfig();

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
          this.fetchReviews();
          this.productStateService.changeProductId(this.currentId); // Update product ID state
        },
        error: (err) => console.log(err)
      });
    });

    // this.setUserid()
    this.payPalConfig = this._PaypalService.payPalConfig;
  }

  fetchReviews() {
    this.reviewService.getReviewsByProductId(this.currentProduct.id!).subscribe({
      next: (reviews) => {
        if (reviews && reviews.length > 0) {
          let totalRating = 0;
          for (let review of reviews) {
            totalRating += review.rating || 0;
          }
          this.currentProduct.rating = totalRating / reviews.length;
        } else {
          this.currentProduct.rating = 0;
        }
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
      }
    });
  }
  
  addToOrder(currentProduct:Iproduct){
    this._Cart.addtoOrder(currentProduct);
  }  

  buy(value: string) {
    this.Quantity = Number(value);
  }


  createorder

    (): void {

  }

  setUserid() {
    this._AuthService.getCurrentUserId().subscribe(user => {
      this.UserId = user.userId
      //console.log(this.UserId)
    })
  }
}




