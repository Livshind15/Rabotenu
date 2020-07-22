import * as React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Platform } from 'react-native';
import { CheckBox } from '@ui-kitten/components';

import Background from '../../component/background/background';
import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';
import results from './acronymResult.mock';

export default function AcronymResult({ }) {
    return (
        <Background>
            <View style={styles.page}>
                <ScrollView style={styles.scroll}>
                    {results.map((result, index) => (
                        <>
                            <View style={styles.header} key={index}>
                                <Text style={styles.headerText}>{result.acronym}</Text>
                            </View>
                            {result.meanings.map((meaning ,index)=> (
                                <View style={styles.meaningContainer} key={index}>
                                    <Text style={styles.headerText}>{meaning}</Text>
                                </View>
                            ))}
                        </>
                    ))}
                </ScrollView>
            </View>
        </Background>
    );
}



const styles = StyleSheet.create({
    headerText: {
        fontSize: 18,
        fontFamily: "OpenSansHebrew",
        color: '#818383',
    },
    meaningContainer:{
        width: '100%',
        height: 40,
        paddingHorizontal:20,
        justifyContent: 'center',
    },
    header: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        paddingHorizontal:20,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        backgroundColor: '#CBD4D3'
    },
    scroll: {
        flex: 1,
        width: '100%',
    },
    page: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
    }
});
