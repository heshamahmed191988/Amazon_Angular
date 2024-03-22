import { Routes } from '@angular/router';
import { OrderComponent } from './Components/order/order.component';
import { AboutUsComponent } from './Components/about-us/about-us.component';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { MainLayoutComponent } from './Components/main-layout/main-layout.component';
import { LoginComponent } from './Components/login/login.component';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';

export const routes: Routes = [
   //     

    {path: '', 
    component:MainLayoutComponent,
    children: [
        {path: '', redirectTo:'Home',pathMatch: 'full'},
        {path:'Home', component:OrderComponent},
         {path:'About', component:AboutUsComponent},
         {path:'ContactUs', component:ContactUsComponent},
         {path:'Details/:id', component:ProductDetailsComponent}
   ],
},
    {path:'login', component:LoginComponent},
    
    {path:'**',component:NotFoundComponent}
];










// export const routes: Routes = [
//     {path: '', redirectTo:'Home',pathMatch: 'full'},
//      {path:'Home', component:OrderComponent},
//      {path:'About', component:AboutUsComponent},
//      {path:'ContactUs', component:ContactUsComponent},
//      {path:'**',component:NotFoundComponent}
//  ];
 