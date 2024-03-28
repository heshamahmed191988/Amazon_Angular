import { Injectable } from '@angular/core';
import { Iproduct } from '../models/iproduct';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ICartService {

  public cartItems: Iproduct[] = [];
  public productList = new BehaviorSubject<Iproduct[]>([]);

  constructor(private httpclient: HttpClient) {
    // Load cart items from local storage on initialization
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      this.cartItems = JSON.parse(savedCartItems);
      this.productList.next(this.cartItems);
    }
  }

  getProduct() {
    return this.productList.asObservable();
  }

  getProduc(product: Iproduct) {
    this.cartItems.push(product);
    this.saveCartItems();
  }
  addtoOrder(product: Iproduct) {
    this.cartItems.push(product);
    this.saveCartItems();
    this.getTotalPrice();
  }

  getTotalPrice(): number {
    let total = 0;
    this.cartItems.forEach(item => {
      total += item.price ? item.price : 0;
    });
    return total;
  }

  removeOrderIteam(product: Iproduct) {
    this.cartItems = this.cartItems.filter(item => item.id !== product.id);
    this.saveCartItems();
  }

  removeallOrder() {
    this.cartItems = [];
    this.saveCartItems();
  }

  private saveCartItems() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.productList.next(this.cartItems);
  }
}


