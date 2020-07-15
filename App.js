import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useFonts } from '@use-expo/font';
import Home from './containers/home/home';
import Splash from './containers/splash/splash'
import Background from './component/background/background';



export default function App() {
  const [fontsLoaded] = useFonts({
    'OpenSansHebrew': require('./assets/fonts/OpenSansHebrew-Regular.ttf'),
  });

  const isInitialized = () => fontsLoaded;

  return (
    <View style={styles.container} >
      <Background>
        {!isInitialized ? <Splash /> : <Home/>}
      </Background>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F3F7FB',
  }
});
