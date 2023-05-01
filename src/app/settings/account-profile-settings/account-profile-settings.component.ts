import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-account-profile-settings',
  templateUrl: './account-profile-settings.component.html',
  styleUrls: ['./account-profile-settings.component.scss']
})
export class AccountProfileSettingsComponent implements OnInit {

  submitted: boolean;
  isSubmitting: boolean;
  profileDetails = null;
  otpScreen: boolean;
  errorMessage: string;
  successMessage: string;
  errors: object = {};
  name: string;
  private profileId: string;
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(10)]),
  });

  constructor(
    private api: ApiService,
    private authService: AuthenticationService

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getProfile();

  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errors = [];
    this.errorMessage = '';
    this.profileVerify(this.form.value);

  }

  getProfile(): void {
    this.api.get(`user/profile`)
      .subscribe((res: any) => {
        this.profileDetails = res;
      });
  }

  profileUpdate(data): void {
    this.api.post(`user/profile`, data)
      .subscribe((res: any) => {
          this.errorMessage = '';
          this.successMessage = '';
          this.errors = [];
          this.isSubmitting = false;
          this.submitted = false;
          this.otpScreen = false;

          this.successMessage = 'Successfully updated your profile';
          this.getProfile();
        },
        (err: HttpErrorResponse) => {
          this.errors = err.error.errors;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });
  }

  profileVerify(data): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;
    this.api.post(`user/newMobile`, data)
      .subscribe((res: any) => {
          this.errors = [];
          this.isSubmitting = false;
          this.submitted = false;

          if (res.isNewMobile) {
            this.otpScreen = true;
          } else {
            this.profileUpdate(this.form.value);
          }
        },
        (err: HttpErrorResponse) => {
          this.errors = err.error.errors;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });
  }


  profileOtpVerify(code): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;
    if (code.length === 6) {
    this.api.get(`user/verify-new-mobile-otp/${this.form.get('mobile').value}/${code}`)
      .subscribe((res: any) => {
          this.errors = [];
          this.isSubmitting = false;
          this.submitted = false;
          this.profileUpdate(this.form.value);
        },
        (err: HttpErrorResponse) => {
          this.errors = err.error.errors;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });
  }}

  get f() {
    return this.form.controls;
  }
}
