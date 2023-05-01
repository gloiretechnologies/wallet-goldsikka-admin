import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountProfileSettingsComponent} from './account-profile-settings/account-profile-settings.component';
import {AccountPasswordSettingComponent} from './account-password-setting/account-password-setting.component';
import {AccountNotificationSettingComponent} from './account-notification-setting/account-notification-setting.component';
import {SettingLayoutComponent} from './setting-layout/setting-layout.component';
import {BankAccountListComponent} from './bankAccounts/bank-account-list/bank-account-list.component';
import {BankAccountAddComponent} from './bankAccounts/bank-account-add/bank-account-add.component';
import {BankAccountEditComponent} from './bankAccounts/bank-account-edit/bank-account-edit.component';
import {AddressEditComponent} from './address/address-edit/address-edit.component';
import {AddressAddComponent} from './address/address-add/address-add.component';
import {AddressListComponent} from './address/address-list/address-list.component';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import { AccountKycSettingsComponent } from './account-kyc-settings/account-kyc-settings.component';
import { NomineeAddComponent } from './nominess/nominee-add/nominee-add.component';
import { NomineeEditComponent } from './nominess/nominee-edit/nominee-edit.component';
import { NomineeListComponent } from './nominess/nominee-list/nominee-list.component';
import {NgOtpInputModule} from "ng-otp-input";

@NgModule({
  declarations: [
    AccountProfileSettingsComponent,
    AccountPasswordSettingComponent,
    AccountNotificationSettingComponent,
    SettingLayoutComponent,
    BankAccountListComponent,
    BankAccountAddComponent,
    BankAccountEditComponent,
    AddressEditComponent,
    AddressAddComponent,
    AddressListComponent,
    AccountKycSettingsComponent,
    NomineeAddComponent,
    NomineeEditComponent,
    NomineeListComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        RouterModule,
        NgOtpInputModule
    ]
})
export class SettingsModule {
}
