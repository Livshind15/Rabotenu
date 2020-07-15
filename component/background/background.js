import * as React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

export default function Background({ children }) {
    return (
        <ImageBackground style={styles.backgroundImage} source={require('./background.png')}>
            {children}
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    backgroundImage:{
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
        resizeMode:  'stretch',
        opacity: 1
    }
    
});
