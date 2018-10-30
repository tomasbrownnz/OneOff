import { StyleSheet, Platform, Image, TextInput, View } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation'
import Home from './Home'
import Profile from './Profile'
import Jobs from './Jobs'

var MainScreenNavigator = createBottomTabNavigator({
  ProfileTab: {screen: Profile},
  HomeTab: {screen: Home},
  JobsTab: {screen: Jobs}
}, 
{
  tabBarPosition: 'bottom',
  swipeEnabled: true,
  tabBarOptions: {
    activeTintColor: '#FFD166',
    activeBackgroundColor: '#26547C',
    inactiveBackgroundColor: '#26547C',
    inactiveTintColor: 'white',
  },
  initialRouteName: 'HomeTab',
  lazy: false
});

MainScreenNavigator.navigationOptions = {
  title: "Tab example"
};

export default MainScreenNavigator;