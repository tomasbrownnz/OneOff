import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { job } from '../../models/job';
import { Profile } from '../../models/profile';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";


/**
 * Generated class for the ViewMyJobPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-my-job',
  templateUrl: 'view-my-job.html',
})
export class ViewMyJobPage {
  job: job ;
  public uid: string;
  public employer: Profile;
  public numberOfApplicants: number;
  public applicants : Array<Profile>
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public database: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private actionSheetCntrl: ActionSheetController
    ){
      this.job = this.navParams.get('job');
      this.numberOfApplicants = 0;
      this.job = navParams.get('job');  
      this.afAuth.authState.take(1).subscribe(auth => {
        this.uid = auth.uid;
      });
      this.database.database.ref(`profile/${this.job.Employer}`).on('value', itemSnapshot => {
        this.employer = itemSnapshot.val();
      });
      
    }

  ionViewDidLoad() {
    this.job = this.navParams.get('job');
    this.numberOfApplicants = 0;
    console.log('ionViewDidLoad ViewJobPage');
    // this.database.database.ref(`jobs/${this.job.JobId}/jobApplicants`).once('value', itemSnapshot => {
    //   if(itemSnapshot.val() != null){
    //     this.numberOfApplicants = itemSnapshot.val().size();
    //   }
    // });
  }
  deleteJob(){
    this.deleteJobDataBase(this.job);
  }
  
  deleteJobDataBase(job:job){    
    this.actionSheetCntrl.create({
      title:`Do you want to delete ${job.Title}`,
      buttons: [
        {
          text: "Yes",
          handler: ()=>{
            this.afAuth.authState.take(1).subscribe(auth => {
            this.database.database.ref(`jobs/${job.JobId}`).remove();
            this.database.database.ref(`profile/${auth.uid}/myjobs/${job.JobId}`).remove();
            this.database.database.ref(`profile`).once('value', function(snapshot){
              snapshot.forEach(function(profilesSapShot){
              profilesSapShot.child('jobsApplied').ref.orderByKey().equalTo(`${job.JobId}`).ref.remove();              });
            });
           });
           this.navCtrl.setRoot('JobsPage');
           
          }
        },
        {
          text: "Cancel",
          handler: ()=>{
            //close actionsheet
          }
        }
      ]
        
      
    }).present();
  }

  viewApplicants(){
    this.applicants = [];
    console.log(this.job.JobId);
    this.database.database.ref(`jobs/${this.job.JobId}/jobApplicants/`).on('child_added', itemSnapshot => {
        this.database.database.ref('profile/').child(itemSnapshot.key).once('value', selectedjob =>{
          if(itemSnapshot.val()=='applied'){
            this.applicants.push(selectedjob.val());
          }
          console.log(selectedjob.val())
      
      });
    });
    console.log(this.applicants);
    this.navCtrl.push('ViewApplicantsListPage', {applicants: this.applicants, job: this.job});
    return false;
    
  }
  
  editJob(){
    this.navCtrl.push('EditJobPage', {job: this.job});  }
}
