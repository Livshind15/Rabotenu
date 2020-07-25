import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Button({ text, onPres, position }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{ ...styles.button, ...positionStyle[position] }}
                onPress={onPres}
                underlayColor='#fff'>
                <Text style={styles.text}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
}

const positionStyle = {
    'top': {
        borderTopRightRadius: 50,
        backgroundColor: '#40b8c4'
    },
    "bottom": {
        borderBottomLeftRadius: 50,
        backgroundColor: '#40b8c4',
    },
    "middle": {
        borderRadius: 0,
        backgroundColor: '#00AABE',
    }
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        margin: 2,
    },
    button: {
        paddingVertical: 15,
    },
    text: {
        color: '#fff',
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        fontSize: 42,
    },
});
