import * as React from 'react';
import { StyleSheet, View,Text, TouchableOpacity } from 'react-native';

export default function TabButton({ isSelected,onPress,children}) {

    return (
            <TouchableOpacity  style={styles.tab}  underlayColor="#ffffff00" onPress={onPress}>
                <View style={[styles.tabLabel, (isSelected ? styles.active : {})]}>
                <Text style={[styles.text, (isSelected ? styles.activeText : {})]}>{children}</Text>
                </View>
                <View style={[styles.triangle, (isSelected ? styles.activeTriangle : {})]}></View>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    active: {
        backgroundColor: '#00AABE',
    },
    activeTriangle: {
        opacity: 1,
        zIndex:1
    },
    triangle:{
        opacity: 0,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth:6,
        borderBottomWidth: 8,
        marginTop:-0.1,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#00AABE',
        transform: [
          {rotate: '180deg'}
        ]
    },
    activeText:{
        color: '#fff',
        fontFamily: "OpenSansHebrewBold",

    },
    text:{
        color: '#A3A5A4',
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        fontSize: 20,
    },
    tabLabel: {
        width: '100%',
        height: '100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#CBD4D3'
    }
});