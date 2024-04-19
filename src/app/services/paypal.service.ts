import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgxPayPalModule } from 'ngx-paypal';
import { OrderService } from './order.service';
import { IcreatrOrder } from '../models/icreatr-order';
import { BehaviorSubject } from 'rxjs';
import { ICartService } from './icart.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PaypalService {
    public payPalConfig?: IPayPalConfig;
    public showSuccess: boolean = false
    public showCancel: boolean = false
    public showError: boolean = false
    public orderid : number = 0;
    public updateOrderData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    public create: IcreatrOrder = {userID:"",orderQuantities:[],addressId:0} ;

    constructor(private _OrderService: OrderService,private router:Router,private _CartServices:ICartService) { }

    public initConfig(): void {
        this.payPalConfig = {
            currency: 'EUR',
            clientId: 'sb',
            createOrderOnClient: (data): ICreateOrderRequest => {


                this.updateOrderData.next({

                });
                let items: any[] = [];
                let totalValue = 0;
                let Quantity = 1;

                
                for (const orderQuantity of this.create.orderQuantities) {
                    const unitAmount = orderQuantity.unitAmount;
                    const quantity = orderQuantity.quantity;
                    const itemTotal = unitAmount * quantity;

                    totalValue += itemTotal;

                    items.push({
                        name: 'Enterprise Subscription',
                        quantity: quantity.toString(),
                        category: 'DIGITAL_GOODS',
                        unit_amount: {
                            currency_code: 'EUR',
                            value: unitAmount.toFixed(2),
                        },
                    });
                }
                return {
                    intent: 'CAPTURE',
                    purchase_units: [{
                        amount: {
                            currency_code: 'EUR',
                            value: totalValue.toFixed(2),
                            breakdown: {
                                item_total: {
                                    currency_code: 'EUR',
                                    value: totalValue.toFixed(2)
                                }
                            }
                        },
                        items: items
                    }]

                }
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'vertical'
            },
            onApprove: (data, actions) => {

                console.log('onApprove - transaction was approved, but not authorized', data, actions);
                actions.order.get().then(
                    console.log('onApprove - you can get full order details inside onApprove: ')
                );

                if (this.create !== undefined) {
                    debugger
                    console.log(this.create)
                    this._OrderService.CreateOrder(this.create).subscribe(a => {
                        console.log(a)
                        this.orderid = a.entity.id
                        this._OrderService.createPayment(this.orderid).subscribe(a =>{
                           // console.log(a);
                        })
                    })
                    this._CartServices.removeAllOrder();
                    this.router.navigate(['/PaymentResult']);
                }
                else {
                    console.log("the order not found");
                }
                if(this.orderid != 0)
                {
                    debugger
                    // this._OrderService.createPayment(this.orderid).subscribe(a =>{
                    //     console.log(a);
                    // })
                }
                else{
                    console.log("no order");
                }

            },
            onClientAuthorization: (data) => {
                console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
                this.showSuccess = true;

            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
                this.showCancel = true;

            },
            onError: err => {
                console.log('OnError', err);
                this.showError = true;
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
                this.resetStatus();
            }
        };
    }
    resetStatus(): void {
        this.showSuccess = false;
        this.showCancel = false;
        this.showError = false;
}
}