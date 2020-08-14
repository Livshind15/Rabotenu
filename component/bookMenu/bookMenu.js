import * as React from 'react';

import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Background from '../../component/background/background';
import Accordian from '../accordian/accordian';
import OctIcons from "react-native-vector-icons/Octicons";

import { Spinner } from '@ui-kitten/components';
import { flatten } from 'lodash';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';
import PlaceHolder from '../placeHolder/placeHolder';

const BookMenu = ({ data, onBookSelect, navigation,isPending }) => {
    return (
        <Background>

            <View style={styles.page}>
                {!isPending && data  && data.child? <ScrollView style={styles.pageScroll}>
                    <Accordian initExpanded={true}  header={'מפרשים'} >
                        {flatten(data.child.map((item, key) => (
                         
                                <TouchableOpacity onPress={() => {
                                    onBookSelect(item.bookId,data.info)
                                    navigation.navigate('View')
                                }} key={key} underlayColor="#ffffff00" style={[styles.resultContainer, { paddingRight: 50 }]}>
                                    <Text style={styles.resultText}>{item.groupName.replace('_','"')}</Text>
                                    <OctIcons name={'book'} size={22} color={'#9AD3CE'}></OctIcons>
                                </TouchableOpacity>
                            )))}

                    </Accordian>
                </ScrollView> : <View style={styles.spinnerContainer}>
                        <Spinner />
                    </View>}

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
    resultText: {
        fontSize: 16,
        paddingRight: 15,
        paddingBottom: 2,
        fontFamily: "OpenSansHebrew",
        color: '#8D8C8C',
    },
    resultContainer: {
        height: 40,
        paddingLeft: 25,
        paddingRight: 60,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderColor: '#E4E4E4'
    },

    pageScroll: {
        width: '100%'
    },
    page: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
    },
    scroll: {
        flex: 1,
        width: '100%'
    },
});

export default optimizeHeavyScreen(BookMenu,PlaceHolder);