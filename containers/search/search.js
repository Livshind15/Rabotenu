import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';


import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';
import Background from '../../component/background/background';
import SearchResultView from './searchResultView';
import { delay } from '../../utils/helpers';
import SearchOptionsModel from '../../component/searchOptions/searchOptions';
import SearchTypeModel from '../../component/searchType/searchType';

const Stack = createStackNavigator();


export default function Search() {
  return (
    <Stack.Navigator initialRouteName="MainSearch" >
      <Stack.Screen name="MainSearch" options={{ headerShown: false }} component={SearchMain} />
      <Stack.Screen name="SearchResultView" options={{ headerShown: false }} component={SearchResultView} />
    </Stack.Navigator>
  );
}

const options = [
  {title:'חיפוש מדוייק',description:"חיפוש מדוייק של מילות החיפוש ללא מרחקים"},
  {title:'חיפוש קל',description:"מרחק של עד 3 מילים בין מילות חיפוש"},
  {title:'חפש תוצאות קרובות',description:"חפש עם קידומות לכל המילים,כתיב חסר למילים בכתיב מלא, מרחק של עד 30 מילים בין מילה למילה"},
  {title:'חיפוש תוצאות דומות',description:"חפש חיפוש עמום עד 20 אחוז, דלג על מילים עד 40 אחוז"},
  {title:'חיפוש טבלאי',description:"פתח את החיפוש הטבלאי"},

]


const SearchMain = ({ navigation }) => {
  const [input, setInput] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [showOptionsSearch,setShowOptionsSearch] = React.useState(false);
  const [showSearchType,setShowSearchType] = React.useState(false);
  return (<Background>
  <SearchOptionsModel openSearchType={()=>setShowSearchType(true)} visible={showOptionsSearch} setVisible={setShowOptionsSearch} ></SearchOptionsModel>
  <SearchTypeModel setVisible={setShowSearchType} options={options} visible={showSearchType}></SearchTypeModel>
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.textWrapper}>
          <Text style={styles.text}>הקלד את המילה החיפוש שתרצה לאתר</Text>
        </View>
        <View style={styles.input}>
          <Input isLoading={isLoading} value={input} onChange={setInput} placeholder={'חפש'} />
        </View>
        <View style={styles.buttonWrapper}>
          <ClickButton onPress={async () => {
            if (!isLoading) {
              setLoading(true)
              await delay(2500);
              setLoading(false)
              navigation.push('SearchResultView', { searchInput: input });
            }
          }} outline={true} >חיפוש</ClickButton>
        </View>
        <TouchableOpacity
          underlayColor="#ffffff00" 
          onPress={()=>setShowOptionsSearch(true)}
          >
          <Text style={styles.clickText}>אפשרויות חיפוש מתקדמות</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Background>)
}


const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  textWrapper: {
    width: '80%',
    height: 70,
    display: 'flex',
    alignItems: 'center',

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
  buttonWrapper: {
    width: 95
  },
  clickText: {
    color: '#11AFC2',
    fontFamily: "OpenSansHebrew",
    textAlign: 'center',
    paddingTop: 14,
    fontSize: 18,
  },

});
