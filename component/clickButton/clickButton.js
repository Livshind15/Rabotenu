import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

export default function ClickButton({ optionsButton, optionsText, outline }) {
    const styles = StyleSheet.create({
        container: {
            width: "100%",
            justifyContent: 'center',
            alignItems: 'center'
        },
        button: {
            ...{
                width: '100%',
                paddingVertical: 5,
                borderRadius: 100
            }, ...(outline ? {
                borderColor:'#00AABE',
                borderWidth:1
            } : {
                backgroundColor: '#00AABE',
            })
        },
        text: {...{
            fontFamily: "OpenSansHebrew",
            textAlign: 'center',
            fontSize: 24,
        }, ...(outline ? {
            color:'#00AABE',
        } : {
            color: '#fff',
        })},
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, optionsButton || []]}
                underlayColor="#ffffff00" >
                <Text style={[styles.text, optionsText || []]}>חיפוש</Text>
            </TouchableOpacity>
        </View>
    );
}

