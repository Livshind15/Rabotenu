import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import logo from './logo.png';

export default function Logo({ options, onPress }) {
    const styles = StyleSheet.create({
        logo: {
            width: 35,
            height: 35,
            ...options
        },
    });
    return (
        <TouchableOpacity underlayColor="#ffffff00" onPress={onPress}>
            <Image
                style={styles.logo}
                source={logo}
                resizeMode='stretch'
            />
        </TouchableOpacity>
    );
}

