import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { deal } from '../models/deal';

@Injectable({
  providedIn: 'root'
})
export class DealService {
  constructor(private http: HttpClient) { }

  getDeals(): Observable<deal[]> {
    return this.http.get<deal[]>('assets/today_deals/today_deals.json');
  }
}