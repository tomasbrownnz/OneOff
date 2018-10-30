import firebase from 'firebase'
import React from 'react'
import NavigationBar from 'react-native-navbar';
import { StyleSheet, FlatList, Image, Text, ScrollView, View, ActivityIndicator} from 'react-native'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import  { Card, Button }  from 'react-native-elements';
import  { ListItem }  from 'react-native-elements';
export default class Profile extends React.Component {

    leftButtonConfig = {
        title: 'Logout',
        textColor: '#FFD166',
        handler: () => this.props.navigation.navigate('Login')
    };

    state = { currentUser: null, selectedIndex: 0, profile: null, loading: true, contacts:[] }
    
    componentDidMount() {
        const { currentUser } = firebase.auth()
        this.setState({ currentUser})
        var self = this
        this.initContacts(currentUser.uid);
        firebase.database().ref('users/' + currentUser.uid).once('value', snapshot =>{
            self.setState({ 
                profile: snapshot.val(),
                loading: false
            })
        })
    }
    initContacts(id){
        conts= []
        firebase.database().ref('users/' + id + '/contacts')
        .on('child_added', itemSnapshot => {
            conts.push(itemSnapshot.val())
        })
        this.state.contacts = conts;
    }
    renderItem = ({ item }) => (
        <ListItem
        title={item.name}
        hideChevron
        subtitle={item.phoneNumber}
        titleStyle={{ color: 'white'}}
        />
    )

    handleIndexChange = (index) => {
        if(index == 0){
            this.setState({
                selectedIndex: index,
                showResults: false
              });
        }
        else{
            this.setState({
                selectedIndex: index,
                showResults: true
              });
        }
        
    }

    static navigationOptions = {
        tabBarLabel: 'PROFILE',
        tabBarIcon: ({tintCOlor}) => (
            <Image 
                source={require("../Images/profile.png")}
                style ={{width: 22, height: 22, tintColor: 'white'}}>
            </Image>
        )
    }

    render() {
        if(this.state.loading) {
            return(
                <View style={styles.loading}>
                    <Text>Loading profile</Text>
                    <Text></Text>
                    <ActivityIndicator size="small"/>
                </View>
            )
        } 
        return (
            <View  style={styles.container} backgroundColor='#26547C'>
                <NavigationBar
                    title={titleConfig}
                    tintColor={'#26547C'}
                    leftButton={this.leftButtonConfig}
                />
                <SegmentedControlTab  
                    style={styles.segment}
                    values={['My Profile', 'My Contacts']}
                    selectedIndex={this.state.selectedIndex}
                    onTabPress={this.handleIndexChange}
                />
                { this.state.showResults ? 
                    //show contacts
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.contacts}
                        renderItem={this.renderItem} 
                    />
                    : 
                    //show profile 
                    <ScrollView style={styles.container} backgroundColor='#26547C'>
                    <Card>
                        <Image 
                        style={styles.image}
                        resizeMethod={'scale'}
                        source= {require('../Images/display.png')}
                        />
                        <Text style={styles.textProfile}>
                            {this.state.profile.firstName + " " + this.state.profile.lastName  + ", " + this.state.profile.age}
                        </Text>
                        <Text style={styles.textBio}>
                            {this.state.profile.description}  
                        </Text>
                        <Button
                            style={styles.button}
                            outline
                            rounded
                            color={'#26547C'}
                            title='Edit Info' 
                            onPress= { () => {
                                 this.props.navigation.navigate('EditProfile', { profile: this.state.profile})
                                }
                            }
                            />
                    </Card>
                    </ScrollView>
                }
            </View>
        )
    }

    logout(){
        this.props.navigation.navigate('Login')
    }
}

const titleConfig = {
    title: 'Profile',
    tintColor: 'white',
    ellipsizeMode: 'middle',
    numberOfLines: 1
  };


  const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    segment: {
        flex: 1,
        paddingTop: 30,
        height: 64,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    image: {
        height: 320,
        width: 320,
        resizeMode: 'cover'
    },
    button: {
        paddingTop: 10
      },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      textProfile: {
          fontSize: 20,
          paddingTop: 10
      },
      textBio: {
        fontSize: 15,
        paddingTop: 10,
        marginBottom: 10
    }
});
  