import firebase from 'firebase'
import React from 'react'
import NavigationBar from 'react-native-navbar';
import { StyleSheet, Switch, FlatList, Image, Text, View, ActivityIndicator} from 'react-native'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import  { Card, Button, Icon }  from 'react-native-elements';

export default class ViewApplicant extends React.Component {


    state = { currentUser: null, selectedIndex: 0, profile: null,
         loading: true, accepted: true, jobId: null, switchState: false, uid: null}
    
    componentDidMount() {
        const { currentUser } = firebase.auth()
        this.setState({ currentUser})
        var self = this
        const { navigation } = this.props;
        this.state.currentUser = currentUser
        this.state.jobId = navigation.getParam('jobId')
        this.state.profile = navigation.getParam('profile')
        this.state.uid = navigation.getParam('uid')
        console.log(this.state.uid)

        this.setState({
            profile: navigation.getParam('profile'),
            jobId: navigation.getParam('jobId')
        })
        console.log(this.state.profile)
        console.log(this.state.uid)
        this.initAplicationInfo()
        this.state.loading = false;
    }
    handleSwitch(){
        //console.log(this.state)
        if(this.state.accepted == false){
            this.setState({
                accepted: true
              });
        }
        else{
            this.setState({
                accepted: false
              });
        }
        this.writeApplied();
    }
    initAplicationInfo(){
        firebase.database().ref(`jobs/${this.state.jobId}/jobApplicants/${this.state.uid}`).once("value", snapshot=>{
            applicationState = snapshot.val();
            if(applicationState == "accepted"){
                this.state.accepted = true
            }
            else{
                this.state.accepted = false
            }
        })
        
    }
    writeApplied(){
        if(this.state.accepted){
         firebase.database().ref(`jobs/${this.state.jobId}/jobApplicants/${this.state.uid}`).set(
             'applied'
           );
           this.removeContactinfo()
        }
        else{
         firebase.database().ref(`jobs/${this.state.jobId}/jobApplicants/${this.state.uid}`).set(
             'accepted'
           );
           this.writeAddContactInfo()
        }
    } 
    writeAddContactInfo(){
        firebase.database().ref(`users/${this.state.currentUser.uid}/contacts/${this.state.uid}`).set(
            {
                phoneNumber: this.state.profile.phoneNumber,
                name: this.state.profile.firstName
            }
          );
    }
    removeContactinfo(){
        firebase.database().ref(`users/${this.state.currentUser.uid}/contacts/${this.state.uid}`).remove();
    }
    backButtonConfig = {
        title: "BACK",
        handler: () => this.props.navigation.navigate("Main")
    }


    render() {
        if(this.state.loading) {
            return(
                <View style={styles.loading}>
                    <Text>Loading profile</Text>
                    <Text></Text>
                    <ActivityIndicator size="small"/>
                </View>
            )
        } 
        return (
            <View style={styles.container} backgroundColor='#26547C'>
                <NavigationBar
                        title={titleConfig}
                        tintColor={'#26547C'}
                        leftButton = {this.backButtonConfig}
                />
                
                <Card>
                        <Image 
                        style={styles.image}
                        resizeMethod={'scale'}
                        source= {require('../Images/display.png')}
                        />
                        <Text style={styles.textProfile}>
                            {this.state.profile.firstName + " " + this.state.profile.lastName  + ", " + this.state.profile.age}
                        </Text>
                        <Text style={styles.textBio}>
                            {this.state.profile.description}  
                        </Text>
                        <Text style={styles.textLabel}>
                            {"SAVE CONTACT INFO:"}  
                        </Text>
                        { this.state.accepted ? 
                        <Switch style = {styles.switch}
                            value={true}
                            onValueChange = {
                                ()=>this.handleSwitch()
                            }
                        />:
                        <Switch style = {styles.switch}
                            value={false}
                            onValueChange = {
                                ()=>this.handleSwitch()
                            }
                        />
                        }
                </Card>
                
            </View>

        )
    }
}

const titleConfig = {
    title: 'Profile',
    tintColor: 'white',
    ellipsizeMode: 'middle',
    numberOfLines: 1
  };


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    segment: {
        flex: 1,
        paddingTop: 30,
        height: 64,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    image: {
        height: 320,
        width: 320,
        resizeMode: 'cover'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      textProfile: {
          fontSize: 20,
          paddingTop: 10
      },
      textBio: {
        fontSize: 15,
        paddingTop: 10,
        marginBottom: 10
    },
    textLabel: {
      fontSize: 15,
      justifyContent: "center",
      paddingRight: 150,
      paddingTop: 10,
      marginBottom: 10
  },
    switch:{
        paddingRight: 10,
        justifyContent: "center"
    }
});
  