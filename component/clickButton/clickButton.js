import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

export default function ClickButton({ disable, optionsButton, optionsText, outline, children, onPress = () => { } }) {
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
                borderRadius: 100,
                justifyContent: 'center',
            }, ...(outline ? {
                borderColor: '#00AABE',
                borderWidth: 1
            } : {
                    backgroundColor: '#00AABE',
                }), ...(disable && outline ? {
                    borderColor: '#8C8C8C',
                    borderWidth: 1
                } : {}), ...(disable && !outline ? {
                    backgroundColor: '#8C8C8C',
                } : {})
        },
        text: {
            ...{
                fontFamily: "OpenSansHebrew",
                textAlign: 'center',
                fontSize: 24,
            }, ...(outline ? {
                color: '#00AABE',
            } : {
                    color: '#fff',
                }), ...(disable && outline ? {
                    color: '#8C8C8C',
                } : {}), ...(disable && !outline ? {
                    color: '#fff',
                } : {})
        },
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, optionsButton || []]}
                underlayColor="#ffffff00"
                disabled={disable}
                onPress={onPress}>
                <Text style={[styles.text, optionsText || []]}>{children}</Text>
            </TouchableOpacity>
        </View>
    );
}

