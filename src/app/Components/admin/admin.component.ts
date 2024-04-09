import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  UserId:string=''
 constructor(private _AuthService:AuthService,private router: Router){}
 ngOnInit():void{
this.setUserid()
}
setUserid() {
  this._AuthService.getCurrentUserId().subscribe(user => {
      this.UserId = user.userId;
    });
}
logout(): void {
  this._AuthService.logout();
  this.router.navigate(['/login']);
}
}