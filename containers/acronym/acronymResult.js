import * as React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';

import Background from '../../component/background/background';
import { FlatList } from 'react-native-gesture-handler';
import { RabotenuContext } from '../../contexts/applicationContext';
// import results from './acronymResult.mock';

export default function AcronymResult({ route,navigation }) {
    const { results } = route.params;
    const {
        setShowBack,
       } = React.useContext(RabotenuContext);
    React.useEffect(() => {
        setShowBack({ enable: true, navigation })
        return () => {
            setShowBack({ enable: false, navigation: null })
        }
    }, [])
    return (
        <Background>
            <View style={styles.page}>
                <FlatList
                    data={results}
                    keyExtractor={(key, index) => index.toString()}
                    initialNumToRender={7}
                    onScrollToIndexFailed={() => { }}
                    getItemLayout={(data, index) => {
                        return { length: 80, offset: 80 * index, index }
                    }}
                    style={styles.scroll}
                    renderItem={({ item, index }) => (
                        <>
                            <View style={styles.header} key={index}>
                                <Text style={styles.headerText}>{item.key}</Text>
                            </View>
                            {item.values.map((meaning, index) => (
                                <View style={styles.meaningContainer} key={index}>
                                    <Text style={styles.headerText}>{meaning}</Text>
                                </View>
                            ))}
                        </>
                    )}
                />
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 18,
        fontFamily: "OpenSansHebrew",
        color: '#818383',
    },
    meaningContainer: {
        width: '100%',
        height: 40,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    header: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 20,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        backgroundColor: '#CBD4D3'
    },
    scroll: {
        flex: 1,
        width: '100%',
    },
    page: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
    }
});
