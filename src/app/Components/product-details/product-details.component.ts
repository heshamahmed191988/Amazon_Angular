import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ProductServiceService } from '../../services/product-service.service';
import { Iproduct } from '../../models/iproduct';
import { ProductStateService } from '../../services/product-state.service';
import { ReviewComponent } from '../review/review.component';
import { SafeBase64Pipe } from '../../pipes/safe-base64.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [CommonModule, ReviewComponent,SafeBase64Pipe,TranslateModule]
})
export class ProductDetailsComponent implements OnInit {
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

  currentId: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private productService: ProductServiceService,
    private productStateService: ProductStateService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.currentId = Number(paramMap.get('id'));
      this.productService.getProductById(this.currentId).subscribe({
        next: (res) => {
          this.currentProduct = res;
          this.productStateService.changeProductId(this.currentId); // Update product ID state
        },
        error: (err) => console.log(err)
      });
    });
  }
}
