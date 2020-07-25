import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import Button from '../button/button';

export default function ButtonList({ optionsList }) {
    return (
        <View style={styles.container}>
            {optionsList.map((option, index) => {
                const position = (index === 0) ? 'top' : (optionsList.length - 1 === index) ? 'bottom' : 'middle';
                return <Button key={index} position={position} text={option.text} onPres={option.onPres} />
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        height: "auto",
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
