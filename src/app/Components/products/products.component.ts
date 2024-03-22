import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Iproduct } from '../../models/iproduct';
import { CommonModule } from '@angular/common';
import { Icategory } from '../../models/icategory';
import { FormsModule } from '@angular/forms';
import { HighlightCardDirective } from '../../directives/highlight-card-directive.directive';
import { EgyptianIdDatePipe } from '../../pipes/egyptian-id-date-pipe.pipe';
import { FormatCreditCardPipe } from '../../pipes/format-credit-card-pipe.pipe';
import { icartitem } from '../../models/icartitem';
import { StaticProductsService } from '../../services/static-products.service';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,FormsModule,HighlightCardDirective,EgyptianIdDatePipe,FormatCreditCardPipe,RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products:Iproduct[]
  filterdProducts:Iproduct[];
  totalorder:number=0;
  @Input() recievedSelectedCatId:number=1;
  @Output() onTotalPriceChanged:EventEmitter<number>;
  @Output() addItemToCart: EventEmitter<{ product: Iproduct; count: number }> = new EventEmitter<{ product: Iproduct; count: number }>();
  constructor(private prodService:StaticProductsService,private router:Router)
  {
    
    this.products = this.prodService.products;


    this.filterdProducts = this.products
    this.onTotalPriceChanged = new EventEmitter<number>();
  }
  

 
  // to make filtration each time change happen 
  ngOnChanges() {
    this.prodService.getProductByCatId(this.recievedSelectedCatId);

    
  }
  addToCart(product: Iproduct, quantity: string) {
    this.addItemToCart.emit({ product, count:parseInt(quantity)});
  }
  
 
updateProductQuantity(productId: number, decrementBy: number) {
  const product = this.products.find(p => p.ID === productId);
  if (product) {
    product.Quantity = Math.max(product.Quantity - decrementBy, 0);
  }
}
updateQuantities(cartItems: icartitem[]) {
  cartItems.forEach(item => {
    const product = this.products.find(p => p.ID === item.product.ID);
    if (product) {
      product.Quantity = Math.max(product.Quantity - item.count, 0);
    }
  });
  this.prodService.getProductByCatId(this.recievedSelectedCatId); // Refresh the filteredProducts to reflect the quantity changes
}
gotodetails(id:number)
{
// this.router.navigateByUrl(`/Details/${id}`);
this.router.navigate(['/Details',id]);
}
} 