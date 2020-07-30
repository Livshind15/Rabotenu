import * as React from 'react';

import { StyleSheet, View, TouchableOpacity, Platform, Text } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import Modal from 'modal-enhanced-react-native-web';
import MobileModal from 'react-native-modal'
import Button from '../button/button';


export default function SearchOptionsModel({ visible, setVisible, openSearchType,onResources }) {
    return Platform.OS === 'web' ? <Modal style={styles.card} onBackdropPress={() => setVisible(false)} isVisible={visible}><SearchOptions onResources={onResources} openSearchType={openSearchType} setVisible={setVisible} /></Modal> :
        <MobileModal onBackdropPress={() => setVisible(false)} style={styles.card} isVisible={visible}><SearchOptions onResources={onResources} openSearchType={openSearchType} setVisible={setVisible} /></MobileModal>
}

const SearchOptions = ({ setVisible, openSearchType,onResources }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity underlayColor="#ffffff00" onPress={() => {setVisible(false)}}>
                    <Icon color={'#696969'} name={'close'} size={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.body}>

                <Button onPres={() => {
                    setVisible(false)
                    openSearchType();
                }} customStyle={{ button: { padding: 25 }, text: { fontSize: 30 } }} position={'top'} text={'סוג חיפוש לבחירה'} />
                <Button onPres={() => {
                    setVisible(false)
                    onResources();
                }}  customStyle={{ button: { padding: 25, backgroundColor: '#239EA1' }, text: { fontSize: 30 } }} position={'bottom'} text={'בחר מאגרים לחיפוש'} />

            </View>
            
        </View>)
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        justifyContent: 'flex-end',
        paddingHorizontal: 15,
        flex: 0.12
    },
    container: {
        flex: 1,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        paddingVertical: 8,
        flex: 1,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textTitle: {
        color: '#9E9D9D',
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'center',
        fontSize: 22
    },
    text: {
        color: '#9E9D9D',
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        paddingTop: 15,
        fontSize: 18
    },
    card: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        alignItems: 'center',
        borderRadius: 20,
        height: 350,
        width: 300,
        backgroundColor: '#F9F9F9'
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});