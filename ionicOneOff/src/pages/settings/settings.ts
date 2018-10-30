import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from './../../models/profile';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

public profile: Profile;
public locations: Array<String>;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afAuth: AngularFireAuth, 
    private afDatabase: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
      this.profileData(data.uid);
    });
  }

  profileData(uid){
    this.afDatabase.database.ref('profile/' + uid).once('value')
    .then((snapshot) => {
      this.profile = snapshot.val();
  });
  this.afDatabase.database.ref('profile/' + uid + '/locations').once('value')
    .then((snapshot) => {
      this.locations = snapshot.val();
  });
  
}

saveSettings(locations){
  this.afDatabase.database.ref(`profile/${this.profile.Id}/locations`).set(
    locations
  );
  this.navCtrl.setRoot('TabsPage');
}

}