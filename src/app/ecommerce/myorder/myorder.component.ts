import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service'; 
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.scss']
})
export class MyorderComponent implements OnInit {

  showUserImageModal: boolean;

  myorders: any;
  onimage: any;
  orderitems: any;
  myorderslenght: any;
  info: any;
  len: any;

  constructor(private api:ApiService,
    private authService: AuthenticationService
    ) { }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getmyorders()
  }

  onImage(order_id) {
    let id=order_id;
        this.showUserImageModal = true;
        this.api.get(`ecom/orderdetails/${id}`)
    .subscribe((a: any) => {
      this.info = a;
      console.log('info',this.info);
    });
    }
    hideUserImageModal() {
        this.showUserImageModal = false;
    }

  getmyorders() {
    this.api.get(`ecom/myorders`)
      .subscribe((r: any) => {
      this.myorders = r;
      this.len=this.myorders.length
      console.log('len',this.len);
      });
      console.log('order',this.myorders);
  }
  downloadPdf(order_id) {
    let id =order_id;
            this.api.get(`ecom/invoice/${id}`, {responseType: 'blob'})
            .subscribe((r: any) => {
                saveAs(new Blob([r], {type: 'application/pdf'}), 'Transaction-slip.pdf');
            });

      
  }
}
