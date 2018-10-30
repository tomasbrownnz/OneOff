import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from './../../models/profile';
import { database } from 'firebase';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { contact } from '../../models/contact';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

public profile: Profile;

public email;
public lastName;
public firstName;
public bio;
public age;
public car;
public contacts: Array<contact>;



constructor(
    private afAuth: AngularFireAuth, 
    private afDatabase: AngularFireDatabase, 
    private toast: ToastController,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    menu: MenuController) {
    menu.enable(true);
  }
  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
    this.email = data.email;
    this.profileData(data.uid);
    this.initContacts(data.uid);
    if(data && data.email && data.uid){
    	this.toast.create({
    		message: `Welcome to One Off, ${data.email}`,
        duration: 3000,
      }).present();

    }
    else{
    	this.toast.create({
    		message: `Could not find authentication details.`,
    		duration: 3000
    	}).present();
    }
    })
  }
  profileData(uid){
    this.afDatabase.database.ref('profile/' + uid).once('value')
    .then((snapshot) => {
      this.profile = snapshot.val();
      console.log(this.profile);
      this.firstName = snapshot.val().firstName;
      this.lastName = snapshot.val().lastName;
      this.bio = snapshot.val().bio;
      this.age = snapshot.val().age;
      this.car = snapshot.val().car;
  });
  }
  initContacts(uid){
    this.contacts = [];
    this.afDatabase.database.ref('profile/' + uid + '/contacts').once('value', element => {
      element.forEach(contact => {
        this.contacts.push(contact.val());
      });
    });
    console.log(this.contacts);
  }
    
  

  openPage(page: string){
    this.navCtrl.push(page);
  }

  editProfile(){
    this.navCtrl.push('EditProfilePage', {Profile: this.profile});
  }

}
