import firebase from 'firebase'
import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

export default class Loading extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {

      if(user == null){
        console.log("authhed")
        this.props.navigation.navigate('SignUp')
      }
      this.props.navigation.navigate(user ? 'Main' : 'SignUp')
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading here </Text>
        <ActivityIndicator size="small" />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
