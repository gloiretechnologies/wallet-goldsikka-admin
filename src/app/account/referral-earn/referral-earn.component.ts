import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from "@angular/router";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-referral-earn',
  templateUrl: './referral-earn.component.html',
  styleUrls: ['./referral-earn.component.scss']
})
export class ReferralEarnComponent implements OnInit {

  referrals: object;
  referralUserList: object;
  page: number = 1;
  showModal: boolean;
  isSubmitting: boolean;
  isBank: boolean;
  errors: object = {};
  errorMessage: string;
  submitted = false;
  referralsUserList: object = {};
  walletAmount: number;
  form: FormGroup = new FormGroup({
    amount: new FormControl('', [Validators.required, Validators.min(500)]),
  });

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
     private authenticationService: AuthenticationService,
  ) {
  }

  show() {
    this.showModal = true; // Show-Hide Modal Check

  }

  //Bootstrap Modal Close event
  hide() {
    this.showModal = false;
  }

  ngOnInit(): void {
     this.authenticationService.checkAccess();

    this.getReferrals();
    this.getReferralList();
    this.getWalletAmount();
  }

  getReferrals(): void {
    this.api.get(`user/referral/earnings`)
      .subscribe((r: any) => {
        this.referrals = r;
        this.form.get('amount').setValue(r.earningsAmount);
        this.referralUserList = r.userList;
      })
  }

  pageChanged(pageNumber) {
    this.page = pageNumber;
    this.getReferralList();
  }

  onSubmit() {
    this.errorMessage = '';
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.errors = [];
    this.errorMessage = '';
    this.isSubmitting = true;
    this.api.get(`user/referral/amount-redeem?amount=` + this.form.get('amount').value)
      .subscribe((r: any) => {
          alert(r.message);
          this.isSubmitting = false;
          this.router.navigate(['/referral']);
        },
        (err: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.errors = err.error.errors;
          this.errorMessage = '';
          this.errors = {};
          if (err.error.errors) {
            this.errors = err.error.errors;
          }
          if (err.error.is_bank === false) {
            this.isBank = true;
          }
          if (err.error.message && err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });
  }

  withDraw() {
    this.show();
  }

  get f() {
    return this.form.controls;
  }

  //Money wallet AMount

  getWalletAmount(): void {
    this.api.get(`user/money-wallet/amount`)
      .subscribe((r: any) => {
          this.walletAmount = r.amount;
        },
        (err: HttpErrorResponse) => {
          if (err.status === 400) {
            alert('Server error. Please try again later');
          }
        });
  }

  getReferralList(): void {
    this.api.get(`user/referral/referralList?page=${this.page}`)
      .subscribe((r: any) => {
          this.referralsUserList = r;
        },
        (err: HttpErrorResponse) => {
          if (err.status === 400) {
            alert('Server error. Please try again later');
          }
        });
  }
}
