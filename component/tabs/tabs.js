import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import TabButton from '../tabButton/tabButton';

export default function Tabs() {
    const [tabIndex, setTabIndex] = React.useState(0)
    return (
        <View style={{ flex: 1, width: '100%', flexDirection: 'row' }}>
            <TabButton isSelected={tabIndex === 0} onPress={()=>setTabIndex(0)} text={'חיפוש מראה מקום'}></TabButton>
            <TabButton isSelected={tabIndex === 1}  onPress={()=>setTabIndex(1)} text={'תצוגת עץ'}></TabButton>
        </View>
    );
}

const styles = StyleSheet.create({

});