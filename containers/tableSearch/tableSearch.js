import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingViewComponent } from 'react-native';

import Background from '../../component/background/background';
import { ScrollView } from 'react-native-gesture-handler';
import ClickButton from '../../component/clickButton/clickButton';
import { Entypo } from '@expo/vector-icons';
import Accordian from '../../component/accordian/accordian';
import { InputWithDropdown } from '../../component/input/input';
import { searchTypes, typeToIndex } from '../search/search.common';
import { Option } from '../bookDisplay/bookDisplay';





const TableSearch = ({ onSave, navigation, tableInit }) => {
    const [tables, setTable] = React.useState(tableInit);
    const [defaultType, setDefaultType] = React.useState("");
    const [isLoading, setLoading] = React.useState(false);

    return (
        <Background>
            <View style={styles.page}>
                <ScrollView style={styles.tableView}>
                    <Accordian header={'מרכיבי השאילתא'}>
                        <ScrollView style={styles.tableViewScroll}>
                            {
                                <>
                                    {tables.map((table, index) => (
                                        <View key={index}>
                                            <Table isLoading={isLoading} key={index} tables={tables} table={table} onRemove={() => {
                                                const newTables = tables.filter((val, tableIndex) => {
                                                    return index != tableIndex
                                                });
                                                setTable([...newTables])

                                            }} setTable={(table) => {
                                                const newTable = tables;
                                                newTable[index] = table;
                                                setTable([...newTable])
                                            }}></Table>

                                            {index != tables.length - 1 && <Text style={styles.andText}>או</Text>}
                                        </View>
                                    ))}
                                    {tables.length < 5 && <View style={styles.plusButtonWrapper}>
                                        <TouchableOpacity
                                            style={[styles.plusButton]}
                                            onPress={(() => {
                                                setTable([...tables, [{ value: "", type: "exact" }]])
                                            })}
                                            underlayColor="#ffffff00"
                                        >
                                            <Entypo name={'plus'} size={20} color={'#ffffff'} />
                                        </TouchableOpacity>
                                    </View>}
                                </>
                            }
                        </ScrollView>
                    </Accordian>
                    <Accordian header={'החל על כל הרכיבים'}>
                        <Default options={searchTypes} onOptionSelect={(index) => {
                            setDefaultType(typeToIndex[index])
                        }} />
                    </Accordian>


                </ScrollView>
                <View style={styles.bottom}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={async () => {
                                if (!isLoading) {
                                    setLoading(true)
                                    await onSave(tables,defaultType, navigation);
                                    setLoading(false)
                                }

                            }}
                            underlayColor="#ffffff00" >
                            <Text style={styles.buttonText} >חפש</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Background>
    )
}
const Default = ({ options, onOptionSelect }) => {
    const [selectOption, setSelectOption] = React.useState(-1)

    return <>
        {options.map((type, key) => <Option key={key} checked={key === selectOption} onChange={(checked) => {
            if (checked) {
                onOptionSelect(key)
                setSelectOption(key);
            }
            else {
                setSelectOption(-1)
            }
        }}>{type}</Option>)}
    </>
}
const Table = ({ table, tables, setTable, isLoading, onRemove }) => {
    return (
        <View style={styles.table}>
            <View style={styles.inputsWrapper}>
                {
                    table.map((input, index) => (
                        <>
                            <View style={styles.input}>
                                <InputWithDropdown
                                    isLoading={isLoading}
                                    dropDown={{
                                        initOption: 0, options: searchTypes, onOptionSelect: (optionIndex) => {
                                            const newInput = table;
                                            newInput[index].type = typeToIndex[optionIndex];
                                            setTable([...newInput]);
                                        }
                                    }}
                                    value={input.value} onChange={(text) => {
                                        const newInput = table;
                                        newInput[index].value = text;
                                        setTable([...newInput]);
                                    }} placeholder={'חפש'} />

                            </View>
                            {index != table.length - 1 && <Text style={styles.andText}>וגם</Text>}
                        </>

                    ))
                }
            </View>
            <View style={styles.buttonsWrapper}>
                <View style={styles.buttonWrapper}>
                    <ClickButton onPress={() => {
                        setTable([...table, { value: "", type: 'exact' }])
                    }} optionsButton={{ paddingHorizontal: 5 }} outline={true} disable={table.length === 5} optionsText={{ fontSize: 16 }}>הוסף שורה</ClickButton>
                </View>
                <View style={styles.buttonWrapper}>
                    <ClickButton outline={true} onPress={() => {
                        const newInput = table;
                        newInput.pop();
                        setTable([...newInput])
                    }} disable={table.length === 1} optionsButton={{ paddingHorizontal: 5 }} optionsText={{ fontSize: 16 }}>הסר שורה</ClickButton>
                </View>
                <View style={styles.buttonWrapper}>
                    <ClickButton onPress={() => onRemove()} optionsButton={{ paddingHorizontal: 5 }} disable={tables.length === 1} outline={true} optionsText={{ fontSize: 16 }}>הסר עמודה</ClickButton>
                </View>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    plusButton: {
        width: 27,
        height: 27,
        paddingVertical: 5,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00AABE',

    },
    plusButtonWrapper: {
        width: 25,
        alignSelf: 'center',
        paddingBottom: 25,

        paddingTop: 1,
        marginRight: 7,
        marginLeft: 8
    },
    input: {
        width: '90%',
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    },
    andText: {
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'center',
        fontSize: 18,
        color: '#A0A0A0',
        paddingVertical: 8,
    },
    buttonWrapper: {
        width: "auto",
        maxWidth: 180,
        paddingHorizontal: 15,
    },
    inputsWrapper: {
        width: "100%",
        height: 'auto',
        paddingVertical: 10,
        alignItems: 'center'
    },
    buttonsWrapper: {
        width: "100%",
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row-reverse'
    },
    tableViewScroll: {
        width: '100%',

        paddingVertical: 15,
    },
    table: {
        width: '80%',
        height: "auto",
        borderWidth: 1,
        marginVertical: 15,
        borderColor: "#323232",
        alignSelf: 'center',
        borderRadius: 8
    },
    buttonContainer: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
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
    buttonText: {
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'center',
        fontSize: 20,
        color: '#ECECEC'
    },
    bottom: {
        height: 'auto',
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    tableView: {
        flex: 1,
        width: "100%"
    },
    page: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center'
    }
});

export default TableSearch;