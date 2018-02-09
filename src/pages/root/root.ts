import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';

import { ScannerPage } from '../scanner/scanner';
import { MenuPage } from '../menu/menu';
import { OrderPage } from '../order/order';
import { AccountPage } from '../account/account';
import { LoginPage } from '../login/login';


import { CacheService } from '../../services/cache.service';
import { RestService } from '../../services/rest.service';
/**
 * Generated class for the RootPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-root',
  templateUrl: 'root.html',
})
export class RootPage {

  page = ScannerPage;
  scannerPage = ScannerPage;
  menupage = MenuPage;
  accountPage = AccountPage;
  ordersPage = OrderPage;

  scannedInSub;
  scannedIn: boolean = false;

  isLoggedInSub;
  isLoggedIn: boolean = false;

  loggedInUserSub;
  loggedInUser: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public cache: CacheService, public restService: RestService, private modalCtrl: ModalController, public events: Events) {

    this.scannedInSub = cache.tableChange.subscribe((value) => {
      this.scannedIn = value;
    });

    this.isLoggedInSub = restService.isLoggedIn.subscribe((value) => {
      this.isLoggedIn = value;
    });

    this.loggedInUserSub = restService.userChange.subscribe((value) => {
      this.loggedInUser = value;
    })
  }

  ionViewWillLeave(){
    this.scannedInSub.unsubscribe();
    this.isLoggedInSub.unsubscribe();
    this.loggedInUserSub.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RootPage');
  }

  openPage(p) {
    if(this.isLoggedIn){
      this.page = p;
    }else{
      if(p == this.ordersPage || p == this.accountPage){
        let loginModal = this.modalCtrl.create(LoginPage);
        loginModal.onDidDismiss(data => {
          if(data){
            //logged in
            this.page = p;
          }else{
            //didnt log in
            //do nothing
          }
        });
        loginModal.present();
      }else{
        this.page = p;
      }
    }
  }

  scanOut(){
    this.cache.put('table', null);
    this.cache.put('premises', null);
    this.cache.put('menu', null);
    this.events.publish("scannedOut", null);
  }

  logout(){
    this.restService.logout();
  }

  login(){
    let loginModal = this.modalCtrl.create(LoginPage);
    loginModal.onDidDismiss(data => {

    });
    loginModal.present();
  }

  getUser(){
    this.restService.getUser()
      .subscribe(data => {
        this.loggedInUser = data.user;
      }, error => {
        console.log(error);
      })
  }

}
