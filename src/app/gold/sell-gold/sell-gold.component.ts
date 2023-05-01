import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { GoldService } from '../gold.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from "@angular/common/http";
import { AccountService } from "../../account/account.service";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-sell-gold',
  templateUrl: './sell-gold.component.html',
  styleUrls: ['./sell-gold.component.scss']
})
export class SellGoldComponent implements OnInit {

  submitted: boolean;
  isSubmitting: boolean;
  errorMessage: string;
  errors: object = {};
  currentBalance: object = {};
  currentSellGoldPricePerGram: number;
  isPriceLock: string;
  banksList: object = {};
  isBank: boolean;
  isBankAccount: boolean;
  bankTransferCompleted: boolean;
  moneyWalletTransferCompleted: boolean;

  form = new FormGroup({
    grams: new FormControl('', [Validators.required, Validators.min(2), Validators.max(30)]),
    amount: new FormControl('', [Validators.required]),
    transferTo: new FormControl('', [Validators.required]),
    purity: new FormControl(24, [Validators.required]), // default
    bankId: new FormControl(''),
    
  });
  form1=new FormGroup({
    message: new FormControl('',[Validators.required]),
    rating: new FormControl('',[Validators.required])
  })
  schemeTransactionModal: boolean;
  name: string;
  schemeTransactionModal_after: boolean;

  constructor(
    private authService: AuthenticationService,

    private api: ApiService,
    private goldService: GoldService,
    private accountService: AccountService,

  ) {

  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.goldService.getCurrentGoldPrice()
      .subscribe((r: any) => {
        this.currentSellGoldPricePerGram = r.buy_price_per_gram;
             });
    this.getBanks();
    this.getAvailableBalance();
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.isSubmitting = true;
    if (this.form.invalid) {
      this.isSubmitting = false;
      return;
    }
    this.balanceValidation();
  }

  onQuantityChange(): void {
    this.submitted = true;
    let amountPayable: number;
    const quantitySellGrams: number = this.form.get('grams').value;

    if (quantitySellGrams < 0) {
      this.form.get('grams').setValue('');
    }

    if (quantitySellGrams > 0) {
      amountPayable = this.goldService.calculateSellPrice(quantitySellGrams, this.currentSellGoldPricePerGram);
    } else {
      amountPayable = 0;

    }
    this.form.get('amount').setValue(amountPayable.toFixed(2));
  }
  hideSchemeTransactionModal() {
    this.schemeTransactionModal = false;
    this.schemeTransactionModal_after=false;
  }
  close() {
    this.schemeTransactionModal = false;
    this.schemeTransactionModal_after=false;

  }
  onsubmit_form() {
    const data = this.form1.value;
    console.log(data);
    this.api.post(`user/testimonials/add`, data)
      .subscribe((res: any) => {
        this.schemeTransactionModal = false;
        this.schemeTransactionModal_after=true;
      })
  }


  get f() {
    return this.form.controls;
  }

  getAvailableBalance() {
    this.accountService.getBalance()
      .subscribe((r: any) => {
        const balance = r['balance'];
        const grams = new Number(balance.inGrams);
        balance.inGrams = grams.toFixed(3);
        this.currentBalance = balance;
      })
  }

  gramsSelling() {
    this.api.post(`user/wallet/gold/sell`, this.form.value)
      .subscribe((res: any) => {
        this.isSubmitting = false;

        if (this.form.get('transferTo').value == 'bankAccount') {
          this.bankTransferCompleted = true;
          this.schemeTransactionModal = true;
        }
        if (this.form.get('transferTo').value == 'moneyWallet') {
          this.moneyWalletTransferCompleted = true;
          this.schemeTransactionModal = true;
        }
      },
        (err: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.errorMessage = '';
          this.errors = err.error.errors;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }

        });
  }




  balanceValidation() {
    this.api.post(`user/wallet/sell-validation`, this.form.value)
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
          if (err.error.is_bank === false) {
            this.isBank = true;
          }

          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
        });
  }

  goldPriceLock() {
    this.api.get(`user/wallet/gold/price/lock?price=` + this.currentSellGoldPricePerGram)
      .subscribe((res: any) => {
        this.gramsSelling();
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

  transferTo(e) {
    this.isBankAccount = false;
    console.log(this.form.get("transferTo").value);
    if (!!this.form.get("transferTo").value && this.form.get("transferTo").value == 'bankAccount') {
      this.isBankAccount = true;
    }
  }

  getBanks() {
    this.api.get(`user/bankAccount/bank/list`)
      .subscribe((res: any) => {
        this.banksList = res;
      });
  }
}