import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';


export default function App() {
  return (
    <View style={ styles.container }>
      <Text style={ { paddingBottom: 50 }}>Hello World!!</Text>
      <Image         
        source={ require('./images/community.png') }
        style={ styles.mainImage }
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems:'center',
    justifyContent:'center'
  },
  mainImage: {
    width: 100,
    height: 100
  }
});
