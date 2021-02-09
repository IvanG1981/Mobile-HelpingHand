import React from 'react';
import { TextInput as RNTextInput, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
// import { Entypo as Icon } from '@expo/vector-icons';

export default function TextInput( { icon, error, touched, ...otherProps }) {
  const validationColor = !touched ? '#223e4b' : error ? '#FF5A5F' : '#223e4b'
  const styles = StyleSheet.create({
    inputBox: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 48,
      borderRadius: 8,
      borderColor: validationColor,
      borderWidth: StyleSheet.hairlineWidth,
      borderWidth: 1,
      padding: 8
    }
  });

  return(
    <View style={ styles.inputBox }>
      <View style={{ padding: 8 }}>
        <Icon name={ icon } color={ validationColor } size={ 16 }/>
      </View>
      <View style={{ flex: 1}}>
        <RNTextInput
          underlineColorAndroid= 'transparent'
          placeholderTextColor='rgba(34,62,75,0.7)'
          {...otherProps}
        />
      </View>
    </View>
  )
}


