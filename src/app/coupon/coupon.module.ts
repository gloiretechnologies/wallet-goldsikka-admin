import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CouponListComponent} from './coupon-list/coupon-list.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {NzNotificationModule} from 'ng-zorro-antd/notification';
import { CouponBuyPageComponent } from './coupon-buy-page/coupon-buy-page.component';
import {NzModalModule} from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [CouponListComponent,CouponBuyPageComponent],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NgxPaginationModule,
        NzNotificationModule,
        NzModalModule
    ],
    exports: [CouponBuyPageComponent]
})
export class CouponModule {
}
