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
import ExploreResultView from './containers/explore/exploreResultView';
const Stack = createStackNavigator();


export default function App() {
  const [fontsLoaded] = useFonts({
    'OpenSansHebrew': require('./assets/fonts/OpenSansHebrew-Regular.ttf'),
  });
  const [isDelay, setDelay] = React.useState(false)

  const [isInitialized, setInitialized] = React.useState(false)
  React.useEffect(() => {
    if (fontsLoaded && isDelay) {
      setInitialized(true);
    }
  }, [fontsLoaded,isDelay]);
  setTimeout(() => {
    setDelay(true)
  }, 1000);


  return (
    <NavigationContainer>

      {isInitialized ? <Routes /> : <Splash />}

    </NavigationContainer>

  );
}

const Routes = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerTintColor: '#00AABE' }}>
      <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
      <Stack.Screen name="Explore" options={{ ...screenOptions, title: 'עיון' }} component={ExploreResultView} />
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
  headerRight: () => (<></>),
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    backgroundColor: '#323232'
  }
}

