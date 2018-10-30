import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { job } from '../../models/job';
import { Profile } from '../../models/profile';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";


/**
 * Generated class for the ViewJobPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-job',
  templateUrl: 'view-job.html',
})
export class ViewJobPage {
  job: job;
  public uid: string;
  public employer: Profile;
  public status: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public afAuth: AngularFireAuth 
    ){
      this.status = "Apply";
      this.job = navParams.get('job');
      this.afAuth.authState.take(1).subscribe(auth => {
        this.uid = auth.uid;
        console.log(auth.uid);
      });
      this.database.database.ref(`profile/${this.job.Employer}`).on('value', itemSnapshot => {
        this.employer = itemSnapshot.val();
        console.log(itemSnapshot.val());
      });
      
    }

  ionViewDidLoad() {
    this.job = this.navParams.get('job');
    this.status = 'apply';
    console.log('ionViewDidLoad ViewJobPage');
    this.database.database.ref(`jobs/${this.job.JobId}/jobApplicants/${this.uid}`).once('value', itemSnapshot => {
      if(itemSnapshot.val() != null){
        this.status = itemSnapshot.val();
      }
    });
  }
  
  apply(){
    //set the applicants for this job to users id
    
    this.database.database.ref(`jobs/${this.job.JobId}/jobApplicants/${this.uid}`).once('value', itemSnapshot => {
      if(itemSnapshot.val() == null){
        this.database.database.ref(`jobs/${this.job.JobId}/jobApplicants/${this.uid}`).set(
        'applied'
      );
      //set the jobs applied for this users to job id
      this.database.database.ref(`profile/${this.uid}/jobsApplied/${this.job.JobId}`).set(
        'applied'
      );
      }
      
    });
    this.ionViewDidLoad();
  }

  viewEmployer(){
    this.navCtrl.push('ViewProfilePage', {Profile: this.employer});
  }

}
