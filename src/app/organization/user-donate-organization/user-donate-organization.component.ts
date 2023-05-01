import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../api.service';
import {GoldService} from '../../gold/gold.service';
import {AccountService} from '../../account/account.service';
import {HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {PaymentService} from '../../_services/payment.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';



@Component({
  selector: 'app-user-donate-organization',
  templateUrl: './user-donate-organization.component.html',
  styleUrls: ['./user-donate-organization.component.scss']
})
export class UserDonateOrganizationComponent implements OnInit {

    orderId: string = null;
    isPayAmount: boolean;
    submitted: boolean;
    isEventValid: boolean;
    isPayEvent: boolean;
    organization: any = [];
    qrCodeImage: any = [];
    currentGoldPricePerGram: number;
    gstPercentage: number = environment.gstPercentage;
    amountPayableIncludingCharges: number;
    errorMessage: string;
    errors: object = {};
    isPriceLock: string;
    isSubmitting: boolean;
    walletAmount: number;
  showUserImageModal: boolean;
  amountWithGstAmount: number;
  walletAmountInput: boolean;
    form: FormGroup = new FormGroup({
        quantity: new FormControl('', [Validators.required, Validators.max(30)]),
        amount: new FormControl('', [Validators.required, Validators.min(100), Validators.maxLength(10)]),
        enteredWalletAmount: new FormControl(''),
    });

    constructor(
        private api: ApiService,
        private goldService: GoldService,
        private route: ActivatedRoute,
        private paymentService: PaymentService,
        private notification: NzNotificationService,
    private authService: AuthenticationService,


    ) {
    }

  /**
   *
   */
  ngOnInit(): void {
     this.authService.checkAccess();

    this.goldService.getCurrentGoldPrice()
    // this.maskedPhone = user.maskedPhone;
      .subscribe((r: any) => {
        this.currentGoldPricePerGram = r.sell_price_per_gram;
      });
    this.getOrganization();
    this.getWalletAmount();
  }


  getWalletAmount(): void {
    this.api.get(`user/money-wallet/amount`)
      .subscribe((r: any) => {
        this.walletAmount = r.amount;
      });
  }

  /**
   *
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.isSubmitting = true;
    const organizationId = this.route.snapshot.paramMap.get('id');
    this.api.get(`user/wallet/gold/price/lock?price=` + this.currentGoldPricePerGram)
      .subscribe((res: any) => {
          const quantityInGrams: number = this.form.get('quantity').value;
          const enteredWalletAmount = this.form.get('enteredWalletAmount').value;
          if (eval(enteredWalletAmount.toString()) > this.walletAmount) {
            alert('Available amount in your Money Wallet is ' + this.walletAmount);
            return;
          }

          if (eval(this.amountPayableIncludingCharges.toString()) == 0) {
            const amount = this.form.get('amount').value;
            const data = {amount, enteredWalletAmount, organizationId};

            this.api.post(`organizations/donate-gold-money-wallet`, data)
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
          if (eval(this.amountPayableIncludingCharges.toString()) !== 0) {
            this.paymentService.donateMoneyRazorpay(this.form.get('amount').value, this.amountPayableIncludingCharges, this.orderId, organizationId, enteredWalletAmount);
            this.isSubmitting = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.errorMessage = '';
          this.errors = err.error.errors;
          if (err.error.message && err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
        });
  }

  addCharges(): void {
    const amount: number = this.form.get('amount').value;
    // const amountWithGst: number = ((amount / 100) * this.gstPercentage);
    const amountWithGst: number = 0;
    const totalAmount = eval(amount.toString()) + eval(amountWithGst.toString());
    // this.amountPayableIncludingCharges = totalAmount.toFixed();
    this.amountPayableIncludingCharges = amount;
    this.amountWithGstAmount = eval(amountWithGst.toString());
  }

  onAmountChange(): void {
    this.submitted = true;
    let quantityInGrams: number;
    const amount: number = this.form.get('amount').value;

    if (amount < 0) {
      this.form.get('amount').setValue('');
      this.form.get('quantity').setValue('');
    }
    if (amount > 0) {
      this.addCharges();
      quantityInGrams = this.goldService.amountToQuantity(amount, this.currentGoldPricePerGram);
    } else {
      quantityInGrams = 0;
    }
    this.form.get('quantity').setValue(quantityInGrams.toFixed(15));
    this.enteredWalletAmountChange();
  }

  onQuantityChange(): void {
    this.submitted = true;
    let amountPayable: number;
    const quantityInGrams: number = this.form.get('quantity').value;

    if (quantityInGrams < 0) {
      this.form.get('quantity').setValue('');
    }

    if (quantityInGrams > 0) {
      amountPayable = this.goldService.calculatePrice(quantityInGrams, this.currentGoldPricePerGram);
    } else {
      amountPayable = 0;
    }

    this.form.get('amount').setValue(amountPayable.toFixed(2));
    this.addCharges();
    this.enteredWalletAmountChange();
  }

  get f() {
    return this.form.controls;
  }


  getOrganization() {
    this.api.get(`organizations/info/` + this.route.snapshot.paramMap.get('id'))
      .subscribe((res: any) => {
          this.organization = res;
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

  enteredWalletAmountChange() {
    const amount: number = this.form.get('amount').value;
    // if(amount == 0 || !amount){
    //     alert('First enter amount to Buy Gold');
    // }
    if (amount >= 100) {
      const enteredWalletAmount = this.form.get('enteredWalletAmount').value;
      this.addCharges();

      if (eval(enteredWalletAmount.toString()) > this.walletAmount) {
        alert('Available amount in your Money Wallet is ' + this.walletAmount);
        this.form.get('enteredWalletAmount').setValue('');
        this.addCharges();
        return;
      }

      if (eval(enteredWalletAmount.toString()) > this.amountPayableIncludingCharges) {
        alert('You can\'t enter more than Payable Amount');
        this.form.get('enteredWalletAmount').setValue('');
        this.addCharges();
        return;
      }

      // this.addCharges();
      this.amountPayableIncludingCharges =
        this.amountPayableIncludingCharges - eval(enteredWalletAmount.toString());

      if (enteredWalletAmount == 0 || !enteredWalletAmount) {
        this.addCharges();
      }
    }
  }

  moneyWallet(e: any) {
    this.form.controls["enteredWalletAmount"].clearValidators();

    if (e.target.checked) {
      this.walletAmountInput = true;
      this.form.controls["enteredWalletAmount"].setValidators([Validators.required, Validators.min(1)]);
    }
    if (!e.target.checked) {
      this.form.get('enteredWalletAmount').setValue('');
      this.walletAmountInput = false;
      this.addCharges();
    }
  }
    onImage() {
        this.showUserImageModal = true;
    }
    hideUserImageModal() {
        this.showUserImageModal = false;
    }
    
}
