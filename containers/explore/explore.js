import * as React from 'react';
import { StyleSheet, View, StatusBar, Text as ReactText, TouchableOpacity } from 'react-native';

import Background from '../../component/background/background';
import Tabs from '../../component/tabs/tabs';
import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';
import TabButton from '../../component/tabButton/tabButton';
import BottomTabButton from '../../component/bottomTabButton/bottomTabButton';


export default function Explore() {
  StatusBar.setBarStyle('light-content', true);

  return (
      <Background>
        <View style={styles.tabs}>
          <Tabs>
            <TabButton>חיפוש מראה מקום</TabButton>
            <TabButton>תצוגת עץ</TabButton>
          </Tabs>
        </View>
        <View style={styles.page}>
          <View style={styles.input}>
            <Input />
          </View>
          <View style={styles.button}>
            <View style={styles.buttonWrapper}>
              <ClickButton />
            </View>
            <TouchableOpacity
              underlayColor="#ffffff00" >
              <ReactText style={styles.clickText}>החלפות והוספות</ReactText>
            </TouchableOpacity>
          </View>
          
        </View>
        <View style={styles.bottomTab}>
          <Tabs>
            <BottomTabButton>ראשי תיבות</BottomTabButton>
            <BottomTabButton>חיפוש</BottomTabButton>
            <BottomTabButton>עיון</BottomTabButton>
          </Tabs>
          </View>
      </Background>

    
  );
}


const styles = StyleSheet.create({
  bottomTab:{
    position:'absolute',
    bottom:0,
    height: 60,
    width: '100%',
    display: 'flex',
  },
  buttonWrapper: {
    width: 95
  },
  clickText: {
    color: '#11AFC2',
    fontFamily: "OpenSansHebrew",
    textAlign: 'center',
    paddingTop: 13,
    fontSize: 18,
    borderBottomColor: '#11AFC2',
    borderBottomWidth: 1,
  },
  tabs: {
    height: 60,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    zIndex: 5,
  },
  input: {
    flex: 0.45,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    paddingTop: 15,
    flex: 0.55,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
  },
  page: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignContent: 'center'
  }
});
