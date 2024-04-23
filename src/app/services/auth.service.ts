import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Registration } from '../models/Registration';
import { Login } from '../models/Login';
import { environment } from '../../environments/environment.development';
import { ICartService } from './icart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
isloggedstate !:BehaviorSubject<boolean>
  constructor(private http: HttpClient,private cart:ICartService) { 
    this.isloggedstate = new BehaviorSubject<boolean>(this.isLoggedIn());
  }

 
  // register(user: Registration): Observable<any> {
  //   return this.http.post(`${environment.baseUrl}/api/Account/register`, user);
  // }

  register(user: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/Account/register`, user, { observe: 'response' })
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.text() || '';
      const err = body || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return throwError(() => errMsg);
  }
  login(credentials: Login): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/Account/login`, credentials).pipe(
      map((response: any) => {
        if (response && response.token) {
          // Save the token to local storage or session storage
          localStorage.setItem('jwtToken', response.token);
          localStorage.setItem('tokenExpiration', response.expiration);
          this.isloggedstate.next(true);
        }
        return response;
      }),
      catchError(error => {
        // Handle errors appropriately
        return throwError(error);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const expiration = localStorage.getItem('tokenExpiration');
    return !!token && new Date(expiration!) > new Date(); // Simple check for token presence and not expired
  }

  logout(): void {
    // Remove token and other user data from storage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('tokenExpiration');
    this.isloggedstate.next(false);
   this.cart.removeAllOrder();
  }

  // Method to automatically attach JWT to HttpHeaders (for making authenticated requests)
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getloggedstatus(): BehaviorSubject<boolean> {
return this.isloggedstate;
  }


  getCurrentUserId(): Observable<any> {
    const headers = this.getAuthHeaders(); // Use getAuthHeaders to ensure the token is included
    return this.http.get(`${environment.baseUrl}/api/Account/currentUserId`, { headers: headers }).pipe(
      catchError(error => {
        // Error handling logic
        return throwError(error);
      })
    );
  }

  getCurrentUserDetails(): Observable<any> {
    const headers = this.getAuthHeaders(); // Use getAuthHeaders to ensure the token is included
    return this.http.get(`${environment.baseUrl}/api/Account/currentUserDetails`, { headers: headers }).pipe(
      catchError(error => {
        // Error handling logic
        return throwError(error);
      })
    );
  }
  GetAddressIdByUserId(userId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${environment.baseUrl}/api/Account/addressid/${userId}`;
    return this.http.get(url, { headers: headers, responseType: 'text' }).pipe(
      catchError(error => {
        // Error handling logic
        return throwError(error);
      })
    );
  }
}