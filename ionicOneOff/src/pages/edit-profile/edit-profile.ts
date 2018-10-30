import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../models/profile';
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

profile : Profile;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private database: AngularFireDatabase, ) {
    this.profile = navParams.get('Profile');
    console.log(this.profile);
 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  saveChanges(){
    this.database.database.ref(`profile/${this.profile.Id}`).update(
      this.profile
    );
    this.navCtrl.setRoot('TabsPage');
  }

}
