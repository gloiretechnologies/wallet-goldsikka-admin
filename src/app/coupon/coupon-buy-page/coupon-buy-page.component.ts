import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from '../../api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CouponService } from '../../coupon/coupon.service';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';



@Component({
    selector: 'app-coupon-buy',
    templateUrl: './coupon-buy-page.component.html',
    styleUrls: ['./coupon-buy-page.component.scss']
})
export class CouponBuyPageComponent implements OnInit {
    @Output() public couponValue = new EventEmitter<any>();
    @Input('jwellaryForm') public jwellaryFormDat: any;
    @Input('mygoldform') public mygoldformDat: any;

    public selectedName: any;

    isVisible: boolean = false;
    submitted: boolean;
    errorMessage: string;
    couponAppliedMessage: string;
    page: number = 1;
    errors: object = {};
    coupons: any = [];
    amount: number;
    couponCode: any;
    couponId: number;
    isSubmitting: boolean;
    onlineCouponAppliedMsg: string;
    onlineAlreadyApplied: boolean = false;


    form: FormGroup = new FormGroup({
        coupon: new FormControl('', [Validators.required]),
    });
    fin: any;

    constructor(
        private api: ApiService,
        private notification: NzNotificationService,
    private authService: AuthenticationService

            ) {
    }

    ngOnInit(): void {
     this.authService.checkAccess();

        this.getResults();
    }

    /**
     *
     */

    onOfflineApply(): void {
        this.submitted = true;
        this.isSubmitting = true;
        if (this.form.invalid) {
            return;
        }
        this.api.post(`coupon/offline-validation`, this.form.value)
            .subscribe((res: any) => {
                if (res.statusOk) {
                    this.couponAppliedMessage = 'Coupon code applied successfully';
                    this.couponCode = res.coupon;
                    this.amount = res.amount,
                    this.couponId = res.id;
                    this.errorMessage = '';
                    let amount: any;
                    let tenure: any;
                    let grams: any;
                    let isJewellery = false;
                    let isGold = false;
                    if (this.jwellaryFormDat) {
                        amount = this.jwellaryFormDat.amount;
                        tenure = this.jwellaryFormDat.tenure;
                        isJewellery = this.jwellaryFormDat.isJewellery;
                    }
                    else if (this.mygoldformDat) {
                        grams = this.mygoldformDat.grams;
                        tenure = this.mygoldformDat.tenure;
                        amount = this.mygoldformDat.amount;
                        isGold = this.mygoldformDat.isGold;
                    }
                 
                    if (isGold) {
                        this.api.get("user/schemes/1/calculations?tenure=" + tenure + "&grams=" + grams + "&coupon=" + this.amount)
                            .subscribe((res: any) => {
                                this.couponValue.emit(res);
                            });
                    }
                    else if (isJewellery) {
                       
                        this.api.get("user/schemes/2/calculations?amount=" + amount + "&coupon=" + this.amount)
                            .subscribe((res: any) => {
                                this.couponValue.emit(res);
                            });


                    }
                    this.notification
                        .blank(
                            'Success',
                            'Coupon code applied successfully'
                        )
                        .onClick.subscribe(() => {
                            console.log('Coupon Code!');
                        });
                    // first remove the items from list
                    if (localStorage.hasOwnProperty('coupon')) {
                        localStorage.removeItem('coupon');
                    }
                    //    store in local storage for applied coupon
                    localStorage.setItem('coupon', JSON.stringify({
                        coupon_code: res.coupon,
                        amount: res.amount,
                        minimumTransactionAmount: res.minimum_transaction_amount,
                        coupon_msg: this.couponAppliedMessage
                    }));

                    this.coupons.map(x => x.isApplied = false);
                    this.coupons.find(x => x.id === res.id).isApplied = false;
                }
            },
                (err: HttpErrorResponse) => {
                    this.errorMessage = '';
                    this.errors = err.error.message;
                    if (err.error.message.length) {
                        this.errorMessage = err.error.message.toString();

                    }


                    this.isSubmitting = false;
                });
    }


    /*getResults() {
        this.api.get(`coupon/online-coupons?page=${this.page}`)
            .subscribe((response: any) => {
                this.coupons = response;
                console.log(this.coupons);

            });
    }*/
    getResults() {
        this.api.get(`coupon/online-coupons-modal`)
            .subscribe((response: any) => {
                this.coupons = response;
                console.log(this.coupons);
            });
}

    get f() {
        return this.form.controls;
    }

    onOnlineApply = (coupon) => {
        // first remove the items from list
        if (localStorage.hasOwnProperty('coupon')) {
            localStorage.removeItem('coupon');

        }
        this.amount = coupon.amount;
//  console.log(this.amount)
         let amount: any;
            let tenure: any;
            let grams: any;
            let isJewellery = false;
            let isGold = false;
            if (this.jwellaryFormDat) {
                amount = this.jwellaryFormDat.amount;
                tenure = this.jwellaryFormDat.tenure;
                isJewellery = this.jwellaryFormDat.isJewellery;
            }
            else if (this.mygoldformDat) {
                grams = this.mygoldformDat.grams;
                tenure = this.mygoldformDat.tenure;
                amount = this.mygoldformDat.amount;
                isGold = this.mygoldformDat.isGold;
            }
         
            if (isGold) {
                this.api.get("user/schemes/1/calculations?tenure=" + tenure + "&grams=" + grams + "&coupon=" + this.amount)
                    .subscribe((res: any) => {
                        this.couponValue.emit(res);
                    });
            }
            else if (isJewellery) {
               
                this.api.get("user/schemes/2/calculations?amount=" + amount + "&coupon=" + this.amount)
                    .subscribe((res: any) => {
                        this.couponValue.emit(res);
                    });


            }
        localStorage.setItem('coupon', JSON.stringify({
            id: coupon.id,
            coupon_code: coupon.coupon,
            amount: coupon.amount,
            minimumTransactionAmount: coupon.minimum_transaction_amount,
            coupon_msg: this.couponAppliedMessage
        }));
        this.onlineCouponAppliedMsg = 'Applied';
        this.coupons.map(x => x.isApplied = false);
        this.coupons.find(x => x.id === coupon.id).isApplied = true;
        this.couponAppliedMessage = '';
        this.errorMessage = '';
    };


    pageChanged(pageNumber) {
        this.page = pageNumber;
        this.getResults();
    }

    onLists(): void {
        this.isVisible = true;
    }

    handleOk(): void {
        console.log('Button ok clicked!');
        this.isVisible = false;
    }

    handleCancel(): void {
        console.log('Button cancel clicked!');
        this.isVisible = false;
    }

    onOfflineRemoveCoupon(id): void {
        console.log(id);
        this.couponAppliedMessage = '';
        this.errorMessage = '';
        localStorage.removeItem('coupon');
        this.couponValue.emit(false);
        // if(this.jwellaryFormDat){
        //     this.jwellaryFormDat.isCouponRemoved=true;
        // }
        this.notification
            .blank(
                'Removed',
                'Coupon code removed successfully'
            )
            .onClick.subscribe(() => {
                console.log('Coupon Code!');
            });
    }

    onOnlineRemoveCoupon = (coupon) => {
        console.log(coupon);
        this.onlineCouponAppliedMsg = '';
        localStorage.removeItem('coupon');
        this.couponValue.emit(false);

        this.notification
            .blank(
                'Removed',
                'Coupon code removed successfully'
            )
            .onClick.subscribe(() => {
                console.log('Coupon Code!');
            });
        this.coupons.map(x => x.isApplied = false);
        this.coupons.find(x => x.id === coupon.id).isApplied = false;

    };


}
