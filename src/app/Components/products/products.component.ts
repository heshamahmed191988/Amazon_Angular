import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  constructor()
  {
    
   
  }
  

 
  // to make filtration each time change happen 
  ngOnChanges() {
    

    
  }
 
} 