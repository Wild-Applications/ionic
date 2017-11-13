import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { ScannerPage } from '../pages/scanner/scanner';
import { RootPage } from '../pages/root/root';
import { MenuPage } from '../pages/menu/menu';

import { HomePage } from '../pages/home/home';

import { RestService } from '../services/rest.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = RootPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private restService: RestService, private storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      this.restService.authUser().then((data) => {
        splashScreen.hide();
      }, (reject) => {
        splashScreen.hide();
      })
    });
  }
}
