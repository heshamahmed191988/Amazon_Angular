import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output ,ViewChild,ElementRef, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProductsComponent } from '../products/products.component';
import { Iorderuserid } from '../../models/iorderuserid';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Iorderdetails } from '../../models/iorderdetails';
import{ IUpdateOrder } from '../../models/iupdate-order'

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule,FormsModule,ProductsComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit{
  public orders: Iorderuserid[] = []
  public orderdetails:Iorderdetails[]= []
  public updateorder:IUpdateOrder ={orderId:1,productId:1,quantity:1,orderItemId:1}
  public UserId:string = ""
constructor(private _OrderService:OrderService,private _AuthService:AuthService)
{

}
  ngOnInit(): void {
    this.setUserid();
    this._OrderService.getOrerByUserId(this.UserId).subscribe({
      next:(res)=>{
        this.orders = res
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
setUserid() {
  debugger
    this._AuthService.getCurrentUserId().subscribe(user => {
      this.UserId = user.userId
      console.log(this.UserId)
    })
  }
  details(orderid: number) {
    this._OrderService.getorderdetails(orderid).subscribe(res =>{
        console.log(res);
        this.orderdetails = res;
    });
  }
  updateQuantity(orderupdate:Iorderdetails,quantity:string)
  {
    this.updateorder.productId = orderupdate.productid;
    this.updateorder.quantity = Number(quantity);
    this.updateorder.orderId = orderupdate.orderid;
    this.updateorder.orderItemId = orderupdate.orderitemid;
    debugger
    this._OrderService.updateOrder(this.updateorder).subscribe({
      next:(res)=>{
        console.log(res)
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }


  delete(id:number){
     this._OrderService.DeleteOrder(id).subscribe(
      {
        next:(res)=>{
          console.log("deleted successfully");
        },
        error:(err)=>{
          console.log(err);
        }
      }
     )
  }
}
