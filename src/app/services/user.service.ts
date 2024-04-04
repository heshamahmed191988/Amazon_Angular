import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iedituser } from '../models/iedituser';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  updateUser(user:Iedituser):Observable<void>{
    return this.http.put<void>(`${environment.baseUrl}/api/UserInfo?userId=${user.userId}`,{
      userName:user.userName,
      currentPassword:user.currentPassword,
      newPassword:user.newPassword,
      confirmPassword:user.confirmPassword
    })
  }
}