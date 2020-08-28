import * as React from 'react';

import { StyleSheet, View, TouchableOpacity, Platform, Text } from 'react-native';
import Background from '../../component/background/background';
import { CheckBox } from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';
import { Radio } from '@ui-kitten/components';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';
import PlaceHolder from '../../component/placeHolder/placeHolder';

const godReplaceOption = ['יהוה', '"', "ה'", 'י-ה', 'ידוד']

const Copy = ({ onSave, navigation,title,godOption }) => {
    const [attachTitle, setAttachTitle] = React.useState(title.enable||false);
    const [subTitleOption,setSubTitleOption] = React.useState(title.position||0);
    const [subGodOption,setSubGodOption] = React.useState(godReplaceOption.findIndex(item => item === godOption)||0);

   

    return (
        <Background>
            <View style={styles.page}>
                <ScrollView style={styles.optionContainer}>
                    <Option subOptionsState={subTitleOption} setSelectedOptions={setSubTitleOption} withRadioOption={true} subOption={['לפני העתקה', 'אחרי העתקה']} customStyle={{ option: { borderWidth: 0 } }} onChange={setAttachTitle} checked={attachTitle}>הוסף כותרות להעתקה</Option>
                    {/* <Option withRadioOption={false} customStyle={{ option: { borderTopWidth: 0 } }} onChange={setComments} checked={comments}>אל תציג ציוני מפרשים והערות</Option> */}
                    <Option subOptionsState={subGodOption} setSelectedOptions={setSubGodOption} showCheckBox={false} subOption={['רגיל', '"', "ה'", 'י-ה', 'ידוד']} title={'עיצוב שם הויה'} withRadioOption={true} customStyle={{ option: { borderWidth: 0 } }} checked={true} />
                    {/* <Option withRadioOption={false} customStyle={{ option: { borderWidth: 0 } }} onChange={setDontRemove} checked={dontRemove}>אל תסיר ציוני מפרשים והערות בהעתקה</Option> */}

                </ScrollView>
                <View style={styles.bottomContainer}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                onSave({ attachTitle:{enable:attachTitle,position:subTitleOption},godReplace:godReplaceOption[subGodOption] })
                                navigation.navigate('View')
                            }}
                            underlayColor="#ffffff00" >
                            <Text style={styles.buttonText} >שמירה</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('View')
                        }
                        underlayColor="#ffffff00" >
                        <Text style={styles.clickText}>סגירה ללא שמירה</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Background>
    )
}

  
export const OptionCopy = ({ subOptionsState,setSelectedOptions, children, showCheckBox = true, checked, onChange, title, withRadioOption, subOption, customStyle = { option: {} } }) => {
    return (
        <View style={[styles.optionWrapper, customStyle.option]}>
            {title && <Text style={styles.optionTitle}>{title}</Text>}
            {showCheckBox && <TouchableOpacity
                style={[styles.option]}
                underlayColor="#ffffff00"
                onPress={() => onChange(!checked)}>
                <View style={styles.checkBoxWrapper}>
                    <CheckBox
                        checked={checked}
                        onChange={() => onChange(!checked)}>
                    </CheckBox>
                </View>
                <View style={styles.optionTitleWrapper}>
                    <Text style={styles.optionText}>{children}</Text>
                </View>
            </TouchableOpacity>}
            {withRadioOption && <View style={styles.radioOptionContainer}>
                {subOption.map((option, key) => (<TouchableOpacity key={key} underlayColor="#ffffff00" onPress={() => checked && setSelectedOptions(key)}>
                    <View style={styles.optionRadio}>
                        <Radio disabled={!checked} onChange={() => checked && setSelectedOptions(key)} checked={subOptionsState === key} />
                        <Text style={styles.optionRadioText}>{option}</Text>
                    </View>
                </TouchableOpacity>))}
            </View>}


        </View>)

}

const styles = StyleSheet.create({
    optionTitle: {
        color: '#6E6E6E',
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'right',
        paddingHorizontal: 30,
        paddingTop: 10,
        
        fontSize: 19
    },
    optionRadioText: {
        color: '#9E9D9D',
        fontFamily: "OpenSansHebrew",
        textAlign: 'right',
        paddingRight: 10,
        fontSize: 18
    },
    optionRadio: {
        height: 40,
        paddingHorizontal: 12,
        alignItems: 'center',
        flexDirection: 'row-reverse',
    },
    buttonText: {
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'center',
        fontSize: 20,
        color: '#ECECEC'
    },
    clickText: {
        color: '#5D5C5C',
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'center',
        paddingTop: 5 ,
        paddingBottom:5,
        fontSize: 18,
    },
    button: {
        width: '95%',
        height: '80%',
        paddingVertical: 5,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00AABE',
    },
    buttonContainer: {
        width: '100%',
        height: 50,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    bottomContainer: {
        flex: 0.26,
        width: "100%"
    },
    sliderWrapper: {
        flex: 1,
        width: '100%',
    },
    sliderWrapperAndText: {
        width: "100%",
        paddingHorizontal: 10,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row-reverse"
    },
    sliderContainer: {
        flex: 1,
        paddingTop: 20,
        alignSelf: 'center',
        width: '96%',
    },
    sliderTextContainer: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',

    },
    optionTextSlider: {
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'right',
        justifyContent: 'center',
        color: '#606060',
        fontSize: 21
    },
    optionContainer: {
        paddingTop: 20,
        width: '100%',
        flex: 0.8
    },
    sliderText: {
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'center',
        justifyContent: 'center',
        color: '#6F6F6F',
        fontSize: 16,
    },
    optionText: {
        fontFamily: "OpenSansHebrew",
        textAlign: 'right',
        justifyContent: 'center',
        color: '#606060',
        fontSize: 20,

    },
    optionTitleWrapper: {
        justifyContent: 'center',
        flex: 1,
    },
    page: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
    },
    checkBoxWrapper: {
        alignItems: 'center',
        width: 45
    },
    option: {
        width: '100%',
        paddingHorizontal: 20,
        height: 50,
        flexDirection: 'row-reverse',

        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOptionContainer: {
        height: 'auto',
        width: '100%',
        paddingHorizontal: 45,
    },
    optionWrapper: {
        display: 'flex',
        height: 'auto',
        width: '100%',
        borderWidth: 1,
        borderColor: '#E4E4E4'

    }
});



export default optimizeHeavyScreen(Copy,PlaceHolder);