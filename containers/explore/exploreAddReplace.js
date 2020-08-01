import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ClickButton from '../../component/clickButton/clickButton';
import Input from '../../component/input/input'
import Icon from "react-native-vector-icons/Entypo";


import Background from '../../component/background/background';
import { ScrollView } from 'react-native-gesture-handler';

const Replace = ({ onClick, inputSrc, inputDes, onSrcChange, onDesChange }) => {
    return (
        <View style={styles.row}>
            <View style={styles.startCol}>
                <InputArea input={inputSrc} onChange={onSrcChange} title={'במקום'}></InputArea>
            </View>
            <View style={styles.centerCol}>
                <View style={styles.divider} />
            </View>
            <View style={styles.endCol}>
                <InputArea input={inputDes} withPlus={true} onChange={onDesChange} onClick={onClick} title={'חפש את'}></InputArea>
            </View>
        </View>
    )
}

const Add = ({ onClick, inputSrc, inputDes, onSrcChange, onDesChange }) => {

    return (
        <View style={styles.row}>
            <View style={styles.startCol}>
                <InputArea input={inputSrc} onChange={onSrcChange} title={'כשאחפש'}></InputArea>
            </View>
            <View style={styles.centerCol}>
                <View style={styles.divider} />
            </View>
            <View style={styles.endCol}>
                <InputArea input={inputDes} withPlus={true} onChange={onDesChange} onClick={onClick} title={'חפש גם את'}></InputArea>
            </View>
        </View>
    )
}
export default function ExploreAddReplace({ navigation,initReplace,initAdds,onSave }) {
    const [replacesElement, setReplacesElement] = React.useState([])
    const [replaces, setReplaces] = React.useState(initReplace &&initReplace.length ? initReplace:[{srcInput:"",desInput:""}])
    const [addElement, setAddElement] = React.useState([])
    const [add, setAdd] = React.useState(initAdds && initAdds.length ? initAdds:[{srcInput:"",desInput:""}])

    React.useEffect(() => {
        setReplacesElement(replaces.map((v, key) => {
            return <Replace key={key} inputSrc={v.srcInput} onSrcChange={(input) => {
                setReplaces(replaces.map((replace, index) => {
                    if (index === key) {
                        return { ...replace, srcInput: input }
                    }
                    return replace;
                }))
            }} inputDes={v.desInput} onDesChange={(input) => {
                setReplaces(replaces.map((replace, index) => {
                    if (index === key) {
                        return { ...replace, desInput: input }
                    }
                    return replace;
                }))
            }} onClick={onAddReplaces} />
        }))
    }, [replaces])
    const onAddReplaces = React.useCallback(
        () => {
            setReplaces([...replaces, { srcInput: "", desInput: '' }])
        },
        [replaces],
    )

    React.useEffect(() => {
        setAddElement(add.map((v, key) => {
            return <Add key={key} inputSrc={v.srcInput} onSrcChange={(input) => {
                setAdd(add.map((add, index) => {
                    if (index === key) {
                        return { ...add, srcInput: input }
                    }
                    return add;
                }))
            }} inputDes={v.desInput} onDesChange={(input) => {
                setAdd(add.map((add, index) => {
                    if (index === key) {
                        return { ...add, desInput: input }
                    }
                    return add;
                }))
            }} onClick={onAdd} />
        }))
    }, [add])
    const onAdd = React.useCallback(
        () => {
            setAdd([...add, { srcInput: "", desInput: '' }])
        },
        [add],
    )



    return (
        <Background>
            <View style={styles.headerContainer}>
                <Text style={styles.textHeader}>החלפות והוספות</Text>
            </View>
            <View style={styles.bodyContainer}>
                <ScrollView style={{ flex: 1, width: '100%' }}>
                    {replacesElement}
                    {addElement}
                </ScrollView>

            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.buttonWrapper}>
                    <ClickButton optionsButton={{ paddingVertical: 6 }} onPress={() => {
                        onSave({
                            replace: replaces.filter(replace => replace.desInput.length && replace.srcInput.length),
                            add: add.filter(add => add.desInput.length && add.srcInput.length),
                        })
                        navigation.goBack()
                    }}>אישור</ClickButton>
                </View>
                <TouchableOpacity
                    underlayColor="#ffffff00"
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.clickText}>סגירה ללא שמירה</Text>
                </TouchableOpacity>
            </View>

        </Background>
    );
}

const InputArea = ({ title, input, onChange = () => { }, onClick = () => { }, withPlus = false }) => {
    return (
        <View style={styles.InputArea}>
            <Text style={styles.inputTitle}>{title}</Text>
            <View style={styles.inputAndButton}>
                <View style={styles.input}>
                    <Input onChangeText={text => onChange(text)}
                        value={input} onChange={onChange} options={{ height: 32 }} placeholder={""} />
                </View>
                {withPlus && <View style={styles.plusButton}>
                    <TouchableOpacity
                        style={[styles.button]}
                        onPress={onClick}
                        underlayColor="#ffffff00"
                    >
                        <Icon name={'plus'} size={20} color={'#ffffff'}></Icon>
                    </TouchableOpacity>
                </View>}
            </View>

        </View>)
}



const styles = StyleSheet.create({
    button: {
        width: 27,
        height: 27,
        paddingVertical: 5,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00AABE',

    },
    iconWrapper: {
        flex: 1,
        width: '100%',
        backgroundColor: 'red'
    },
    inputAndButton: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center'
    },
    plusButton: {
        width: 25,
        paddingTop: 1,
        marginRight: 7,
        marginLeft: 8
    },

    inputTitle: {
        paddingBottom: 5,
        fontFamily: "OpenSansHebrew",
        fontSize: 16,
        paddingRight: 5,
        color: '#B0B0B0'
    },
    InputArea: {
        flex: 1,
        paddingRight: 5,
        justifyContent: 'center',
    },
    input: {
        alignItems: 'center',
        width: '98%',
        flex: 1,
        alignSelf: 'flex-end'
    },
    clickText: {
        color: '#11AFC2',
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        paddingTop: 14,
        fontSize: 22,
        borderBottomColor: '#11AFC2',
        borderBottomWidth: 1,
    },
    buttonWrapper: {
        width: 95
    },
    divider: {
        flex: 0.8,
        width: 1,
        backgroundColor: '#E5E5E5',
        borderRadius: 100
    },
    startCol: {
        flex: 1,
    },
    centerCol: {
        flex: 0.05,
        justifyContent: 'center',
        alignItems: 'center'
    },
    endCol: {
        flex: 1,
    },
    row: {
        flex: 1,
        flexDirection: 'row-reverse',
        paddingBottom: 2
    },
    headerContainer: {
        flex: 0.1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textHeader: {
        fontSize: 24,
        fontFamily: "OpenSansHebrewBold",
        color: '#5E5E5E',
    },
    bodyContainer: {
        flex: 0.5,
        width: '100%',
        flexDirection: 'column'

    },
    bottomContainer: {
        flex: 0.4,
        width: '100%',
        paddingTop: 20,
        alignItems: 'center'

    },
    page: {
        flex: 1,
        width: '100%',
        height: '90%',
        alignItems: 'center',
        alignContent: 'center',
    }
});
