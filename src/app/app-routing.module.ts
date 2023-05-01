import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { AuthGuard } from './_services/authentication/auth.guard';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { DashboardComponent } from './account/dashboard/dashboard.component';
import { RegisterComponent } from './auth/register/register.component';
import { BuyGoldComponent } from './gold/buy-gold/buy-gold.component';
import { SellGoldComponent } from './gold/sell-gold/sell-gold.component';
import { PassbookComponent } from './account/passbook/passbook.component';
import { TransactionSuccessfulComponent } from './gold/transaction-successful/transaction-successful.component';
import { TransferGoldComponent } from './gold/transfer-gold/transfer-gold.component';
import { SettingLayoutComponent } from './settings/setting-layout/setting-layout.component';
import { AccountProfileSettingsComponent } from './settings/account-profile-settings/account-profile-settings.component';
import { AccountPasswordSettingComponent } from './settings/account-password-setting/account-password-setting.component';
import { BankAccountListComponent } from './settings/bankAccounts/bank-account-list/bank-account-list.component';
import { BankAccountAddComponent } from './settings/bankAccounts/bank-account-add/bank-account-add.component';
import { BankAccountEditComponent } from './settings/bankAccounts/bank-account-edit/bank-account-edit.component';
import { AddressAddComponent } from './settings/address/address-add/address-add.component';
import { AddressEditComponent } from './settings/address/address-edit/address-edit.component';
import { AddressListComponent } from './settings/address/address-list/address-list.component';
import { AccountNotificationSettingComponent } from './settings/account-notification-setting/account-notification-setting.component';
import { WithDrawComponent } from './gold/with-draw/with-draw.component';
import { AccountKycSettingsComponent } from './settings/account-kyc-settings/account-kyc-settings.component';
import { NomineeListComponent } from './settings/nominess/nominee-list/nominee-list.component';
import { NomineeAddComponent } from './settings/nominess/nominee-add/nominee-add.component';
import { NomineeEditComponent } from './settings/nominess/nominee-edit/nominee-edit.component';
import { SchemesListComponent } from './schemes/schemes-list/schemes-list.component';
import { SchemeUserListComponent } from './schemes/scheme-user-list/scheme-user-list.component';
import { SchemeSubscribeComponent } from './schemes/scheme-subscribe/scheme-subscribe.component';
import { MyGoldFormComponent } from './schemes/forms/my-gold-form/my-gold-form.component';
import { JewelleryFormComponent } from './schemes/forms/jewellery-form/jewellery-form.component';
import { UserSchemeInfoComponent } from './schemes/user-scheme-info/user-scheme-info.component';
import { AccountVerificationComponent } from './auth/account-verification/account-verification.component';
import { GiftGoldComponent } from './gold/gift-gold/gift-gold.component';
import { ReferralEarnComponent } from './account/referral-earn/referral-earn.component';
import { CouponListComponent } from './coupon/coupon-list/coupon-list.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { EventCreateComponent } from './events/event-create/event-create.component';
import { EventUpdateComponent } from './events/event-update/event-update.component';
import { EventInfoComponent } from './events/event-info/event-info.component';
import { InvitedEventPayComponent } from './events/invited-event-pay/invited-event-pay.component';
import { FeedBackListComponent } from './feedback/feed-back-list/feed-back-list.component';
import { FeedBackCreateComponent } from './feedback/feed-back-create/feed-back-create.component';
import { FeedBackUpdateComponent } from './feedback/feed-back-update/feed-back-update.component';
import { TicketsListComponent } from './schemes/tickets-list/tickets-list.component';
import { EventInviteUserComponent } from './events/event-invite-user/event-invite-user.component';
import { EventInviteUserListComponent } from './events/event-invite-user-list/event-invite-user-list.component';
import { InvitationEventListComponent } from './events/invitation-event-list/invitation-event-list.component';
import { MoneyWalletComponent } from './money-wallet/money-wallet/money-wallet.component';
import { UserDonateOrganizationComponent } from './organization/user-donate-organization/user-donate-organization.component';
import { OrganizationViewComponent } from './organization/organization-view/organization-view.component';
import { UserOrganizationListComponent } from './organization/user-organization-list/user-organization-list.component';
import { UserRole } from './_models/UserRole';
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

import { DetailssComponent } from './ecommerce/detailss/detailss.component';


