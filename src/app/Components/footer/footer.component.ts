import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RegisterComponent } from '../register/register.component';
import { FormsModule } from '@angular/forms';
import { Icategory } from '../../models/icategory';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule,RouterLink,RouterLinkActive,CommonModule,RegisterComponent,RouterModule,FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  lang:string="en";

  constructor(private translate: TranslateService)
  {

  }
  ngOnInit(): void {
    this.lang=localStorage.getItem('lang')||'en';

  }
  changelanguage(lang: any) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
   
  }
}
