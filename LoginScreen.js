import React, {Fragment} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TextInput,
    Button,
  } from 'react-native';
import { withNavigation } from 'react-navigation';


class LoginScreen extends React.Component {
    constructor(props) {
    super(props);
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
                    <Button style={{height: 40, marginVertical: 10,}} onPress={() => { this.props.navigation.push('Survey');}} title="Login" />
                  </View>
                </View>
  
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
};

export default withNavigation(LoginScreen);

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
      marginVertical: 10,
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