import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-account-password-setting',
  templateUrl: './account-password-setting.component.html',
  styleUrls: ['./account-password-setting.component.scss']
})
export class AccountPasswordSettingComponent implements OnInit {

  submitted: boolean;
  isSubmitting: boolean;
  showPasswordStatus: boolean;
  errorMessage: string;
  successMessage: string;
  errors: object = {};
  form: FormGroup = new FormGroup({
    currentPassword: new FormControl('', [Validators.required, Validators.min(6)]),
    newPassword: new FormControl('', [Validators.required, Validators.min(6), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]),
    confirmNewPassword: new FormControl('', [Validators.required, Validators.min(6)]),
  });

  constructor(
    private api: ApiService,
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
    this.errorMessage = '';
    this.successMessage = '';
    this.errors = [];
    this.api.post(`user/changePassword`, this.form.value)
      .subscribe((res: any) => {
          this.isSubmitting = false;
          this.submitted = false;
          this.successMessage = res.success;
          this.form.reset();
        },
        (err: HttpErrorResponse) => {
          this.errors = err.error.errors;
          if (err.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });
  }

// Function
  showPassword(): void {
    this.showPasswordStatus = !this.showPasswordStatus;
  }

  get f() {
    return this.form.controls;
  }
}

