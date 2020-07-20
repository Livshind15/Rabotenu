import * as React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Platform } from 'react-native';
import { CheckBox } from '@ui-kitten/components';

import Background from '../../component/background/background';
import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';

export default function ExploreResultView({ route }) {
  const { result, searchInput } = route.params;
  const [input, setInput] = React.useState(searchInput);
  const [exploreResult, setExploreResult] = React.useState(attachKeyToArray(result, 'isCheck', false));

  const setResultCheck = (index) => {
    setExploreResult(exploreResult.map(result => {
      if (result.key === index) {
        return { ...result, isCheck: !result.isCheck }
      }
      return { ...result }
    }))
  }

  const isResultSelect = () => exploreResult.some(result => result.isCheck)

  const countResultSelect = () => exploreResult.filter(result => result.isCheck).length

  return (
    <Background>
      <View style={styles.page}>
        <View style={styles.input}>
          <View style={styles.buttonWrapper}>
            <ClickButton outline={true} optionsButton={{ paddingVertical: 8 }} optionsText={{ fontSize: 16 }}>חיפוש</ClickButton>
          </View>
          <View style={styles.inputWrapper}>
            <Input value={input} onChange={setInput} options={{ fontSize: 16, paddingHorizontal: 20, height: 40 }} />
          </View>
        </View>
        <View style={styles.resultCountWrapper}>
          <Text style={styles.titleResult}>תוצאות חיפוש</Text>
          <Text style={styles.titleCount}>{`(סה"כ ${result.length})`}</Text>
        </View>
        <View style={styles.resultWrapper}>
          <ScrollView>
            {exploreResult.map((result, index) =>
              <TouchableOpacity
                style={styles.result}
                key={index}
                underlayColor="#ffffff00"
                onPress={() => { setResultCheck(result.key) }}>
                <View style={styles.checkBoxWrapper}>
                  <CheckBox
                    checked={result.isCheck}
                    onChange={() => { setResultCheck(result.key) }}>
                  </CheckBox>
                </View>
                <View style={styles.resultTitleWrapper}>
                  <Text style={styles.resultTitle}>{result.title}</Text>
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
        <View style={styles.selectContainer}>
          <TouchableOpacity
            disabled={!isResultSelect()}
            style={[styles.selectButton, isResultSelect() ? {} : styles.selectButtonDisable]}
            underlayColor="#ffffff00" >
            <Text style={[styles.selectButtonText, isResultSelect() ? {} : styles.selectButtonDisableText]} >
              {isResultSelect() ? `פתח ספרים נבחרים (${countResultSelect()})` : `פתח ספרים נבחרים`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
}

const attachKeyToArray = (array, key, initValue) => {
  return array.map(element => {
    return {
      ...element,
      [key]: initValue
    }
  })
}


const styles = StyleSheet.create({
  resultTitleWrapper: {
    justifyContent: 'center',
    flex: 1,

  },
  resultTitle: {
    fontFamily: "OpenSansHebrew",
    textAlign: 'right',
    justifyContent: 'center',
    color: '#606060',
    fontSize: 16,
  },
  checkBoxWrapper: {
    alignItems: 'center',
    width: 35
  },
  result: {
    ...{
      width: '100%',
      height: 50,
      paddingHorizontal: 8,
      flexDirection: 'row-reverse',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#E4E4E4'
    }
    , ...(Platform.OS === 'web' ? {
      flexDirection: 'row',
    } : {})
  },
  selectButton: {
    width: '95%',
    height: '80%',
    paddingVertical: 5,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00AABE',
  },
  selectButtonDisable: {
    backgroundColor: '#D8D8D8',
  },
  selectButtonDisableText: {
    fontFamily: "OpenSansHebrewBold",
    textAlign: 'center',
    fontSize: 20,
    color: '#A9A9A9'
  },
  selectContainer: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButtonText: {
    fontFamily: "OpenSansHebrewBold",
    textAlign: 'center',
    fontSize: 20,
    color: '#ECECEC'
  },
  resultWrapper: {
    flex: 1,
    width: '100%',
    direction: 'rtl',

  },
  resultCountWrapper: {
    height: 40,
    width: '100%',
    paddingHorizontal: 15,
    backgroundColor: '#CBD4D3',
    shadowColor: "#000",
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  titleResult: {
    fontFamily: "OpenSansHebrewBold",
    textAlign: 'center',
    fontSize: 16,
    color: "#6D6D6D"
  },
  titleCount: {
    fontFamily: "OpenSansHebrew",
    textAlign: 'center',
    fontSize: 14,
    color: '#878A8A'
  },
  inputWrapper: {
    flex: 0.82,
    height: '100%',
    justifyContent: 'center'
  },
  buttonWrapper: {
    flex: 0.18,
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
    width: '95%',
    height: 55,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '100%',
    height: '100%',
    alignItems: 'center',
    alignContent: 'center',
  }
});