const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardComponent },
            {
                path: 'account',
                children: [
                    // {path: 'settings', component: SettingsComponent},
                ]
            },
            {
                path: 'gold',
                children: [
                    {
                        path: 'buy', component: BuyGoldComponent,
                        data: { role: UserRole.role_PEROSNAL_WALLET }

                    },
                    {
                        path: 'sell', component: SellGoldComponent,
                        data: { role: UserRole.role_PEROSNAL_WALLET }
                    },
                    {
                        path: 'transfer', component: TransferGoldComponent,
                        data: { role: UserRole.role_PEROSNAL_WALLET }
                    },
                    {
                        path: 'gift', component: GiftGoldComponent,
                        data: { role: UserRole.role_PEROSNAL_WALLET }
                    },
                    { path: 'withdraw', component: WithDrawComponent },
                    {
                        path: 'transaction/:id', component: TransactionSuccessfulComponent,
                        data: { role: UserRole.role_PEROSNAL_WALLET }
                    },
                ]
            },

            {
                path: 'money-wallet',
                children: [
                    { path: '', component: MoneyWalletComponent,
                    data: { role: UserRole.role_PEROSNAL_WALLET } },
                    {
                        path: 'withdraw', component: MoneyWalletTransferComponent,
                        data: { role: UserRole.role_PEROSNAL_WALLET }
                    },
                ]

            },
            {
                path: 'transactions',
                children: [
                    { path: '', component: PassbookComponent },
                    {
                        path: ':id', component: TransactionSuccessfulComponent,
                        data: { role: UserRole.role_PEROSNAL_WALLET }
                    },
                ]
            },
            {
                path: 'settings',
                component: SettingLayoutComponent,
                children: [
                    { path: '', component: AccountProfileSettingsComponent },
                    { path: 'kyc', component: AccountKycSettingsComponent },
                    {
                        path: 'nominees',
                        children: [
                            { path: '', component: NomineeListComponent },
                            { path: 'add', component: NomineeAddComponent },
                            { path: ':id/edit', component: NomineeEditComponent },
                        ]
                    },
                    { path: 'password', component: AccountPasswordSettingComponent },
                    { path: 'notifications', component: AccountNotificationSettingComponent },
                    {
                        path: 'bankAccounts',
                        children: [
                            { path: '', component: BankAccountListComponent },
                            { path: 'add', component: BankAccountAddComponent },
                            { path: ':id/edit', component: BankAccountEditComponent },
                        ]
                    },
                    {
                        path: 'addresses',
                        children: [
                            { path: '', component: AddressListComponent },
                            { path: 'add', component: AddressAddComponent },
                            { path: ':id/edit', component: AddressEditComponent },
                        ]
                    },
                ]
            },
            {
                path: 'schemes',
                data: { role: UserRole.role_PEROSNAL_WALLET },
                children: [
                    { path: '', component: SchemesListComponent },
                    { path: ':id', component: SchemeUserListComponent },
                    { path: ':id/subscribe', component: SchemeSubscribeComponent },
                    { path: ':id/my-gold-form', component: MyGoldFormComponent },
                    { path: ':id/jewellery-form', component: JewelleryFormComponent },
                    { path: ':id/info', component: UserSchemeInfoComponent },
                    { path: 'transaction/:id', component: TransactionSuccessfulComponent },
                ]
            },
            {
                path: 'coupons',
                data: { role: UserRole.role_PEROSNAL_WALLET },
                children: [
                    { path: '', component: CouponListComponent },
                ]
            },

            {
                path: 'user-organizations',
                data: { role: UserRole.role_PEROSNAL_WALLET },
                children: [
                    { path: '', component: UserOrganizationListComponent },
                    { path: ':id/donate', component: UserDonateOrganizationComponent },
                ]
            },
            {
                path: 'organization',
                children: [
                    { path: 'view', component: OrganizationViewComponent },
                ]
            },

            {
                path: 'referral',
                data: { role: UserRole.role_PEROSNAL_WALLET },
                children: [
                    { path: '', component: ReferralEarnComponent }
                ]
            },
            {
                path: 'events',
                data: { role: UserRole.role_PEROSNAL_WALLET },
                children: [
                    { path: '', component: EventListComponent },
                    { path: 'create', component: EventCreateComponent },
                    { path: ':id/update', component: EventUpdateComponent },
                    { path: ':id/info', component: EventInfoComponent },
                    { path: ':id/event-pay', component: InvitedEventPayComponent },
                    { path: 'event-invites', component: InvitationEventListComponent },
                    { path: ':id/invited-list', component: EventInviteUserListComponent },
                    { path: ':id/invite', component: EventInviteUserComponent },
                ]
            },
            {
                path: 'feedback',
                data: { role: UserRole.role_PEROSNAL_WALLET },
                children: [
                    { path: '', component: FeedBackListComponent },
                    { path: 'add', component: FeedBackCreateComponent },
                    { path: ':id/update', component: FeedBackUpdateComponent },
                ]
            },
            {
                path: 'ecommerce',
                data: { role: UserRole.role_PEROSNAL_WALLET },
                children: [
                    { path: 'ecommerceHome', component: EcommerceComponent },
                    { path: 'category/:id', component: CategoryComponent },
                    { path: 'details/:id', component: DetailsComponent },
                    { path: 'favourites', component: FavouritesComponent },
                    { path: 'prices-under/:id', component: PricesUnderComponent },
                    { path: 'brand-page/:id', component: BrandPageComponent },
                    { path: 'checkout', component: CheckoutComponent },
                    { path: 'cartpage', component: CartpageComponent },
                    { path: 'myorder', component: MyorderComponent },
                    { path: 'order-tracking/:order_id', component: OrderTrackingComponent },
                    { path: 'paymentsuccess/:payment_id', component: PaymentsuccessComponent },
                    { path: 'bullion/:id', component: BullionComponent },
                    { path: 'detailss/:id', component: DetailssComponent },
                ]    
            },
            {
                path: 'tickets',
                data: { role: UserRole.role_PEROSNAL_WALLET },
                children: [
                    { path: '', component: TicketsListComponent }
                ]
            },
            {
                path: 'jewellery',
                data: { role: UserRole.role_PEROSNAL_WALLET },
                children: [
                    { path: 'jewellery-inventory', component: JewelleryInventoryComponent },
                    { path: 'productbycats/:id', component: ProductsComponent },
                    { path: 'wishlist', component: WishlistComponent },
                    { path: 'product-details/:id', component: ProductDetailsComponent },
                    { path: 'passbookwishlist/:id',component:WishlistpassbookComponent},
                ]
            },
        ]
    },

    // Login routes goes here
    {
        path: 'auth',
        component: LoginLayoutComponent,
        children:
            [
                { path: 'login', component: LoginComponent },
                { path: 'resetPassword', component: ForgotPasswordComponent },
                { path: 'response-password-reset', component: ResetPasswordComponent },
                { path: 'register', component: RegisterComponent },
                { path: 'account-verify', component: AccountVerificationComponent }
            ]
    },
    {
        path: '', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard],
    },
    {
        path: '**', component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        scrollOffset: [0, 70]
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}


