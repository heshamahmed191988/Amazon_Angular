import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iproduct } from '../models/iproduct';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { FilterCriteria } from '../models/filterCriteria';

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


 
  filterdaLLbrand(name: string,pageSize: number, pageNumber: number): Observable<Iproduct[]> {
    let params = new HttpParams()
    .append('pageSize', pageSize.toString())
    .append('pageNumber', pageNumber.toString());
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/searchAllbrand?name=${name}`,{ params });
  }
  filterdbybrandname(name: string, categoryId: number, pageSize: number, pageNumber: number): Observable<Iproduct[]> {
    let params = new HttpParams()
        .append('categoryId', categoryId.toString())
        .append('pageSize', pageSize.toString())
        .append('pageNumber', pageNumber.toString());
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/searchbrand?name=${name}`, { params });
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

  filterProductsByCategoryAndNameAndPrice(categoryId: number, sortOrder: string = 'asc', pageSize: number, pageNumber: number, brandName?: string) {
    let params = new HttpParams()
      .append('pageSize', pageSize.toString())
      .append('pageNumber', pageNumber.toString())
      .append('sortOrder', sortOrder);
  
    // Conditionally append categoryId if it is provided and not zero
    if (categoryId !== 0) {
      params = params.append('categoryId', categoryId.toString());
    }
  
    // Conditionally append brandName if it is provided
    if (brandName) {
      params = params.append('brandName', brandName);
    }
  
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/all/sorted`, { params });
  }


  getFilteredProducts(filters: any, pageSize: number, pageNumber: number): Observable<any> {
    // Initialize HttpParams
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNumber', pageNumber.toString());
  
    // Add other filter parameters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        // This ensures even complex objects or enums get sent as readable strings for the API to interpret
        params = params.set(key, filters[key].toString());
      }
    });
  
    return this.httpclient.get<FilterCriteria>(`${environment.baseUrl}/api/Product/filtered`, { params });
  }
  









  filterProductsByCategoryAndPriceRange(categoryId: number, minPrice: number, maxPrice: number, pageSize: number, pageNumber: number) {
    let params = new HttpParams()
      .append('pageSize', pageSize.toString())
      .append('pageNumber', pageNumber.toString());
  
    // Conditionally append categoryId if provided and not 0
    if (categoryId !== 0) {
      params = params.append('categoryId', categoryId.toString());
    }
  
    // Append minPrice and maxPrice to the request parameters
    params = params.append('minPrice', minPrice.toString())
                   .append('maxPrice', maxPrice.toString());
  
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/all/filteredprice`, { params });
  }
  filterProductsByPriceRange(minPrice: number, maxPrice: number) {
    let params = new HttpParams()
      .append('minPrice', minPrice.toString())
      .append('maxPrice', maxPrice.toString());
  
    return this.httpclient.get<Iproduct[]>(`${environment.baseUrl}/api/Product/all/filteredpriceAllcategory`, { params })
      
  }
  
  
}

