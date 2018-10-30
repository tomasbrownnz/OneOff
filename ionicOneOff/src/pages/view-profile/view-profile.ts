import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../models/profile';

/**
 * Generated class for the ViewProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {
  profile : Profile;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.profile = navParams.get('Profile');
    console.log(this.profile);
    console.log(navParams.get('Profile'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProfilePage');
  }

}
