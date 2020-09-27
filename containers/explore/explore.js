import * as React from 'react';
import axios from "axios";
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Tabs from '../../component/tabs/tabs';
import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';
import TabButton from '../../component/tabButton/tabButton';
import Background from '../../component/background/background';
import ExploreResultView, { removeEmptyHeaders, filterTree, flattenHeaders } from './exploreResultView';
import ExploreTreeView from './exploreTreeView'
import ExploreAddReplace from './exploreAddReplace';
import BookNavigator from '../bookNavigator/bookNavigator'
import config from "../../config/config";
import { debounce } from 'lodash';


const Stack = createStackNavigator();

const { Navigator, Screen } = createMaterialTopTabNavigator();

export const getBooksByByQuery = async ([query]) => {
  const { data } = await axios.post(`${config.serverUrl}/book/find/`, { query: query });
  return (data || []).map((book, index) => {
    return { ...book, key: index }
  });
}

export const getBookTree = async (booksIds) => {
  const data = await Promise.all(booksIds.map(bookId => {
      return axios.get(`${config.serverUrl}/book/tree/${bookId}`).then(res => res.data);
  }))
  return data || [];
}

export default function Explore(props) {
  return (
    <Stack.Navigator initialRouteName="ExplorePages" >
      <Stack.Screen name="ExplorePages" options={{ headerShown: false,title:'רבותינו' }} component={ExplorePages} />
      <Stack.Screen name="Result" options={{ headerShown: false,title:'רבותינו' }} component={BookNavigator} />
    </Stack.Navigator>
  );
}

const ExplorePages = () => (
  <Navigator initialRouteName='SearchExplore' tabBar={props => <TopTabBar {...props} />}>
    <Screen name='SearchExplore' options={{title:'רבותינו' }} component={SearchExploreRoutes} />
    <Screen name='Tree'  options={{title:'רבותינו' }} component={ExploreTreeView} />
  </Navigator>
)

const TopTabBar = ({ navigation, state }) => (
  <View style={styles.tabs}>
    <Tabs selectedIndex={state.index} onSelect={index => navigation.navigate(state.routeNames[index])}>
      <TabButton>חיפוש מראה מקום</TabButton>
      <TabButton>תצוגת עץ</TabButton>
    </Tabs>
  </View>
);

const SearchExploreRoutes = () => {
  const [add, setAdd] = React.useState([{ srcInput: "", desInput: "" }]);

  const [replace, setReplace] = React.useState([{ srcInput: "", desInput: "" }]);
  const exploreAddReplace = (props) => <ExploreAddReplace initReplace={replace} initAdds={add} onSave={({ replace, add }) => {
    setAdd(add);
    setReplace(replace);
  }} {...props} />
  const exploreMain = (props) => <ExploreMain replaceInput={replace} addInput={add}  {...props} />
  const exploreResultView = (props) => <ExploreResultView replaceInput={replace} addInput={add} {...props} />
 
  return (
    <Stack.Navigator initialRouteName="Main" >
      <Stack.Screen name="ResultView" options={{ headerShown: false ,title:'רבותינו'}} component={exploreResultView} />
      <Stack.Screen name="Main" options={{ headerShown: false ,title:'רבותינו'}} component={exploreMain} />
      <Stack.Screen name="AddReplace" options={{ headerShown: false,title:'רבותינו' }} component={exploreAddReplace} />
    </Stack.Navigator>
  )
}

const ExploreMain = ({ navigation, replaceInput, addInput }) => {
  const [input, setInput] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);

  const onSearch = debounce(async (text) => {
    const newInput = replaceInput.reduce((input, currReplace) => {
      input = input.replace(currReplace.srcInput, currReplace.desInput)
      return input;
    }, text)
    const addInputs = addInput.reduce((addInput, inputToAdd) => {
      if (inputToAdd.srcInput.length && newInput.includes(inputToAdd.srcInput)) {
        addInput.push(inputToAdd.desInput)
      }
      return addInput;
    }, [])
    setLoading(true)
    const result = await getBooksByByQuery([newInput, ...addInputs])
    if (result.length === 1) {
      const tree = (await getBookTree([result[0].bookId]))[0].tree;
      const queryTree = removeEmptyHeaders(filterTree(tree, result[0].headers));
      navigation.push('ResultView', { result: flattenHeaders(queryTree, {}).map(res => { return { filters: res, ...result[0] } }), searchInput: input });

    }
    else {
      navigation.push('ResultView', { result: result, searchInput: input });
    }
    setLoading(false)

  }, 100)

  
  return (
    <Background>
      <View style={styles.page}>
        <View style={styles.input}>
          <Input onSubmit={()=>{onSearch(input)}} isLoading={isLoading} value={input} onChange={setInput} placeholder={"חיפוש חופשי"} />
        </View>
        <View style={styles.button}>
          <View style={styles.buttonWrapper}>
            <ClickButton optionsButton={{ paddingVertical: 6 }} onPress={()=>{onSearch(input)}}>חיפוש</ClickButton>
          </View>
          <TouchableOpacity
            underlayColor="#ffffff00"
            onPress={() => !isLoading && navigation.push('AddReplace')}>
            <Text style={styles.clickText}>החלפות והוספות</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  )
}


const styles = StyleSheet.create({
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
