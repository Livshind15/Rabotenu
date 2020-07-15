import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import ButtonList from '../../component/buttonList/buttonList';

export default function Home() {
    return (
        <>
            <Text style={styles.text}>בחר את אופן החיפוש:</Text>
            <ButtonList optionsList={[
                { text: 'עיון', onPres: () => { } },
                { text: 'חיפוש', onPres: () => { } },
                { text: 'ראשי תיבות', onPres: () => { } }]}></ButtonList>
        </>
    );
}
const styles = StyleSheet.create({
    text: {
        color: '#767474',
        fontSize: 20,
        fontFamily: "OpenSansHebrew",
        paddingBottom: 10
    }
});