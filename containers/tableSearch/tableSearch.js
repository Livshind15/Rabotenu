import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Background from '../../component/background/background';
import { ScrollView } from 'react-native-gesture-handler';
import ClickButton from '../../component/clickButton/clickButton';
import Input from '../../component/input/input';
import Icon from "react-native-vector-icons/Entypo";


const TableSearch = ({ onSave, navigation, tableInit }) => {
    const [tables, setTable] = React.useState(tableInit)
    const [isLoading, setLoading] = React.useState(false);

    return (
        <Background>
            <View style={styles.page}>
                <View style={styles.tableView}>
                    <ScrollView style={styles.tableViewScroll}>
                        {
                            <>
                                {tables.map((table, index) => (
                                    <>
                                        <Table isLoading={isLoading} tables={tables} table={table} onRemove={() => {
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
                                    </>
                                ))}
                                {tables.length < 5 && <View style={styles.plusButtonWrapper}>
                                    <TouchableOpacity
                                        style={[styles.plusButton]}
                                        onPress={(() => {
                                            setTable([...tables, [{ value: "" }]])
                                        })}
                                        underlayColor="#ffffff00"
                                    >
                                        <Icon name={'plus'} size={20} color={'#ffffff'}></Icon>
                                    </TouchableOpacity>
                                </View>}
                            </>
                        }
                    </ScrollView>
                </View>
                <View style={styles.bottom}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={async () => {
                              if(!isLoading){
                                setLoading(true)
                                await onSave(tables, navigation);
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

const Table = ({ table, tables, setTable,isLoading, onRemove }) => {
    return (
        <View style={styles.table}>
            <View style={styles.inputsWrapper}>
                {
                    table.map((input, index) => (
                        <>
                            <View style={styles.input}>
                                <Input isLoading={isLoading} value={input.value} onChange={(text) => {
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
                        setTable([...table, { value: "" }])
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
        width: '80%',
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