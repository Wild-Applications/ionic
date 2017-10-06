import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Stripe } from '@ionic-native/stripe';
import { CustomFormsModule } from 'ng2-validation';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonPullupModule } from 'ionic-pullup';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ScannerPage } from '../pages/scanner/scanner';
import { MenuPage } from '../pages/menu/menu';
import { ProductListPage, ProductModal } from '../pages/product-list/product-list';
import { CheckoutPage } from '../pages/checkout/checkout';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

import { RestService } from '../services/rest.service';
import { CacheService } from '../services/cache.service';
import { BasketService } from '../services/basket.service';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ScannerPage,
    MenuPage,
    ProductListPage,
    ProductModal,
    CheckoutPage,
    LoginPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonPullupModule,
    CustomFormsModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ScannerPage,
    MenuPage,
    ProductListPage,
    ProductModal,
    CheckoutPage,
    LoginPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestService,
    CacheService,
    BasketService,
    Stripe
  ]
})
export class AppModule {}
