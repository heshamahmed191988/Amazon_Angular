import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgxPayPalModule } from 'ngx-paypal';
import { OrderService } from './order.service';
import { IcreatrOrder } from '../models/icreatr-order';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaypalService {
    public payPalConfig?: IPayPalConfig;
    public showSuccess: boolean = false
    public showCancel: boolean = false
    public showError: boolean = false
    public updateOrderData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    public create: IcreatrOrder = {} as IcreatrOrder;

    constructor(private _OrderService: OrderService) { }

    public initConfig(): void {
        this.payPalConfig = {
            currency: 'EUR',
            clientId: 'sb',
            createOrderOnClient: (data): ICreateOrderRequest => {

                this.updateOrderData.next(data);
                return {
                    intent: 'CAPTURE',
                        purchase_units: [{
                            amount: {
                                currency_code: 'EUR',
                                value: '9.99',
                                breakdown: {
                                    item_total: {
                                        currency_code: 'EUR',
                                        value: '9.99'
                                    }
                                }
                            },
                            items: [{
                                name: 'Enterprise Subscription',
                                quantity: '1',
                                category: 'DIGITAL_GOODS',
                                unit_amount: {
                                    currency_code: 'EUR',
                                    value: '9.99',
                                },
                            }]
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
                    console.log(this.create)
                    this._OrderService.CreateOrder(this.create).subscribe(a=>{
                        console.log(a)
                    })
                }
                else {
                    console.log("the order not found");
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
        this.showError = false;
    }
}

