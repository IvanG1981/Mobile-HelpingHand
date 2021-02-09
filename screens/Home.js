import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import { StatusBar } from 'expo-status-bar';


export function Home( { navigation }) {
  return(
    <View style={ styles.container }>
      <Text style={ { paddingBottom: 50, fontSize: 20 }}>Welcome to Helping Hand!!</Text>
      <Image
        source={ require('../images/community.png') }
        style={ styles.mainImage }
      />
      <View>
        <TouchableHighlight
            onPress={ () => navigation.navigate('Signin')}
            underlayColor="#f6f5f5"
            activeOpacity={0.3}
          >
            <View style={ styles.button }>
              <Text style= { styles.signinLink }> Sign In to your account </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={ () => navigation.navigate('Signup')}
            underlayColor="#f6f5f5"
            activeOpacity={0.3}
          >
            <View style={ styles.button }>
              <Text style= { styles.signinLink }> Sign Up, and join Helping Hand </Text>
            </View>
        </TouchableHighlight>
      </View>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f9f9',
    alignItems:'center',
    justifyContent:'space-around'
  },
  mainImage: {
    width: 100,
    height: 100
  },
  signinLink: {
    color: '#276678',
    fontSize: 20,
  },
  button: {
    alignItems: "center",
    padding: 10,
  }
});
