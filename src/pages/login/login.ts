import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { RegisterPage } from '../register/register';
import { CheckoutPage } from '../checkout/checkout';

import { RestService } from '../../services/rest.service';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: string;
  password: string;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private storage: Storage, private restService: RestService, public loadingCtrl: LoadingController) {
    //check if current User Exists
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
    let loader = this.loadingCtrl.create({});
    loader.present();
    this.restService.login(this.email, this.password)
      .subscribe(
        data => {
          loader.dismiss();
          this.navCtrl.push(CheckoutPage, this.viewCtrl)
          .then(()=>{
            const index = this.viewCtrl.index;
            this.navCtrl.remove(index);
          });
        },
        error => {
          console.log(error);
        }
      );
  }

  signUp(){
    this.navCtrl.push(RegisterPage);
  }
}
