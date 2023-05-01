import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-bank-account-edit',
  templateUrl: './bank-account-edit.component.html',
  styleUrls: ['./bank-account-edit.component.scss']
})
export class BankAccountEditComponent implements OnInit {

  submitted: boolean;
  isSubmitting: boolean;
  bankData = null;

  errorMessage: string;
  successMessage: string;
  errors: object = {};
  name: string;
  private profileId: string;
  form: FormGroup = new FormGroup({
    name_on_account: new FormControl('', [Validators.required]),
    account_number: new FormControl('', [Validators.required]),
    bank_name: new FormControl('', [Validators.required]),
    bank_branch: new FormControl('', [Validators.required]),
    ifsc_code: new FormControl('', [Validators.required, Validators.min(11)]),
  });

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();


    this.getBankAccountData(this.route.snapshot.paramMap.get('id'));
  }

  onSubmit(): void {

    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errors = [];
    this.errorMessage = '';
    this.successMessage = '';
    this.api.post(`user/bankAccount/` + this.bankData.id, this.form.value)
      .subscribe((res: any) => {
          this.errors = [];
          this.isSubmitting = false;
          this.submitted = false;
          this.successMessage = 'Bank Account updated Successfully';
          this.router.navigate(['/settings/bankAccounts']);
        },
        (err: HttpErrorResponse) => {
          this.errors = err.error.errors;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });

  }

  // Get Bank Details

  getBankAccountData(id): void {
    this.api.get(`user/bankAccount/` + id)
      .subscribe((res: any) => {
        this.bankData = res;
        this.form.get('name_on_account').setValue(res['name_on_account']);
        this.form.get('account_number').setValue(res['account_number']);
        this.form.get('bank_name').setValue(res['bank_name']);
        this.form.get('bank_branch').setValue(res['bank_branch']);
        this.form.get('ifsc_code').setValue(res['ifsc_code']);
      });
  }

  get f() {
    return this.form.controls;
  }
}

