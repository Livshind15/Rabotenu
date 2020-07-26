import * as React from 'react';

import { StyleSheet, View, TouchableOpacity, Platform, Text } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import Modal from 'modal-enhanced-react-native-web';
import MobileModal from 'react-native-modal'
import ClickButton from '../clickButton/clickButton';


export default function ErrorModel({ visible, setVisible,errorTitle,errorMsg }) {
    return Platform.OS === 'web' ? <Modal style={styles.card} onBackdropPress={() => setVisible(false)} isVisible={visible}><ModelContent errorTitle={errorTitle} errorMsg={errorMsg} setVisible={setVisible} /></Modal> :
        <MobileModal onBackdropPress={() => setVisible(false)} style={styles.card} isVisible={visible}><ModelContent errorTitle={errorTitle} errorMsg={errorMsg} setVisible={setVisible}  /></MobileModal>
}

const ModelContent = ({ errorTitle,errorMsg, setVisible }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity underlayColor="#ffffff00" onPress={() => setVisible(false)}>
                    <Icon color={'#696969'} name={'close'} size={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
               <Text style={styles.textTitle}>{errorTitle}</Text>
               <Text style={styles.text}>{errorMsg}</Text>

            </View>
            <View style={styles.buttonWrapper}>
                <ClickButton onPress={() => setVisible(false)} outline={true}>סגור</ClickButton>
            </View>
        </View>)
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        justifyContent: 'flex-end',
        paddingHorizontal: 15,
        flex: 0.3
    },
    body: {
        paddingVertical: 8,
        flex: 1,
        width: '100%',
        alignItems:'center',
        justifyContent: 'flex-start',
    },
    textTitle: {
        color: '#9E9D9D',
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'center',
        fontSize: 22
    },
    text:{
        color: '#9E9D9D',
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        paddingTop:15 ,
        fontSize: 18
    },
    card: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonWrapper: {
        width: 95,
        flex: 0.6
    },
    container: {
        alignItems: 'center',
        borderRadius: 20,
        height: 190,
        width: 380,
        backgroundColor: '#F9F9F9'
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});