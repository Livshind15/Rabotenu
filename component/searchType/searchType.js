import * as React from 'react';

import { StyleSheet, View, TouchableOpacity, Platform, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import Modal from 'modal-enhanced-react-native-web';
import ClickButton from '../../component/clickButton/clickButton';
import { Radio } from '@ui-kitten/components';
import MobileModal from 'react-native-modal'
import { ScrollView } from 'react-native-gesture-handler';



export default function SearchTypeModel({ visible, setVisible, options, onOptionChange,currSelect }) {
    return Platform.OS === 'web' ? <Modal style={styles.card} onBackdropPress={() => setVisible(false)} isVisible={visible}><ModelContent currSelect={currSelect} onOptionChange={onOptionChange} options={options} setVisible={setVisible} /></Modal> :
        <MobileModal onBackdropPress={() => setVisible(false)} style={styles.card} isVisible={visible}><ModelContent currSelect={currSelect} options={options} setVisible={setVisible} onOptionChange={onOptionChange} /></MobileModal>
}

const ModelContent = ({ setVisible, options, onOptionChange, currSelect }) => {
    const [selectedOptions, setSelectedOptions] = React.useState(currSelect);
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity underlayColor="#ffffff00" onPress={() => setVisible(false)}>
                    <AntDesign color={'#696969'} name={'close'} size={20} />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.options}>
                {options.map((option, key) => (
                    <TouchableOpacity underlayColor="#ffffff00" onPress={() => {
                        setSelectedOptions(key)
                        onOptionChange(key)
                    }}>
                        <View style={styles.option}>
                            <Radio onChange={() => {
                                setSelectedOptions(key)
                                onOptionChange(key)
                            }} checked={selectedOptions === key} />

                            <View style={styles.textWrapper}>
                                <Text style={styles.optionTextTitle}>{option.title}</Text>
                                <Text style={styles.optionText}>{option.description}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

            </ScrollView>
            <View style={styles.buttonWrapper}>
                <ClickButton onPress={() => setVisible(false)} outline={true}>סגור</ClickButton>
            </View>
        </View>)
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        justifyContent: 'center',
        paddingHorizontal: 15,
        flex: 0.12
    },
    textWrapper: {
        flex: 1,
        width: '100%'
    },
    options: {
        paddingVertical: 8,
        flex: 1,
        width: '100%',
    },
    optionTextTitle: {
        color: '#9E9D9D',
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'right',
        paddingRight: 10,
        fontSize: 18,
        marginTop: -2,
    },
    optionText: {
        color: '#9E9D9D',
        fontFamily: "OpenSansHebrew",
        textAlign: 'right',
        paddingRight: 10,
        fontSize: 18
    },
    option: {
        height: 'auto',
        width: '100%',
        padding: 5,
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        borderBottomColor: "#DDDDDD",
        alignItems: 'flex-start',
        flexDirection: 'row-reverse'
    },
    card: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonWrapper: {
        width: 95,
        alignItems: 'center',
        flex: 0.16
    },
    container: {
        alignItems: 'center',
        borderRadius: 20,
        height: 520,
        width: 410,
        backgroundColor: '#F9F9F9'
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});