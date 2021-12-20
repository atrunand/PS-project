import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlTest = 'http://localhost:3000/posts';
  // urlTest = '../palletlist.json/post';

  constructor(private http: HttpClient) { }

  createPalletData(data:{}){
    return this.http.post<any>(this.urlTest,data)
    .pipe(map((res:any)=> {
      return res;
    }))
  }

  getPalletData() {
    return this.http.get<any>(this.urlTest)
    .pipe(map((res:any)=> {
      return res;
    }))
  }

  // deletePalletData(id: number) {
  //   return this.http.delete<any>(this.urlTest)
  //   .pipe(map((res:any)=> {
  //     return res;
  //   }))
  // }
}
