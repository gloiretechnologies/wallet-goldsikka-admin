import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistserviceService {

  constructor(private http: HttpClient) { }

  postwishlistId(id:any) {
    // return this.http.post(`https://staging-api.dev.goldsikka.in/api/Jewellery/wishlist?id=${id}`, id);
  }
}
