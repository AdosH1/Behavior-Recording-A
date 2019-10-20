import React, {Fragment} from 'react';

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TextInput,
    Dimensions,
    Switch,
    PushNotificationIOS,
  } from 'react-native';
import {  Divider, Button, Slider } from 'react-native-elements';
import RadioForm from 'react-native-simple-radio-button';
import RNRestart from 'react-native-restart'; 

class SurveyScreen extends React.Component {
    constructor(props) {
      super(props);

      const { navigation } = this.props;

      var sampleSurveyQuestions = [
        {
          Question: "Test question",
          Type: "scale",
          Answers: [
            {Answer: 0, Followup: null},
            {Answer: 200, Followup: null},
            {Answer: 5, Followup: null},
          ],
        },
        {
          Question: "What type of weather do you like?",
          Type: "multiple",
          Answers: [
            {Answer: "Sunny", Followup: null},
            {Answer: "Gloomy", Followup: null},
            {Answer: "Windy", Followup: null},
            {Answer: "Wet", Followup: null},
            {Answer: "Humid", Followup: null},
          ]
        },
        {
          Question: "What did you eat for lunch?",
          Type: "single",
          Answers: [
            {Answer: "Hamburger", Followup: null},
            {Answer: "Salad", Followup: null},
            {Answer: "Tacos", Followup:
              {
                Question: "Did you enjoy the taco?",
                Type: "single",
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
        {
          Question: "Test question 2",
          Type: "scale",
          Answers: [
            {Answer: -50, Followup: null},
            {Answer: 50, Followup: null},
            {Answer: 10, Followup: null},
          ],
        },
        {
          Question: "Which foods would you like to eat for dinner?",
          Type: "multiple",
          Answers: [
            {Answer: "Sushi", Followup: null},
            {Answer: "Steak", Followup: null},
            {Answer: "Fish and Chips", Followup: null},
            {Answer: "Avo' on Toast", Followup: null},
            {Answer: "Salad", Followup: null},
          ]
        },
      ];

      this.state = 
      {
        ViewArray: [],
        CurrentQuestionIndex: -1,
        CurrentQuestion: "",
        SurveyQuestions: sampleSurveyQuestions,
        Answers: {

        },
        SurveyTitle: "",
        RadioProps: [],
        screenWidth: Dimensions.get('window').width,
        screenHeight: Dimensions.get('window').height,
        ShowAlternateQuestion: false,
        // ============ Checkbox ========== //
        IsCheckboxQuestion: true,
        Checkboxes: [], 
        CheckboxId: 0, 
        ShowCheckboxes: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, ],
        CheckboxText: ["", "","","","","","","","","","","","","","","","","","","",],
        Username: "",
        // ============ Slider ============ //
        ShowSlider: false,
        sliderText: "",
        sliderMinValue: 0,
        sliderMaxValue: 100,
        sliderStepValue: 20,
        sliderValue: 5,
      };
      
      this.convertServerDataToSurvey(navigation.getParam('serverData', 'Unable to find server data.'));
      this.state.Username = navigation.getParam('username', 'Unable to find user data');
      PushNotificationIOS.requestPermissions();
    }

    componentDidMount() {

      PushNotificationIOS.addEventListener('localNotification', function(){
        RNRestart.Restart();
      });

      this.loadNextQuestion();
    }

    convertServerDataToSurvey(serverData) {
      // Clear default survey questions
      this.state.SurveyQuestions = [];
      this.state.SurveyTitle = serverData.title;

      for (var i = 0; i < serverData.questions.length; i++) {
        let SQ = serverData.questions[i];

        // Create list of answers
        let answers = [];
        for (var j = 0; j < SQ.content.length; j++) {
          let SQans = SQ.content[j];

          // Create list of followups
          let SQFollowupAns = []
          
          let hasFollowup = SQans.followUp.title != null;
          if (hasFollowup) {
            if (SQans.followUp.type == "text") {

            }
            else {
              for (var k = 0; k < SQans.followUp.content.length; k++) {
                let SQFollowup = SQans.followUp.content[k];
                let followUpAns = {
                  Answer: SQFollowup.title,
                  Followup: null
                }
                SQFollowupAns.push(followUpAns);
              }
            }
         }

          let SQFollowup = hasFollowup ? {
            Question: SQans.followUp.title,
            Type: SQans.followUp.type,
            Answers: SQFollowupAns
          } : null;

          // =======================================
          let ansObj = {
            Answer: SQans.title,
            Followup: SQFollowup
          }

          answers.push(ansObj);
        }

        let SurveyQuestion = { 
          Question: SQ.title,
          Type: SQ.type,
          Answers: answers
         };
        this.state.SurveyQuestions.push(SurveyQuestion);
      }

    }

    sendNotification(seconds) {
        setTimeout(function() {
            PushNotificationIOS.presentLocalNotification({ alertBody: "A survey is ready to be taken!", alertAction: "view" });
        }, seconds * 1000);
    }

    loadNextQuestion(goBackwards = false) {
      this.state.ViewArray = []
      this.state.IsCheckboxQuestion = false;
      this.state.ShowAlternateQuestion = false;
      this.state.ShowSlider = false;
      this.state.sliderValue = 0;

      if (goBackwards) this.state.CurrentQuestionIndex--;
      else this.state.CurrentQuestionIndex++;

      let currentQuestion = this.state.SurveyQuestions[this.state.CurrentQuestionIndex];
      let currentAnswers = [];

      this.state.CurrentQuestion = currentQuestion.Question;
      let surveyAnswers = currentQuestion.Answers;

      // ================================= CHECKBOXES ==================================== //
      if (currentQuestion.Type === "multiple") { 
        // Create answer entry
        this.state.Answers[currentQuestion.Question] = [];
        this.state.IsCheckboxQuestion = true;
        this.state.ShowAlternateQuestion = true;

        this.constructCheckboxes(surveyAnswers);
      }
      // ================================= BUTTONS ==================================== //
      else if (currentQuestion.Type === "single") {
        this.state.ViewArray.push(<Text style={styles.sectionTitle}>{currentQuestion.Question}</Text>);
        
        // Create answer entry
        this.state.Answers[currentQuestion.Question] = "";
        this.state.RadioProps = []

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
            initial={-1}
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
        this.state.ViewArray.push(<Text style={styles.sectionTitle}>{currentQuestion.Question}</Text>);
        // Create answer entry
        this.state.Answers[currentQuestion.Question] = "";

        this.state.ViewArray.push(<TextInput style={{marginVertical: 5, marginHorizontal: 20, borderColor: "grey", borderWidth: 1, height: this.state.screenHeight / 2.8, textAlignVertical: "top"}} defaultValue="" multiline={true} onChangeText={(text) => this.state.Answers[currentQuestion.Question] = text} />)
      }
      // ================================= SLIDER ==================================== //
      else if (currentQuestion.Type === "scale") {
        this.state.ShowSlider = true;
        this.state.ShowAlternateQuestion = true;
        
        // Create answer entry
        this.state.Answers[currentQuestion.Question] = "";
        for (var i = 0; i < surveyAnswers.length; i++) {
          let answer = surveyAnswers[i]; 
          let option = answer.Answer;

          if (i == 0) this.state.sliderMinValue = parseFloat(option);
          if (i == 1) this.state.sliderMaxValue = parseFloat(option);
          if (i == 2) this.state.sliderStepValue = parseFloat(option);
        }
        this.state.sliderValue = this.state.sliderMinValue;

        this.state.sliderText = "Value: " + this.state.sliderValue.toString();

      }
      this.state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);


       // ================================= LOAD NEXT / BACK BUTTONS ==================================== //
       // ======================== Last Question, Show Submit Button ========================= //
      if (this.state.CurrentQuestionIndex == this.state.SurveyQuestions.length - 1) {
        this.state.ViewArray.push(
          <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between'}}>
             <Button large title="Back" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: this.state.screenWidth / 2.2}} onPress={() => this.loadNextQuestion(true)}/>
            <Button large title="Submit" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: this.state.screenWidth / 2.2}} onPress={() => {
              if(this.checkAndAppendFollowUp(currentAnswers)) {
                this.loadNextQuestion();
              } else {
              this.submitData();
              }
              }} />
          </View>
          );
      }
      // ======================== First Question, No Back Button ========================= //
      else if (this.state.CurrentQuestionIndex == 0) {
        this.state.ViewArray.push(
          <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between'}}>
            <Button large title="Back" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: this.state.screenWidth / 2.2}} onPress={() => {}}/>
            <Button large title="Next" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: this.state.screenWidth / 2.2}} onPress={() =>
            { 
              // append followup question if there are any
              this.checkAndAppendFollowUp(currentAnswers);
              this.loadNextQuestion()
            }
          }/>
          </View>
          );
      }
      // ======================== A Question In The Middle, Show Back and Next button ========================= //
      else {
        this.state.ViewArray.push(
        <View style={{flex: 1, flexDirection: 'row', justifyContent:'center'}}>
          <Button large title="Back" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: this.state.screenWidth / 2.2}} onPress={() => this.loadNextQuestion(true)}/>
          <Button large title="Next" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: this.state.screenWidth / 2.2}} onPress={() =>
            { 
              // append followup question if there are any
              this.checkAndAppendFollowUp(currentAnswers);
              this.loadNextQuestion()
            }
          }/>
        </View>
        );
      }

      this.forceUpdate();
    }

    checkAndAppendFollowUp(currentAnswers) {
      var followUpExists = false;
      for (var i = 0; i < currentAnswers.length; i++) {
        var answer = currentAnswers[i];
        if (answer.Followup != null) {
          this.state.SurveyQuestions.splice(this.state.CurrentQuestionIndex + 1, 0, answer.Followup);
          followUpExists = true;
        }
      }
      return followUpExists;
    }

    submitData() {

      this.state.IsCheckboxQuestion = false;
      this.state.ShowAlternateQuestion = false;
      this.state.ShowSlider = false;
      this.state.ViewArray = [];

      this.state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);
      this.state.ViewArray.push(<Text style={styles.sectionTitle}>Thank you for participating in this survey.</Text>);
      this.state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);

      let result = []

      for (var key in this.state.Answers) {
        var ans = this.state.Answers[key];

        let answer = { stitle: this.state.SurveyTitle, qtitle: key, answer: ans };
        result.push(answer);
      }

      // Post results
      let data = {
        method: 'POST',
        body: JSON.stringify({
            result: result,
            username: this.state.Username,
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
      }
      

      fetch('https://emad-cits5206-2.herokuapp.com/projectAPI/' + this.state.Username, data)
      //fetch('http://192.168.31.244:3000/projectAPI/' + this.state.Username, data)
      .then((response) => response.json())
            .then((responseJson) => {

          // ============= on success ============== //
          // Adjust notification time
          this.sendNotification(responseJson.interval);

        }).catch((error) => {
          // ============= on failure ============== //
          alert(error);
      });

      this.forceUpdate();
    }

    constructCheckboxes(answers) {
      // Clear checkboxes
      this.state.Checkboxes = []
      for (var i = 0; i < this.state.ShowCheckboxes.length; i++) {
        this.state.ShowCheckboxes[i] = false;
      }
  
      // Add new checkboxes
      let checkboxesSeen = 0; // 0 - 19 (20 boxes)
      for (var i = 0; i < answers.length; i++) {
        let ans = answers[i];

        let id = this.state.CheckboxId + 1;
        let checked = false;
        let option = ans.Answer;
        
        let cb = {id: id, option: option, checked: checked};
        this.state.Checkboxes.push(cb);
        this.state.ShowCheckboxes[i] = true;
        this.state.CheckboxText[i] = option;
  
        checkboxesSeen = i;
        this.state.CheckboxId++;
      }
  
      for (var i = checkboxesSeen + 1; i < 20; i++){
        let cb = {id: this.state.CheckboxId+1, checked: false};
        this.state.Checkboxes.push(cb);
        this.state.ShowCheckboxes[i] = false;
        this.state.CheckboxText[i] = "";
      }
    }

    updateCheckboxAnswers(){
      let answer = "";
      for (var i = 0; i < this.state.Checkboxes.length; i++) {

        if (this.state.Checkboxes[i].checked) {

          if (answer == "") answer += this.state.Checkboxes[i].option;
          else {
            answer += (", " + this.state.Checkboxes[i].option);
          }

        }
      }

      this.state.Answers[this.state.CurrentQuestion] = answer;
    }

    updateSlider(value) {
      this.state.sliderValue = value; 

      this.state.sliderText = "Value: " + this.state.sliderValue.toString();
      this.state.Answers[this.state.CurrentQuestion] = this.state.sliderValue.toString();
      this.forceUpdate();
    }

    checkboxChanged(index, value) {
      this.state.Checkboxes[index].checked = value; 
      this.updateCheckboxAnswers();
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
                  {this.state.ShowAlternateQuestion ? <Text style={styles.sectionTitle}>{this.state.CurrentQuestion}</Text> : null}

                  {this.state.IsCheckboxQuestion? 
                      <View style={{flex: 1, flexDirection: 'column', justifyContent:'center'}}>
                        {this.state.ShowCheckboxes[0] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(0, value)}} value={this.state.Checkboxes[0].checked}/><Text>{this.state.CheckboxText[0]}</Text></View> : null }
                        {this.state.ShowCheckboxes[1] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(1, value)}} value={this.state.Checkboxes[1].checked}/><Text>{this.state.CheckboxText[1]}</Text></View> : null }
                        {this.state.ShowCheckboxes[2] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(2, value)}} value={this.state.Checkboxes[2].checked}/><Text>{this.state.CheckboxText[2]}</Text></View> : null }
                        {this.state.ShowCheckboxes[3] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(3, value)}} value={this.state.Checkboxes[3].checked}/><Text>{this.state.CheckboxText[3]}</Text></View> : null }
                        {this.state.ShowCheckboxes[4] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(4, value)}} value={this.state.Checkboxes[4].checked}/><Text>{this.state.CheckboxText[4]}</Text></View> : null }
                        {this.state.ShowCheckboxes[5] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(5, value)}} value={this.state.Checkboxes[5].checked}/><Text>{this.state.CheckboxText[5]}</Text></View> : null }
                        {this.state.ShowCheckboxes[6] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(6, value)}} value={this.state.Checkboxes[6].checked}/><Text>{this.state.CheckboxText[6]}</Text></View> : null }
                        {this.state.ShowCheckboxes[7] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(7, value)}} value={this.state.Checkboxes[7].checked}/><Text>{this.state.CheckboxText[7]}</Text></View> : null }
                        {this.state.ShowCheckboxes[8] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(8, value)}} value={this.state.Checkboxes[8].checked}/><Text>{this.state.CheckboxText[8]}</Text></View> : null }
                        {this.state.ShowCheckboxes[9] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(9, value)}} value={this.state.Checkboxes[9].checked}/><Text>{this.state.CheckboxText[9]}</Text></View> : null }
                        {this.state.ShowCheckboxes[10] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(10, value)}} value={this.state.Checkboxes[10].checked}/><Text>{this.state.CheckboxText[10]}</Text></View> : null }
                        {this.state.ShowCheckboxes[11] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(10, value)}} value={this.state.Checkboxes[11].checked}/><Text>{this.state.CheckboxText[11]}</Text></View> : null }
                        {this.state.ShowCheckboxes[12] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(10, value)}} value={this.state.Checkboxes[12].checked}/><Text>{this.state.CheckboxText[12]}</Text></View> : null }
                        {this.state.ShowCheckboxes[13] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(10, value)}} value={this.state.Checkboxes[13].checked}/><Text>{this.state.CheckboxText[13]}</Text></View> : null }
                        {this.state.ShowCheckboxes[14] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(10, value)}} value={this.state.Checkboxes[14].checked}/><Text>{this.state.CheckboxText[14]}</Text></View> : null }
                        {this.state.ShowCheckboxes[15] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(10, value)}} value={this.state.Checkboxes[15].checked}/><Text>{this.state.CheckboxText[15]}</Text></View> : null }
                        {this.state.ShowCheckboxes[16] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(10, value)}} value={this.state.Checkboxes[16].checked}/><Text>{this.state.CheckboxText[16]}</Text></View> : null }
                        {this.state.ShowCheckboxes[17] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(10, value)}} value={this.state.Checkboxes[17].checked}/><Text>{this.state.CheckboxText[17]}</Text></View> : null }
                        {this.state.ShowCheckboxes[18] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(10, value)}} value={this.state.Checkboxes[18].checked}/><Text>{this.state.CheckboxText[18]}</Text></View> : null }
                        {this.state.ShowCheckboxes[19] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {this.checkboxChanged(10, value)}} value={this.state.Checkboxes[19].checked}/><Text>{this.state.CheckboxText[19]}</Text></View> : null }
                        
                      </View> : null
                    }

                  {this.state.ShowSlider? 
                    <View style={{marginHorizontal: 20, marginVertical: 5}}>
                      <Slider 
                        value={this.state.sliderValue}
                        onValueChange={(value) => { this.updateSlider(value); }}
                        minimumValue={this.state.sliderMinValue}
                        maximumValue={this.state.sliderMaxValue}
                        step={this.state.sliderStepValue}/>
                      <Text>{this.state.sliderText}</Text>
                    </View> : null 
                  }

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
    checkboxStyle: {
      flex: 1, 
      flexDirection: 'row', 
      marginVertical: 5, 
      marginHorizontal: 20
    },
  });