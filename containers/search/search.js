import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from "axios";

import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';
import Background from '../../component/background/background';
import SearchResultView from './searchResultView';
import { delay } from '../../utils/helpers';
import SearchOptionsModel from '../../component/searchOptions/searchOptions';
import SearchTypeModel from '../../component/searchType/searchType';
import Resources from '../resources/resources';
import config from "../../config/config";
import { SearchContext, SearchProvider } from '../../contexts/searchContext';
import SearchView from './searchView';
import BookNavigator from '../bookNavigator/bookNavigator';
import TableSearch from '../tableSearch/tableSearch';
import { isEmpty } from 'lodash';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen'
import PlaceHolder from '../../component/placeHolder/placeHolder';


const Stack = createStackNavigator();


export const getBooksByContent = async (content, searchType, tableInput,books,groups) => {
  const { data } = await axios.post(`${config.serverUrl}/book/search/books/`, {
    "content": content,
    "type": !isEmpty(tableInput) ? searchType || 'exact' : 'exact',
    "table": tableInput,
    "books":books,
    "groups":groups
  });
  return data;
}



export default function Search() {
  const { setTableInput, setBookResult, setSearchType ,notSearchBooks,notSearchGroups} = React.useContext(SearchContext);
  const [tableInit] = React.useState([[{ value: "" }]])
  const tableSearch = (props) => <TableSearch tableInit={tableInit} {...props} onSave={async (table, navigation) => {
    const tablesInput = table.map(or => {
      return or.map(must => {
        return {
          "content": must.value,
          "type": 'exact'
        }
      })
    })
    const result = await getBooksByContent("", "table", tablesInput,notSearchBooks,notSearchGroups);
    setTableInput(tablesInput)
    setBookResult(result);
    navigation.push('SearchResultView', { onSearch: getBooksByContent })
  }} />

  return (

    <Stack.Navigator initialRouteName="MainSearch" >
      <Stack.Screen name="MainSearch" options={{ headerShown: false, title: 'רבותינו' }} component={searchMain} />
      <Stack.Screen name="SearchResultView" options={{ headerShown: false, title: 'רבותינו' }} component={searchResultView} />
      <Stack.Screen name="Resources" options={{ headerShown: false, title: 'רבותינו' }} component={resources} />
      <Stack.Screen name="SearchView" options={{ headerShown: false, title: 'רבותינו' }} component={searchView} />
      <Stack.Screen name="Result" options={{ headerShown: false, title: 'רבותינו' }} component={bookNavigator} />
      <Stack.Screen name="TableSearch" options={{ headerShown: false, title: 'רבותינו' }} component={tableSearch} />

    </Stack.Navigator>
  );
}

const options = [
  { title: 'חיפוש מדוייק', description: "חיפוש מדוייק של מילות החיפוש ללא מרחקים" },
  { title: 'חיפוש קל', description: "מרחק של עד 3 מילים בין מילות חיפוש" },
  { title: 'חפש תוצאות קרובות', description: "חפש עם קידומות לכל המילים,כתיב חסר למילים בכתיב מלא, מרחק של עד 30 מילים בין מילה למילה" },
  { title: 'חיפוש טבלאי', description: "פתח את החיפוש הטבלאי" },

]

const typeToIndex = ['exact', 'close', 'like', 'table'];

const SearchMain = ({ navigation }) => {
  const [isLoading, setLoading] = React.useState(false);
  const [showOptionsSearch, setShowOptionsSearch] = React.useState(false);
  const [showSearchType, setShowSearchType] = React.useState(false);
  const { searchInput, setSearchInput, setBookResult,notSearchGroups,notSearchBooks, setSearchType, searchType, tableInput, setTableInput } = React.useContext(SearchContext);

const onSubmit = async () =>{
  if (!isLoading) {
    setLoading(true);
    const result = await getBooksByContent(searchInput, searchType, tableInput,notSearchBooks,notSearchGroups);
    setLoading(false)
    setBookResult(result);
    navigation.push('SearchResultView', { onSearch: getBooksByContent })
  }
}
  return (
    <Background>
      <SearchOptionsModel onResources={() => navigation.push('Resources')} openSearchType={() => setShowSearchType(true)} visible={showOptionsSearch} setVisible={setShowOptionsSearch} ></SearchOptionsModel>
      <SearchTypeModel currSelect={typeToIndex.findIndex(item => item === searchType) || 0} onOptionChange={(index) => {
        setSearchType(typeToIndex[index] || 'exact');
        if (index === 3) {
          navigation.push('TableSearch');
          setShowSearchType(false)
        }


      }} setVisible={setShowSearchType} options={options} visible={showSearchType}></SearchTypeModel>
      <View style={styles.page}>
        <View style={styles.container}>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>הקלד את המילה החיפוש שתרצה לאתר</Text>
          </View>
          <View style={styles.input}>
            <Input onSubmit={onSubmit} isLoading={isLoading} value={searchInput} onChange={setSearchInput} placeholder={'חפש'} />
          </View>
          <View style={styles.buttonWrapper}>
            <ClickButton onPress={onSubmit} outline={true} >חיפוש</ClickButton>
          </View>
          <TouchableOpacity
            underlayColor="#ffffff00"
            onPress={() => setShowOptionsSearch(true)}
          >
            <Text style={styles.clickText}>אפשרויות חיפוש מתקדמות</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  )
}

const searchResultView = optimizeHeavyScreen(SearchResultView,PlaceHolder)
const searchMain = optimizeHeavyScreen(SearchMain,PlaceHolder)
const resources = optimizeHeavyScreen(Resources,PlaceHolder)
const searchView = optimizeHeavyScreen(SearchView,PlaceHolder)
const bookNavigator = optimizeHeavyScreen(BookNavigator,PlaceHolder)



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
