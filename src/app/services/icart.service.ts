import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Iproduct } from '../models/iproduct';

@Injectable({
  providedIn: 'root'
})
export class ICartService {
  private cartItems: Iproduct[] = [];
  private cartItemsSubject = new BehaviorSubject<Iproduct[]>([]);

  constructor() {
    this.loadCartItems();
  }

  getProduct() {
    return this.cartItemsSubject.asObservable();
  }

  addtoOrder(product: Iproduct, quantity: number) {
    const existingProductIndex = this.cartItems.findIndex(item => item.id === product.id);
    if (existingProductIndex !== -1) {
      // If the product exists, update its quantity
      this.cartItems[existingProductIndex].quantity = (this.cartItems[existingProductIndex].quantity || 0) + quantity;
    } else {
      // If the product doesn't exist, add it with the specified quantity
      const productToAdd = { ...product, quantity };
      this.cartItems.push(productToAdd);
    }
    this.saveCartItems();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }

  removeOrderItem(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.saveCartItems();
  }

  removeAllOrder() {
    this.cartItems = [];
    this.saveCartItems();
  }

  private loadCartItems() {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      this.cartItems = JSON.parse(savedCartItems);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  private saveCartItems() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.cartItemsSubject.next(this.cartItems);
  }
}
