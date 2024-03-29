import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,RouterLink,RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  constructor(private router: Router) { } 
  navigateToCategory(categoryId: number): void {
    // Navigate to the CategoryProudectsComponent with the selected category ID
    this.router.navigate(['/category', categoryId]); // Assuming your route for CategoryProudectsComponent is '/category/:id'
  }
}

