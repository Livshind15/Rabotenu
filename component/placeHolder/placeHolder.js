import * as React from 'react';

import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Background from '../../component/background/background';

import { Spinner } from '@ui-kitten/components';

const PlaceHolder = () => {


    return (
        <Background>

            <View style={styles.page}>
                <View style={styles.spinnerContainer}>
                    <Spinner />
                </View>
            </View>
        </Background>
    )
}

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        width: "100%",
        justifyContent: 'center',
        alignItems: "center"
    },
    page: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
    }
});

export default PlaceHolder;