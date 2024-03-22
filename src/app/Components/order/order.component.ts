import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output ,ViewChild,ElementRef} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProductsComponent } from '../products/products.component';


@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule,FormsModule,ProductsComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
 



  
constructor()
{
 
}

}
