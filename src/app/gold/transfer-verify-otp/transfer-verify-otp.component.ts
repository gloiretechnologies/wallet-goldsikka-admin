import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {ApiService} from "../../api.service";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-transfer-verify-otp',
  templateUrl: './transfer-verify-otp.component.html',
  styleUrls: ['./transfer-verify-otp.component.scss']
})
export class TransferVerifyOtpComponent implements OnChanges {

  @Output()
  onVerification: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  triggerOtp: boolean;

  submitted: boolean;
  isSubmitting: boolean;
  errorMessage: string;
  errors: object = {};
  numberOfTimesOtpSent: number = 0;
  maxLimitForOtp: number = 5;
  maskedPhone: string;
  localStorageJsonData: any;

  constructor(
    private api: ApiService,
    private notification: NzNotificationService,
     private authService: AuthenticationService,

  ) {
  }


  ngOnChanges(changes: SimpleChanges): void {
    
    if ('triggerOtp' in changes) {
      this.sendOtp();
    }
  }

  /**
   *
   */
  sendOtp(): void {
    this.numberOfTimesOtpSent++;

    if (this.numberOfTimesOtpSent >= this.maxLimitForOtp) {
      this.errorMessage = `We have sent you OTP ${this.maxLimitForOtp} times already. Please try again later`;
      this.errors = [];
      return;
    }

    this.api.get(`otp/send`)
      .subscribe((res: any) => {
          this.isSubmitting = false;
          this.maskedPhone = res['last2'];

          this.notification.blank(
            'OTP Sent',
            `We have sent you OTP`
          );

        },
        (err) => {
          this.errors = err.error.errors;

          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });
  }

  /**
   *
   * @param otp
   */
  onOtpChange(otp) {
    if (!!otp && otp.length === 6) {
      this.isSubmitting = true;
       this.localStorageJsonData = JSON.parse(localStorage.getItem('user')).verifyToken;

      this.api.get(`auth/login/${this.localStorageJsonData}/otp/verify/${otp}`)
        .subscribe((res: any) => {
            //this.isSubmitting = false;
            this.errorMessage = '';
            this.errors = [];
            this.onVerification.emit(true);
          },
          (err) => {
            this.onVerification.emit(false);

            this.errorMessage = '';
            this.errors = err.error.errors;

            if (!!err.error.message) {
              this.errorMessage = err.error.message.toString();
            }

            this.isSubmitting = false;
          });
    }
  }
}
