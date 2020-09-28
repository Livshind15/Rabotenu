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
import SearchHistory from '../historyPage/historyPage';
import { flattenHeaders } from '../../component/resourcesTree/resourceTree';
import { typeToIndex, optionsSearch } from './search.common';


const Stack = createStackNavigator();
const headers = ["header1", "header2", "header3", "header4", "header5", "header6", "header7"]


export const getBooksByContent = async (content, searchType, tableInput, books, groups, filtersHeaders) => {
  const { data } = await axios.post(`${config.serverUrl}/book/search/books/`, {
    "content": content,
    "type": !isEmpty(tableInput) ? searchType || 'exact' : 'exact',
    "table": tableInput,
    "books": books,
    headers:filtersHeaders,

    "groups": groups
  });
  return data;
}



export default function Search({ navigation }) {
  const { setTableInput, setSearchHistory, cache, resources, setSearchInput, setNotSearchGroups, setNotSearchBooks, setBookResult, searchHistory, notSearchBooks, notSearchGroups, setSearchType } = React.useContext(SearchContext);
  const [tableInit] = React.useState([[{ value: "" }]])
  const bookIds = resources.map(resource => resource.bookId);
  const getAllBookFilter = React.useCallback(() => {
    return Object.keys(cache||{}).reduce((acc, curr) => {
        if (!bookIds.includes(cache[curr].id)) {
            const headers = flattenHeaders(cache[curr].tree, {})
            headers.map(header => {
              const newHeader = header;
              delete newHeader.id;
              return newHeader
            })
            acc = { ...acc, [cache[curr].id]:headers };
        }
        return acc;
    }, {})
}, [cache])
  const tableSearch = (props) => <TableSearch tableInit={tableInit} {...props} onSave={async (table, navigation) => {
    const tablesInput = table.map(or => {
      return or.map(must => {
        return {
          "content": must.value,
          "type": 'exact'
        }
      })
    })
    const result = await getBooksByContent("", "table", tablesInput, notSearchBooks, notSearchGroups, getAllBookFilter());
    setTableInput(tablesInput)
    setBookResult(result);
    navigation.push('SearchResultView', { onSearch: getBooksByContent })
  }} />

  const historyPage = (props) => <SearchHistory onSelect={async (selectIndex) => {
    const { searchInput, searchType, tableInput, notSearchBooks, notSearchGroups } = searchHistory[selectIndex];
    setTableInput(tableInput)
    setSearchType(searchType)
    setSearchInput(searchInput)
    setNotSearchGroups(notSearchGroups)
    setNotSearchBooks(notSearchBooks)
    const result = await getBooksByContent(searchInput, searchType, tableInput, notSearchBooks, notSearchGroups, getAllBookFilter());
    setBookResult(result);
    navigation.push('SearchResultView', { onSearch: getBooksByContent })
  }} onRemove={(removeIndex) => {
    setSearchHistory(searchHistory.filter((key, index) => index !== removeIndex))
  }} {...props} history={searchHistory} />

  return (

    <Stack.Navigator initialRouteName="MainSearch" >
      <Stack.Screen name="MainSearch" options={{ headerShown: false, title: 'רבותינו' }} component={searchMain} />
      <Stack.Screen name="SearchResultView" options={{ headerShown: false, title: 'רבותינו' }} component={searchResultView} />
      <Stack.Screen name="Resources" options={{ headerShown: false, title: 'רבותינו' }} component={Resources} />
      <Stack.Screen name="SearchView" options={{ headerShown: false, title: 'רבותינו' }} component={searchView} />
      <Stack.Screen name="Result" options={{ headerShown: false, title: 'רבותינו' }} component={bookNavigator} />
      <Stack.Screen name="TableSearch" options={{ headerShown: false, title: 'רבותינו' }} component={tableSearch} />
      <Stack.Screen name="SearchHistory" options={{ headerShown: false, title: 'רבותינו' }} component={historyPage} />

    </Stack.Navigator>
  );
}



const SearchMain = ({ navigation }) => {
  const [isLoading, setLoading] = React.useState(false);
  const [showOptionsSearch, setShowOptionsSearch] = React.useState(false);
  const [showSearchType, setShowSearchType] = React.useState(false);
  const { searchInput, resources, cache, setSearchInput, setBookResult, notSearchGroups, notSearchBooks, setSearchType, searchType, tableInput, setSearchHistory, searchHistory } = React.useContext(SearchContext);
  const bookIds = resources.map(resource => resource.bookId);
  const getAllBookFilter = React.useCallback(() => {
    return Object.keys(cache||{}).reduce((acc, curr) => {
        if (!bookIds.includes(cache[curr].id)) {
            const headers = flattenHeaders(cache[curr].tree, {})
            headers.map(header => {
              const newHeader = header;
              delete newHeader.id;
              return newHeader
            })
            acc = { ...acc, [cache[curr].id]:headers };
        }
        return acc;
    }, {})
}, [cache])
  const onSubmit = async () => {
    if (!isLoading) {
      setLoading(true);
      setSearchHistory([{ searchInput, searchType, tableInput, notSearchBooks, notSearchGroups }, ...searchHistory])
      const result = await getBooksByContent(searchInput, searchType, tableInput, notSearchBooks, notSearchGroups, getAllBookFilter());
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
        if (index === 4) {
          navigation.push('TableSearch');
          setShowSearchType(false)
        }


      }} setVisible={setShowSearchType} options={optionsSearch} visible={showSearchType}></SearchTypeModel>
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
          <TouchableOpacity underlayColor="#ffffff00" onPress={() => navigation.push('SearchHistory')}>
            <Text style={styles.clickText}>הסטוריית חיפושים</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  )
}

const searchResultView = optimizeHeavyScreen(SearchResultView, PlaceHolder)
const searchMain = optimizeHeavyScreen(SearchMain, PlaceHolder)
const resources = optimizeHeavyScreen(Resources, PlaceHolder)
const searchView = optimizeHeavyScreen(SearchView, PlaceHolder)
const bookNavigator = optimizeHeavyScreen(BookNavigator, PlaceHolder)



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
