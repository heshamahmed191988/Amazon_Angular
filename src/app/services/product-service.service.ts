import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iproduct } from '../models/iproduct';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(private httpclient:HttpClient) { }

  // getAllProducts(): Observable<Iproduct[]>{
  //   return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/all`)
  // }

  getAllProducts(pageSize: number, pageNumber: number): Observable<Iproduct[]> {
    let params = new HttpParams()
      .append('pageSize', pageSize.toString())
      .append('pageNumber', pageNumber.toString());
  
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/all`, { params });
  }
  getproudectsbycatogry(id: number,pageSize: number, pageNumber: number): Observable<Iproduct[]> {
    let params = new HttpParams()
    .append('pageSize', pageSize.toString())
    .append('pageNumber', pageNumber.toString());
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/bycatogry?catid=${id}`,{ params });
  }

  //  getProductById(id: number): Observable<Iproduct> {
  //   return this.httpclient.get<Iproduct>(`${environment.baseUrl}/api/Product/${id}`)
  //  }

  getProductById(id: number): Observable<Iproduct> {
    
    return this.httpclient.get<Iproduct>(`${environment.baseUrl}/api/Product?id=${id}`);
   
    
  }
  filterdbynameProducts(name: string,pageSize: number, pageNumber: number): Observable<Iproduct[]> {
    let params = new HttpParams()
    .append('pageSize', pageSize.toString())
    .append('pageNumber', pageNumber.toString());
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/searchname?name=${name}`,{ params });
  }


 
  filterdbybrandname(name: string,pageSize: number, pageNumber: number): Observable<Iproduct[]> {
    let params = new HttpParams()
    .append('pageSize', pageSize.toString())
    .append('pageNumber', pageNumber.toString());
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/searchbrand?name=${name}`,{ params });
  }
  getbrandsname(): Observable<Iproduct[]>{
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/brands`)
  }


  
  filterProductsByCategoryAndName(categoryId: number, name: string,pageSize: number, pageNumber: number): Observable<Iproduct[]> {
    let params = new HttpParams()
    .append('pageSize', pageSize.toString())
    .append('pageNumber', pageNumber.toString());
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/ByCategoryAndName?categoryId=${categoryId}&name=${name}`,{ params });
  }

  // filterProductsByCategoryAndNameandprice(categoryId: number, name: string, price: number, pageSize: number, pageNumber: number)
  // {
  //   let params = new HttpParams()
  //   .append('pageSize', pageSize.toString())
  //   .append('pageNumber', pageNumber.toString());
  //   return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/ByCategoryAndNameSortedByPrice?categoryId=${categoryId}&name=${name}`,{ params });
  // }

  filterProductsByCategoryAndNameAndPrice(categoryId: number, sortOrder: string = 'asc', pageSize: number, pageNumber: number) {
    let params = new HttpParams()
      .append('pageSize', pageSize.toString())
      .append('pageNumber', pageNumber.toString())
      .append('sortOrder', sortOrder);
  
    // Conditionally append categoryId, name, and price if they are provided
    if (categoryId !== 0) {
      params = params.append('categoryId', categoryId.toString());
    }
  
    
  
    
  
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/all/sorted`, { params });
  }
  
  
}

