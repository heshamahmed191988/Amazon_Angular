import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output ,ViewChild,ElementRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icategory } from '../../models/icategory';
import { ProductsComponent } from '../products/products.component';
import { icartitem } from '../../models/icartitem';
import { Iproduct } from '../../models/iproduct';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule,FormsModule,ProductsComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  cartItems: icartitem[] = [];
  selcategoryId:number = 1;
  // !:non null assertion operator  productsComponent it hold elemnent in html
  @ViewChild(ProductsComponent) productsComponent!: ProductsComponent;

  categories:Icategory[];
  
  totalorderprice:number = 0;
  @Output() checkoutEvent: EventEmitter<icartitem[]> = new EventEmitter<icartitem[]>();

  
  @ViewChild('username') username!:ElementRef
constructor()
{
  this.categories=[
    {ID:1,Name:'Mobile'},
    {ID:2,Name:'Laptop'},
    {ID:3,Name:'Tablet'},

  ]
 
}
viewTotalPrice(totalOrderPrice:number){
this.totalorderprice = totalOrderPrice;
}
// ngAfterViewInit() {
//  console.log(this.username.nativeElement.querySelector.value); 
 
  
// }


updateTotalOrderPrice() {
  this.totalorderprice = this.cartItems.reduce((acc, item) => acc + item.product.Price * item.count, 0);
}

onAddItemToCart(item: { product: Iproduct; count: number }) {
  const existingItemIndex = this.cartItems.findIndex(ci => ci.product.ID === item.product.ID);
  if (existingItemIndex !== -1) {
    this.cartItems[existingItemIndex].count += item.count;
  } else {
    this.cartItems.push(item);
  }
  this.updateTotalOrderPrice();
}
removeItem(index: number) {
  this.cartItems.splice(index, 1);
  this.updateTotalOrderPrice();
}

checkout() {
  // directly call the updateQuantities method of ProductsComponent
  this.productsComponent.updateQuantities(this.cartItems);

  // Clear the cartItems and update total price after checkout
  this.cartItems = [];
  this.updateTotalOrderPrice();
}

}
