import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';
import Background from '../../component/background/background';



export default function Acronym(props) {

  return (
    <Background>
      <View style={styles.page}>
        <View style={styles.container}>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>הקלד ראשי תיבות שתרצה לאתר</Text>
          </View>
          <View style={styles.input}>
            <Input placeholder={'חפש'} />
          </View>
          <View style={styles.buttonsWrapper}>
            <View style={styles.buttonWrapper}>
              <ClickButton outline={true}>הגדרות</ClickButton>
            </View>
            <View style={styles.buttonWrapper}>
              <ClickButton outline={false} optionsButton={{ paddingVertical: 6 }} >חיפוש</ClickButton>
            </View>
          </View>
          <TouchableOpacity
            underlayColor="#ffffff00" >
            <Text style={styles.clickText}>אפשרויות חיפוש מתקדמות</Text>
          </TouchableOpacity>
        </View>

      </View>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          underlayColor="#ffffff00" >
          <Text style={styles.addButtonText} >הוסף ראשי תיבות למילון</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}


const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: "OpenSansHebrewBold",
    textAlign: 'center',
    fontSize: 20,
    color:'#ECECEC'
  },
  addButton: {
    width: '95%',
    height: '80%',
    paddingVertical: 5,
    borderRadius: 2,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#00AABE',
  },
  textWrapper: {
    width: '85%',
    height: 40,
    display: 'flex',
    alignItems: 'center',
  },
  buttonsWrapper: {
    height: 45,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontFamily: "OpenSansHebrew",
    fontSize: 24,
    color: '#575656',
    textAlign: 'center'
  },
  input: {
    width: '100%',
    height: 80,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonContainer: {
    width: '100%',
    height: 60,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: 95,
    marginHorizontal: 12
  },
  clickText: {
    color: '#11AFC2',
    fontFamily: "OpenSansHebrew",
    textAlign: 'center',
    paddingTop: 18,
    fontSize: 18,
  },

});
