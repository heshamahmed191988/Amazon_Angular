import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iproduct } from '../models/iproduct';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Iresultproduct } from '../models/iresultproduct';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(private httpclient:HttpClient) { }

  getAllProducts(): Observable<Iproduct[]>{
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/all`)
  }
  getAllProductsPagination(pagenumber:number,items:number): Observable<Iresultproduct>{
    return this.httpclient.get<Iresultproduct>(`${environment.baseUrl}/api/Product/all?pagenumber=${pagenumber}&itemsperpage=${items}`)
  }

  //  getProductById(id: number): Observable<Iproduct> {
  //   return this.httpclient.get<Iproduct>(`${environment.baseUrl}/api/Product/${id}`)
  //  }

  getProductById(id: number): Observable<Iproduct> {
    return this.httpclient.get<Iproduct>(`${environment.baseUrl}/api/Product?id=${id}`);


  }
  filterdbynameProducts(name: string,pagenumber:number,items:number): Observable<Iproduct[]> {
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/searchname?name=${name}&pagenumber=${pagenumber}&items=${items}`);
  }



  filterdbybrandname(name: string): Observable<Iproduct[]> {
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/searchbrand?name=${name}`);
  }
  getbrandsname(): Observable<Iproduct[]>{
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/brands`)
  }


  getproudectsbycatogry(id: number): Observable<Iproduct[]> {
    return this.httpclient.get<Iproduct[]>(`http://localhost:5110/api/Product/bycatogry?catid=${id}`);
  }
  filterProductsByCategoryAndName(categoryId: number, name: string): Observable<Iproduct[]> {
    return this.httpclient.get<Iproduct[]>(`http://localhost:5110/api/Product/ByCategoryAndName?categoryId=${categoryId}&name=${name}`);
  }
}

