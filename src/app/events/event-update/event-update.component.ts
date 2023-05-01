import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {ApiService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GoldService} from "../../gold/gold.service";
import {SchemesService} from "../../schemes/schemes.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-event-update',
  templateUrl: './event-update.component.html',
  styleUrls: ['./event-update.component.scss']
})
export class EventUpdateComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  isSubmitting: boolean;
  errors: object = {};
  filedata: any;
  submitted: boolean;
  isEventType: boolean;
  isOthersEventType: boolean;
  currentGoldPricePerGram: number;
  schemeCalculationType: string;
  imageSrc: string;
  list: any;
  files = null;
  selectedImage: File = null;
  selectedCoupleImage: File = null;
  schemes: any = [];
  date3: string;
  events: any = [];
  schemeValues: any = [];
  form: FormGroup = new FormGroup({
    event_type: new FormControl('', [Validators.required]),
    event_name: new FormControl('', [Validators.required]),
    event_date: new FormControl('', [Validators.required]),
    bride_name: new FormControl('', []),
    groom_name: new FormControl('', []),
    venue: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    gender: new FormControl('', []),
    holder_name: new FormControl('', []),
    photo: new FormControl('', [Validators.required]),
    muhurtham_time: new FormControl('', [Validators.required]),
    wedding_card_photo: new FormControl('', []),
    other_event_type: new FormControl('', []),
  });

  constructor(
    private notification: NzNotificationService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private goldService: GoldService,
    private schemeService: SchemesService,
    private http: HttpClient,
    private authService: AuthenticationService,

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getEventsData(this.route.snapshot.paramMap.get('id'));
  }

  /**
   *
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const eventDate = new DatePipe('en-US').transform(this.events.event_date, 'dd/MM/yyyy');
    let myFormData = new FormData();
    myFormData.append('event_type', this.form.get('event_type').value);
    myFormData.append('event_name', this.form.get('event_name').value);
    myFormData.append('event_date', eventDate);
    myFormData.append('venue', this.form.get('venue').value);
    myFormData.append('description', this.form.get('description').value);
    myFormData.append('muhurtham_time', this.form.get('muhurtham_time').value);
    myFormData.append('gender', this.form.get('gender').value);
    myFormData.append('bride_name', this.form.get('bride_name').value);
    myFormData.append('groom_name', this.form.get('groom_name').value);
    myFormData.append('holder_name', this.form.get('holder_name').value);
    myFormData.append('photo', this.selectedImage, this.selectedImage.name);
    myFormData.append('other_event_type',this.form.get('other_event_type').value);
    if (this.selectedCoupleImage) {
      myFormData.append('wedding_card_photo', this.selectedCoupleImage, this.selectedCoupleImage.name);
    }
    this.api.post(`user/events/update/` + this.route.snapshot.paramMap.get('id'), myFormData)
      .subscribe((res: any) => {
          this.notification
            .blank(
              'Success',
              ''+res.message,
            )
            .onClick.subscribe(() => {
          });
          this.submitted = false;
          this.router.navigate(['/events']);
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
    this.isSubmitting = true;

  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      this.selectedImage = event.target.files[0];
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }

  onCouplePhotosChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      this.selectedCoupleImage = event.target.files[0];
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }

  get f() {
    return this.form.controls;
  }

  changeEventType() {
    this.form.controls["bride_name"].clearValidators();
    this.form.controls["holder_name"].clearValidators();
    this.form.controls["groom_name"].clearValidators();
    this.form.controls["wedding_card_photo"].clearValidators();
    this.form.controls["other_event_type"].clearValidators();
    this.form.controls["gender"].clearValidators();
    const type = this.form.get('event_type').value;
    if (type === 'MRG') {
      this.isEventType = true;
      this.isOthersEventType = false;
      this.form.controls["bride_name"].setValidators([Validators.required]);
      this.form.controls["groom_name"].setValidators([Validators.required]);
      this.form.controls["gender"].setValidators([Validators.required]);
      this.form.controls["wedding_card_photo"].setValidators([Validators.required]);
    } else if (type === 'OTH') {
      this.isOthersEventType = true;
      this.isEventType = false;
      this.form.controls["holder_name"].setValidators([Validators.required]);
      this.form.controls["other_event_type"].setValidators([Validators.required]);
    }
  }

  getEventsData(id) {
    this.api.get(`user/events/get/` + id)
      .subscribe((res: any) => {
          this.events = res;
          //  this.date3 = this.datePipe.transform(this.events.event_date, 'yyyy-mm-dd');
          //       const eventDate2 = new DatePipe('').transform(res.event_date, 'yyyy-mm-dd');
          this.form.get('event_type').setValue(res.event_type);
          this.form.get('event_name').setValue(res.event_name);
          const eventDate1 = new DatePipe('en-US').transform(res.event_date, 'yyyy-MM-dd');         //   console.log(this.eventDate2);
          this.form.get('event_date').setValue(eventDate1);
          this.form.get('venue').setValue(res.venue);
          this.form.get('description').setValue(res.description);
          this.form.get('muhurtham_time').setValue(res.muhurtham_time);
          if (res.event_type === 'MRG') {
            this.form.get('gender').setValue(res.gender);
            this.form.get('bride_name').setValue(res.bride_name);
            this.form.get('groom_name').setValue(res.groom_name);
          }
          if (res.event_type === 'OTH') {
            this.form.get('holder_name').setValue(res.holder_name);
            this.form.get('other_event_type').setValue(res.other_event_type);
          }
          this.changeEventType();
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
}
