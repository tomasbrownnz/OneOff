import firebase from 'firebase'
import React from 'react'
import NavigationBar from 'react-native-navbar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import MapView from 'react-native-maps';
import  { Button }  from 'react-native-elements';
import  { Marker } from 'react-native-maps';

export default class PickLocation extends React.Component {

    state = { currentUser: null,
        selectedIndex: 0 ,
        loading: true,
        coordinate: {
            latitude: -41.2865,
            longitude: 174.7762,
        },
        region: {
            latitude: -41.2865,
            longitude: 174.7762,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        
        jobId: null
    }
    
    componentDidMount() {
        const { currentUser } = firebase.auth()
        this.setState({ currentUser })
        this.state.loading = false
        this.state.jobId = this.props.navigation.getParam('jobId')
    }
    
    render() {
        if(this.state.loading) {
            return(
                <View style={styles.loading}>
                    <Text>Loading Map</Text>
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
            <Button 
            style={styles.button}
            title="CONFIRM" 
            outline
            rounded
            color={'#FFD166'}
            onPress={this.writeUserJobData.bind(this)}/>
            <MapView
                style = {styles.map}
                initialRegion={
                    this.state.region
                }
             >
            <Marker
                tracksViewChanges
                draggable
                title = "PRESS AND HOLD TO DRAG" 
                coordinate={this.state.coordinate}
                onDragEnd={(e) => this.setState({ coordinate: e.nativeEvent.coordinate })
                }
              />
           
            </MapView>
        </View>
       
        )
        console.log(this.state.coordinate)
    }
    writeUserJobData(){
        firebase
        .database()
        .ref('jobs/' + this.state.jobId)
        .update(
           this.state.coordinate 
        )
        this.props.navigation.navigate("Main")
    }
}

const titleConfig = {
    title: 'Pick location',
    tintColor: 'white',
    ellipsizeMode: 'middle',
    numberOfLines: 1,
};

const styles = StyleSheet.create({
    container: {
        flex: 2
        
    },
    button: {
        paddingBottom: 10
    },
    segment: {
        flex: 1,
        paddingTop: 300,
        height: 64,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    map:{ 
        paddingTop: 10,
        height: 700,
        bottom: 0
    }
});