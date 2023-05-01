import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../../api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
    selector: 'app-nominee-edit',
    templateUrl: './nominee-edit.component.html',
    styleUrls: ['./nominee-edit.component.scss']
})
export class NomineeEditComponent implements OnInit {

    submitted: boolean;
    isSubmitting: boolean;
    nomineeDetails = null;

    errorMessage: string;
    successMessage: string;
    errors: object = {};
    name: string;
    states: [] = [];
    countries: [] = [];
    private profileId: string;
    form: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state_id: new FormControl('', [Validators.required]),
        country_id: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        relation: new FormControl('', [Validators.required]),
        zip: new FormControl('', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$'), Validators.min(6)]),
    });

    constructor(
        private api: ApiService,
        private router: Router,
        private route: ActivatedRoute,
    private authService: AuthenticationService

    ) {
    }

    ngOnInit(): void {
     this.authService.checkAccess();

        this.errorMessage = '';
        this.successMessage = '';
        this.getNomineeProfile(this.route.snapshot.paramMap.get('id'));
        this.getStates();
        this.getCountries();
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
        this.api.post(`user/nominee/` + this.nomineeDetails.id, this.form.value)
            .subscribe((res: any) => {
                    this.isSubmitting = false;
                    this.submitted = false;
                    this.form.reset();
                    this.successMessage = 'Nominee Updated Successfully';
                    this.router.navigate(['/settings/nominees']);
                },
                (err: HttpErrorResponse) => {
                    this.errors = err.error.errors;
                    if (err.error.message.length) {
                        this.errorMessage = err.error.message.toString();
                    }
                    this.isSubmitting = false;
                });

    }

    //Get Nominee
    getNomineeProfile(id): void {
        this.api.get(`user/nominee/` + id)
            .subscribe((res: any) => {
                this.nomineeDetails = res;
                this.form.get('name').setValue(res.name);
                this.form.get('phone').setValue(res.phone);
                this.form.get('address').setValue(res.address);
                this.form.get('city').setValue(res.city);
                this.form.get('zip').setValue(res.zip);
                this.form.get('country_id').setValue(res.country_id);
                this.form.get('state_id').setValue(res.state_id);
                this.form.get('relation').setValue(res.relation);
            });
    }


    getStates(): void {
        this.api.get(`states`)
            .subscribe((res: any) => {
                this.states = res;
            });
    }

    getCountries(): void {
        this.api.get(`countries`)
            .subscribe((res: any) => {
                this.countries = res;
            });
    }

    get f() {
        return this.form.controls;
    }
}
