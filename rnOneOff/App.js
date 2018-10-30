import firebase from 'firebase'
import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { SwitchNavigator } from 'react-navigation'

// import the different screens
import Loading from './authentication/Loading'
import SignUp from './authentication/SignUp'
import Login from './authentication/Login'
import Main from './tabs/Main'
import Home from './tabs/Home'
import Profile from './tabs/Profile'
import Jobs from './tabs/Jobs'
import ViewJob from './tabs/ViewJob'
import Register from './authentication/Register'
import NewJob from './tabs/NewJob'
import PickLocation from './tabs/PickLocation'

import ViewMyJob from './tabs/ViewMyJob'
import EditJob from './tabs/EditJob'
import EditProfile from './tabs/EditProfile'
import ViewApplicant from './tabs/ViewApplicant'


// create our app's navigation stack
const App = SwitchNavigator(
  {
    Loading,
    SignUp,
    Login,
    Register,
    Main,
    Profile,
    Home,
    PickLocation,
    Jobs,
    NewJob,
    ViewJob,
    ViewMyJob,
    EditJob,
    EditProfile,
    ViewApplicant
  },
  {
    initialRouteName: 'Login'
  }
)

var config = {
  apiKey: "AIzaSyCoKseYT-F_12n1BVsNjzOdWhd-8FE0gf0",
  authDomain: "oneoffreactnative.firebaseapp.com",
  databaseURL: "https://oneoffreactnative.firebaseio.com",
  projectId: "oneoffreactnative",
  storageBucket: "oneoffreactnative.appspot.com",
  messagingSenderId: "21126758012"
};
firebase.initializeApp(config);

export default App;