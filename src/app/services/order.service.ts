import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IorderId } from '../models/iorder-id';
import { IcreatrOrder } from '../models/icreatr-order';
import { IUpdateOrder } from '../models/iupdate-order';
import { IResultUpdate } from '../models/iresult-update';
import { Iorderuserid } from '../models/iorderuserid';
import { Iorderdetails } from '../models/iorderdetails';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private httpclient:HttpClient) { }
  getOrerByUserId(UserId:string):Observable<Iorderuserid[]>{
    return this.httpclient.get<Iorderuserid[]>(`${environment.baseUrl}/api/Order/${UserId}`);
  }


  getorderdetails(orderid:number):Observable<Iorderdetails[]>
  {
    return this.httpclient.get<Iorderdetails[]>(`${environment.baseUrl}/api/Order/orderid?orderId=${orderid}`)
  }



  CreateOrder(create:IcreatrOrder):Observable<IorderId>{
    return this.httpclient.post<IorderId>(`${environment.baseUrl}/api/Order`, {
      userID: create.userID,
      orderQuantities: create.orderQuantities,
       addressId: create.addressId
    });
    }


//   updateOrder(update: IUpdateOrder): Observable<IResultUpdate> {
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json'
//       })
//     };

//     // Ensure you use backticks here
//     return this.httpclient.put<IResultUpdate>(`
//       ${environment.baseUrl}/api/Order`, // Ensure this is the correct endpoint
//       JSON.stringify(update),
//       httpOptions
//   );
// }


updateOrder(update: IUpdateOrder): Observable<IResultUpdate> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  return this.httpclient.put<IResultUpdate>(
    `${environment.baseUrl}/api/Order`, // Make sure this URL is correct
    update, // No need to stringify when using HttpClient and the correct headers
    httpOptions
  );
}
  DeleteOrder(id:number):Observable<void>
  {
    return this.httpclient.delete<void>(`${environment.baseUrl}/api/Order/${id}`);
  }

  createPayment(orderid:number):Observable<void>
  {
    return this.httpclient.post<void>(`${environment.baseUrl}/api/Payment?orderId=${orderid}`,null)
  }

}