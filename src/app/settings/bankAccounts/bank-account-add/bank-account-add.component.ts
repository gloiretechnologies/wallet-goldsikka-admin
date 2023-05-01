import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from "@angular/router";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-bank-account-add',
  templateUrl: './bank-account-add.component.html',
  styleUrls: ['./bank-account-add.component.scss']
})
export class BankAccountAddComponent implements OnInit {

  submitted: boolean;
  isSubmitting: boolean;
  profileDetails = null;

  errorMessage: string;
  successMessage: string;
  errors: object = {};
  name: string;
  private profileId: string;
  form: FormGroup = new FormGroup({
    name_on_account: new FormControl('', [Validators.required]),
    account_number: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
    bank_name: new FormControl('', [Validators.required]),
    bank_branch: new FormControl('', [Validators.required]),
    ifsc_code: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
  });

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthenticationService

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();


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
    this.api.post(`user/bankAccount`, this.form.value)
      .subscribe((res: any) => {
          this.errors = [];
          this.isSubmitting = false;
          this.submitted = false;
          this.form.reset();
          this.successMessage = 'Bank Account Added Successfully';
          this.router.navigate(['/settings/bankAccounts'])
        },
        (err: HttpErrorResponse) => {
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
}

