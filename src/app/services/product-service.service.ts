import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iproduct } from '../models/iproduct';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(private httpclient:HttpClient) { }

  
  getAllProducts(): Observable<Iproduct[]>{
    return this.httpclient.get<Iproduct[]>(`http://localhost:5110/api/Product/all`)
  }


  getProductById(id: number): Observable<Iproduct> {
    return this.httpclient.get<Iproduct>(`http://localhost:5110/api/Product?id=${id}`);
  }
  filterdbynameProducts(name: string): Observable<Iproduct[]> {
    return this.httpclient.get<Iproduct[]>(`http://localhost:5110/api/Product/searchname?name=${name}`);
  }
  filterdbybrandname(name: string): Observable<Iproduct[]> {
    return this.httpclient.get<Iproduct[]>(`http://localhost:5110/api/Product/searchbrand?name=${name}`);
  }
  getbrandsname(): Observable<Iproduct[]>{
    return this.httpclient.get<Iproduct[]>(`http://localhost:5110/api/Product/brands`)
  }
 
  getproudectsbycatogry(id: number): Observable<Iproduct[]> {
    return this.httpclient.get<Iproduct[]>(`http://localhost:5110/api/Product/bycatogry?catid=${id}`);
  }
  filterProductsByCategoryAndName(categoryId: number, name: string): Observable<Iproduct[]> {
    return this.httpclient.get<Iproduct[]>(`http://localhost:5110/api/Product/ByCategoryAndName?categoryId=${categoryId}&name=${name}`);
  }
}

