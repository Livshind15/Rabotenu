import * as React from 'react';
import { StyleSheet, TouchableOpacity,View,Text } from 'react-native';

export default function ClickButton() {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                underlayColor="#ffffff00" >
                <Text style={styles.text}>חיפוש</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        margin: 3,
        justifyContent:'center',
        alignItems:'center'
    },
    button: {
        width:'28%',

        paddingVertical: 5,
        backgroundColor:'#00AABE',
        borderRadius:100

    },
    text: {
        color: '#fff',
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        fontSize: 24,
    },
});