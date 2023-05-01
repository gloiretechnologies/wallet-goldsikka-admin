import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse, HttpHeaderResponse} from '@angular/common/http';
import {PaymentService} from '../../_services/payment.service';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-money-wallet',
  templateUrl: './money-wallet.component.html',
  styleUrls: ['./money-wallet.component.scss']
})
export class MoneyWalletComponent implements OnInit {

  walletAmount: any;
  transactions: any;
  page: number = 1;
  orderId: string = null;

  submitted: boolean;
  isSubmitting: boolean;
  errorMessage: string;
  successMessage: string;
  errors: object = {};

  form: FormGroup = new FormGroup({
    amount: new FormControl('', [Validators.required, Validators.min(50), Validators.max(100000), Validators.pattern('^[0-9]\.*$')]),
  });

  constructor(
    private api: ApiService,
    private paymentService: PaymentService,
    private authService: AuthenticationService

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getTransactions();
    this.getWalletAmount();
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

  getTransactions(): void {
    this.api.get(`user/money-wallet/transactions?page=${this.page}`)
      .subscribe((r: any) => {
        this.transactions = r;
      });
  }

  pageChanged(pageNumber: number) {
    this.page = pageNumber;
    this.getTransactions();
  }

  onSubmit(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      this.errorMessage = '';
      this.successMessage = '';
      return;
    }
    //if(confirm("Are you sure to Submit")) {
      this.errors = [];
      this.errorMessage = '';
      this.successMessage = '';
      this.isSubmitting = true;

      this.paymentService.addMoneyWalletRazorpay(this.form.get('amount').value, this.orderId);
      this.isSubmitting = false;
    //}
  }

  get f() {
    return this.form.controls;
  }

}
