import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BuyGoldComponent} from './buy-gold/buy-gold.component';
import {SellGoldComponent} from './sell-gold/sell-gold.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {TransactionSuccessfulComponent} from './transaction-successful/transaction-successful.component';
import {RouterModule} from '@angular/router';
import { TransferGoldComponent } from './transfer-gold/transfer-gold.component';
import {NgOtpInputModule} from 'ng-otp-input';
import { TransferVerifyOtpComponent } from './transfer-verify-otp/transfer-verify-otp.component';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import { WithDrawComponent } from './with-draw/with-draw.component';
import {NzInputModule} from "ng-zorro-antd/input";
import { GiftGoldComponent } from './gift-gold/gift-gold.component';
import {CouponBuyPageComponent} from '../coupon/coupon-buy-page/coupon-buy-page.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import { CouponModule } from '../coupon/coupon.module';

@NgModule({
  declarations: [BuyGoldComponent, SellGoldComponent, TransactionSuccessfulComponent, TransferGoldComponent, TransferVerifyOtpComponent, WithDrawComponent, GiftGoldComponent],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NgOtpInputModule,
        NzAutocompleteModule,
        NzInputModule,
        NgxPaginationModule,
        NzModalModule,
        NzAlertModule ,
         CouponModule    
    ]
})
export class GoldModule {
}
