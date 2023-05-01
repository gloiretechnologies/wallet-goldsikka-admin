import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-prices-under',
  templateUrl: './prices-under.component.html',
  styleUrls: ['./prices-under.component.scss']
})
export class PricesUnderComponent implements OnInit {
response:any;
  constructor( private api:ApiService,private activate:ActivatedRoute) { }
price:any;
  ngOnInit(): void {
    let id = this.activate.snapshot.paramMap.get('id');
   this.price = this.activate.snapshot.paramMap.get('id');

    this.getInfo(id);
  }
 getInfo(id) {
    this.api.get(`ecom/priceunderboxes/${id}`)
      .subscribe((r: any) => {
        this.response = r;
        console.log(this.response)
      });
  }
}