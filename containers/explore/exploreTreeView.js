import * as React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import config from "../../config/config";
import { useAsync } from "react-async";
import axios from "axios";


import Background from '../../component/background/background';
import ExploreTree from '../../component/exploreTree/exploreTree';
import { Spinner } from '@ui-kitten/components';
import ErrorModel from '../../component/modalError/modalError';
import PlaceHolder from '../../component/placeHolder/placeHolder';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';

function removeNulls(obj) {
    var isArray = obj instanceof Array;
    for (var k in obj) {
      if (obj[k] === null) isArray ? obj.splice(k, 1) : delete obj[k];
      else if (typeof obj[k] == "object") removeNulls(obj[k]);
      if (isArray && obj.length == k) removeNulls(obj);
    }
    return obj;
  }
const getGroups = async () => {
    const { data } = await axios.get(`${config.serverUrl}/mapping/groups/`);
    return  JSON.parse(JSON.stringify(data))||[]
    return data || [];
}

const ExploreTreeView = ({ navigation }) => {
    const { data, error, isPending } = useAsync({ promiseFn: getGroups })
    const [showErrorModel, setShowErrorModel] = React.useState(false);
    React.useEffect(()=>{
        if(error){
            setShowErrorModel(true);
        }
    },[error])
    return (
        <Background>
            <ErrorModel errorMsg={"שגיאה בבקשה מהשרת של תצוגת עץ"} errorTitle={'שגיאה'} visible={showErrorModel} setVisible={setShowErrorModel} />

            <View style={styles.page}>
                {!isPending &&data&& data.length ? <ScrollView style={styles.scroll}>
                    <ExploreTree navigation={navigation} groups={data} />
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

 export default  optimizeHeavyScreen(ExploreTreeView,PlaceHolder);