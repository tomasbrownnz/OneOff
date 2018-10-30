import React from 'react'
import { StyleSheet, Text, TextInput, View, Image } from 'react-native'
import firebase from 'firebase' 
import { Button } from 'react-native-elements'

export default class EditJob extends React.Component {

    state = { 
        job: null,
        bodyText: 'Edit your job'
    }
    
    componentWillMount() {
        console.log("mounted")
        const { currentUser } = firebase.auth()
        this.state.currentUser = currentUser;
        this.setState({ currentUser: currentUser ,
            job: this.props.navigation.getParam('job'),
        })    
        this.state.job = this.props.navigation.getParam('job')
    }
    
    render() {  
    return (
        
        <View style={styles.container} backgroundColor='#26547C'>
            <Image
                source={require('../Images/lightLogo.png')}
                style={{width: 320, height: 180}}
            />
            <Text style={styles.bodyText}>
               {this.state.bodyText}{'\n'}
            </Text>
            <TextInput
            title = "Job name:"
            style={styles.textInput}
            selectionColor={'#FFD166'}
            placeholderTextColor={'#FFD166'}
            autoCapitalize="none"
            placeholder={"Job Name"}
            onChangeText={jobTitle => this.state.job.jobTitle = jobTitle}
            value={this.state.job.jobTitle}
            />
            <TextInput
            title= "Adress:"
            style={styles.textInput}
            selectionColor={'#FFD166'}
            placeholderTextColor={'#FFD166'}
            autoCapitalize="none"
            placeholder={"Address"}
            onChangeText={jobAddress => this.state.job.jobAddress = jobAddress}
            value={this.state.job.jobAddress}
            />
            <TextInput
            title = "Estimated number of hours:"
            type = "number"
            keyboardType = 'numeric'
            selectionColor={'#FFD166'}
            placeholderTextColor={'#FFD166'}
            style={styles.textInput}
            placeholder={"Hours"}
            onChangeText={estimatedHours => this.state.job.estimatedHours = estimatedHours}
            value={this.state.job.estimatedHours}
            />
            <TextInput
            keyboardType = 'numeric'
            style={styles.textInput}
            selectionColor={'#FFD166'}
            placeholderTextColor={'#FFD166'}
            placeholder={"Hourly rate"}
            onChangeText={payRate => this.state.job.payRate = payRate}
            value={this.state.job.payRate}
            />
            <TextInput
            multiline = {true}
            numberOfLines = {4}
            selectionColor={'#FFD166'}
            placeholderTextColor={'#FFD166'}
            style={styles.descriptionInput}
            placeholder= {"Job description"}
            onChangeText={jobDescription => this.state.job.jobDescription = jobDescription}
            value={this.state.job.jobDescription}
            />
            <View style={styles.Button}>
                <Button 
                    style={styles.button} 
                    outline 
                    rounded
                    color={'#F85A3E'} 
                    title="Cancel" 
                    onPress={() => this.cancel()}/>
                <Button 
                    style={styles.button}
                    outline
                    rounded
                    color={'#FFD166'}
                    title="Done" 
                    onPress={this.writeUserJobData.bind(this)}/>                
            </View>
      </View>
        )
    }

    cancel(){
        this.props.navigation.navigate('Main')
    }

    writeUserJobData(){
        //write to jobs collection
        
        firebase
        .database()
        .ref('jobs/' + this.state.job.jobId)
        .update(
           this.state.job
        )
        //add jobId to my jobs
       
        this.props.navigation.navigate('Main');
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    Button:{
        flex: 1,
        flexDirection: 'row'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
        color: '#FFD166'
      },
    descriptionInput: {
        height: 120,
        width: '90%',
        borderColor:'gray',
        borderWidth: 1,
        marginTop: 8,
        color: '#FFD166'
      },
      button: {
          paddingTop: 10
      },
      titleText: {
        fontSize: 26,
        color: '#FFD166'
      },
      bodyText: {
        fontSize: 18,
        color: '#FFD166'
      }
});