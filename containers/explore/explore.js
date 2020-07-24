import * as React from 'react';
import { useAsync } from "react-async";

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import axios from "axios";

import Tabs from '../../component/tabs/tabs';
import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';
import TabButton from '../../component/tabButton/tabButton';
import Background from '../../component/background/background';
import ExploreResultView from './exploreResultView';
import ExploreTreeView from './exploreTreeView'
import ExploreAddReplace from './exploreAddReplace';
import BookNavigator from '../bookNavigator/bookNavigator'
import config from "../../config/config";


const Stack = createStackNavigator();

const { Navigator, Screen } = createMaterialTopTabNavigator();

export const getBooksByByBookName = async (bookName) => {
    const { data } = await axios.get(`${config.serverUrl}/mapping/books/book/${bookName}`);
    return (data || []).map((book,index) => {
      return {...book,key:index}
    });
}


export default function Explore(props) {

  return (
    <Stack.Navigator initialRouteName="ExplorePages" >
      <Stack.Screen name="ExplorePages" options={{ headerShown: false }} component={ExplorePages} />
      <Stack.Screen name="Result" options={{ headerShown: false }} component={BookNavigator} />
    </Stack.Navigator>
  );
}

const ExplorePages = () => (
  <Navigator initialRouteName='SearchExplore' tabBar={props => <TopTabBar {...props} />}>
    <Screen name='SearchExplore' component={SearchExploreRoutes} />
    <Screen name='Tree' component={ExploreTreeView} />
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

const SearchExploreRoutes = () => (
  <Stack.Navigator initialRouteName="Main" >
    <Stack.Screen name="ResultView" options={{ headerShown: false }} component={ExploreResultView} />
    <Stack.Screen name="Main" options={{ headerShown: false }} component={ExploreMain} />
    <Stack.Screen name="AddReplace" options={{ headerShown: false }} component={ExploreAddReplace} />
  </Stack.Navigator>
)

const ExploreMain = ({ navigation }) => {
  const [input, setInput] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);

  return (
    <Background>
      <View style={styles.page}>
        <View style={styles.input}>
          <Input isLoading={isLoading} value={input} onChange={setInput} placeholder={"חיפוש חופשי"} />
        </View>
        <View style={styles.button}>
          <View style={styles.buttonWrapper}>
            <ClickButton optionsButton={{ paddingVertical: 6 }} onPress={async () => {
              if (!isLoading) {
                setLoading(true)
                const result = await getBooksByByBookName(input);
                setLoading(false)
                navigation.push('ResultView', { result: result, searchInput: input });
              }
            }}>חיפוש</ClickButton>
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
