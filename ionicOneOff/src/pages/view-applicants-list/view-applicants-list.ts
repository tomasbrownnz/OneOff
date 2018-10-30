import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Profile } from '../../models/profile';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";
import { job } from '../../models/job';
import { contact } from '../../models/contact';



/**
 * Generated class for the ViewApplicantsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-applicants-list',
  templateUrl: 'view-applicants-list.html',
})
export class ViewApplicantsListPage {
  applicants: Array<Profile>;
  employees: Array<Profile>;
  job : job;
  employerContact= {} as contact;
  private uid: string;
  constructor(public navCtrl: NavController,
    private toast: ToastController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public afAuth: AngularFireAuth) {
    this.applicants = navParams.get('applicants');
    this.job = navParams.get('job');
    console.log( navParams.get('job'));
    this.afAuth.authState.take(1).subscribe(auth => {
      this.uid = auth.uid;
    });
  }

  ionViewDidLoad() {
    this.applicants = this.navParams.get('applicants');
    console.log(this.applicants);
    console.log(this.navParams.get('applicants')+ 'nav params');
    console.log('ionViewDidLoad ViewApplicantsListPage');
  }

  viewApplicant(Profile: Profile){
    this.navCtrl.push('ViewProfilePage',{Profile: Profile});
  }

  accept(Profile: Profile){
    event.stopPropagation();
    this.database.database.ref(`jobs/${this.job.JobId}/jobApplicants/${Profile.Id}`).set(
      "accepted"
    );
    //set the jobs applied for this users to job id
    this.database.database.ref(`profile/${Profile.Id}/jobsApplied/${this.job.JobId}`).set(
      "accepted"
    );
    this.addContacts(Profile);
    this.navCtrl.pop();
    this.toast.create({
      message: `Profile added to Contact Page.`,
      duration: 3000,
    }).present();
  }

  decline(Profile: Profile){
    event.stopPropagation();
    this.database.database.ref(`jobs/${this.job.JobId}/jobApplicants/${Profile.Id}`).set(
      'declined'
    );
    //set the jobs applied for this users to job id
    this.database.database.ref(`profile/${Profile.Id}/jobsApplied/${this.job.JobId}`).set(
      'declined'
    );
  }

  addContacts(Profile: Profile){
    //ADD COTACT TO EMPLOYER ACCOUNT
    this.employerContact.jobTitle = this.job.Title;
    this.employerContact.name = Profile.firstName + " " + Profile.lastName;
    this.employerContact.email = Profile.email;
    this.employerContact.phoneNumber = Profile.phoneNumber;
    //add contact to employer
    this.database.database.ref(`profile/${this.uid}/contacts`).push(
      this.employerContact
    );
  }


}
