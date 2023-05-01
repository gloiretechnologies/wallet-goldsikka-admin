import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-brand-page',
  templateUrl: './brand-page.component.html',
  styleUrls: ['./brand-page.component.scss']
})
export class BrandPageComponent implements OnInit {
  response: any;
  response1: any;

   constructor( private api:ApiService,private activate:ActivatedRoute,
    private authService: AuthenticationService
    ) { }


  ngOnInit(): void {
    this.authService.checkAccess();
    let id = this.activate.snapshot.paramMap.get('id');
    this.getInfo(id);
    this.getInfo1(id);

  }
 getInfo(id) {
    this.api.get(`ecom/brand/${id}`)
      .subscribe((r: any) => {
        this.response = r;
        console.log(this.response)
      });
  }
  getInfo1(id) {
    this.api.get(`ecom/brands/${id}`)
      .subscribe((r: any) => {
        this.response1 = r;
        console.log(this.response1)
      });
  }
}




