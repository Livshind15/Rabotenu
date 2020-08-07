import * as React from 'react';

import { StyleSheet, View, TouchableOpacity, Platform, Text } from 'react-native';
import Slider from "react-native-slider";
import Background from '../../component/background/background';
import { CheckBox } from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';


const BookDisplay = ({onSave,navigation,setting}) => {
    const [textSize, setTextSide] = React.useState(setting.textSize);
    const [grammar, setGrammar] = React.useState(setting.grammar);
    const [exegesis,setExegesis]= React.useState(setting.exegesis);
    const [flavors,setFlavors]= React.useState(setting.flavors);


    return (
        <Background>
            <View style={styles.page}>
                <ScrollView style={styles.optionContainer}>
                    <Option checked={flavors} onChange={setFlavors} customStyle={{ option: { borderTopWidth: 0 } }}>אל תציג טעמים בכל המאגרים</Option>
                    <Option  checked={grammar} onChange={setGrammar}>אל תציג ניקוד בכל המאגרים</Option>
                    <Option  checked={exegesis} onChange={setExegesis}>אל תציג ציוני מפרשים והערות</Option>
                    <View style={styles.sliderContainer}>
                        <Text style={styles.optionTextSlider}>גודל תצוגה:</Text>
                        <View style={styles.sliderWrapperAndText}>
                            <View style={styles.sliderTextContainer}>
                                <Text style={[styles.sliderText]}>100%</Text>
                            </View>
                            <View style={styles.sliderWrapper}>
                                <Slider
                                    value={textSize}
                                    onValueChange={setTextSide}
                                    trackStyle={iosStyles.track}
                                    thumbStyle={iosStyles.thumb}
                                    minimumTrackTintColor='#00A8BD'
                                    maximumTrackTintColor='#b7b7b7'
                                />
                            </View>
                            <View style={styles.sliderTextContainer}>
                                <Text style={styles.sliderText}>0%</Text>
                            </View>

                        </View>
                    </View>
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={()=>{
                            onSave({textSize,grammar,exegesis,flavors})
                            navigation.goBack()
                            }}
                            underlayColor="#ffffff00" >
                            <Text style={styles.buttonText} >שמירה</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                    onPress={()=>navigation.goBack()}
                        underlayColor="#ffffff00" >
                        <Text style={styles.clickText}>סגירה ללא שמירה</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Background>
    )
}

const Option = ({ children,checked,onChange, customStyle = { option: {} } }) => (
    <TouchableOpacity
        style={[styles.option, customStyle.option]}
        underlayColor="#ffffff00"
        onPress={()=> onChange(!checked)}>
        <View style={styles.checkBoxWrapper}>
            <CheckBox
                checked={checked}
                onChange={()=> onChange(!checked)}>
            </CheckBox>
        </View>
        <View style={styles.optionTitleWrapper}>
            <Text style={styles.optionText}>{children}</Text>
        </View>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
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
        paddingTop: 18,
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
        height: 60,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    bottomContainer: {
        flex: 0.3,
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
        alignSelf:'center',
       width:'96%',       
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
        paddingRight: 15,
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
        height: 60,
        flexDirection: 'row-reverse',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#E4E4E4'
    }
});

const iosStyles = StyleSheet.create({
    track: {
        height: 2,
        borderRadius: 1,
    },
    thumb: {
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        shadowOpacity: 0.35,
    }
});


export default BookDisplay;