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
    CheckBox,
    FlatList
    //Button,
    //PushNotificationIOS
  } from 'react-native';
var PushNotification = require("react-native-push-notification");
import {  Divider, Button, List, ListItem } from 'react-native-elements';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
//import SelectMultiple from 'react-native-select-multiple';
//import CheckBox from 'react-native-check-box';

class SurveyScreen extends React.Component {
    constructor(props) {
      super(props);

      this.state = 
      {
        ViewArray: [],
        checked: false,
        CurrentQuestionIndex: -1,
        SurveyQuestions: 
          [
            {
              Question: "How do you feel right now?",
              Type: "checkbox",
              Answers: {
                Answer1: "Very Good",
                Answer2: "Good",
                Answer3: "Okay",
                Answer4: "Bad",
                Answer5: "Very Bad",
              }
            },
            {
              Question: "What did you eat for lunch?",
              Type: "button",
              Answers: {
                Answer1: "Hamburger",
                Answer2: "Salad",
                Answer3: "Tacos",
              }
            },
            {
              Question: "Describe how this week went.",
              Type: "text",
            },
          ],
        Answers: {

        },
        Checkboxes: [], 
        CheckboxId: 1, 
        RadioProps: [],
        Fruits: ['apples', 'pear',' banana'],
      };

      this.loadNextQuestion();

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

    sendNotification() {
      PushNotification.localNotificationSchedule({
        //... You can use all the options from localNotifications
        message: "A survey is ready to be taken!", // (required)
        date: new Date(Date.now() + 10 * 1000) // in 60 secs
      });
    }

    toggleCheckbox(id) {
      const changedCheckbox = this.state.Checkboxes.find((cb) => cb.id === id);

      changedCheckbox.checked = !changedCheckbox.checked;
      const checkboxes = Object.assign({}, this.state.Checkboxes, changedCheckbox);
      this.setState({ checkboxes });

      this.forceUpdate();
    }

    onSelectionsChange = (selectedFruits) => {
      // selectedFruits is array of { label, value }
      this.state.Checkboxes = selectedFruits;
    }

    renderRow ({ item }) {
      return (
        <ListItem
          title={item.name}
          subtitle={item.subtitle}
        />
      )
    }

    loadNextQuestion() {
      this.state.ViewArray = []
      this.state.CurrentQuestionIndex++;

      let currentQuestion = this.state.SurveyQuestions[this.state.CurrentQuestionIndex];

      this.state.ViewArray.push(<Text style={styles.sectionTitle}>{currentQuestion.Question}</Text>);
      let surveyAnswers = currentQuestion.Answers;

      // ================================= CHECKBOXES ==================================== //
      if (currentQuestion.Type === "checkbox") { 
        // Create answer entry
        this.state.Answers[currentQuestion.Question] = [];

        for (var key in surveyAnswers) {
          let option = surveyAnswers[key];

          let cb = {id: this.state.CheckboxId, title: option, checked: false}
          this.state.Checkboxes.push(cb);
          
          this.state.ViewArray.push(
            <View style={{ flexDirection: 'row', marginVertical: 5, marginHorizontal: 20 }}>
            <CheckBox
              value={cb.checked}
              onTouchEnd={() => {cb.checked = !cb.checked;}}
              onValueChange={() => {alert(cb.checked);}}
            />
            
            <Text style={{marginTop: 5}}>{option}</Text>
            </View>
          );
          //<CheckBox checked={cb.checked} key={cb.id} title={cb.title} onTouchStart={(event) => {cb.checked = !cb.checked; this.state.Answers[currentQuestion.Question] = option}} />
          this.state.CheckboxId++;
        }


      }
      // ================================= BUTTONS ==================================== //
      else if (currentQuestion.Type === "button") {
          // Create answer entry
        this.state.Answers[currentQuestion.Question] = "";
        this.state.RadioProps = []

        for (let key in surveyAnswers) {
          let option = surveyAnswers[key];

          this.state.RadioProps.push({label: option, value: option});
        }

        this.state.ViewArray.push(
          <View style={{marginHorizontal: 20, marginVertical: 5}}>
          <RadioForm
            buttonColor={'#333333'}
            animation={true}
            radio_props={this.state.RadioProps}
            initial={0}
            onPress={(value) => {this.setState({value: value}); this.state.Answers[currentQuestion.Question] = value;}}
          />
        </View>
        );
      }
      // ================================= TEXT ==================================== //
      else if (currentQuestion.Type === "text") {
          // Create answer entry
        this.state.Answers[currentQuestion.Question] = "";

        this.state.ViewArray.push(<TextInput style={{marginVertical: 5, marginHorizontal: 20, borderColor: "grey", borderWidth: 1}} defaultValue="" onChangeText={(text) => this.state.Answers[currentQuestion.Question] = text} />)
      }
      this.state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);
      

      if (this.state.CurrentQuestionIndex == this.state.SurveyQuestions.length - 1) {
        this.state.ViewArray.push(<Button large title="Submit" buttonStyle={{marginVertical: 5, marginHorizontal: 20}} onPress={() => this.submitData()}/>);
      }
      else {
        this.state.ViewArray.push(<Button large title="Next" buttonStyle={{marginVertical: 5, marginHorizontal: 20}} onPress={() => this.loadNextQuestion()}/>);
      }

      this.forceUpdate();
    }

    submitData() {
      this.state.ViewArray = [];
      this.state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);

      this.state.ViewArray.push(<Text style={styles.sectionTitle}>Thank you for participating in this survey.</Text>);

      this.state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);


      // var ans = JSON.stringify(this.state.Answers);
      // this.state.ViewArray.push(<Text style={styles.sectionDescription}>{ans}</Text>);
      for (var key in this.state.Answers) {
        var ans = this.state.Answers[key];
        
        this.state.ViewArray.push(<Text style={styles.sectionDescription}>{key}</Text>);
        this.state.ViewArray.push(<Text style={styles.sectionDescription}>{ans}</Text>);

        // var key1 = JSON.stringify(key);
        // var ans1 = JSON.stringify(ans);
        // this.state.ViewArray.push(<Text style={styles.sectionDescription}>{key1}</Text>);
        // this.state.ViewArray.push(<Text style={styles.sectionDescription}>{ans1}</Text>);
        
      }

      this.sendNotification();
      this.forceUpdate();
    }

    createView() {
      return this.state.ViewArray.map(info => info);
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
                    {this.state.ViewArray.map(info => info)}
                    {/* <Button style={{height: 40, marginTop: 5,}} onPress={() => { this.loadNextQuestion(); }} title="Next Question" /> */}
                  </View>
                  <View style={{ height: 50, }}></View>
                  {/* <Button large title="Submit" buttonStyle={{marginVertical: 5, marginHorizontal: 20}} onPress={() => {this.props.navigation.push('Thankyou', {sendData: this.state.Answers});}}/> */}
                  {/* <Button large title="Submit" buttonStyle={{marginVertical: 5, marginHorizontal: 20}} onPress={() => this.submitData()}/> */}
    
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
      fontSize: 20,
      fontWeight: '600',
      color: '#000',
      marginBottom: 15,
      marginHorizontal: 20,
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