import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { RestService } from '../../services/rest.service';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  password: string;
  email: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register(){

    let loader = this.loadingCtrl.create({content:'Registering...'});
    loader.present();
    this.restService.register(this.password, this.email)
      .subscribe(
        data => {
          loader.dismiss();
          //data is the token;
          this.navCtrl.pop();
        },
        error => {
          alert(error);
        }
      );
  }

}
