
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Accordian({ children,onExpanded =()=>{},   shouldExpanded = true, header, initExpanded = false, endToggle = false, customStyles = { container: {} }, additionalComponent, index }) {
    const [expanded, setExpanded] = React.useState(initExpanded);
    const accordian = React.useRef(null);

    React.useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, [])

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded)
        onExpanded(!expanded);
    }

    return (
        <View>
            <TouchableOpacity underlayColor="#ffffff00" ref={accordian} style={[styles.row, index === 0 ? { borderTopWidth: 1 } : {}, customStyles.container || {}]} onPress={() => toggleExpand()}>
                { !endToggle && additionalComponent && <View style={styles.additionalComponent}>
                    {additionalComponent}
                </View>}
                {endToggle && shouldExpanded && <Icon name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} color={'#A0A0A0'} size={30} />}
                <View style={styles.toggleAndText}>
                    
                    <Text style={[styles.title, styles.font, expanded && shouldExpanded ? styles.titleBold : {}]}>{header}</Text>
                    {!endToggle && shouldExpanded&&  <Icon name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} color={'#A0A0A0'} size={30} />}
                </View>
                    {additionalComponent && endToggle && <View style={styles.additionalComponentStart}>
                        {additionalComponent}
                    </View>} 
            </TouchableOpacity>
            <View style={styles.parentHr} />
            {
                expanded &&
                <View style={styles.child}>
                    {children}
                </View>
            }
        </View>
    );
}
const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        marginBottom: 4,
        paddingRight: 5,
        fontFamily: "OpenSansHebrew",
        color: '#919191',
    },
    titleBold: {
        fontFamily: "OpenSansHebrewBold",
    },
    toggleAndText: {
        flex: 1,
        alignItems: 'center',
        width: '100%',   
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    additionalComponent: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
    },
    additionalComponentStart: {
        width:'auto',
        height: '100%',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        paddingLeft: 25,
        paddingRight: 18,
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderColor: '#E4E4E4'
    },
    parentHr: {
        height: 1,
        width: '100%'
    },
    child: {
        backgroundColor: '#EAEAEA',
    }
});