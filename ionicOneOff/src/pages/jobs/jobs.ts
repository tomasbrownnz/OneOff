import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { job } from '../../models/job';
import { AngularFireAuth } from "angularfire2/auth";

/**
 * Generated class for the JobsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html',
})
export class JobsPage {
  public jobsApplied: Array<any> = [];
  public myjobs: Array<any> = [];
  private uid: string;

  JoblistReference: firebase.database.Reference;
  myJoblistReference: firebase.database.Reference;
  jobAppliedListReference: firebase.database.Reference;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private database: AngularFireDatabase, 
    private actionSheetCntrl: ActionSheetController) {
    this.JoblistReference = database.database.ref('jobs/');
    //initialise the uid.
    this.afAuth.authState.take(1).subscribe(auth => {
      this.uid = auth.uid;
    });
    this.ionViewDidLoad();
  }

  ionViewDidLoad() {
    this.initialiseArrays();
  }

  initialiseArrays(){
    this.myjobs = [];
    this.jobsApplied = [];
    //get the reference to the my jobs list and jobs applied list.
    this.myJoblistReference = this.database.database.ref(`profile/${this.uid}/myjobs`);
    this.jobAppliedListReference = this.database.database.ref(`profile/${this.uid}/jobsApplied`);
    //initialise the Jobs array,
    this.jobsApplied = [];
    this.jobAppliedListReference.on('child_added', itemSnapshot => {
            this.JoblistReference.child(itemSnapshot.key).once('value', selectedjob =>{
            this.jobsApplied.push(selectedjob.val());
          });
      });
      console.log(this.jobsApplied);


    //initialise myjobs array    
    this.myjobs = [];
    this.myJoblistReference.on('child_added', itemSnapshot => {
        this.JoblistReference.child(itemSnapshot.val()).once('value', selectedjob =>{
          this.myjobs.push(selectedjob.val());
        });
    });
}
  
      

  newJob(){
    this.navCtrl.push('NewJobPage'); 
  }

  viewMyJob(job: job){
    //push to view ny job page is the user owns the job
    if(job.Employer == this.uid){
      console.log(job);
      this.navCtrl.push('ViewMyJobPage', {job: job});
    }
    //push to view Job page 
    else{
      this.navCtrl.push('ViewJobPage', {job: job});
    }
  }

  menuBar(job: job){
    event.stopPropagation();
    this.actionSheetCntrl.create({
      title:`${job.Title}`,
      buttons: [
        {
          text: "Edit",
          handler: ()=>{
            // Send user to Edit Job page with job key as a parameter
          this.navCtrl.push('EditJobPage', {job: job});
          }
        },
        {
          text: "Delete",
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
            this.navCtrl.setRoot('JobsPage');
          }
        }
      ]
        
      
    }).present();
  }

  getStatus(job: job){
    console.log("profile/" + this.uid + "/myjobs/" + job.JobId);
    this.database.database.ref("profile/" + this.uid + "/myjobs/" + job.JobId).once('value',  function(snapshot){
      return snapshot.val();
    });
  }
  viewJobNow(job: job){
    this.navCtrl.push('ViewJobPage', {job: job});
  }
  viewJob(job: job){
    event.stopPropagation();
      this.actionSheetCntrl.create({
        title:`${job.Title}`,
        buttons: [
          {
            text: "View Job",
            handler: ()=>{
              // Send user to Edit Job page with job key as a parameter
            this.navCtrl.push('ViewJobPage', {job: job});
            }
          },
          {
            text: "Cancel",
            handler: ()=>{
              //close actionsheet
              this.ionViewDidLoad();
            }
          }
        ]
          
        
      }).present();
  }

  
  

}
