import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Background from '../../component/background/background';

const Stack = createStackNavigator();


const BookNavigator = ({ navigation }) => {
    return (<Background>
        <View style={styles.header}>
            <HeaderButton>רשימת ספרים</HeaderButton>
            <HeaderButton>הגדרות תצוגה</HeaderButton>
            <HeaderButton>תפריטי קשר</HeaderButton>
            <HeaderButton>העתקה</HeaderButton>
        </View>
        <View style={styles.page}>

        </View>
    </Background>)
}

const HeaderButton = ({children}) => (
    <TouchableOpacity style={styles.tab} underlayColor="#ffffff00">
        <View style={[styles.tabLabel]}>
            <Text style={[styles.text]}>{children}</Text>
        </View>
    </TouchableOpacity>

)


const styles = StyleSheet.create({
    tab: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#CBD4D3',
        borderLeftWidth:2,
        borderLeftColor:'#F0F0F0'
    },

    text: {
        color: '#727575',
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        fontSize: 18,
    },
    tabLabel: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CBD4D3'
    },
    header: {
       height:50,
        flexDirection: 'row-reverse',
        width: '100%'
    },
    page: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
});

export default BookNavigator;