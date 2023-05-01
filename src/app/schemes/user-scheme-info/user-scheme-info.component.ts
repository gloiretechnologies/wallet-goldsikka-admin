import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {saveAs} from 'file-saver';
import {HttpErrorResponse} from '@angular/common/http';
import {GoldService} from '../../gold/gold.service';
import {SchemesService} from '../schemes.service';
import {environment} from '../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-user-scheme-info',
  templateUrl: './user-scheme-info.component.html',
  styleUrls: ['./user-scheme-info.component.scss']
})
export class UserSchemeInfoComponent implements OnInit {

  schemes: object;
  schemeId: number;
  prices: object;
  page = 1;
  currentGoldPricePerGram: number;
  schemeTitle: string;
  type: string;
  showModal: boolean;
  schemeInstallementId: string;
  paymentDetails: any = [];
  subscribeSchemeInfo: any = [];
  schemeDataList: boolean;
  submitted: boolean;
  isSubmitting: boolean;
  isPaymentDo: boolean;
  errorMessage: string;
  isTicket: boolean;
  errors: object = {};
  accountErrorMessage: string;
  isAccountAccess: boolean;
  walletAmount: any;
  walletAmountInput = false;
  gstPercentage: number = environment.gstPercentage;
  schemeValues: any = [];
  finalAmount: number;
  form: FormGroup = new FormGroup({
    enteredWalletAmount: new FormControl(''),
   // referralCode: new FormControl(''),
  });

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private goldService: GoldService,
    private schemeService: SchemesService,
    private authService: AuthenticationService

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();
        // get 22 carat Price
    this.goldService.getCurrent22CarartGoldPrice()
    .subscribe((r: any) => {

      this.currentGoldPricePerGram = r.sell_price_per_gram;
    console.log("current gold 22", this.currentGoldPricePerGram)
    });

