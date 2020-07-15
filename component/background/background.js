import * as React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import background from './background.png'

export default function Background({ children }) {
    return (
        <ImageBackground  style={styles.backgroundImage} source={background}>
            {children}
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    backgroundImage:{
        flex: 1,
        width: '100%',
        height: '110%',
        justifyContent: "center",
        alignItems: "center",
        
        opacity: 1
    }
    
});
