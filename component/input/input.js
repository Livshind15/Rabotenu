import * as React from 'react';
import { StyleSheet, View, TextInput, Platform } from 'react-native';
import { Spinner } from '@ui-kitten/components';


export default function Input({ options, placeholder, value, onChange, isLoading }) {
    return (
        <View style={styles.MainContainer}>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor='#CBCBCB'
                    underlineColorAndroid='transparent'
                    selectionColor={'#CBCBCB'}
                    underlineColorAndroid={'#FFFFFF00'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={text => onChange(text)}
                    value={value}
                    style={[styles.TextInputStyleClass, options || []]} />
            </View>
            {isLoading && <View style={styles.spinnerContainer}>
                <Spinner/>
            </View>}

        </View>
    );
}
const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        width: '100%',
    },
    spinnerContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 40,
    },
    MainContainer: {
        width: '100%',
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
        flexDirection: 'row-reverse'
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
        }, ...(Platform.OS === 'web' ? {
            outlineWidth: 0,
            outlineColor: "transparent",
        } : {})
    }
});