import * as React from 'react';
import { StyleSheet, View, TextInput, Platform } from 'react-native';

export default function Input({options,placeholder}) {
    return (
        <View style={styles.MainContainer}>
            <TextInput
                placeholder= {placeholder}
                placeholderTextColor='#CBCBCB'
                underlineColorAndroid='transparent'
                selectionColor={'#CBCBCB'}
                underlineColorAndroid={'#FFFFFF00'}
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.TextInputStyleClass,options||[]]} />
        </View>
    );
}
const styles = StyleSheet.create({
    MainContainer: {
        width: '100%'
    },
    TextInputStyleClass: {
        ...{
            color: '#CBCBCB',
            fontFamily: "OpenSansHebrew",
            fontSize: 20,
            textAlign: 'right',
            height: 50,
            paddingHorizontal: 20,
            direction: 'rtl',
            borderRadius: 50,
            backgroundColor: "#FFFFFF",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.00,
            elevation: 1,
        }, ...(Platform.OS === 'web' ? {
            outlineWidth: 0,
            outlineColor: "transparent",
        } : {})
    }
});