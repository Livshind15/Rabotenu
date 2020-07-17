import * as React from 'react';
import { StyleSheet, View, TouchableOpacity,Text } from 'react-native';

import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';
import Background from '../../component/background/background';



export default function Search(props) {

  return (
     <Background>
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
            <Text style={styles.clickText}>החלפות והוספות</Text>
          </TouchableOpacity>
        </View>
      </View>


    </Background>
  );
}


const styles = StyleSheet.create({
  bottomTab: {
    position: 'absolute',
    bottom: 0,
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
    paddingTop: 14,
    fontSize: 18,
    borderBottomColor: '#11AFC2',
    borderBottomWidth: 1,
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
    paddingTop: 18,
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
