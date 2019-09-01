import React, {Fragment} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    TextInput,
    Button,
    //PushNotificationIOS
  } from 'react-native';
  var PushNotification = require("react-native-push-notification");
  
  import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
  } from 'react-native/Libraries/NewAppScreen';

class LoginScreen extends React.Component {
    constructor(props) {
    super(props);

      PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function(token) {
          console.log("TOKEN:", token);
        },
      
        // (required) Called when a remote or local notification is opened or received
        onNotification: function(notification) {
          console.log("NOTIFICATION:", notification);
        },
    
        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,
      
        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         */
        requestPermissions: true
      });
  
      let uwaLogo = {uri: 'https://www.courseseeker.edu.au/assets/images/institutions/1055.png'};
  
  
    }
  
    render() {
      return (
        <Fragment>
          <SafeAreaView>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}>
    
                <View style={{flex: 1, flexDirection: 'column', justifyContent:'space-between'}}>
                <View style={{ height: 25, }}></View>
    
                  <Image source={{uri: 'https://www.courseseeker.edu.au/assets/images/institutions/1055.png'}} style={{width: 330, height: 110,  margin: 5,}} />
    
                  <View style={{ height: 50, }}></View>
                  <View style={styles.body}>
                    <View style={styles.sectionContainer}>
    
                      <Text style={styles.sectionTitle}>Login</Text>
                      <Text>Username: </Text>
                      <TextInput
                        style={styles.userInput}
                        placeholder="Enter username here."/>
                      <Text>Password: </Text>
                      <TextInput
                        style={styles.userInput}
                        placeholder="Enter password here."/>
                      <Button style={{height: 40, marginTop: 5,}} onPress={() => this.props.navigation.navigate('Survey')} title="Login" />
                    </View>
                  </View>
    
              </View>
            </ScrollView>
          </SafeAreaView>
        </Fragment>
      );
    }
};

export default LoginScreen;

const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: Colors.white,
    },
    body: {
      backgroundColor: Colors.white,
      textAlignVertical: 'center'
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
      // borderStyle: 'solid',
      // borderWidth: 1,
      // borderColor: 'grey',
      padding: 10,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.black,
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: Colors.dark,
    },
    userInput: {
      height: 40, 
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'grey',
    },
    highlight: {
      fontWeight: '700',
    },
    footer: {
      color: Colors.dark,
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
  });