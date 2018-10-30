import firebase from 'firebase'
import React from 'react'
import NavigationBar from 'react-native-navbar';
import { StyleSheet, FlatList, Image, Text, View, ActivityIndicator } from 'react-native'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import  { ListItem, List }  from 'react-native-elements';

export default class Jobs extends React.Component {

    state = { currentUser: null, selectedIndex: 0, myjobs: [],jobsApplied: [], showResults: false, loading: true }
   
    componentDidMount() {
        const { currentUser } = firebase.auth()
        this.setState({ currentUser })
        this.initMyJobs(currentUser)
        this.initJobsApplied(currentUser)
    }

    handleIndexChange = (index) => {
        if(index == 0){
            this.setState({
                selectedIndex: index,
                showResults: false
              });
        }
        else{
            this.setState({
                selectedIndex: index,
                showResults: true
              });
        }
        
      }

    static navigationOptions = {
        tabBarLabel: 'JOBS',
        tabBarIcon: ({tintCOlor}) => (
            <Image 
                source={require("../Images/job.png")}
                style ={{width: 22, height: 22, tintColor: 'white'}}>
            </Image>
        )    
    }
    keyExtractor = (item, index) => index

    renderItem = ({ item }) => (
        <ListItem
        title={item.jobTitle}
        subtitle={item.jobDescription}
        titleStyle={{ color: 'white'}}
        onPress= { () => {
            if(item.employer == this.state.currentUser.uid){
                this.props.navigation.navigate('ViewMyJob', { job: item})
            }
            else{
                this.props.navigation.navigate('ViewJob', { job: item})
            }
        }
        }
        />
    )

    render() {
        const { currentUser } = this.state
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
                    rightButton={this.rightButtonConfig}
            />
            <SegmentedControlTab  
                style={styles.segment}  
                values={['Jobs Applied', 'My jobs']}
                selectedIndex={this.state.selectedIndex}
                onTabPress={this.handleIndexChange}
            />
            { this.state.showResults ? 
            <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.myjobs}
                renderItem={this.renderItem}
            />
             : 
             <FlatList
             keyExtractor={this.keyExtractor}
             data={this.state.jobsApplied}
             renderItem={this.renderItem} 
             />
            }

        </View>
        )
    }
    
    initMyJobs(currentUser){
        this.state.myjobs =[];
        var uid = currentUser.uid
        this.setState({loading: true})
        firebase.database().ref('users/' + uid + '/myJobs')
        .on('child_added', itemSnapshot => {
            firebase.database().ref('jobs/').child(itemSnapshot.val().jobId)
            .once('value', selectedJob => {
                this.state.myjobs.push(selectedJob.val())
            }) 
        })
        console.log(uid)
        console.log(this.state.myjobs)
    }

    initJobsApplied(currentUser){
        this.state.jobsApplied =[];
        var uid = currentUser.uid
        firebase.database().ref('users/' + currentUser.uid).once('value', snapshot =>{
            applied = snapshot.child('jobsApplied').val();
            if(applied==null){
                this.setState({loading: false})
            }
        })
        firebase.database().ref('users/' + uid + '/jobsApplied')
        .on('child_added', itemSnapshot => {
            firebase.database().ref('jobs/').child(itemSnapshot.key)
            .once('value', selectedJob => {
                this.state.jobsApplied.push(selectedJob.val())
                this.setState({loading: false})
            })
        })
        console.log(this.state.jobsApplied)
    }

    rightButtonConfig = {
        title: "+",
        handler: () => this.props.navigation.navigate('NewJob')
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    segment: {
        flex: 1,
        paddingTop: 30,
        height: 64,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const titleConfig = {
    title: 'Jobs',
    tintColor: 'white',
    ellipsizeMode: 'middle',
    numberOfLines: 1
  };


  