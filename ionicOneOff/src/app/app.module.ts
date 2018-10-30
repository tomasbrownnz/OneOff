import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {FIREBASE_CONFIG} from './app.firebase.config';
import { MyApp } from './app.component';
import { HomePageModule } from '../pages/home/home.module';
import { JobsPageModule } from '../pages/jobs/jobs.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { LoginPageModule } from '../pages/login/login.module';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    HomePageModule,
    JobsPageModule,
    ProfilePageModule,
    TabsPageModule,
    AngularFireDatabaseModule,
    SettingsPageModule,
    LoginPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera
  ]
})
export class AppModule {}
