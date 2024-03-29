import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iproduct } from '../models/iproduct';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(private httpclient:HttpClient) { }

  getAllProducts(): Observable<Iproduct[]>{
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/all`)
  }

  getProductById(id: number): Observable<Iproduct> {
    return this.httpclient.get<Iproduct>(`${environment.baseUrl}/api/Product?id=${id}`);
  }
  
  filterdbynameProducts(name: string): Observable<Iproduct[]> {
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/searchname?name=${name}`);
  }

getproudectbycategory(categoryid: number): Observable<Iproduct[]> {
  return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/bycatogry?catid=${categoryid}`);
}
}
