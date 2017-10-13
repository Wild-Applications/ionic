import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';

@Injectable()
export class RestService {

  baseUrl: string = "http://192.168.99.100:31126/mobile/webapp/";
  cache: any = {};
  currentUser: any;

  constructor( private http: Http, private storage: Storage ){

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
          this.jwt(token);
        }
        return token;
      });
  }

  checkToken(){
    return this.http.get(this.baseUrl + "token", this.currentUser)
      .map((response: Response) => {
        return response.json();
      })
  }

  order(order:any){
    console.log(this.currentUser);
    return this.http.post(this.baseUrl + "order", order, this.currentUser)
      .map((response: Response) => {
        return response.json();
      })
  }

  retrieveStoredPaymentMethods(){
    return this.http.get(this.baseUrl + "payments/stored", this.currentUser)
      .map((response: Response) => {
        return response.json();
      })
  }

  public authUser(){
    return new Promise((resolve, reject) => {
      this.storage.get('currentUser').then((currentUser) => {
        if( currentUser ){
          let headers = new Headers({ 'Authorization':'Bearer ' + currentUser.token});
          this.currentUser = new RequestOptions({ headers: headers});
          this.http.get(this.baseUrl + "token", this.currentUser)
            .map((response: Response ) => {
              return response.json();
            })
            .subscribe((data)=>{
              //token is valid
              resolve(null);
            }, (error) => {
              if(error.status == 401 || error.status == 400){
                this.storage.remove('currentUser');
                resolve(null);
              }
            })
        }else{
          resolve(null);
        }
      });
    })
  }

  //private helper methods
  public jwt(token?: any): any {
    if(token){
      let headers = new Headers({ 'Authorization':'Bearer ' + token.token});
      this.currentUser = new RequestOptions({ headers: headers});
    }else{
      this.storage.get('currentUser').then((currentUser) => {
        if( currentUser ){
          let headers = new Headers({ 'Authorization':'Bearer ' + currentUser.token});
          this.currentUser = new RequestOptions({ headers: headers});
        }
      });
    }
  }
}
