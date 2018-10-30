import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { job } from '../../models/job';
import { initializeApp } from '../../../node_modules/firebase';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import leaflet from 'leaflet';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild('map') mapContainer: ElementRef;
  JoblistReference: firebase.database.Reference;
  public jobs: Array<job> = [];
  public jobsApplied: Array<any> = [];
  public jobsremove: Array<any> = [];

  jobAppliedListReference: firebase.database.Reference;

  private uid: string;

  map: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams, 
    public database: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private actionSheetCntrl: ActionSheetController
  ) {
    //initialise job refernence 
    this.JoblistReference = database.database.ref('jobs/');
    //initialise uid
    this.afAuth.authState.take(1).subscribe(auth => {
      this.uid = auth.uid;
    });
    this.ionViewDidLoad();
  }
  //initialise the Jobs array,ioii

  viewWillDisappear() {
    console.log("called");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.jobs = [];
    this.JoblistReference.on('value', itemSnapshot => {
      this.jobs = [];
      itemSnapshot.forEach( itemSnap => {
        var applied  = itemSnap.child('jobApplicants').child(this.uid).val();
        if(itemSnap.val().Employer != this.uid && applied == null){
          this.jobs.push(itemSnap.val());
          //var marker = leaflet.marker([this.jobs.locationLat, this.jobs.locationLong]).addTo(this.map);       
        }
        if(itemSnap.val().Employer == this.uid){
          this.jobsremove.push(itemSnap.val());
          //var marker = leaflet.marker([this.jobs.locationLat, this.jobs.locationLong]).addTo(this.map);       
        }

        return false;
      });    });  
      
      this.removeMap();
  }

  
  viewJob(job: job){
    this.navCtrl.push('ViewJobPage', {job: job});      
  }
   
  loadMap(){
    this.removeMap();
    if (!this.map){
    this.map = leaflet.map('map').fitWorld();
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(this.map);

    this.map.setView([-41.2865, 174.7762], 12, { animation: true});  }

   //uncommented shit is code that sets location to the computers location
   //  this.map.locate({
   //  setView: true,
   //  maxZoom: 12
   // }).on('locationfound', (e) => {
   //  console.log('Your location has been found!');
   // })
  
   var marker =  [];
   var self = this;
   for(let j of this.jobs){

    var mark = leaflet.marker([j.locationLat, j.locationLong]);
    mark.on('click', function(e){
      //mark.bindPopup("<b>"+j.Title+"</b><br>"+j.Description).openPopup();
      if(confirm("Would you like to view job: " + j.Title + "?")){
        self.navCtrl.push('ViewJobPage', {job: j});
      }
    });
    marker.push(mark.addTo(this.map));
  }
  
  //for(let j of this.jobsremove){
  //  var mark = leaflet.marker([j.locationLat, j.locationLong]);
  //  mark.bindPopup("<b>"+j.Title+"</b><br>"+j.Description).openPopup()
  //  marker.push(mark.addTo(this.map));
  //}
   
  }


  markerOnClick(id: any){
    console.log("done");
  }

  removeMap(){
    if (this.map ){
      this.map.eachLayer(function(layer){
          layer.remove();
      });
      this.map.remove();
      this.map = null;
  }
}

  intitialiseJobsApplied(){
    this.jobAppliedListReference = this.database.database.ref(`profile/${this.uid}/jobsApplied`);

    this.jobAppliedListReference.on('child_added', itemSnapshot => {
            this.JoblistReference.child(itemSnapshot.key).once('value', selectedjob =>{
            this.jobsApplied.push(selectedjob.val());
          });
        });
        return false;

  }
  
  

  
  openActionSheet(job: job){
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
        },
        {
          text: "Apply",
          handler: ()=>{
            this.apply(job);
          }
        }
      ]
        
      
    }).present();
  }
  apply(job: job){
    //set the applicants for this job to users id
    this.database.database.ref(`jobs/${job.JobId}/jobApplicants/${this.uid}`).set(
      'applied'
    );
    //set the jobs applied for this users to job id
    this.database.database.ref(`profile/${this.uid}/jobsApplied/${job.JobId}`).set(
      'applied'
    );
    this.ionViewDidLoad();
  }

}
