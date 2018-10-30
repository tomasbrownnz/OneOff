import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { storage } from 'firebase';
import * as firebase from 'firebase';
import { Profile } from '../../models/profile';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the SetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})

export class SetupPage {

  profile = {} as Profile;
  public img: any;
  private uid: string;

  storageReference: firebase.storage.Reference;

  constructor(
    private afAuth: AngularFireAuth, 
    private database: AngularFireDatabase, 
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {

      //initialise the uid.
    this.afAuth.authState.take(1).subscribe(auth => {
      this.uid = auth.uid;
      console.log(auth.uid);
    });

  }

  ionViewDidLoad() {
    this.storageReference = storage().ref('profilepic/' + this.uid + `/myprofilepic`);
    this.storageReference.putString("data:image/png;base8,./src/assets/imgs/profile.png",'data_url');
  }

  createProfile(){
  	 this.afAuth.authState.take(1).subscribe(auth => {
       this.profile.Id = auth.uid;
       this.profile.email = auth.email;
       console.log(auth.email);
        this.database.object(`profile/${auth.uid}`).set(this.profile)
          .then(() => this.navCtrl.setRoot('TabsPage', this.profile));
     })

    }
}
