import * as React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import config from "../../config/config";
import { useAsync } from "react-async";
import axios from "axios";


import Background from '../../component/background/background';
import ExploreTree from '../../component/exploreTree/exploreTree';
import { Spinner } from '@ui-kitten/components';
import ErrorModel from '../../component/modalError/modalError';


const getBookTree = async (booksIds) => {
    const data = await Promise.all(booksIds.map(bookId => {
        return axios.get(`${config.serverUrl}/book/tree/${bookId}`).then(res => res.data);
    }))
    return data || [];
}
const getGroups = async () => {
    const { data } = await axios.get(`${config.serverUrl}/mapping/groups/`);
    return JSON.parse(JSON.stringify(data)) || []
}

const ExploreTreeView = ({ navigation }) => {
    const { data, error, isPending } = useAsync({ promiseFn: getGroups })
    const [showErrorModel, setShowErrorModel] = React.useState(false);
    const cache = {};
    const getBookInfo = async (bookId) => {
        if (cache[bookId]) {
            return cache[bookId]
        }
        const res = await getBookTree([bookId]);
        cache[bookId] = res;
        return res;
    }
    React.useEffect(() => {
        if (error) {
            setShowErrorModel(true);
        }
    }, [error])
    return (
        <Background>
            <ErrorModel errorMsg={"שגיאה בבקשה מהשרת של תצוגת עץ"} errorTitle={'שגיאה'} visible={showErrorModel} setVisible={setShowErrorModel} />

            <View style={styles.page}>
                {!isPending && data && data.length ? <ScrollView style={styles.scroll}>
                    <ExploreTree getBookInfo={getBookInfo} navigation={navigation} groups={data} />
                </ScrollView> : <View style={styles.spinnerContainer}>
                        <Spinner />
                    </View>}
            </View>
        </Background>
    )
}


const styles = StyleSheet.create({
    resultText: {
        fontSize: 16,
        paddingRight: 15,
        fontFamily: "OpenSansHebrew",
        color: '#8D8C8C',
    },
    spinnerContainer: {
        flex: 1,
        width: "100%",
        justifyContent: 'center',
        alignItems: "center"
    },
    scroll: {
        flex: 1,
        width: '100%'
    },
    innerScroll: {
        flex: 1,
        width: '100%'
    },
    resultContainer: {
        height: 40,
        paddingLeft: 25,
        paddingRight: 60,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderColor: '#E4E4E4'
    },
    page: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        paddingTop: 4,
        alignContent: 'center'
    }
});

export default ExploreTreeView;