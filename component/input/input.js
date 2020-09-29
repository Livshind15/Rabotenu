import * as React from 'react';
import { StyleSheet, View, TextInput, Platform, Text, TouchableOpacity } from 'react-native';
import { Spinner, OverflowMenu, MenuItem } from '@ui-kitten/components';
import { MaterialIcons } from '@expo/vector-icons';
import { CheckBox } from '@ui-kitten/components';


export default function Input({ options,onFocus=()=>{} , placeholder, value, onSubmit = () => { }, onChange, isLoading }) {
    return (
        <View style={styles.MainContainer}>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor='#CBCBCB'
                    underlineColorAndroid='transparent'
                    selectionColor={'#CBCBCB'}
                    underlineColorAndroid={'#FFFFFF00'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={onFocus}
                    onKeyPress={(e) => e.nativeEvent.key === 'Enter' ? onSubmit() : () => { }}
                    onChangeText={text => onChange(text)}
                    value={value}
                    style={[styles.TextInputStyleClass, options || []]} />
            </View>
            {isLoading && <View style={styles.spinnerContainer}>
                <Spinner />
            </View>}

        </View>
    );
}


export function InputWithDropdown({ options, placeholder, value, onSubmit = () => { }, onChange, isLoading, dropDown }) {
    const [expanded, setExpanded] = React.useState(false);
    const [option, selectedOption] = React.useState(dropDown.initOption);

    return (
        <OverflowMenu
            style={{ marginTop: 5, width: 300 }}
            anchor={() => <View style={styles.MainContainer}>
                {
                    <TouchableOpacity style={styles.toggleContainer} onPress={() => setExpanded(!expanded)} underlayColor="#ffffff00">
                        <MaterialIcons name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} color={option === -1 ? '#A0A0A0' : "#00AABE"} size={30} />
                    </TouchableOpacity>
                }
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder={placeholder}
                        placeholderTextColor='#CBCBCB'
                        underlineColorAndroid='transparent'
                        selectionColor={'#CBCBCB'}
                        underlineColorAndroid={'#FFFFFF00'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onKeyPress={(e) => e.nativeEvent.key === 'Enter' ? onSubmit() : () => { }}
                        onChangeText={text => onChange(text)}
                        value={value}
                        style={[styles.TextInputStyleClass, options || []]} />
                </View>

                {isLoading && <View style={styles.spinnerContainer}>
                    <Spinner />
                </View>}
            </View>}
            visible={expanded}

            onBackdropPress={() => setExpanded(false)}>
            {dropDown.options.map((type, index) => {
                return <MenuItem key={index} style={{ flexDirection: 'row-reverse' }} accessoryLeft={() => {
                    return <View style={{ flexDirection: 'row-reverse' }}><CheckBox onChange={(checked) => {
                        if (checked) {
                            selectedOption(index);
                            dropDown.onOptionSelect(index);
                        }
                        else {
                            selectedOption(-1)
                        }
                    }} checked={index === option} style={{ paddingLeft: 20 }} /><Text>{type}</Text></View>
                }}></MenuItem>
            })}
        </OverflowMenu>

    );
}




const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        width: '100%',
    },
    toggleContainer: {
        justifyContent: 'center',
        alignItems: "flex-start",
        width: 40,
    },
    spinnerContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 40,
    },
    MainContainer: {
        width: '100%',
        borderRadius: 50,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
        flexDirection: 'row-reverse'
    },
    TextInputStyleClass: {
        ...{
            color: '#CBCBCB',
            fontFamily: "OpenSansHebrew",
            fontSize: 20,
            textAlign: 'right',
            height: 50,
            paddingHorizontal: 20,
            direction: 'rtl',
        }, ...(Platform.OS === 'web' ? {
            outlineWidth: 0,
            outlineColor: "transparent",
        } : {})
    }
});