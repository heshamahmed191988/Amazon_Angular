import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressSharedService {
  private addressSubmittedSource = new BehaviorSubject<boolean>(false);
  addressSubmitted$ = this.addressSubmittedSource.asObservable();
  setAddressSubmitted(submitted: boolean): void {
    this.addressSubmittedSource.next(submitted);
  }
  constructor() { }
}
