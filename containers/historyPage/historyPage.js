import * as React from 'react';
import Icon from "react-native-vector-icons/AntDesign";

import { StyleSheet, FlatList, View, TouchableOpacity, Text } from 'react-native';
import Background from '../../component/background/background';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';
import PlaceHolder from '../../component/placeHolder/placeHolder';
import { RabotenuContext } from '../../contexts/applicationContext';
import { Spinner } from '@ui-kitten/components';




const SearchHistory = ({ navigation, history, onRemove, onSelect }) => {
    const { setShowBack } = React.useContext(RabotenuContext);
    const [isLoading, setLoading] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(-1);

    React.useEffect(() => {
        setShowBack({ enable: true, navigation })
        return () => {
            setShowBack({ enable: false, navigation: null })
        }
    }, [])

    return (
        <Background>
            <View style={styles.page}>
                <Text style={styles.pageTitle}>{`הסטוריית חיפושים`}</Text>

                <FlatList
                    data={history || []}
                    keyExtractor={(key, index) => index.toString()}
                    initialNumToRender={7}
                    onEndReachedThreshold={0.5}
                    onScrollToIndexFailed={() => { }}
                    getItemLayout={(data, index) => {
                        return { length: 60, offset: 60 * index, index }
                    }}
                    style={styles.scroll}
                    renderItem={({ item, index }) => <TouchableOpacity onPress={async () => {
                        if (!isLoading) {
                            setLoading(true);
                            setSelectedIndex(index)
                            await onSelect(index)
                            setLoading(false);
                            setSelectedIndex(-1)
                        }
                    }} underlayColor="#ffffff00">
                        <View key={index} style={styles.searchContainer}>
                            <Text style={styles.search}>{item.searchInput}</Text>
                            {selectedIndex === index && isLoading ? <Spinner /> : <TouchableOpacity onPress={() => onRemove(index)} underlayColor="#ffffff00">
                                <Icon color={'#47BBB2'} name={'close'} size={20} />
                            </TouchableOpacity>}
                        </View>
                    </TouchableOpacity>
                    }
                />
            </View>
        </Background>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
    },
    search: {
        color: '#8D8D8D',
        fontFamily: "OpenSansHebrew",
        paddingRight: 10,
        fontSize: 20,
    },
    pageTitle: {
        fontFamily: "OpenSansHebrewBold",
        fontSize: 26,
        padding: 20,
        color: '#47BBB2',
        textAlign: 'center'
    },
    scroll: {
        flex: 1,
        width: '100%'
    },
    searchContainer: {
        width: '100%',
        height: 60,
        paddingHorizontal: 25,
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        borderColor: '#DCDCDC',
        borderWidth: 1
    },
});

export default optimizeHeavyScreen(SearchHistory, PlaceHolder);