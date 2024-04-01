import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Address } from '../models/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpclient:HttpClient) { }
  getAddressById(id: number): Observable<Address> {
    return this.httpclient.get<Address>(`${environment.baseUrl}/api/Address/${id}`);
  }

  createAddress(address: Address): Observable<Address> {
    return this.httpclient.post<Address>(`${environment.baseUrl}/api/Address`, address, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'text/plain'
      })
    });
  }
}
