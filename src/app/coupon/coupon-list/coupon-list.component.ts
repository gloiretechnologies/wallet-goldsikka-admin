import {Component, OnInit} from '@angular/core';
// import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../api.service';
import {HttpErrorResponse} from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
    selector: 'app-coupon-list',
    templateUrl: './coupon-list.component.html',
    styleUrls: ['./coupon-list.component.scss']
})
export class CouponListComponent implements OnInit {

    submitted: boolean;
    errorMessage: string;
    page: number = 1;
    errors: object = {};
    coupons: any;
    isSubmitting: boolean;
    // form: FormGroup = new FormGroup({
    //     coupon: new FormControl('', [Validators.required]),
    // });


    constructor(
        private api: ApiService,
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

    // onSubmit(): void {
    //     this.submitted = true;
    //     this.isSubmitting = true;
    //     if (this.form.invalid) {
    //         return;
    //     }
    //     this.api.get(`user/wallet/coupons/apply`)
    //         .subscribe((res: any) => {
    //                 location.reload();
    //             },
    //             (err: HttpErrorResponse) => {
    //                 this.errorMessage = '';
    //                 this.errors = err.error.errors;
    //                 if (err.error.message.length) {
    //                     this.errorMessage = err.error.message.toString();
    //                 }
    //                 this.isSubmitting = false;
    //             });
    // }

    getResults() {
        this.api.get(`coupon/online-coupons?page=${this.page}`)
            .subscribe((response: any) => {
                this.coupons = response;
                console.log(this.coupons);

            });
    }

    /*get f() {
        return this.form.controls;
    } */

    onApply(coupon) {
        window.location.href = '/gold/buy';
        window.location.href = 'schemes/2/subscribe';
        window.location.href = 'schemes/1/subscribe';
    }
    pageChanged(pageNumber) {
        this.page = pageNumber;
        this.getResults();
    }


}
