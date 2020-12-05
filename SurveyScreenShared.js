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
  } from 'react-native';
  import {  Divider, Button, Slider } from 'react-native-elements';
  import RadioForm from 'react-native-simple-radio-button';


export const SurveyScreenShared =
{

    test : function() 
    {
        console.log("I'm working");
    },

    getInitialState(useSampleQuestions = false) {
      sampleSurveyQuestions = [];
      if (useSampleQuestions) {
          sampleSurveyQuestions = this.getSampleQuestions();
      }

      return {
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
  },

    getSampleQuestions : function() {
        return [
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
    },

    convertServerDataToSurvey : function(serverData)
    {
        // Clear default survey questions
        var SurveyQuestions = [];
        var SurveyTitle = serverData.title;
  
        for (var i = 0; i < serverData.questions.length; i++)
        {
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
          SurveyQuestions.push(SurveyQuestion);
        }

        return SurveyQuestions;
    },

    loadNextQuestion : function(context, state, goBackwards = false) {
        state.ViewArray = []
        state.IsCheckboxQuestion = false;
        state.ShowAlternateQuestion = false;
        state.ShowSlider = false;
        state.sliderValue = 0;

        if (goBackwards) state.CurrentQuestionIndex--;
        else state.CurrentQuestionIndex++;

        let currentQuestion = state.SurveyQuestions[state.CurrentQuestionIndex];
        let currentAnswers = [];

        state.CurrentQuestion = currentQuestion.Question;
        let surveyAnswers = currentQuestion.Answers;

        // ================================= CHECKBOXES ==================================== //
        if (currentQuestion.Type === "multiple") { 
            // Create answer entry
            state.Answers[currentQuestion.Question] = [];
            state.IsCheckboxQuestion = true;
            state.ShowAlternateQuestion = true;

            this.constructCheckboxes(state, surveyAnswers);
        }
        // ================================= BUTTONS ==================================== //
        else if (currentQuestion.Type === "single") {
            state.ViewArray.push(<Text style={styles.sectionTitle}>{currentQuestion.Question}</Text>);
            
            // Create answer entry
            state.Answers[currentQuestion.Question] = "";
            state.RadioProps = []

            for (var i = 0; i < surveyAnswers.length; i++) {
            let answer = surveyAnswers[i]; 
            let option = answer.Answer;
            let followup = answer.Followup;

            state.RadioProps.push({label: option, value: option, answer: answer});
            }

            state.ViewArray.push(
            <View style={{marginHorizontal: 20, marginVertical: 5}}>
            <RadioForm
                buttonColor={'#333333'}
                animation={true}
                radio_props={state.RadioProps}
                initial={-1}
                onPress={(value) => {
                    context.setState({value: value}); 
                    state.Answers[currentQuestion.Question] = value;
                    currentAnswers = [];
                    
                    // Insert answer into current answer (to check for followup)
                    for (var i = 0; i < state.RadioProps.length; i++) {
                        let prop = state.RadioProps[i];
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
            state.ViewArray.push(<Text style={styles.sectionTitle}>{currentQuestion.Question}</Text>);
            // Create answer entry
            state.Answers[currentQuestion.Question] = "";

            state.ViewArray.push(<TextInput style={{marginVertical: 5, marginHorizontal: 20, borderColor: "grey", borderWidth: 1, height: state.screenHeight / 2.8, textAlignVertical: "top"}} defaultValue="" multiline={true} onChangeText={(text) => state.Answers[currentQuestion.Question] = text} />)
        }
        // ================================= SLIDER ==================================== //
        else if (currentQuestion.Type === "scale") {
            state.ShowSlider = true;
            state.ShowAlternateQuestion = true;
            
            // Create answer entry
            state.Answers[currentQuestion.Question] = "";
            for (var i = 0; i < surveyAnswers.length; i++) {
            let answer = surveyAnswers[i]; 
            let option = answer.Answer;

            if (i == 0) state.sliderMinValue = parseFloat(option);
            if (i == 1) state.sliderMaxValue = parseFloat(option);
            if (i == 2) state.sliderStepValue = parseFloat(option);
            }
            state.sliderValue = state.sliderMinValue;

            state.sliderText = "Value: " + state.sliderValue.toString();

        }
        state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);


            // ================================= LOAD NEXT / BACK BUTTONS ==================================== //
            // ======================== Last Question, Show Submit Button ========================= //
        if (state.CurrentQuestionIndex == state.SurveyQuestions.length - 1) {
            state.ViewArray.push(
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between'}}>
                <Button large title="Back" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: state.screenWidth / 2.2}} onPress={() => this.loadNextQuestion(context, state, true)}/>
                <Button large title="Submit" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: state.screenWidth / 2.2}} onPress={() => {
                if(this.checkAndAppendFollowUp(context, currentAnswers)) {
                    this.loadNextQuestion(context, state);
                } else {
                    this.submitData(context);
                }
                }} />
            </View>
            );
        }
        // ======================== First Question, No Back Button ========================= //
        else if (state.CurrentQuestionIndex == 0) {
            state.ViewArray.push(
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between'}}>
                <Button large title="Back" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: state.screenWidth / 2.2}} onPress={() => {}}/>
                <Button large title="Next" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: state.screenWidth / 2.2}} onPress={() =>
                { 
                    // append followup question if there are any
                    this.checkAndAppendFollowUp(context, currentAnswers);
                    this.loadNextQuestion(context, state)
                }
            }/>
            </View>
            );
        }
        // ======================== A Question In The Middle, Show Back and Next button ========================= //
        else {
            context.state.ViewArray.push(
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'center'}}>
            <Button large title="Back" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: context.state.screenWidth / 2.2}} onPress={() => this.loadNextQuestion(context, state, true)}/>
            <Button large title="Next" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: context.state.screenWidth / 2.2}} onPress={() =>
                { 
                    // append followup question if there are any
                    this.checkAndAppendFollowUp(context,currentAnswers);
                    this.loadNextQuestion(context, state)
                }
            }/>
            </View>
            );
        }

        context.forceUpdate();
    },

    checkAndAppendFollowUp: function(context, currentAnswers) {
      var followUpExists = false;
      for (var i = 0; i < currentAnswers.length; i++) {
        var answer = currentAnswers[i];
        if (answer.Followup != null) {
          context.state.SurveyQuestions.splice(context.state.CurrentQuestionIndex + 1, 0, answer.Followup);
          followUpExists = true;
        }
      }
      return followUpExists;
    },

    constructCheckboxes: function(state, answers) {
      // Clear checkboxes
      state.Checkboxes = []
      for (var i = 0; i < state.ShowCheckboxes.length; i++) {
        state.ShowCheckboxes[i] = false;
      }
  
      // Add new checkboxes
      let checkboxesSeen = 0; // 0 - 19 (20 boxes)
      for (var i = 0; i < answers.length; i++) {
        let ans = answers[i];

        let id = state.CheckboxId + 1;
        let checked = false;
        let option = ans.Answer;
        
        let cb = {id: id, option: option, checked: checked};
        state.Checkboxes.push(cb);
        state.ShowCheckboxes[i] = true;
        state.CheckboxText[i] = option;
  
        checkboxesSeen = i;
        state.CheckboxId++;
      }
  
      for (var i = checkboxesSeen + 1; i < 20; i++){
        let cb = {id: state.CheckboxId+1, checked: false};
        state.Checkboxes.push(cb);
        state.ShowCheckboxes[i] = false;
        state.CheckboxText[i] = "";
      }
    },

    checkboxChanged: function(context, index, value) {
      context.state.Checkboxes[index].checked = value; 
      this.updateCheckboxAnswers(context);
      context.forceUpdate();
    },

    updateCheckboxAnswers: function(context){
      let answer = "";
      for (var i = 0; i < context.state.Checkboxes.length; i++) {

        if (context.state.Checkboxes[i].checked) {

          if (answer == "") answer += context.state.Checkboxes[i].option;
          else {
            answer += (", " + context.state.Checkboxes[i].option);
          }

        }
      }

      context.state.Answers[context.state.CurrentQuestion] = answer;
    },

    updateSlider(context, value) {
      context.state.sliderValue = value; 

      context.state.sliderText = "Value: " + context.state.sliderValue.toString();
      context.state.Answers[context.state.CurrentQuestion] = context.state.sliderValue.toString();
      context.forceUpdate();
    },

    submitData(context) {

      context.state.IsCheckboxQuestion = false;
      context.state.ShowAlternateQuestion = false;
      context.state.ShowSlider = false;
      context.state.ViewArray = [];

      context.state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);
      context.state.ViewArray.push(<Text style={styles.sectionTitle}>Thank you for participating in this survey.</Text>);
      context.state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);

      let result = []

      for (var key in context.state.Answers) {
        var ans = context.state.Answers[key];

        let answer = { stitle: context.state.SurveyTitle, qtitle: key, answer: ans };
        result.push(answer);
      }

      // Post results
      let data = {
        method: 'POST',
        body: JSON.stringify({
            result: result,
            username: context.state.Username,
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
      }
      

      fetch('https://emad-cits5206-2.herokuapp.com/projectAPI/' + context.state.Username, data)
      //fetch('http://192.168.31.244:3000/projectAPI/' + this.state.Username, data)
      .then((response) => response.json())
            .then((responseJson) => {

          // ============= on success ============== //
          // Adjust notification time
          context.sendNotification(responseJson.interval);

        }).catch((error) => {
          // ============= on failure ============== //
          alert(error);
      });

      context.forceUpdate();
    },

    const : styles = StyleSheet.create({
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
      }),


}

//module.exports = SurveyScreenShared;