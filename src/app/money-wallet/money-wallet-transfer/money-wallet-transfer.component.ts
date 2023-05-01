import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api.service';
import {GoldService} from '../../gold/gold.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from "@angular/common/http";
import {AccountService} from "../../account/account.service";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-money-wallet-transfer',
  templateUrl: './money-wallet-transfer.component.html',
  styleUrls: ['./money-wallet-transfer.component.scss']
})
export class MoneyWalletTransferComponent implements OnInit {
  submitted: boolean;
  isSubmitting: boolean;
  errorMessage: string;
  errors: object = {};
  currentBalance: object = {};
  currentSellGoldPricePerGram: number;
  isPriceLock: string;
  banksList: object = {};
  isBank: boolean;
  walletAmount: any;
  transactionMessage: string;
  isBankAccount: boolean;
  bankTransferCompleted: boolean;
  moneyWalletTransferCompleted: boolean;

  form: FormGroup = new FormGroup({
    amount: new FormControl('', [Validators.required, Validators.min(500), Validators.max(100000)]),
    bank_id: new FormControl('', []),
  });

  constructor(
    private api: ApiService,
    private goldService: GoldService,
    private accountService: AccountService,
    private authService: AuthenticationService

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.goldService.getCurrentGoldPrice()
      .subscribe((r: any) => {
        this.currentSellGoldPricePerGram = r.buy_price_per_gram;
      });
    this.getBanks();
    this.getWalletAmount();
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.isSubmitting = true;
    if (this.form.invalid) {
      this.isSubmitting = false;
      return;
    }
    this.api.post(`user/money-wallet/withdraw`, this.form.value)
      .subscribe((res: any) => {
          this.isSubmitting = false;
          this.bankTransferCompleted = true;
          this.transactionMessage = res.message;
        },
        (err: HttpErrorResponse) => {
          this.errorMessage = '';
          this.errors = {};
          if (err.error.errors) {
            this.errors = err.error.errors;
          }
          if (err.error.is_bank === false) {
            this.isBank = true;
          }

          this.isSubmitting = false;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
        });
  }


  get f() {
    return this.form.controls;
  }

  getWalletAmount(): void {
    this.api.get(`user/money-wallet/amount`)
      .subscribe((r: any) => {
          this.walletAmount = r.amount;
        },
        (err: HttpErrorResponse) => {
          if (err.status == 400) {
            alert('Server error. Please try again later');
          }
        });
  }

  getBanks() {
    this.api.get(`user/bankAccount/bank/list`)
      .subscribe((res: any) => {
        this.banksList = res;
        this.isBankAccount = true;
      });
  }

}
