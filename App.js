import * as React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { useFonts } from '@use-expo/font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './containers/home/home';
import Splash from './containers/splash/splash';
import Explore from './containers/explore/explore';
import Logo from './component/logo/logo';
const Stack = createStackNavigator();


export default function App() {
  const [fontsLoaded] = useFonts({
    'OpenSansHebrew': require('./assets/fonts/OpenSansHebrew-Regular.ttf'),
  });

  const isInitialized = () => fontsLoaded;

  return (
    <NavigationContainer>

      {isInitialized() ? <Routes /> : <Splash />}

    </NavigationContainer>

  );
}

const Routes = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerTintColor: '#00AABE', headerStyle: { backgroundColor: '#323232' } }}>
      <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
      <Stack.Screen name="Explore" options={{ ...screenOptions, title: 'עיון' }} component={Explore} />
      <Stack.Screen name="Search" component={Home} />
      <Stack.Screen name="Acronym" component={Home} />
    </Stack.Navigator>
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
  headerRight: () => (<></>)
}

