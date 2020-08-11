import * as React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';


import Background from '../../component/background/background';
import ResourceTree from '../../component/resourcesTree/resourceTree';
import { flatten } from 'lodash';



const ResourcesTreeView = ({ navigation,resources,onRemoveResources=()=>{} }) => {
    return (
        <Background>

            <View style={styles.page}>
            
               <ScrollView style={styles.scroll}>
                    <ResourceTree navigation={navigation} onChange={(removeResources,resourceTree)=>{
                      const allBooks =  flatten(removeResources.map(resource => resource.booksId));
                      const groups = removeResources.filter(resource => !!resource.groupIds).map(resource => resource.groupIds)
                      const books = flatten(removeResources.filter(resource => !resource.groupIds).map(resource => resource.booksId))
                      onRemoveResources(allBooks,groups,books,resourceTree)
                    }} groups={resources} />
                </ScrollView>
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

export default ResourcesTreeView;