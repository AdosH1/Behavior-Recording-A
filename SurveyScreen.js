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
  import { CheckBox, } from 'react-native-elements'
  
  // import {
  //   Header,
  //   LearnMoreLinks,
  //   Colors,
  //   DebugInstructions,
  //   ReloadInstructions,
  // } from 'react-native/Libraries/NewAppScreen';

class SurveyScreen extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        showCheckbox: true,
        showTextbox: false,
        showRadioButton: false,
      }
      // var Checkboxes = React.createClass({
      //   getInitialState() {
      //     return { showResults : false }
      //   },
        
      //   render() {
      //     <View style={styles.sectionContainer}>
      //       <Text style={styles.sectionTitle}>What did you eat for lunch?</Text>
      //       <CheckBox center
      //         title='Hamburgers'
      //         // checked={this.state.checked}
      //       />
      //       <CheckBox center
      //         title='Fries'
      //         //checked={this.state.checked}
      //       />
      //       <CheckBox center
      //         title='Salad'
      //         //checked={this.state.checked}
      //       />
      //       <Button style={{height: 40, marginTop: 5,}} onPress={() => { alert('You tapped the button!'); }} title="Submit" />
      //     </View>
      //   }

      // });

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
    }

    showData() {
      if (this.state.showCheckbox) {
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>What did you eat for lunch?</Text>
            <CheckBox center
              title='Hamburgers'
              checked={this.state.checked}
            />
            <CheckBox center
              title='Fries'
              checked={this.state.checked}
            />
            <CheckBox center
              title='Salad'
              checked={this.state.checked}
            />
            <Button style={{height: 40, marginTop: 5,}} onPress={() => { alert('You tapped the button!'); }} title="Submit" />
          </View>
        )
      }
      else if (this.state.showTextbox) {
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>What did you eat for lunch?</Text>
            <TextInput defaultValue="Tell me!"/>
            <Button style={{height: 40, marginTop: 5,}} onPress={() => { alert('You tapped the button!'); }} title="Submit" />
          </View>
        )
      }
      else if (this.state.showRadioButton) {
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>What did you eat for lunch?</Text>
            <CheckBox
              center
              title='Chicken Treat'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={this.state.checked}
            />
            <CheckBox
              center
              title='KFC'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={this.state.checked}
            />
            <CheckBox
              center
              title='Hungry Jacks'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={this.state.checked}
            />
            <Button style={{height: 40, marginTop: 5,}} onPress={() => { alert('You tapped the button!'); }} title="Submit" />
          </View>
        )
      }
      else {
        return (
          <View />
        )
      }

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
                    {this.showData()}
                    <Button style={{height: 40, marginTop: 5,}} onPress={() => { this.setState({showCheckbox: true, showTextbox: false, showRadioButton: false}) }} title="Show Checkbox" />
                    <Button style={{height: 40, marginTop: 5,}} onPress={() => { this.setState({showCheckbox: false, showTextbox: true, showRadioButton: false}) }} title="Show Textbox" />
                    <Button style={{height: 40, marginTop: 5,}} onPress={() => { this.setState({showCheckbox: false, showTextbox: false, showRadioButton: true}) }} title="Show Radiobutton" />
                  </View>
    
              </View>
            </ScrollView>
          </SafeAreaView>
        </Fragment>
      );
    }
};

export default SurveyScreen;

const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: '#FFF',
    },
    body: {
      backgroundColor: '#FFF',
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
      color: '#000',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: '#444',
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
      color: '#444',
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
  });