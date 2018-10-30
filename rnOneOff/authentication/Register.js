import React from 'react'
import { StyleSheet, Text, TextInput, View, Image } from 'react-native'
import firebase from 'firebase' 
import { Button } from 'react-native-elements'

export default class Register extends React.Component {

    state = { 
        firstName: '', 
        lastName: '',
        currentUser: null,
        phoneNumber: "",
        description: "",
        age: '',
        loading: true,
        bodyText: 'Let us know a few details about you.'
    }
    
    componentDidMount() {
        const { currentUser } = firebase.auth()
        this.state.currentUser = currentUser;
    }
    
    render() {  
        if(this.state.loading) {
            return (
                <View style={styles.container} backgroundColor='#26547C'>
                    <Image
                        source={require('../Images/lightLogo.png')}
                        style={{width: 320, height: 180}}
                    />
                    <Text style={styles.bodyText}>
                        {this.state.bodyText}
                    </Text>
                    <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    selectionColor={'#FFD166'}
                    placeholderTextColor={'#FFD166'}
                    placeholder="First name"
                    onChangeText={firstName => this.setState({ firstName })}
                    value={this.state.firstName}
                    />
                    <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    selectionColor={'#FFD166'}
                    placeholderTextColor={'#FFD166'}
                    placeholder="Last name"
                    onChangeText={lastName => this.setState({ lastName })}
                    value={this.state.lastName}
                    />
                    <TextInput
                    type = "number"
                    keyboardType = 'numeric'
                    selectionColor={'#FFD166'}
                    placeholderTextColor={'#FFD166'}
                    style={styles.textInput}
                    placeholder="eg 021 124 2893"
                    onChangeText={phoneNumber => this.setState({ phoneNumber })}
                    value={this.state.phoneNumber}
                    />
                    <TextInput
                    keyboardType = 'numeric'
                    style={styles.textInput}
                    selectionColor={'#FFD166'}
                    placeholderTextColor={'#FFD166'}
                    placeholder="Age"
                    onChangeText={age => this.setState({ age })}
                    value={this.state.age}
                    />
                    <TextInput
                    multiline = {true}
                    numberOfLines = {4}
                    selectionColor={'#FFD166'}
                    placeholderTextColor={'#FFD166'}
                    style={styles.descriptionInput}
                    placeholder="Description"
                    onChangeText={description => this.setState({ description })}
                    value={this.state.description}
                    />
                    
                    <Button 
                        rounded
                        outline 
                        style={styles.button}
                        title="Done" 
                        color={'#FFD166'} 
                        onPress={this.writeUserData.bind(this)}/>
                   
              </View>
                )
            
        } 
        this.props.navigation.navigate('Main')    
        return("hi")
    }

    writeUserData(){
        console.log(this.state)
        const { 
            firstName, lastName, currentUser,
            phoneNumber, description, age } = this.state;
        firebase
        .database()
        .ref('users/' + currentUser.uid)
        .set({
            firstName: firstName,
            lastName: lastName,
            description: description,
            phoneNumber: phoneNumber,
            age: age
        }).then(
            this.setState({loading: false})
        )
    }
}

const styles = StyleSheet.create({
    container: {
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
    descriptionInput: {
        height: 120,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
        color: '#FFD166'
      },
      button:{
          paddingTop: 10
      },
      loading: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        bodyText: {
          fontSize: 18,
          color: '#FFD166'
        }
});