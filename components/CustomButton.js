import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ label, onPress }){
  return(
    <TouchableOpacity
      style= { styles.button }
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text style={ styles.buttonLabel }>
        { label }
      </Text>
    </TouchableOpacity>
  );

}


const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 50,
    width: 245,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a3d2ca'
  },
  buttonLabel: {
    fontSize: 18,
    color: '#276678',
    textTransform: 'uppercase'
  }
});

