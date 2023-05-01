import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DEFAULT_CURRENCY_CODE, NgModule} from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import {AppComponent} from './app.component';
import {LoginLayoutComponent} from './layouts/login-layout/login-layout.component';
import {LoginComponent} from './auth/login/login.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './_interceptors/jwt.interceptor';
import {ErrorInterceptor} from './_interceptors/error.interceptor';
import {RegisterComponent} from './auth/register/register.component';
import {NgOtpInputModule} from 'ng-otp-input';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {AppRoutingModule} from './app-routing.module';
import {AppLayoutComponent} from './layouts/app-layout/app-layout.component';
import {SidebarComponent} from './layouts/sidebar/sidebar.component';
import {AccountModule} from './account/account.module';
import {GoldModule} from './gold/gold.module';
import {SettingsModule} from './settings/settings.module';
import {SchemesModule} from './schemes/schemes.module';
import {AccountVerificationComponent} from './auth/account-verification/account-verification.component';
import {ReferralEarnComponent} from './account/referral-earn/referral-earn.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {CouponModule} from './coupon/coupon.module';
import {FeedbackModule} from './feedback/feedback.module';
import {EventsModule} from './events/events.module';
import {OrganizationTypeDetailsComponent} from './auth/components/organization-type-details/organization-type-details.component';
import {MoneyWalletComponent} from './money-wallet/money-wallet/money-wallet.component';
import {OrganizationModule} from './organization/organization.module';
import {AuthenticationService} from './_services/authentication/authentication.service';
import {SocialLoginModule, SocialAuthServiceConfig} from 'slr-angularx-social-login';
import {GoogleLoginProvider,FacebookLoginProvider} from 'slr-angularx-social-login';
import {environment} from '../environments/environment';
import { MoneyWalletTransferComponent } from './money-wallet/money-wallet-transfer/money-wallet-transfer.component';
import { JewelleryInventoryComponent } from './jewelleryinventory/jewellery-inventory/jewellery-inventory.component';
import { ProductsComponent } from './jewelleryinventory/products/products.component';
import { WishlistComponent } from './jewelleryinventory/wishlist/wishlist.component';
import { ProductDetailsComponent } from './jewelleryinventory/product-details/product-details.component';
import { WishlistpassbookComponent } from './jewelleryinventory/wishlistpassbook/wishlistpassbook.component';

//Ecommerce
import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { CategoryComponent } from './ecommerce/category/category.component';
import { DetailsComponent } from './ecommerce/details/details.component';
import { FavouritesComponent } from './ecommerce/favourites/favourites.component';
import { PricesUnderComponent } from './ecommerce/prices-under/prices-under.component';
import { BrandPageComponent } from './ecommerce/brand-page/brand-page.component';
import { CheckoutComponent } from './ecommerce/checkout/checkout.component';
import { CartpageComponent } from './ecommerce/cartpage/cartpage.component';
import { MyorderComponent } from './ecommerce/myorder/myorder.component';
import { OrderTrackingComponent } from './ecommerce/order-tracking/order-tracking.component';
import { PaymentsuccessComponent } from './ecommerce/paymentsuccess/paymentsuccess.component';
import { BullionComponent } from './ecommerce/bullion/bullion.component';
import {FilterPipe} from '../app/_pipes/filter.pipe';
import { DetailssComponent } from './ecommerce/detailss/detailss.component'


@NgModule({
    declarations: [
        AppComponent,
        LoginLayoutComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        PageNotFoundComponent,
        RegisterComponent,
        AppLayoutComponent,
        SidebarComponent,
        AccountVerificationComponent,
        ReferralEarnComponent,
        OrganizationTypeDetailsComponent,
        MoneyWalletComponent,
        MoneyWalletTransferComponent,
        JewelleryInventoryComponent,
        ProductsComponent,
        WishlistComponent,
        ProductDetailsComponent,
        WishlistpassbookComponent,
        EcommerceComponent,
        CategoryComponent,
        DetailsComponent,
        FavouritesComponent,
        PricesUnderComponent,
        BrandPageComponent,
        CheckoutComponent,
        CartpageComponent,
        MyorderComponent,
        OrderTrackingComponent,
        PaymentsuccessComponent,
        BullionComponent,
        FilterPipe,
        DetailssComponent

        
    ],

    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        BsDropdownModule.forRoot(),
        ReactiveFormsModule,
        HttpClientModule,
        NgOtpInputModule,
        AppRoutingModule,
        AccountModule,
        GoldModule,
        SettingsModule,
        SchemesModule,
        CouponModule,
        NgxPaginationModule,
        FeedbackModule,
        EventsModule,
        OrganizationModule,
        SocialLoginModule,
        CarouselModule
    

    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        {provide: DEFAULT_CURRENCY_CODE, useValue: 'INR'},
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: true,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            environment.googleClientId
                        )
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider(environment.facebookAppId)
                    }
                ]
            } as SocialAuthServiceConfig,
        }

    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
