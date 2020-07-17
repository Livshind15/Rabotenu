import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import Tabs from '../../component/tabs/tabs';
import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';
import TabButton from '../../component/tabButton/tabButton';
import Background from '../../component/background/background';


export default function Explore(props) {
  const [tab, setTab] = React.useState(0)

  return (
    <Background>
      <View style={styles.tabs}>
        <Tabs selectedIndex={tab} onSelect={setTab}>
          <TabButton>חיפוש מראה מקום</TabButton>
          <TabButton>תצוגת עץ</TabButton>
        </Tabs>
      </View>
      <View style={styles.page}>
        <View style={styles.input}>
          <Input  placeholder={ "חיפוש חופשי"} />
        </View>
        <View style={styles.button}>
          <View style={styles.buttonWrapper}>
            <ClickButton >חיפוש</ClickButton>
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
