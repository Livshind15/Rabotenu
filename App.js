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

const Stack = createStackNavigator();


export default function App() {
  const [fontsLoaded] = useFonts({
    'OpenSansHebrew': require('./assets/fonts/OpenSansHebrew-Regular.ttf'),
    'OpenSansHebrewBold': require('./assets/fonts/OpenSansHebrew-Bold.ttf'),

  });
  const [isDelay, setDelay] = React.useState(false)

  const [isInitialized, setInitialized] = React.useState(false)
  React.useEffect(() => {
    if (fontsLoaded && isDelay) {
      setInitialized(true);
    }
  }, [fontsLoaded, isDelay]);
  setTimeout(() => {
    setDelay(true)
  }, 1500);


  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...myTheme }}>
      <NavigationContainer>
        <RabotenuProvider>
          {isInitialized ? <Routes /> : <Splash />}
        </RabotenuProvider>
      </NavigationContainer>
    </ApplicationProvider>
  );
}

const Routes = (props) => {
  const { title, showBack } = React.useContext(RabotenuContext);

  return (
    <>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerTintColor: '#00AABE' }}>
        <Stack.Screen name="Home" options={{ headerShown: false, title }} component={Home} />
        <Stack.Screen name="Main" options={(props) => {
          return {
            ...screenOptions,
            headerRight: () => showBack.enable ? <TouchableOpacity style={{marginRight:12}}  onPress={() => {
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

