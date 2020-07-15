import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useFonts } from '@use-expo/font';
import Home from './containers/home/home';
import Background from './component/background/background';



export default function App() {
  let [fontsLoaded] = useFonts({
    'OpenSansHebrew': require('./assets/fonts/OpenSansHebrew-Regular.ttf'),
  });

  return (
    <View style={styles.container} >
      <Background>
        {fontsLoaded &&
          <Home />
        }
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
