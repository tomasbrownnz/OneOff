import React from 'react'
import { StyleSheet, Text, TextInput, View, Image } from 'react-native'
import firebase from 'firebase' 
import { Button } from 'react-native-elements'

export default class EditProfile extends React.Component {
    
    state = {
        currentuser: null,
        profile: null,
        bodyText: 'Edit your profile.'
    }

    componentWillMount(){
        const { currentUser } = firebase.auth()
        this.state.currentUser = currentUser;
        this.setState({ currentUser: currentUser ,
            profile: this.props.navigation.getParam('profile'),
        })    
        this.state.profile = this.props.navigation.getParam('profile')
    }

    firstName
    lastName
    currentUser
    phoneNumber
    description
    age

    render(){
        return(
            <View style={styles.container} backgroundColor='#26547C'>
                <Image
                    source={require('../Images/lightLogo.png')}
                    style={{width: 320, height: 180}}
                />
                <Text style={styles.bodyText}>
                    {this.state.bodyText}
                </Text>
                <TextInput
                    title = "Fist Name:"
                    style={styles.textInput}
                    autoCapitalize="none"
                    selectionColor={'#FFD166'}
                    placeholderTextColor={'#FFD166'}
                    placeholder={this.state.profile.firstName}
                    onChangeText={fName => this.state.profile.firstName = fName}
                    value={this.state.profile.firstName}
                />
                <TextInput
                    title= "Last Name:"
                    style={styles.textInput}
                    selectionColor={'#FFD166'}
                    placeholderTextColor={'#FFD166'}
                    autoCapitalize="none"
                    placeholder={this.state.profile.lastName}
                    onChangeText={lName => this.state.profile.lastName = lName}
                    value={this.state.profile.lastName}
                />
                <TextInput
                    title = "Phone Number:"
                    type = "number"
                    keyboardType = 'numeric'
                    selectionColor={'#FFD166'}
                    placeholderTextColor={'#FFD166'}
                    style={styles.textInput}
                    placeholder={this.state.profile.phoneNumber}
                    onChangeText={ph => this.state.profile.phoneNumber = ph}
                    value={this.state.profile.phoneNumber}
                />
                <TextInput
                    title = 'Age:'
                    keyboardType = 'numeric'
                    style={styles.textInput}
                    selectionColor={'#FFD166'}
                    placeholderTextColor={'#FFD166'}
                    placeholder={this.state.profile.age}
                    onChangeText={age => this.state.profile.age = age}
                    value={this.state.profile.age}
                />
                <TextInput
                    multiline = {true}
                    numberOfLines = {4}
                    title = "About Me:"
                    style={styles.descriptionInput}
                    selectionColor={'#FFD166'}
                    placeholderTextColor={'#FFD166'}
                    placeholder={this.state.profile.description}
                    onChangeText={desc => this.state.profile.description = desc}
                    value={this.state.profile.description}
                />
                <View style={styles.Button}>
                    <Button style={styles.button} outline rounded color={'#F85A3E'} title="Cancel" onPress={() => this.cancel()}/>
                    <Button style={styles.button} outline rounded color={'#FFD166'} title="Save Changes" onPress={this.writeData.bind(this)}/>
                </View>
            </View>
            
        )
    }

    cancel(){
        this.props.navigation.navigate('Main')
    }

    writeData(){
        //write to profile collection
        
        firebase
        .database()
        .ref('users/' + this.state.currentUser.uid)
        .update(
           this.state.profile
        )
        //add jobId to my jobs
        this.props.navigation.navigate('Main');
    }
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        flex: 1,
        justifyContent: 'center',
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
      Button:{
          flex: 1,
          flexDirection: 'row'
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