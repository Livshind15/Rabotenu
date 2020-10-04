import * as React from 'react';

import { StyleSheet, View, TouchableOpacity, Platform, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import Modal from 'modal-enhanced-react-native-web';
import ClickButton from '../../component/clickButton/clickButton';
import { Radio } from '@ui-kitten/components';
import MobileModal from 'react-native-modal'
import optionsList from './acronym.model.options';


export default function AcronymModal({ visible, setVisible,onOptionsSelected,selectedOptions }) {
    return Platform.OS === 'web' ? <Modal style={styles.card} onBackdropPress={() => setVisible(false)} isVisible={visible}><ModelContent onOptionsSelected={onOptionsSelected} selectedOptions={selectedOptions} setVisible={setVisible} options={optionsList} /></Modal> :
        <MobileModal onBackdropPress={() => setVisible(false)} style={styles.card} isVisible={visible}><ModelContent  onOptionsSelected={onOptionsSelected} setVisible={setVisible} selectedOptions={selectedOptions}  options={optionsList} /></MobileModal>
}

const ModelContent = ({ options, setVisible,onOptionsSelected,selectedOptions }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity underlayColor="#ffffff00" onPress={() => setVisible(false)}>
                    <AntDesign color={'#696969'} name={'close'} size={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.options}>
                {options.map((option, key) => (
                    <TouchableOpacity underlayColor="#ffffff00" onPress={() => onOptionsSelected(key)}>
                        <View key={key} style={styles.option}>
                            <Radio onChange={() => onOptionsSelected(key)} checked={selectedOptions === key} />
                            <Text style={styles.optionText}>{option.text}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.buttonWrapper}>
                <ClickButton onPress={() => setVisible(false)} outline={true}>אישור</ClickButton>
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
    options: {
        paddingVertical: 8,
        flex: 1,
        width: '100%',
        justifyContent: 'center',
    },
    optionText: {
        color: '#9E9D9D',
        fontFamily: "OpenSansHebrew",
        textAlign: 'right',
        paddingRight: 10,
        fontSize: 18
    },
    option: {
        height: 40,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#DDDDDD",
        alignItems: 'center',
        flexDirection: 'row-reverse',
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
        height: 180,
        width: 380,
        backgroundColor: '#F9F9F9'
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});