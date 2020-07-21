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
                    {results.map((result ,index)=> (
                    <View style={styles.header} key={index}>
                        <Text>{result.acronym}</Text>
                    </View>
                    ))}
                </ScrollView>
            </View>
        </Background>
    );
}



const styles = StyleSheet.create({
    header:{
        width:'100%',
        height:20,
        backgroundColor:'red'

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
