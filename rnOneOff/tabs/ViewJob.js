import firebase from 'firebase'
import React from 'react'
import NavigationBar from 'react-native-navbar';
import { StyleSheet,Text, View } from 'react-native'
import  { Card, Button }  from 'react-native-elements';
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps'

export default class ViewJob extends React.Component {

    state = { 
            currentUser: null,
            job: null,
            applied: null,
            status: null
            }

    componentWillMount() {
        const { currentUser } = firebase.auth()
        const { navigation } = this.props;
        const {job } = navigation.getParam('job')
        this.setState({ currentUser: currentUser ,
            job: navigation.getParam('job')
        })
        this.state.job = navigation.getParam('job')
        console.log(this.state.job)
        this.findApplied(currentUser.uid)
    }
   
    findApplied(id){
        ref = firebase.database().ref(`jobs/${this.state.job.jobId}`)
        .on('value', itemSnapshot => {
            var applied  = itemSnapshot.child('jobApplicants').child(id).val();
            if (applied == null){
                this.setState({applied: false})
                console.log("not applied")
            }else{
                this.setState({applied: true})
                console.log("yes applied")
            }
        })

    }
   

    render() {
    return (
        <View style={styles.container} backgroundColor='#26547C'>
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
            { this.state.applied ?
            <Button
                style={styles.button}
                color={'#26547C'}
                outline
                rounded
                title='Unapply' 
                onPress={
                    this.unwriteAppliedData.bind(this)
                }
            />
            :
            <Button
                style={styles.button}
                color={'#26547C'}
                outline
                rounded
                title='Apply Now' 
                onPress={
                    this.writeAppliedData.bind(this)
                }/>
            }
            </Card>
            }
            </View>
       
        )
    }
    writeAppliedData(){
        firebase.database().ref(`jobs/${this.state.job.jobId}/jobApplicants/${this.state.currentUser.uid}`).once('value', itemSnapshot => {
            if(itemSnapshot.val() == null){
              firebase.database().ref(`jobs/${this.state.job.jobId}/jobApplicants/${this.state.currentUser.uid}`).set(
              'applied'
            );
            //set the jobs applied for this users to job id
            firebase.database().ref(`users/${this.state.currentUser.uid}/jobsApplied/${this.state.job.jobId}`).set(
              'applied'
            );
            }
        });
        this.findApplied(this.state.currentUser.uid)
    }

    unwriteAppliedData(){
        firebase.database().ref(`jobs/${this.state.job.jobId}/jobApplicants`).child(`${this.state.currentUser.uid}`).remove();
        firebase.database().ref(`users/${this.state.currentUser.uid}/jobsApplied`).child(`${this.state.job.jobId}`).remove();
        this.findApplied(this.state.currentUser.uid)
    }


    backButtonConfig = {
        title: "BACK",
        handler: () => this.props.navigation.navigate("Main")
    }

}

const titleConfig = {
    title: 'Job',
    tintColor: 'white',
    ellipsizeMode: 'middle',
    numberOfLines: 1,
};

const styles = StyleSheet.create({
    container: {
        flex: 2
        
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
    },
    map: {
        paddingTop: 10,
        paddingBottom: 10,
        height: 150,
        right: 0,
        left: 0
    },
});