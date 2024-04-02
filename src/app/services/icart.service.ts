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
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.StockQuantity = (existingProduct.StockQuantity ?? 1) + 1;
    } else {
      this.cartItems.push({ ...product, StockQuantity: 1 });
    }
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
    const existingProductIndex = this.cartItems.findIndex(item => item.id === product.id);
  if (existingProductIndex !== -1) {
    const existingProduct = this.cartItems[existingProductIndex];
    if (existingProduct.StockQuantity && existingProduct.StockQuantity > 1) {
      existingProduct.StockQuantity -= 1;
    } else {
      this.cartItems.splice(existingProductIndex, 1); 
    }
    this.saveCartItems();
    this.getTotalPrice();
  }
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