import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';

@Injectable()
export class RestService {

  baseUrl: string = "http://api.wildapplications.com/mobile/webapp/";
  cache: any = {};
  currentUser: any;

  constructor( private http: Http, private storage: Storage ){
    this.currentUser = this.jwt();
  }

  scanIn(tableId: string){
    return this.http.get(this.baseUrl + 'scan/' + tableId)
      .map((response: Response) => {
        return response.json();
      })
  }

  register(password: string, email: string){
    return this.http.post(this.baseUrl + 'register',  {password: password, email: email})
      .map((response: Response) => {
        let token = response.json();
        if(token && token.token){
          this.storage.set('currentUser', token.token);
          this.currentUser = this.jwt();
        }

        return token;
      })
  }

  login(email: string, password: string){
    return this.http.post(this.baseUrl + "login", {email: email, password: password})
      .map((response: Response) => {
        let token = response.json();
        if(token && token.token){
          this.storage.set('currentUser', token);
          this.currentUser = this.jwt();
        }
        return token;
      });
  }

  order(order:any){
    console.log(this.currentUser);
    return this.http.post(this.baseUrl + "order", order, this.currentUser)
      .map((response: Response) => {
        return response.json();
      })
  }

  //private helper methods
  private jwt(): any {
    this.storage.get('currentUser').then((currentUser) => {
      if( currentUser ){
        let headers = new Headers({ 'Authorization':'Bearer ' + currentUser.token});
        this.currentUser = new RequestOptions({headers:headers});
        return new RequestOptions({ headers: headers});
      }
    });
  }
}
