import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IorderId } from '../models/iorder-id';
import { IcreatrOrder } from '../models/icreatr-order';
import { IUpdateOrder } from '../models/iupdate-order';
import { IResultUpdate } from '../models/iresult-update';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private httpclient:HttpClient) { }
  getOrerById(UserId:string):Observable<IorderId>{
    return this.httpclient.get<IorderId>(`${environment.baseUrl}/api/Order/${UserId}`);
  }


  CreateOrder(create:IcreatrOrder):Observable<IorderId>{
    return this.httpclient.post<IorderId>(`${environment.baseUrl}/api/Order`, {
      userID: create.userID,
      orderQuantities: create.orderQuantities
    });
    }
    
  updateOrder(update:IUpdateOrder):Observable<IResultUpdate>
  {
    return this.httpclient.put<IResultUpdate>(`${environment.baseUrl}/api/Order`,JSON.stringify(update));
  }

  DeleteOrder(id:number): void
  {
   this.httpclient.delete(`${environment.baseUrl}/api/Order/${id}`);
  }

  createPayment(orderid:number):Observable<void>
  {
    return this.httpclient.post<void>(`${environment.baseUrl}/api/Payment?orderId=${orderid}`,null)
  }

}
