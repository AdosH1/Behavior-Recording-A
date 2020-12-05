import { SurveyScreenShared } from './SurveyScreenShared.js';
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

      this.state = SurveyScreenShared.getInitialState(true);
      //this.convertServerDataToSurvey(navigation.getParam('serverData', 'Unable to find server data.'));
      this.state.Username = navigation.getParam('username', 'Unable to find user data');
      PushNotificationIOS.requestPermissions();
    }

    componentDidMount() {

      PushNotificationIOS.addEventListener('localNotification', function(){
        RNRestart.Restart();
      });

      SurveyScreenShared.loadNextQuestion(this, this.state);
    }

    sendNotification(seconds) {
        setTimeout(function() {
            PushNotificationIOS.presentLocalNotification({ alertBody: "A survey is ready to be taken!", alertAction: "view" });
        }, seconds * 1000);
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
                        {this.state.ShowCheckboxes[0] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 0, value)}} value={this.state.Checkboxes[0].checked}/><Text>{this.state.CheckboxText[0]}</Text></View> : null }
                        {this.state.ShowCheckboxes[1] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 1, value)}} value={this.state.Checkboxes[1].checked}/><Text>{this.state.CheckboxText[1]}</Text></View> : null }
                        {this.state.ShowCheckboxes[2] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 2, value)}} value={this.state.Checkboxes[2].checked}/><Text>{this.state.CheckboxText[2]}</Text></View> : null }
                        {this.state.ShowCheckboxes[3] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 3, value)}} value={this.state.Checkboxes[3].checked}/><Text>{this.state.CheckboxText[3]}</Text></View> : null }
                        {this.state.ShowCheckboxes[4] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 4, value)}} value={this.state.Checkboxes[4].checked}/><Text>{this.state.CheckboxText[4]}</Text></View> : null }
                        {this.state.ShowCheckboxes[5] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 5, value)}} value={this.state.Checkboxes[5].checked}/><Text>{this.state.CheckboxText[5]}</Text></View> : null }
                        {this.state.ShowCheckboxes[6] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 6, value)}} value={this.state.Checkboxes[6].checked}/><Text>{this.state.CheckboxText[6]}</Text></View> : null }
                        {this.state.ShowCheckboxes[7] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 7, value)}} value={this.state.Checkboxes[7].checked}/><Text>{this.state.CheckboxText[7]}</Text></View> : null }
                        {this.state.ShowCheckboxes[8] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 8, value)}} value={this.state.Checkboxes[8].checked}/><Text>{this.state.CheckboxText[8]}</Text></View> : null }
                        {this.state.ShowCheckboxes[9] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 9, value)}} value={this.state.Checkboxes[9].checked}/><Text>{this.state.CheckboxText[9]}</Text></View> : null }
                        {this.state.ShowCheckboxes[10] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 10, value)}} value={this.state.Checkboxes[10].checked}/><Text>{this.state.CheckboxText[10]}</Text></View> : null }
                        {this.state.ShowCheckboxes[11] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 11, value)}} value={this.state.Checkboxes[11].checked}/><Text>{this.state.CheckboxText[11]}</Text></View> : null }
                        {this.state.ShowCheckboxes[12] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 12, value)}} value={this.state.Checkboxes[12].checked}/><Text>{this.state.CheckboxText[12]}</Text></View> : null }
                        {this.state.ShowCheckboxes[13] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 13, value)}} value={this.state.Checkboxes[13].checked}/><Text>{this.state.CheckboxText[13]}</Text></View> : null }
                        {this.state.ShowCheckboxes[14] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 14, value)}} value={this.state.Checkboxes[14].checked}/><Text>{this.state.CheckboxText[14]}</Text></View> : null }
                        {this.state.ShowCheckboxes[15] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 15, value)}} value={this.state.Checkboxes[15].checked}/><Text>{this.state.CheckboxText[15]}</Text></View> : null }
                        {this.state.ShowCheckboxes[16] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 16, value)}} value={this.state.Checkboxes[16].checked}/><Text>{this.state.CheckboxText[16]}</Text></View> : null }
                        {this.state.ShowCheckboxes[17] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 17, value)}} value={this.state.Checkboxes[17].checked}/><Text>{this.state.CheckboxText[17]}</Text></View> : null }
                        {this.state.ShowCheckboxes[18] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 18, value)}} value={this.state.Checkboxes[18].checked}/><Text>{this.state.CheckboxText[18]}</Text></View> : null }
                        {this.state.ShowCheckboxes[19] ?  <View style={styles.checkboxStyle}><Switch onValueChange={(value) => {SurveyScreenShared.checkboxChanged(this, 19, value)}} value={this.state.Checkboxes[19].checked}/><Text>{this.state.CheckboxText[19]}</Text></View> : null }
                        
                      </View> : null
                    }

                  {this.state.ShowSlider? 
                    <View style={{marginHorizontal: 20, marginVertical: 5}}>
                      <Slider 
                        value={this.state.sliderValue}
                        onValueChange={(value) => { SurveyScreenShared.updateSlider(this, value); }}
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