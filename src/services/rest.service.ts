import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';

@Injectable()
export class RestService {

  //baseUrl: string = "http://192.168.99.100:31126/mobile/webapp/";
  baseUrl: string = "https://api.wildapplications.com/mobile/webapp/";
  cache: any = {};
  currentUser: any;

  loggedInOnLoad: boolean = false;
  public isLoggedIn: Subject<boolean> = new BehaviorSubject<boolean>(this.loggedInOnLoad);

  loggedInUser: any = {};
  public userChange: Subject<any> = new BehaviorSubject<any>(this.loggedInUser);

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
          this.isLoggedIn.next(true);
          this.getUser()
            .subscribe(data => {
              this.userChange.next(data);
            }, error => {
              console.log(error);
            })
        }
        return token;
      });
  }

  logout(){
    this.storage.remove('currentUser');
    this.currentUser = null;
    this.isLoggedIn.next(false);
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

  getOrders(){
    return this.http.get(this.baseUrl + 'orders', this.currentUser)
      .map((response: Response) => {
        return response.json();
      })
  }

  getUser(){
    return this.http.get(this.baseUrl + 'user', this.currentUser)
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
            .subscribe((data) => {
              //token is valid
              this.loggedInOnLoad = true;
              this.isLoggedIn.next(true);
              this.getUser()
                .subscribe(data => {
                  this.loggedInUser = data;
                  this.userChange.next(data);
                }, error => {
                  console.log(error);
                })
              resolve(true);
            }, (error) => {
              if(error.status == 401 || error.status == 400){
                this.storage.remove('currentUser');
                this.isLoggedIn.next(false);
                resolve(false);
              }else{
                this.isLoggedIn.next(false);
                resolve(false);
              }
            })
        }else{
          this.isLoggedIn.next(false);
          resolve(false);
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
