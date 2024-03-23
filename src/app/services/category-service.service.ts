import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Icategory } from '../models/icategory';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoryServiceService {

  constructor(private httpclient:HttpClient) {

   }

getAllCategory():Observable<Icategory[]>
{
  return this.httpclient.get<Icategory[]>(`${environment.baseUrl}/category`);
  
}
  
}
