import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductStateService {
  private currentProductIdSource = new BehaviorSubject<number>(0);
  currentProductId$ = this.currentProductIdSource.asObservable();

  changeProductId(productId: number): void {
    this.currentProductIdSource.next(productId);
  }
}
