import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Iedituser } from '../../models/iedituser';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit{
  userId:string=''
  userName:string=''
  currentPassword:string=''
  newPassword:string=''
  confirmPassword:string=''
  user:Iedituser={  userId:'',
  userName:'',
  currentPassword:'',
  newPassword:'',
  confirmPassword:''}
  constructor(private _authServices:AuthService,private _EditServices:UserService,private router: Router){

  }
  ngOnInit():void{
    this.setUserid()
    }
  Edit(){
    debugger
    this.user.userId = this.userId;
    this.user.userName = this.userName;
    this.user.currentPassword = this.currentPassword;
    this.user.newPassword = this.newPassword;
    this.user.confirmPassword=this.confirmPassword;
    this._EditServices.updateUser(this.user).subscribe(res =>
      {
        console.log("edit Successfully");
        this.router.navigate(['/login']);
      })
  }
    setUserid() {
      this._authServices.getCurrentUserId().subscribe(user => {
          this.userId = user.userId;
        });
    }
}