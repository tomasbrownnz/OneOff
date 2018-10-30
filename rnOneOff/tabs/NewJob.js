import React from 'react'
import { StyleSheet, Text, Image, TextInput, View } from 'react-native'
import NavigationBar from 'react-native-navbar';
import firebase from 'firebase' 
import { Button } from 'react-native-elements'

export default class NewJob extends React.Component {

    state = { 
        jobTitle: '', 
        jobAddress: '',
        currentUser: null,
        jobDescription: "",
        estimatedHours: "",
        payRate: '',
        bodyText: 'We just need a few details about your job.'
    }
    backButtonConfig = {
        title: "Cancel",
        handler: () => this.props.navigation.navigate("Main")
    }
    
    componentDidMount() {
        console.log("mounted")
        const { currentUser } = firebase.auth()
        this.state.currentUser = currentUser;
        console.log(currentUser)
    }
    
    render() {  
    return (
        
        <View style={styles.mainContainer}>
            <NavigationBar
            title = "New Job"
            tintColor={'#26547C'}
            leftButton = {this.backButtonConfig}
        />

        <View style={styles.container} backgroundColor='#26547C'>
                <Image
                    source={require('../Images/lightLogo.png')}
                    style={{width: 320, height: 180}}
                />
                <Text style={styles.bodyText}>
                    {this.state.bodyText}{'\n'}
                </Text>
    
            <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            selectionColor={'#FFD166'}
            placeholderTextColor={'#FFD166'}
            placeholder="Job name:"
            onChangeText={jobTitle => this.setState({ jobTitle })}
            value={this.state.jobTitle}
            />
            <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            selectionColor={'#FFD166'}
            placeholderTextColor={'#FFD166'}
            placeholder="Job address (this will be public)"
            onChangeText={jobAddress => this.setState({ jobAddress })}
            value={this.state.jobAddress}
            />
            <TextInput
            type = "number"
            keyboardType = 'numeric'
            style={styles.textInput}
            selectionColor={'#FFD166'}
            placeholderTextColor={'#FFD166'}
            placeholder="Estimated number of hours"
            onChangeText={estimatedHours => this.setState({ estimatedHours })}
            value={this.state.estimatedHours}
            />
            <TextInput
            keyboardType = 'numeric'
            selectionColor={'#FFD166'}
            placeholderTextColor={'#FFD166'}
            style={styles.textInput}
            placeholder="Hourly rate"
            onChangeText={payRate => this.setState({ payRate })}
            value={this.state.payRate}
            />
            <TextInput
            multiline = {true}
            numberOfLines = {4}
            style={styles.descriptionInput}
            selectionColor={'#FFD166'}
            placeholderTextColor={'#FFD166'}
            placeholder="Description"
            onChangeText={jobDescription => this.setState({ jobDescription })}
            value={this.state.jobDescription}
            />
            <Button 
                rounded
                outline
                style={styles.button}
                color={'#FFD166'}
                title="Pick location"  
                onPress={this.writeUserJobData.bind(this)}
            />
        </View>
      </View>
        )
    }

    cancel(){
        this.props.navigation.navigate('Main')
    }

    writeUserJobData(){
        //write to jobs collection
        var id = firebase.database().ref().push().key 
        console.log(id)
        const { jobTitle, 
                jobAddress,
                currentUser,
                jobDescription,
                estimatedHours,
                payRate,
            } = this.state;
        firebase
        .database()
        .ref('jobs/' + id)
        .set({
            jobId: id,
            jobTitle: jobTitle, 
            jobAddress: jobAddress,
            jobDescription: jobDescription,
            estimatedHours: estimatedHours,
            payRate: payRate,
            employer: currentUser.uid
        })
        //add jobId to my jobs
        firebase
        .database()
        .ref('users/' + currentUser.uid + '/myJobs/'+ id)
        .set(
            {jobId: id}
        )

        this.props.navigation.navigate('PickLocation', {jobId: id});
    }
}
const titleConfig = {
    title: 'Home',
    tintColor: 'white',
    ellipsizeMode: 'middle',
    numberOfLines: 1,
};


const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
    },
    container: {
      flex: 1,
      alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
        color: '#FFD166'
      },
      button: {
        paddingTop: 10
      },
        descriptionInput: {
        height: 120,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
        color: '#FFD166'
      },
      bodyText: {
        fontSize: 18,
        color: '#FFD166'
      }
});