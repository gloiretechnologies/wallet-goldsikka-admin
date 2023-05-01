import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../api.service";
import {AuthenticationService} from "../../_services/authentication/authentication.service";
import {GoldService} from "../gold.service";
import {AccountService} from "../../account/account.service";
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-gift-gold',
  templateUrl: './gift-gold.component.html',
  styleUrls: ['./gift-gold.component.scss']
})
export class GiftGoldComponent implements OnInit {

  submitted: boolean;
  isSubmitting: boolean;
  maskedPhone: string;
  errorMessage: string;
  errors: object = {};
  currentGoldPricePerGram: number;
  isValidTransfer: boolean;
  showOtpBox: boolean;
  transferCompleted: boolean;
  wallets: string[] = [];
  balance: object = {};
  isPriceLock: string;
  form: FormGroup = new FormGroup({
    to: new FormControl('', [Validators.required, Validators.min(10)]),
    quantity: new FormControl('', [Validators.required, Validators.max(30)]),
    amount: new FormControl('', [Validators.required, Validators.max(1000000)]),
  });

  constructor(
    private api: ApiService,
    private authenticationService: AuthenticationService,
    private goldService: GoldService,
    private accountService: AccountService,
    private notification: NzNotificationService,

  ) {
  }

  ngOnInit(): void {
     this.authenticationService.checkAccess();

    const user = this.authenticationService.getUser();
    this.maskedPhone = user.maskedPhone;
    this.goldService.getCurrentGoldPrice()
      .subscribe((r: any) => {
        this.currentGoldPricePerGram = r.sell_price_per_gram;
      });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting = true;
    this.errors = [];
    this.errorMessage = '';
    this.onMobileChange();
    this.getCheckUserBalance(this.form.get('quantity').value);
    console.log(this.isValidTransfer);
    if (this.isValidTransfer) {
      this.balanceValidation();
    }
  }

  onMobileChange(): void {
    const toWallet: string = this.form.get('to').value;

    if (toWallet.length <= 3) {
      return;
    }

    this.accountService.search(toWallet)
      .subscribe((res: any) => {
        this.wallets = [];
        this.isValidTransfer = true;
        for (const r of res) {
          this.wallets.push(`${r.name} (${r.mobile})`);
        }
      }, (err: HttpErrorResponse) => {
        this.errors = err.error.errors;

        if (err.error.message.length) {
          this.errorMessage = err.error.message.toString();
        }
        this.isValidTransfer = false;
        this.isSubmitting = false;
      });

  }

  onQuantityChange(): void {
    let amountPayable: number;
    const quantityInGrams: number = this.form.get('quantity').value;

    if (quantityInGrams < 0) {
      this.form.get('quantity').setValue('');
    }

    if (quantityInGrams > 0) {
      // Fractional rate should not be applied when transfering gold
      // amountPayable = this.goldService.calculatePrice(quantityInGrams, this.currentGoldPricePerGram);
      amountPayable = quantityInGrams * this.currentGoldPricePerGram;
    } else {
      amountPayable = 0;
    }

    this.form.get('amount').setValue(amountPayable.toFixed(2));
  }


  /**
   * @param otpVerified
   */
  processTransfer(otpVerified: boolean): void {
    if (otpVerified) {
      const data = this.form.value;
      data.to = data.to.replace(/\D/g, '');

      this.api.post(`user/wallet/gold/gift`, data)
        .subscribe((res: any) => {
            this.errorMessage = '';
            this.errors = [];
            this.isSubmitting = false;
            sessionStorage.setItem('desc', res.description);
            this.transferCompleted = true;
          },
          (err: HttpErrorResponse) => {
            this.errors = err.error.errors;

            if (err.error.message.length) {
              this.errorMessage = err.error.message.toString();
            }
            this.isSubmitting = false;
          });
    }
  }

  getCheckUserBalance(grams): void {
    const data = this.form.value;
    this.api.get(`user/wallet/checkBalance?quantity=${grams}`)
      .subscribe((res: any) => {
          this.isValidTransfer = true;
        },
        (err: HttpErrorResponse) => {
          this.errors = [];
          this.errors = err.error.errors;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });
  }

  get f() {
    return this.form.controls;
  }

  goldPriceLock() {
    this.api.get(`user/wallet/gold/price/lock?price=` + this.currentGoldPricePerGram)
      .subscribe((res: any) => {
          this.showOtpBox = true;
        },
        (err: HttpErrorResponse) => {
          this.errorMessage = '';
          this.errors = err.error.errors;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });
  }

  balanceValidation() {
    const data = this.form.value;
    data.to = data.to.replace(/\D/g, '');
    this.api.post(`user/wallet/transfer-validation`, data)
      .subscribe((res: any) => {
          this.goldPriceLock();
        },
        (err: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.errorMessage = '';
          this.errors = {};
          if (err.error.errors) {
            this.errors = err.error.errors;
          }
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
        });
  }

}
