import firebase from 'firebase'
import React from 'react'
import { StyleSheet, Text, TextInput, View, Image } from 'react-native'
import { Button } from 'react-native-elements'

export default class SignUp extends React.Component {
  state = { 
    email: '', 
    password: '', 
    errorMessage: null,
    titleText: 'Welcome to One Off!',
    bodyText: 'Please register below.'
   }

  handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('Register'))
      .catch(error => this.setState({ errorMessage: error.message }))
      console.log("gets here")
      
}
render() {
    return (
      <View style={styles.container} backgroundColor='#26547C'>
        <Image
          source={require('../Images/lightLogo.png')}
          style={{width: 320, height: 180}}
        />
        <Text style={styles.titleText}>
          {this.state.titleText}
        </Text>
        <Text style={styles.bodyText}>
          {this.state.bodyText}{'\n'}
        </Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          selectionColor={'#FFD166'}
          placeholderTextColor={'#FFD166'}
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          selectionColor={'#FFD166'}
          placeholderTextColor={'#FFD166'}
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button 
          rounded
          outline
          style={styles.button}
          title="Sign Up"
          color={'#FFD166'} 
          onPress={this.handleSignUp} />
        
        <Button
          rounded
          style={styles.button}
          outline
          color={'#FFD166'}
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate('Login')}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    paddingTop: 10
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    color: '#FFD166'
  },
  titleText: {
    fontSize: 26,
    color: '#FFD166'
  },
  bodyText: {
    fontSize: 18,
    color: '#FFD166'
  }
})