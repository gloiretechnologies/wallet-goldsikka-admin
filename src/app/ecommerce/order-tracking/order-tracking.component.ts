import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit {
  ordertracking: any;

  constructor(private api:ApiService,private activate:ActivatedRoute,
    private authService: AuthenticationService
    ) { }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getordertracking();
  }

  getordertracking(){
    let id = this.activate.snapshot.paramMap.get('order_id');

    this.api.get(`ecom/ordertracking/${id}`)
    .subscribe((a: any) => {
      this.ordertracking = a;
      console.log('tracking',this.ordertracking);
    });
  }

}
