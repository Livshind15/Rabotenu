import * as React from 'react';
import { StyleSheet,ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Entypo";
import OctIcons from "react-native-vector-icons/Octicons";


import Background from '../../component/background/background';
import Accordian from '../../component/accordian/accordian';
import treeMock from './tree.mock';




const ExploreTreeView = ({ navigation }) => {

    return (
        <Background>
            <View style={styles.page}>
                <ScrollView style={styles.scroll}>
                    {treeMock.map((val, index) => <Accordian key={index} index={index} header={val.title} additionalComponent={<Icon name={'folder'} size={22} color={'#515151'} />}>
                        <View style={styles.innerScroll}>
                            {val.options.map((result, index) => <TouchableOpacity  underlayColor="#ffffff00" key={index} style={styles.resultContainer}>
                                <Text style={styles.resultText}>{result.title}</Text>
                                <OctIcons name={'book'} size={22} color={'#9AD3CE'}></OctIcons>
                            </TouchableOpacity>)}
                        </View>
                    </Accordian>)}
                </ScrollView>
            </View>

        </Background>
    )
}


const styles = StyleSheet.create({
    resultText: {
        fontSize: 16,
        paddingRight: 15,
        fontFamily: "OpenSansHebrew",
        color: '#8D8C8C',
    },
    scroll: {
        flex: 1,
        width: '100%'
    },
    innerScroll: {
        flex: 1,
        width: '100%'
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
    page: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        paddingTop: 4,
        alignContent: 'center'
    }
});

export default ExploreTreeView;