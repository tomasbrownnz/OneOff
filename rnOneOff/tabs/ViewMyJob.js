import firebase from 'firebase'
import React from 'react'
import NavigationBar from 'react-native-navbar';
import { StyleSheet, FlatList, Text, ScrollView, View } from 'react-native'
import  { Card, Button, Icon }  from 'react-native-elements';
import  { ListItem }  from 'react-native-elements';
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps'

export default class ViewMyJob extends React.Component {

    state = { currentUser: null , job: null, applicants:[], showResults:true,switchState: false, accepted:[]}
    
    componentWillMount() {
        const { currentUser } = firebase.auth()
        const { navigation } = this.props;
        this.setState({ currentUser: currentUser ,
            job: navigation.getParam('job')
        })
        this.state.job = navigation.getParam('job')
        this.initApplicants()
        console.log(this.state.applicants)
    }
   initApplicants(){
    applicants = []
    firebase.database().ref(`jobs/${this.state.job.jobId}/jobApplicants/`).on('child_added', itemSnapshot => {
        firebase.database().ref('users/').child(itemSnapshot.key).once('value', selectedjob =>{
          if((itemSnapshot.val()=='applied' || itemSnapshot.val()=='accepted') && selectedjob.val() != null){
            this.state.applicants.push( {profile: selectedjob.val(), uid: selectedjob.key });
            console.log(selectedjob.key)
          }
          
      
      });
    });
   }
   handleAccept(){

   }

   keyExtractor = (item, index) => index

   renderItem = ({ item }) => (
       <ListItem
        title={item.profile.firstName}
        titleStyle={{ color: 'black'}}
        //rightTitle = {"SAVE CONTACT INFO"}
        subtitle={item.profile.description}
        onPress= { () => {
            console.log(item)
            this.props.navigation.navigate('ViewApplicant',
             { profile: item.profile, jobId: this.state.job.jobId, uid: item.uid})
           }
       }
       >
       </ListItem>
   )
  
   showResults() {
    if(this.state.showResults == true){
        this.setState({
            showResults: false
          });
    }
    else{
        this.setState({
            showResults: true
          });
    }
    
  }
   

    render() {
    return (
        <ScrollView style={styles.container} backgroundColor='#26547C'>
           <NavigationBar
                    title={titleConfig}
                    tintColor={'#26547C'}
                    leftButton = {this.backButtonConfig}
            />
           <Card
                title= {this.state.job.jobTitle}
            >
            <Text style={{marginBottom: 10}}>
                { "Address: " + this.state.job.jobAddress }  
            </Text>
            <Text style={{marginBottom: 10}}>
                {"Pay: $" + this.state.job.payRate}  
            </Text>
            <Text style={{marginBottom: 10}}>
                {"Estimated hours:" + this.state.job.estimatedHours}
            </Text>
            <Text style={{marginBottom: 10}}>
                {"Description:" + this.state.job.jobDescription}
            </Text>

            <MapView
                style = {styles.map}
                initialRegion={{
                latitude: this.state.job.latitude,
                longitude: this.state.job.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
             }}
            >
                <Marker
                pinColor={'#F85A3E'}
                title={this.state.job.jobTitle}
                description = {"Press here to view!"}
                coordinate={{
                    latitude: this.state.job.latitude,
                    longitude: this.state.job.longitude
                }}
                />
            </MapView>

            <Button
                style={styles.button} 
                outline rounded 
                color={'#F85A3E'}
                title='DELETE' 
                onPress={
                    ()=>this.deleteJob(this.state.job)
                }
            />
            <Button
                style={styles.button} 
                outline rounded 
                color={'#26547C'}
                title='EDIT' 
                onPress={
                    ()=>this.editJob()
                }
            />
                
            { this.state.showResults ? 
            
                <Button
                style={styles.button} 
                outline 
                rounded 
                color={'#26547C'}
                title='SHOW APPLICANTS' 
                onPress={
                    ()=>this.showResults()
                }/>
                :
                <Button
                outline 
                rounded 
                style={styles.button}
                color={'#26547C'}
                title='HIDE APPLICANTS' 
                onPress={
                    ()=>this.showResults()
                }/>
            }
            { this.state.showResults ? 
                null
                :
                <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.applicants}
                renderItem={this.renderItem} 
                />
        }

            </Card>
            }
            </ScrollView>
       
        )
    }
    editJob(){
        this.props.navigation.navigate("EditJob", { job: this.state.job} )
    }
    deleteJob(job){
        console.log(this.state.currentUser.uid)
        firebase.database().ref(`jobs/${this.state.job.jobId}`).remove();
        firebase.database().ref(`users/${this.state.currentUser.uid}/myJobs/${this.state.job.jobId}`).remove();
        firebase.database().ref(`users`).once('value', function(snapshot){
            console.log(snapshot)
            snapshot.forEach(function(profilesSapShot){
                console.log(profilesSapShot.child('jobsApplied').ref.orderByKey().equalTo(`${job.jobId}`))
                profilesSapShot.child('jobsApplied').ref.orderByKey().equalTo(`${job.jobId}`).ref.remove();
            });
        });
        this.props.navigation.navigate('Main')
    }


    backButtonConfig = {
        title: "BACK",
        handler: () => this.props.navigation.navigate("Main")
    }

}

const titleConfig = {
    title: 'Your Job',
    tintColor: 'white',
    ellipsizeMode: 'middle',
    numberOfLines: 1,
};

const styles = StyleSheet.create({
    container: {
        flex: 2
        
    },
    map: {
        paddingTop: 10,
        paddingBottom: 10,
        height: 150,
        right: 0,
        left: 0
    },
    Button:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch'
    },
    segment: {
        flex: 1,
        paddingTop: 300,
        height: 64,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    button: {
        paddingTop: 10
    }
});