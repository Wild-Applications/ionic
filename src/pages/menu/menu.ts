import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, AlertController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { IonPullUpFooterState } from 'ionic-pullup';

import { ProductListPage } from '../product-list/product-list';
import { LoginPage } from '../login/login';
import { CheckoutPage } from '../checkout/checkout';

import { RestService } from '../../services/rest.service';
import { CacheService } from '../../services/cache.service';
import { BasketService } from '../../services/basket.service';
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  footerState: IonPullUpFooterState;
  checkoutButton: boolean = false;

  productListPage = ProductListPage;
  menu: any = {};
  table: any = {};
  premises: any = {};

  basket: any = {contents: []};

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService, public loadingCtrl: LoadingController, private cache: CacheService, private basketService: BasketService, private alertController: AlertController, private modalController: ModalController, private storage: Storage) {
    //let loader = this.loadingCtrl.create({content:'Loading...'});
    //loader.present();
    this.table = this.cache.get('table');
    this.menu = this.cache.get('menu');
    this.premises = this.cache.get('premises');

    this.footerState = IonPullUpFooterState.Collapsed;
    var self = this;
    this.basketService.getBasket(function(data){
      self.basket = data;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  footerExpanded() {
    this.checkoutButton = true;
  }

  footerCollapsed() {
    this.checkoutButton = false;
  }

  toggleFooter() {
    this.footerState = this.footerState == IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }

  checkout(){
    let alert = this.alertController.create({
      title: "ID Verification",
      subTitle: "A valid form of identification will be required upon delivery of the drinks. Failure to provide will result in drinks being rejected and no refund will be issued.",
      buttons: [{
        text: 'OK',
        handler: () => {
          //this.navCtrl.push(CheckoutPage);
          this.cache.put("order", this.basket);
          this.storage.get('currentUser').then((currentUser) => {
            if(typeof currentUser == 'string'){
              currentUser = JSON.parse(currentUser);
            }

            if( currentUser ){
              //user already logged in so skip this screen
              let checkoutModal = this.modalController.create(CheckoutPage);
              checkoutModal.present();
            }else{
              let loginModal = this.modalController.create(LoginPage);
              loginModal.present();
            }
          });


        }
      }]
    });
    alert.present();
  }

  remove(product){
    this.basketService.remove(product);
  }

  getFooterHeight(){
    return window.innerHeight / 2;
  }
}
