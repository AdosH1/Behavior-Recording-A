import React, {Fragment} from 'react';

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TextInput,
    CheckBox,
    Dimensions,
    Switch,
    TouchableHighlight
    //Button,
    //PushNotificationIOS
  } from 'react-native';
var PushNotification = require("react-native-push-notification");
import {  Divider, Button } from 'react-native-elements';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import RNRestart from 'react-native-restart'; 
//import { TouchableHighlight } from 'react-native-gesture-handler';

class SurveyScreen extends React.Component {
    constructor(props) {
      super(props);

      this.state = 
      {
        ViewArray: [],
        CurrentQuestionIndex: -1,
        SurveyQuestions: 
          [
            {
              Question: "How do you feel right now?",
              Type: "checkbox",
              Answers: [
                {Answer: "Very Good", Followup: null},
                {Answer: "Good", Followup: null},
                {Answer: "Okay", Followup: null},
                {Answer: "Bad", Followup: null},
                {Answer: "Very Bad", Followup: null},
              ]
            },
            {
              Question: "What did you eat for lunch?",
              Type: "button",
              Answers: [
                {Answer: "Hamburger", Followup: null},
                {Answer: "Salad", Followup: null},
                {Answer: "Tacos", Followup:
                  {
                    Question: "Did you fart?",
                    Type: "button",
                    Answers: [
                      {Answer: "No", Followup: null},
                      {Answer: "Maybe", Followup: null},
                      {Answer: "Absolutely", Followup: null},
                    ]
                  }
                }
              ]
            },
            {
              Question: "Describe how this week went.",
              Type: "text",
              Answers: [],
            },
          ],
        Answers: {

        },
        Checkboxes: [], 
        CheckboxId: 1, 
        RadioProps: [],
        screenWidth: Dimensions.get('window').width,
        screenHeight: Dimensions.get('window').height,
        checked: false,
        props: this.props,

      };
      
    }

