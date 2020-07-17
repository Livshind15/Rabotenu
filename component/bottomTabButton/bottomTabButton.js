import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';


export default function BottomTabButton({ isSelected, onPress, children, Icon }) {

  return (
    <TouchableOpacity style={styles.tab} underlayColor="#ffffff00" onPress={onPress}>
      <View style={[styles.tabLabel, (isSelected ? styles.active : {})]}>
        <Icon fill={isSelected ? '#EEEEED' : "#504F4F"} width={25} height={25}></Icon>
        <Text style={[styles.text, (isSelected ? styles.activeText : {})]}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  active: {
    backgroundColor: '#504F4F',
  },
  activeText: {
    color: '#EEEEED',
  },
  text: {
    color: '#504F4F',
    fontFamily: "OpenSansHebrewBold",
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 16,
  },
  tabLabel: {
    width: '100%',
    height: '100%',
    padding:5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderWidth: 0.5,
    borderColor: '#CCCCCC'
  }
});