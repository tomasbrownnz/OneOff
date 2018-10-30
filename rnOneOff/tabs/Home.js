import firebase from 'firebase'
import React from 'react'
import NavigationBar from 'react-native-navbar';
import { StyleSheet, Text,  Image, View, ActivityIndicator } from 'react-native'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import MapView from 'react-native-maps'
import  { Marker } from 'react-native-maps';


export default class Home extends React.Component {

    state = { currentUser: null, selectedIndex: 0 , myJobs: [], findJobs: [], loading: true}
    
    componentDidMount() {
        const { currentUser } = firebase.auth()
        this.state.currentUser = currentUser
        this.initJobs();
    }

    handleIndexChange = (index) => {
        if(index == 0){
            this.setState({
                selectedIndex: index,
                showResults: false
              });
              this.initJobs();
        }
        else{
            this.setState({
                selectedIndex: index,
                showResults: true
              });
              this.initJobs();
        }
        
      }
    static navigationOptions = {
        tabBarLabel: 'MAP',
        tabBarIcon: ({tintCOlor}) => (
            <Image 
                source={require("../Images/home.png")}
                style ={{width: 30, height: 30, tintColor: 'white'}}>
            </Image>
        )
    }
    keyExtractor = (item, index) => index

    renderItem = ( jobs ) => {
        let markers = []

        for (let i = 0; i < jobs.length; i++){
            let mark = []
            let job = jobs[i];
            mark.push(<Marker
                key={i}
                pinColor={'#F85A3E'}
                title={job.jobTitle}
                description = {"Press here to view!"}
                onCalloutPress={
                    () =>this.viewJob(job)
                }
                coordinate={{
                    latitude: job.latitude,
                    longitude: job.longitude
                }}
            />)
            markers.push(mark)
        }
        
        return markers
    }
    viewJob(job){
        if(job.employer == this.state.currentUser.uid){
            this.props.navigation.navigate("ViewMyJob", {job:job})
        }
        else{
            this.props.navigation.navigate("ViewJob", {job:job})
        }
    }



    render() {
        console.log(this.state.jobs)
        if(this.state.loading) {
            return(
                <View style={styles.loading}>
                    <Text>Loading jobs</Text>
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
            />
            <SegmentedControlTab  
                style={styles.segment}
                values={['Find jobs', 'My jobs']}
                selectedIndex={this.state.selectedIndex}
                onTabPress={this.handleIndexChange}
            />
    
        { this.state.showResults ? 
            <MapView
                style = {styles.map}
                initialRegion={{
                latitude: -41.2865,
                longitude: 174.7762,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
             }}
            >
             {this.renderItem(this.state.myJobs)}
            </MapView>
            : 
            <MapView
            
            style={styles.map}
                initialRegion={{
                latitude: -41.2865,
                longitude: 174.7762,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
            >
            {this.renderItem(this.state.findJobs)}
            </MapView>
            }
        </View>
       
        )
    }

    initJobs(){
        jobs = [];
        firebase.database().ref('jobs/')
        .on('child_added', itemSnapshot => {
            var applied  = itemSnapshot.child('jobApplicants').child(this.state.currentUser.uid).val();
            console.log(applied);
            if(itemSnapshot.val().employer != this.state.currentUser.uid && applied == null){
                jobs.push(itemSnapshot.val())
            }
            this.setState({loading: false})
        })
        this.setState({findJobs: jobs})
        myjobs = [];        
        var uid = this.state.currentUser.uid
        
        //init my jobs
        firebase.database().ref('users/' + uid + '/myJobs')
        .on('child_added', itemSnapshot => {
            firebase.database().ref('jobs/').child(itemSnapshot.val().jobId)
            .once('value', selectedJob => {
                myjobs.push(selectedJob.val())
            }) 
        })
        this.setState({myJobs: myjobs})
        console.log("nice")
    }
}

const titleConfig = {
    title: 'Home',
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
    map:{
        position: 'absolute',
        top: 98,
        bottom: 0,
        right: 0,
        left: 0
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});