    componentDidMount() {
      PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function(token) {
          console.log("TOKEN:", token);
        },
      
        // (required) Called when a remote or local notification is opened or received
        onNotification: function(notification) {
          RNRestart.Restart();
          //console.log("NOTIFICATION:", notification);
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

      this.loadNextQuestion();
    }

    sendNotification() {
      PushNotification.localNotificationSchedule({
        //... You can use all the options from localNotifications
        message: "A survey is ready to be taken!", // (required)
        date: new Date(Date.now() + 1 * 1000) // in 60 secs
      });
    }

    testfunc = (value) => {
      this.state.checked = value; 
      this.forceUpdate();
    }

    loadNextQuestion(goBackwards = false) {
      this.state.ViewArray = []
      if (goBackwards) this.state.CurrentQuestionIndex--;
      else this.state.CurrentQuestionIndex++;

      let currentQuestion = this.state.SurveyQuestions[this.state.CurrentQuestionIndex];
      let currentAnswers = [];

      this.state.ViewArray.push(<Text style={styles.sectionTitle}>{currentQuestion.Question}</Text>);
      let surveyAnswers = currentQuestion.Answers;

      // ================================= CHECKBOXES ==================================== //
      if (currentQuestion.Type === "checkbox") { 
        // Create answer entry
        this.state.Answers[currentQuestion.Question] = [];

        for (var i = 0; i < surveyAnswers.length; i++) {
          let answer = surveyAnswers[i]; 
          let option = answer.Answer;
          let followup = answer.Followup;

          let cb = {id: this.state.CheckboxId, title: option, checked: false}
          this.state.Checkboxes.push(cb);
          
          this.state.ViewArray.push(
            <View style={{ flexDirection: 'row', marginVertical: 5, marginHorizontal: 20 }}>
              <Switch title={cb.id} onValueChange={(value) => {this.state.checked = value; this.forceUpdate();}} value={this.state.checked}/>
              <Text style={{marginTop: 5}}>{option}</Text>
              {/* <Button 
                title="Push me" 
                style={this.state.checked
                  ? styles.buttonPress
                  : styles.button} 
                  onPress={() => {this.state.checked = !this.state.checked; this.forceUpdate(); alert(this.state.checked)}}  
              />
              <TouchableHighlight 
                activeOpacity={1}
                underlayColor={'#660000'}
                style={{backgroundColor: this.getBackgroundColor()}}
                onPress={() => {this.state.checked = !this.state.checked; this.forceUpdate(); }}>
                  <Text>Click me!</Text>
              </TouchableHighlight> */}
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

        // for (let answer in surveyAnswers) {
        for (var i = 0; i < surveyAnswers.length; i++) {
          let answer = surveyAnswers[i]; 
          let option = answer.Answer;
          let followup = answer.Followup;

          this.state.RadioProps.push({label: option, value: option, answer: answer});
        }

        this.state.ViewArray.push(
          <View style={{marginHorizontal: 20, marginVertical: 5}}>
          <RadioForm
            buttonColor={'#333333'}
            animation={true}
            radio_props={this.state.RadioProps}
            initial={0}
            onPress={(value) => {
              this.setState({value: value}); 
              this.state.Answers[currentQuestion.Question] = value;
              currentAnswers = [];
              
              // Insert answer into current answer (to check for followup)
              for (var i = 0; i < this.state.RadioProps.length; i++) {
                let prop = this.state.RadioProps[i];
                if (value == prop.value) {
                  currentAnswers.push(prop.answer);
                }
              }
              
              
            }}
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


       // ================================= LOAD NEXT / BACK BUTTONS ==================================== //
      if (this.state.CurrentQuestionIndex == this.state.SurveyQuestions.length - 1) {
        this.state.ViewArray.push(
          <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between'}}>
             <Button large title="Back" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: this.state.screenWidth / 2.2}} onPress={() => this.loadNextQuestion(true)}/>
            <Button large title="Submit" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: this.state.screenWidth / 2.2}} onPress={() => this.submitData()}/>
          </View>
          );
      }
      else {
        this.state.ViewArray.push(
        <View style={{flex: 1, flexDirection: 'row', justifyContent:'center'}}>
          <Button large title="Back" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: this.state.screenWidth / 2.2}} onPress={() => this.loadNextQuestion(true)}/>
          <Button large title="Next" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: this.state.screenWidth / 2.2}} onPress={() =>
            { 
              // append followup question if there are any
              for (var i = 0; i < currentAnswers.length; i++) {
                var answer = currentAnswers[i];
                alert(answer);
                if (answer.Followup != null) {
                  this.state.SurveyQuestions.splice(this.state.CurrentQuestionIndex + 1, 0, answer.Followup);
                }
              }
              this.loadNextQuestion()
            }
          }/>
        </View>
        );
      }

      this.forceUpdate();
    }

    getBackgroundColor() {
      return this.state.checked ? '#660000' : '#006600';
    }

    submitData() {
      this.state.ViewArray = [];
      this.state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);

      this.state.ViewArray.push(<Text style={styles.sectionTitle}>Thank you for participating in this survey.</Text>);

      this.state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);

      for (var key in this.state.Answers) {
        var ans = this.state.Answers[key];
        
        this.state.ViewArray.push(<Text style={styles.sectionDescription}>{key}</Text>);
        this.state.ViewArray.push(<Text style={styles.sectionDescription}>{ans}</Text>);
        
      }

      this.sendNotification();
      this.forceUpdate();
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
                  </View>
                  <View style={{ height: 50, }}></View>
    
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
    // ================================ Test ============================== //
    button: {
      borderColor: "#000066",
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: '#660000'
    },
    buttonPress: {
        borderColor: "#000066",
        backgroundColor: "#000066",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#006600'
    },
    welcome: {
      fontSize: 20,
      textAlign: "center",
      margin: 10,
      color: "#000066"
    },
    welcomePress: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
        color: "#ffffff"
    },
  });