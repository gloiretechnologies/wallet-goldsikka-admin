import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  response: any;
  isSubmitting: boolean;
  errors: any;
  errorMessage: string;
  favo1: any;

  constructor(private api:ApiService,private route:Router,
    private authService: AuthenticationService
    ) { }
favo:any;
  ngOnInit(): void {
     this.authService.checkAccess();

    this.getfavouri();
  }
getfavouri() {
    this.api.get(`ecom/favourites`)
      .subscribe((r: any) => {
        this.favo = r;
        console.log('selling',this.favo);
       

      })

  }
  movetofav(id,size) {
   
       this.api.post(`ecom/movetocart/${id}/${size}`,id,size)
    .subscribe((res: any) => {
        this.response=res;
    console.log('done')

this.route.navigate([`ecommerce/cartpage`])

      });
    this.api.delete(`ecom/favourites/${id}`,)
    .subscribe((res: any) => {
        this.response=res;
    console.log('done')



      });

  }
del(id) {
    
       this.api.delete(`ecom/favourites/${id}`,)
    .subscribe((res: any) => {
        this.response=res;
    console.log('done')
    window.location.reload();



      });

  }
}
