import * as React from 'react';
import { StyleSheet, View, StatusBar, Text, TouchableOpacity, Platform } from 'react-native';
import Background from '../../component/background/background';
import Tabs from '../../component/tabs/tabs';
import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';
export default function ExploreResultView() {
  StatusBar.setBarStyle('light-content', true);
  return (
    <Background>
      <View style={styles.tabs}>
        <Tabs></Tabs>
      </View>
      <View style={styles.page}>
        <View style={styles.input}>
          <View style={styles.buttonWrapper}>
            <ClickButton
              outline={true}
              optionsButton={{
                paddingVertical: 7
              }}
              optionsText={{
                fontSize: 16,
              }}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Input options={{
              fontSize: 16,
              paddingHorizontal:20,
              height: 40,
            }} />
          </View>
        </View>
        <View style={styles.button}>
        </View>
      </View>
    </Background>
  );
}


const styles = StyleSheet.create({
  inputWrapper: {
    flex: 0.8,
    height: '100%',
    justifyContent: 'center'

  },
  buttonWrapper: {
    flex: 0.2,
    height: '100%',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignContent: 'center',
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
    flex: 0.15,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    paddingTop: 15,
    flex: 0.85,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
  },
  page: {
    flex: 1,
    width: '95%',
    justifyContent: 'center',
    alignContent: 'center'
  }
});