    this.isPaymentDo = true;
    this.getSchemeIdList(this.route.snapshot.paramMap.get('id'));
    // this.goldService.getCurrentGoldPrice()
    //   .subscribe((r: any) => {
    //     this.currentGoldPricePerGram = r.sell_price_per_gram;
    //   });
    this.getSchemeInfo();
    this.getWalletAmount();
  }

  getSchemeIdList(id): void {
    this.api.get(`user/schemes/` + id + `?page=${this.page}`)
      .subscribe((r: any) => {
          this.schemes = r;
        },
        (err: HttpErrorResponse) => {
          this.isPaymentDo = false;
          this.errorMessage = '';
          this.errors = err.error.errors;
          if (err.error.message) {
            this.errorMessage = err.message;
          }

          this.isSubmitting = false;
        });
  }

  downloadReceipt(id) {
    this.api.get(`user/schemes/` + id + `/scheme-pdf`, {responseType: 'blob'})
      .subscribe((r: any) => {
        saveAs(new Blob([r], {type: 'application/pdf'}), 'Scheme-Installments.pdf');
      });
  }


  /*Scheme MMI Payment Details After Price Lock**/
  getSchemePaymentDetails(id) {
    this.api.get(`user/schemes/` + id + `/payment-details`)
      .subscribe((res: any) => {
          this.showModal = true;
          this.schemeInstallementId = id;
          this.paymentDetails = res;
          this.finalAmount = res.finalAmount;
          this.isPaymentDo = false;
          if (this.type === 'MG') {
            this.getpriceLock(this.paymentDetails.livePrice);
          }
        },
        (err: HttpErrorResponse) => {
          this.isPaymentDo = false;
          this.errorMessage = '';
          this.errors = err.error.errors;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }

          this.isSubmitting = false;
        });
  }


  getSchemeInfo() {
    this.isSubmitting = true;
    this.accountErrorMessage = '';
    this.api.get(`user/schemes/info/` + this.route.snapshot.paramMap.get('id'))
      .subscribe((r: any) => {
        this.isSubmitting = false;
        this.isPaymentDo = false;
        this.subscribeSchemeInfo = r;
        this.schemeId = this.subscribeSchemeInfo.scheme_title.id;
        this.schemeTitle = this.subscribeSchemeInfo.scheme_title.title;
        this.type = this.subscribeSchemeInfo.scheme_title.scheme_calculation_type;
        this.schemeDataList = true;

      }, (err: HttpErrorResponse) => {
        this.isPaymentDo = false;
        this.accountErrorMessage = '';
        this.errors = err.error.errors;
        if (err.error.message) {
          this.accountErrorMessage = err.error.message;
        }
        this.isSubmitting = false;
      });
  }

  mmiPaymentRazorPay(s_Id, livePrice: number, finalAmount: number) {
    this.api.get(`user/wallet/gold/price/lock?price=${this.currentGoldPricePerGram}&carat=22`)
            
    .subscribe((r: any) => {
  console.log("logapi", r)
    });
    this.isSubmitting = true;
    const enteredWalletAmount = this.form.get('enteredWalletAmount').value;
    const referralCode = '';
    if (eval(enteredWalletAmount.toString()) > this.walletAmount) {
      alert('Available amount in your Money Wallet is ' + this.walletAmount);
      return;
    }
    this.isSubmitting = true;
    if (eval(this.finalAmount.toString()) == 0) {
      this.isSubmitting = true;
      const data = {live_price: livePrice, s_Id, walletAmount: enteredWalletAmount, referralCode: referralCode};

      this.api.post(`user/schemes/mmi-payment/${s_Id}/money-wallet`, data)
        .subscribe((r: any) => {
          if (r.processed == true) {
            this.isSubmitting = false;
            alert(r.description);
            sessionStorage.setItem('desc', r.description);
            window.location.href = '/gold/transaction/' + r.transactionId;
            return;
          } else {
            this.isSubmitting = false;
            alert('Transaction Failed');
            return;
          }
        });
    }

    if (eval(this.finalAmount.toString()) !== 0) {
      this.schemeService.mmiPaymentPurchase(finalAmount, {livePrice, s_Id, enteredWalletAmount, referralCode});
      this.isSubmitting = false;
    }
  }


  raiseTicket() {
    this.isAccountAccess = true;
    this.isTicket = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.showModal = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.showModal = false;
    this.form.controls.enteredWalletAmount.clearValidators();
    this.form.get('enteredWalletAmount').setValue('');
    this.walletAmountInput = false;
    this.addCharges();
  }

  paymentMMI(id) {
   
    this.api.get(`user/wallet/gold/price/lock?price=${this.currentGoldPricePerGram}&carat=22`)
            
    .subscribe((r: any) => {
  console.log("logapi", r)
    });

    this.isPaymentDo = true;
    this.errorMessage = '';
    this.schemeInstallementId = '';
    this.getSchemePaymentDetails(id);
  }

  getpriceLock(livePrice: number) {
    this.api.get(`user/wallet/gold/price/lock?price=` + livePrice)
      .subscribe((res: any) => {
          // this.getSchemePaymentDetails(id, r.sell_price_per_gram);
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

  enteredWalletAmountChange() {
    const finalAmount = this.paymentDetails.finalAmount;
    const enteredWalletAmount = this.form.get('enteredWalletAmount').value ? this.form.get('enteredWalletAmount').value : '0';
    this.addCharges();
    if (eval(enteredWalletAmount.toString()) > this.walletAmount) {
      alert('Available amount in your Money Wallet is ' + this.walletAmount);
      this.form.get('enteredWalletAmount').setValue('');
      this.addCharges();
      return;
    }

    if (eval(enteredWalletAmount.toString()) > finalAmount) {
      alert('You can\'t enter more than Payable Amount');
      this.form.get('enteredWalletAmount').setValue('');
      this.addCharges();
      return;
    }
    if (enteredWalletAmount == 0 || !enteredWalletAmount) {
      this.addCharges();
    }
  }

  getWalletAmount(): void {
    this.api.get(`user/money-wallet/amount`)
      .subscribe((r: any) => {
        this.walletAmount = r.amount;
      });
  }

  moneyWallet(e: any) {
    this.form.controls.enteredWalletAmount.clearValidators();

    if (e.target.checked) {
      this.walletAmountInput = true;
      this.form.controls.enteredWalletAmount.setValidators([Validators.required, Validators.min(1)]);
    }
    if (!e.target.checked) {
      this.form.get('enteredWalletAmount').setValue('');
      this.walletAmountInput = false;
      this.addCharges();
    }
  }

  addCharges() {
    const enteredWalletAmount = this.form.get('enteredWalletAmount').value ? this.form.get('enteredWalletAmount').value : '0';

    this.finalAmount = this.paymentDetails.finalAmount - enteredWalletAmount;
  }


  get f() {
    return this.form.controls;
  }

}
