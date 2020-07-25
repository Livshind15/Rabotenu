import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Tabs({ children, selectedIndex = 0, onSelect = (index) => { } }) {
    return (
        <View style={{ flex: 1, width: '100%', flexDirection: 'row' }}>
            {React.Children.map(children, (child, index) => (
                React.cloneElement(child, {
                    key: index,
                    isSelected: selectedIndex === index,
                    onPress: () => {
                        onSelect(index)
                    }
                })
            ))}
        </View>
    );
}

const styles = StyleSheet.create({});