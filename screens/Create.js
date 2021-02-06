import React from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';


export function Create(){
  return(
    <View style={ styles.container }>
      <Text>Create A New Profile: </Text>
      <TextInput/>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d3e0ea',
    alignItems:'center',
    justifyContent:'space-around'
  }
});

