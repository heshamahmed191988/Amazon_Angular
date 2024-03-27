import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewUserDTO } from '../models/review-user-dto';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private httpclient:HttpClient) { }
  
  getReviewsByProductId(productID: number): Observable<ReviewUserDTO[]> {
    const url = `${environment.baseUrl}/api/Reviews/Product/${productID}`;
    return this.httpclient.get<ReviewUserDTO[]>(url);
  }

  postReview(reviewDto: ReviewUserDTO): Observable<ReviewUserDTO> {
    return this.httpclient.post<ReviewUserDTO>(`${environment.baseUrl}/api/Reviews`, reviewDto);
  }

  
}