import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
let router=inject(Router);
let userauthservice=inject(AuthService)
  
    if(userauthservice.isLoggedIn()) 

    {
      return true;
    }
    else
    {
      //alert('You must be logged in first.');
      router.navigate(['/login']);
      return false;
    }

  // return true;
};
