import React from 'react'
import { StyleSheet, Text, TextInput, View, Image } from 'react-native'
import firebase from 'firebase'
import { Button } from 'react-native-elements'

export default class Login extends React.Component {
  state = { 
    email: '', 
    password: '', 
    errorMessage: null,
    titleText: 'Welcome to One Off!',
    bodyText: 'Please sign in, or register, below.'
   }
  // componentDidMount() {
  //  firebase.auth().signOut();
  // }

  handleLogin = () => {
    const { email, password } = this.state
    console.log(email + password)
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => this.setState(
        { errorMessage: error.message }
      ));
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
          style={styles.textInput}
          autoCapitalize="none"
          selectionColor={'#FFD166'}
          placeholderTextColor={'#FFD166'}
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          selectionColor={'#FFD166'}
          placeholderTextColor={'#FFD166'}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button style={styles.button} color={'#FFD166'} title="Login" onPress={this.handleLogin} outline rounded/>
        <Button
          style={styles.button}
          outline
          rounded
          color={'#FFD166'}
          title="Don't have an account? Sign Up"
          onPress={() => this.props.navigation.navigate('SignUp')}
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
  titleText: {
    fontSize: 26,
    color: '#FFD166'
  },
  bodyText: {
    fontSize: 18,
    color: '#FFD166'
  }
}) 