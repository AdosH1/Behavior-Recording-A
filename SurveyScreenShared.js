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
          // ========== Categorical Slider ======== //
          ShowCatSlider: false,
          catMinValue: 0,
          catMaxValue: 5,
          catValue: 2,
          CatAnswers: [],
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

    convertServerDataToSurvey : function(context, serverData)
    {
        // Clear default survey questions
        var SurveyQuestions = [];
        console.log("============== SERVERDATA ================");
        console.log(serverData);
        var sq = this.createQuestion(serverData);
        SurveyQuestions.push(sq);

        return SurveyQuestions;

        var SurveyId = serverData._id;
        var SurveyTitle = serverData.title;
        var SurveyType = serverData.type;
        var SurveyInterval = serverData.interval;
  
        for (var i = 0; i < serverData.content.length; i++)
        {
          console.log(serverData.content);
          let SQ = serverData.content[i];
  
          // Create list of answers
          let answers = [];
          for (var j = 0; j < serverData.content.length; j++) {
            
            let SQid = SQ._id;
            let SQans = SQ.title[j];

            // =======================================
            let ansObj = {
              Id: SQid,
              Answer: SQans
            }
  
            answers.push(ansObj);
          }
  
          let SurveyQuestion = { 
            Id: SurveyId,
            Interval: SurveyInterval,
            Question: SurveyTitle,
            Type: SurveyType,
            Answers: answers
           };
          SurveyQuestions.push(SurveyQuestion);
        }

        return SurveyQuestions;
    },

    // convertServerDataToSurvey : function(serverData)
    // {
    //     // Clear default survey questions
    //     var SurveyQuestions = [];
    //     var SurveyTitle = serverData.title;
  
    //     for (var i = 0; i < serverData.questions.length; i++)
    //     {
    //       let SQ = serverData.questions[i];
  
    //       // Create list of answers
    //       let answers = [];
    //       for (var j = 0; j < SQ.content.length; j++) {
    //         let SQans = SQ.content[j];
  
    //         // Create list of followups
    //         let SQFollowupAns = []
            
    //         let hasFollowup = SQans.followUp.title != null;
    //         if (hasFollowup) {
    //           if (SQans.followUp.type == "text") {
  
    //           }
    //           else {
    //             for (var k = 0; k < SQans.followUp.content.length; k++) {
    //               let SQFollowup = SQans.followUp.content[k];
    //               let followUpAns = {
    //                 Answer: SQFollowup.title,
    //                 Followup: null
    //               }
    //               SQFollowupAns.push(followUpAns);
    //             }
    //           }
    //        }
  
    //         let SQFollowup = hasFollowup ? {
    //           Question: SQans.followUp.title,
    //           Type: SQans.followUp.type,
    //           Answers: SQFollowupAns
    //         } : null;
  
    //         // =======================================
    //         let ansObj = {
    //           Answer: SQans.title,
    //           Followup: SQFollowup
    //         }
  
    //         answers.push(ansObj);
    //       }
  
    //       let SurveyQuestion = { 
    //         Question: SQ.title,
    //         Type: SQ.type,
    //         Answers: answers
    //        };
    //       SurveyQuestions.push(SurveyQuestion);
    //     }

    //     return SurveyQuestions;
    // },

    loadNextQuestion : async function(context, state, goBackwards = false) {
        context.state.ViewArray = []
        context.state.IsCheckboxQuestion = false;
        context.state.ShowAlternateQuestion = false;
        context.state.ShowSlider = false;
        context.state.sliderValue = 0;

        if (goBackwards) context.state.CurrentQuestionIndex--;
        else context.state.CurrentQuestionIndex++;

        console.log("Current Index: " + context.state.CurrentQuestionIndex);
        console.log("Current Question: ");
        console.log(context.state.SurveyQuestions[context.state.CurrentQuestionIndex]);
        let currentQuestion = context.state.SurveyQuestions[context.state.CurrentQuestionIndex];
        let currentAnswers = [];

        context.state.CurrentQuestion = currentQuestion.Question;
        let surveyAnswers = currentQuestion.Answers;

        // ================================= CHECKBOXES ==================================== //
        if (currentQuestion.Type === "multiple") { 
            // Create answer entry
            context.state.Answers[currentQuestion.Question] = [];
            context.state.IsCheckboxQuestion = true;
            context.state.ShowAlternateQuestion = true;

            this.constructCheckboxes(state, surveyAnswers);
        }
        // ================================= BUTTONS ==================================== //
        else if (currentQuestion.Type === "single") {
            context.state.ViewArray.push(<Text style={styles.sectionTitle}>{currentQuestion.Question}</Text>);
            
            // Create answer entry
            context.state.Answers[currentQuestion.Question] = "";
            context.state.RadioProps = []

            for (var i = 0; i < surveyAnswers.length; i++) {
            let answer = surveyAnswers[i]; 
            let option = answer.Answer;
            let followup = answer.Followup;

            context.state.RadioProps.push({label: option, value: option, answer: answer});
            }

            context.state.ViewArray.push(
            <View style={{marginHorizontal: 20, marginVertical: 5}}>
            <RadioForm
                buttonColor={'#333333'}
                animation={true}
                radio_props={state.RadioProps}
                initial={-1}
                onPress={(value) => {
                    context.setState({value: value}); 
                    context.state.Answers[currentQuestion.Question] = value;
                    currentAnswers = [];
                    
                    // Insert answer into current answer (to check for followup)
                    for (var i = 0; i < context.state.RadioProps.length; i++) {
                        let prop = context.state.RadioProps[i];
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
            context.state.ViewArray.push(<Text style={styles.sectionTitle}>{currentQuestion.Question}</Text>);
            // Create answer entry
            context.state.Answers[currentQuestion.Question] = "";

            context.state.ViewArray.push(<TextInput style={{marginVertical: 5, marginHorizontal: 20, borderColor: "grey", borderWidth: 1, height: state.screenHeight / 2.8, textAlignVertical: "top"}} defaultValue="" multiline={true} onChangeText={(text) => context.state.Answers[currentQuestion.Question] = text} />)
        }
        // ================================= SLIDER ==================================== //
        else if (currentQuestion.Type === "scale") {

            context.state.ShowSlider = true;
            context.state.ShowAlternateQuestion = true;
            
            // Create answer entry
            context.state.Answers[currentQuestion.Question] = "";
            for (var i = 0; i < surveyAnswers.length; i++) {
            let answer = surveyAnswers[i]; 
            let option = answer.Answer;

            if (i == 0) context.state.sliderMinValue = parseFloat(option);
            if (i == 1) context.state.sliderMaxValue = parseFloat(option);
            if (i == 2) context.state.sliderStepValue = parseFloat(option);
            }
            context.state.sliderValue = context.state.sliderMinValue;
            context.state.sliderText = "Value: " + context.state.sliderValue.toString();

        }
        else if (currentQuestion.Type === "cas") {

          context.state.ShowCatSlider = true;
          context.state.ShowAlternateQuestion = true;
          context.state.CatAnswers = []
          
          // Create answer entry
          context.state.Answers[currentQuestion.Question] = "";
          for (var i = 0; i < surveyAnswers.length; i++) {
            let answer = surveyAnswers[i]; 
            let option = answer.Answer;

            context.state.CatAnswers.push(option);
          }

          context.state.catMinValue = 0;
          context.state.catMaxValue = context.state.CatAnswers.length - 1;

          context.state.catValue = context.state.catMinValue;

        }
        context.state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);


          // ================================= LOAD NEXT / BACK BUTTONS ==================================== //
          // ======================== Last Question, Show Submit Button ========================= //
        // if (state.CurrentQuestionIndex == state.SurveyQuestions.length - 1) {
        //     state.ViewArray.push(
        //     <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between'}}>
        //         <Button large title="Back" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: state.screenWidth / 2.2}} onPress={() => this.loadNextQuestion(context, state, true)}/>
        //         <Button large title="Submit" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: state.screenWidth / 2.2}} onPress={() => {
        //         if(this.checkAndAppendFollowUp(context, currentAnswers)) {
        //             this.loadNextQuestion(context, state);
        //         } else {
        //             this.submitData(context);
        //         }
        //         }} />
        //     </View>
        //     );
        // }
        // ======================== First Question, No Back Button ========================= //
        if (context.state.CurrentQuestionIndex == 0) {
            context.state.ViewArray.push(
            <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
                <Button large title="Next" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: state.screenWidth / 2.2}} onPress={async () =>
                { 

                  // If theres no next question locally
                  if ((context.state.CurrentQuestionIndex + 1) === context.state.SurveyQuestions.length)  {

                    let GFQresponse = await this.getFollowupQuestion(context, currentAnswers);
                    console.log("Has followup question: " + GFQresponse.hasFollowup);
                    if (GFQresponse.hasFollowup) {
                      this.loadNextQuestion(context, context.state);
                    }
                    else {

                      if (GFQresponse.msg == "Timer has started.") {
                        console.log("Has follow up, timer started");
                        console.log("Submitting data...");
                        this.submitData(context, GFQresponse.msg);
                      }
                      else {
                        // find next question
                        console.log("Looking for next question");
                        let GNGQresponse = await this.getNextQuestion(context); 
                        console.log("Has next question: " + GNGQresponse.hasNextQuestion);
                        if (GNGQresponse.hasNextQuestion) {
                          this.loadNextQuestion(context, context.state);
                        }
                        else {
                          console.log("Submitting data...");
                          this.submitData(context, GNGQresponse.msg);
                        }
                      }
                      
                    }

                  }
                  else {

                    console.log(" ============================= local question exists, using local");
                    this.loadNextQuestion(context, state);

                  }
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
            <Button large title="Next" buttonStyle={{marginVertical: 5, marginHorizontal: 5, alignSelf: 'stretch', width: context.state.screenWidth / 2.2}} onPress={async () =>
                { 
                  
                  if ((context.state.CurrentQuestionIndex + 1) === context.state.SurveyQuestions.length)  {
                  //if (typeof context.state.SurveyQuestions[context.state.CurrentQuestionIndex + 1] === undefined) {

                    let GFQresponse = await this.getFollowupQuestion(context, currentAnswers);
                    console.log("Has followup question: " + GFQresponse.hasFollowup);
                    if (GFQresponse.hasFollowup) {
                      this.loadNextQuestion(context, context.state);
                    }
                    else {

                      if (GFQresponse.msg == "Timer has started.") {
                        console.log("Has follow up, timer started");
                        console.log("Submitting data...");
                        this.submitData(context, GNGQresponse.msg);
                      }
                      else {
                        // find next question
                        console.log("Looking for next question");
                        let GNGQresponse = await this.getNextQuestion(context); 
                        console.log("Has next question: " + GNGQresponse.hasNextQuestion);
                        if (GNGQresponse.hasNextQuestion) {
                          this.loadNextQuestion(context, context.state);
                        }
                        else {
                          console.log("Submitting data...");
                          this.submitData(context, GNGQresponse.msg);
                        }
                      }
                      
                    }
                  }
                  else {

                    console.log(" ============================= local question exists, using local");
                    this.loadNextQuestion(context, state);

                  }


                }
            }/>
            </View>
            );
        }

        context.forceUpdate();
    },

    checkAndAppendFollowUp: async function(context, currentAnswers) {
      
      console.log("I AM CHECKING AND APPENDING A FOLLOWUP")

      var followUpExists = await this.getFollowupQuestion(context, currentAnswers);

      console.log("Follow Exists: " + followUpExists);
      return followUpExists;

      
    },

    getFollowupQuestion: async function(context, currentAnswers) {
      var i;
      var followup;
      console.log("====================================== GOING INTO LOOOOOOOOP =====================================");
      for (i = 0; i < currentAnswers.length; i++) {

        let answer = currentAnswers[i];
        console.log("LOOOOOOPING =====================================");
        console.log(answer);
        if (answer.FollowUp == null) continue;
        else { followup = answer; break; }

      }

      if (followup === undefined || followup.FollowUp === undefined) return false;

      let urlstring = 'http://emad-uwa5206.herokuapp.com/getFollowUp/' + context.state.Username + "/" + followup.FollowUp; 

      //let urlstring = 'http://192.168.20.9:3000/getFollowUp/' + context.state.Username + "/" + followup.FollowUp;  
        console.log("Url Answer Followup: " + urlstring);

      try {
        let data = {
          method: 'POST'
        };
        let response = await fetch(urlstring, data);
        if(response.ok) {
          let responseJson = await response.json();
          if (responseJson.msg == "Timer has started.") {
            // thank someone for survey
            console.log("Timer has started");
            return {hasFollowup: false, msg: responseJson.msg};
          }
          // =========== THERE IS A FOLLOWUP FOR NEXT QUESTION
          else if (responseJson != null) {

            var newQ = this.createQuestion(responseJson);
            console.log("New Question: " + newQ);

            context.state.SurveyQuestions.splice(context.state.CurrentQuestionIndex + 1, 0, newQ);
            console.log("Survey Question at current index: " + context.state.SurveyQuestions[context.state.CurrentQuestionIndex]);

            return {hasFollowup: true, msg: responseJson.msg};
          }
          else {
            console.log("error occurred in check and append followup")
            return {hasFollowup: false, msg: responseJson.msg};
          }
        } else {
          console.log("HTTP Error" + response.status);
        }
      } catch (error) {
        console.log("THERE WAS ERROR");
        console.log(error);
        // ============= on failure ============== //
        this.state.error = true;
        this.forceUpdate();
        throw error;
      }

    },

    getNextQuestion: async function(context) {

      let data = {
        method: 'POST',
      }
      let urlstring = 'http://emad-uwa5206.herokuapp.com/surveyAPI/' + context.state.Username;
      //let urlstring = 'http://192.168.20.9:3000/surveyAPI/' + context.state.Username;  
      console.log("Url Answer Next Question: " + urlstring);
      try {
        let response = await fetch(urlstring, data);
        if(response.ok) {
          let responseJson = await response.json();
          if (responseJson.msg == "Timer has started." || responseJson.msg == "You have completed the survey.") {
            // thank someone for survey
            console.log(responseJson.msg);
            return {hasNextQuestion: false, msg: responseJson.msg};
          }
          // =========== THERE IS A NEXT QUESTION
          else if (responseJson != null) {

            var newQ = this.createQuestion(responseJson);
            console.log("================================= Next Question: " + newQ);

            context.state.SurveyQuestions.splice(context.state.CurrentQuestionIndex + 1, 0, newQ);
            console.log("Survey Question at current index: " + context.state.SurveyQuestions[context.state.CurrentQuestionIndex]);

            return {hasNextQuestion: true, msg: responseJson.msg};
          }
          else {
            console.log("error occurred in getNextQuestion")
            return {hasNextQuestion: false, msg: responseJson.msg};
          }
        } else {
          console.log("HTTP Error" + response.status);
        }
      } catch (error) {
        console.log("THERE WAS ERROR");
        console.log(error);
        // ============= on failure ============== //
        context.state.error = true;
        context.forceUpdate();
        throw error;
      }

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

    updateCatSlider(context, value) {
      context.state.catValue = value; 

      context.state.Answers[context.state.CurrentQuestion] = context.state.CatAnswers[context.state.catValue];
      context.forceUpdate();
    },

    submitData : async function (context, msg) {

      context.state.IsCheckboxQuestion = false;
      context.state.ShowAlternateQuestion = false;
      context.state.ShowSlider = false;
      context.state.ShowCatSlider = false;
      context.state.ViewArray = [];

      context.state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);
      context.state.ViewArray.push(<Text style={styles.sectionTitle}>Thank you for participating in this survey.</Text>);
      context.state.ViewArray.push(<Divider style={{ backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 25 }} />);

      let result = []

      for (var key in context.state.Answers) {
        var ans = context.state.Answers[key];

        //let answer = { stitle: context.state.SurveyTitle, qtitle: key, answer: ans };
        let answer = { "id": context.state.SurveyId, "question": key, "answer": ans };
        result.push(answer);
      }

      console.log(result);

      // Post results
      let data = {
        method: 'POST',
        body: JSON.stringify({
            result: result,
            username: context.state.Username,
        }),
        // headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json',
        // }
      }
      
      let type = "";
      if (msg == "Timer has started.") type = "EOQ";
      if (msg == "You have completed the survey.") type = "EOS";
      let urlstring = 'https://emad-uwa5206.herokuapp.com/diaryAPI/' + context.state.Username + "/" + context.state.SurveyId + "/" + type;
      //let urlstring = 'http://192.168.20.9:3000/diaryAPI/' + context.state.Username + "/" + context.state.SurveyId + "/" + type;
      console.log(urlstring);

      let response = await fetch(urlstring, data); 

      if (response.ok) {

        let responseJson = await response.json();
        console.log(responseJson);

        if (responseJson.interval !== undefined)
          context.sendNotification(context, responseJson.interval);

      }
      else {
        console.log("HTTP Error" + response.status);
      }

      // .then((response) => response.json())
      //       .then((responseJson) => {

      //     // ============= on success ============== //
      //     // Adjust notification time
      //     console.log("ResponseJson");
      //     console.log(responseJson);
      //     //context.sendNotification(responseJson.interval);

      //   }).catch((error) => {
      //     // ============= on failure ============== //
      //     console.log(error);
      //     alert(error);
      //     throw error;
      // });

      context.forceUpdate();
    },

    createQuestion(data) {

          var SurveyId = data._id;
          var SurveyTitle = data.title;
          var SurveyType = data.type;
          var SurveyInterval = data.interval;
          
          // Create list of answers
          let answers = [];
          for (var j = 0; j < data.content.length; j++) {
            
            let SQ = data.content[j];
            let SQid = SQ._id;
            let SQans = SQ.title;
            let SQfollowup = SQ.followUp;

            // =======================================
            let ansObj = {
              Id: SQid,
              Answer: SQans,
              FollowUp: SQfollowup
            }
  
            answers.push(ansObj);
          }
  
          let SurveyQuestion = { 
            Id: SurveyId,
            Interval: SurveyInterval,
            Question: SurveyTitle,
            Type: SurveyType,
            Answers: answers
          };

          console.log(SurveyQuestion);
          
          return SurveyQuestion;
    },

    GetCatSliderOption(context, val) {

      if (context.state.CatAnswers[val] !== undefined)
        return context.state.CatAnswers[val];
      else 
        return "";

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