import * as React from 'react';
import * as eva from '@eva-design/eva';
import 'react-native-gesture-handler';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts } from '@use-expo/font';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApplicationProvider } from '@ui-kitten/components';
import { myTheme } from './custom-theme';

import Home from './containers/home/home';
import Splash from './containers/splash/splash';
import Logo from './component/logo/logo';
import MainNavigator from './containers/mainNavigator/mainNavigator';
import { RabotenuProvider, RabotenuContext } from './contexts/applicationContext';
import Icons from "react-native-vector-icons/MaterialIcons";
import { SearchContext, SearchProvider } from './contexts/searchContext';
import config from "./config/config";
import { useAsync } from "react-async";
import axios from "axios";
import { addCheckForResources } from './containers/resources/resources';

const Stack = createStackNavigator();
export const getGroups = async () => {
  const { data } = await axios.get(`${config.serverUrl}/mapping/groups/`);
  return data || [];
}


function App() {
  const [fontsLoaded] = useFonts({
    'OpenSansHebrew': require('./assets/fonts/OpenSansHebrew-Regular.ttf'),
    'OpenSansHebrewBold': require('./assets/fonts/OpenSansHebrew-Bold.ttf'),

  });
  const [isDelay, setDelay] = React.useState(false)
  const {  setResources,setData,allResourceToggle } = React.useContext(SearchContext);
  const { data, error, isPending } = useAsync({ promiseFn: getGroups })

  const [isInitialized, setInitialized] = React.useState(false)
  React.useEffect(() => {
    if (fontsLoaded && isDelay && !isPending) {
      setInitialized(true);
    }
  }, [fontsLoaded, isDelay,isPending]);
  setTimeout(() => {
    setDelay(true)
  }, 1500);
  React.useEffect(() => {
    if (data && data.length) {
      if(allResourceToggle){
        setResources(addCheckForResources(data, true))
      }
      setData(data)
    }
  }, [data]);


  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...myTheme }}>
      <NavigationContainer>
        {isInitialized ? <Routes /> : <Splash />}
      </NavigationContainer>
    </ApplicationProvider>
  );
}
export default () =>
  <SearchProvider>
    <RabotenuProvider>
      <App />
    </RabotenuProvider>
  </SearchProvider>


const Routes = (props) => {
  const { title, showBack } = React.useContext(RabotenuContext);

  return (
    <>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerTintColor: '#00AABE' }}>
        <Stack.Screen name="Home" options={{ headerShown: false,title: 'רבותינו'   }} component={Home} />
        <Stack.Screen name="Main" options={(props) => {
          return {
            ...screenOptions,
            headerRight: () => showBack.enable ? <TouchableOpacity  underlayColor="#ffffff00" style={{ marginRight: 12 }} onPress={() => {
              if (showBack.navigation) {
                showBack.navigation.goBack()
              }
            }} ><Icons name={'keyboard-arrow-right'} size={35} color={'#00AABE'} /></TouchableOpacity> : <></>,

            title,
          }
        }} component={MainNavigator} />
      </Stack.Navigator>
    </>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F3F7FB',
  },
  headerTitle: {
    textAlign: "center",
    flex: 1,
    fontFamily: "OpenSansHebrew",
  }
});

const screenOptions = {
  headerTitleStyle: styles.headerTitle,
  headerLeft: ({ onPress }) => <Logo options={{ marginLeft: 12 }} onPress={onPress} />,


  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    backgroundColor: '#323232'
  }
}

