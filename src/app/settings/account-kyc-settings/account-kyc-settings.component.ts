import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../api.service";
import {HttpErrorResponse} from "@angular/common/http";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
    selector: 'app-account-kyc-settings',
    templateUrl: './account-kyc-settings.component.html',
    styleUrls: ['./account-kyc-settings.component.scss']
})
export class AccountKycSettingsComponent implements OnInit {

    submitted: boolean;
    isSubmitting: boolean;
    kycDetails = null;

    errorMessage: string;
    successMessage: string;
    errors: object = {};
    name: string;
    isKyc: boolean;
    private profileId: string;
    form: FormGroup = new FormGroup({
        gender: new FormControl('', [Validators.required]),
        father_name: new FormControl(''),
        spouse_name: new FormControl(''),
        alternate_phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(10)]),
        pan_card: new FormControl('', [Validators.required]),
        aadhaar_card: new FormControl('', [Validators.required, Validators.min(12)]),
    });

    constructor(
        private api: ApiService,
    private authService: AuthenticationService

    ) {
    }

    ngOnInit(): void {
     this.authService.checkAccess();

        this.geKycProfile();
    }

    onSubmit(): void {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.isSubmitting = true;
        this.errors = [];
        this.errorMessage = '';
        this.profileKycUpdate(this.form.value);

    }

    geKycProfile(): void {
        this.isKyc = false;
        this.api.get(`user/kyc`)
            .subscribe((res: any) => {
                this.kycDetails = res;
                if (!this.kycDetails.aadhaar_card) {
                    this.isKyc = true;
                }

                this.form.get('father_name').setValue(res.father_name);
                this.form.get('gender').setValue(res.gender);
                    // this.form.get('aadhaar_card').setValue(res.aadhaar_card);
                    // this.form.get('pan_card').setValue(res.pan_card);
                this.form.get('alternate_phone').setValue(res.alternate_phone);
                this.form.get('spouse_name').setValue(res.spouse_name);

            });
    }

    profileKycUpdate(data): void {
        this.api.post(`user/kyc`, data)
            .subscribe((res: any) => {
                    this.errorMessage = '';
                    this.successMessage = '';
                    this.errors = [];
                    this.isSubmitting = false;
                    this.submitted = false;
                    this.isKyc = false;
                    this.successMessage = 'Successfully updated your profile';
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

    updateKyc() {
        this.isKyc = true;
    }
}
