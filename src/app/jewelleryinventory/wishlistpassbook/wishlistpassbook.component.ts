import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import {HttpErrorResponse} from "@angular/common/http";
import {Router, ActivatedRoute, Params} from '@angular/router';
@Component({
  selector: 'app-wishlistpassbook',
  templateUrl: './wishlistpassbook.component.html',
  styleUrls: ['./wishlistpassbook.component.scss']
})
export class WishlistpassbookComponent implements OnInit {

  public response: any;

  constructor(private api: ApiService,private ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this. getInfo();
  }

   getInfo() {
     let pids = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.api.get(`Jewellery/passbook/${pids}`)
      .subscribe((r: any) => {
        this.response = r;
      
        console.log(this.response);

      });      
  }

}
