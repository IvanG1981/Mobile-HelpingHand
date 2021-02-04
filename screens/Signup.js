import React, { useState } from 'react';
import {
  TextInput,
  Text,
  Button,
  StyleSheet,
  View,
  Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { helpinghandServer } from '../utils/apihelpinghand';


export function Signup( { navigation }){
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confPassword, setConfPassword ] = useState('');

  const handleSubmit = async () => {
    if(password === confPassword ){
      try {
        const response = await helpinghandServer({
          method:'POST',
          url:`/sponsors/signup`,
          data: { email, password }
        })
        const { token } = response.data;
        await AsyncStorage.setItem('token', token );
        navigation.navigate('Recipients')
      }
      catch(err){
        Alert.alert(err.message)
        await AsyncStorage.removeItem('token')
        navigation.navigate('Home')
      }
    }
    else {
      Alert.alert("Sorry!, Password and Confirm Password fields must be equal. Try again")
    }
  }
  return(
    <View style={ styles.container }>
      <Text>Your Email: </Text>
      <TextInput
        placeholder="john@doe.com"
        onChangeText={ email => setEmail( email ) }
        autoCapitalize="none"
        value={ email }
        style={styles.input}
      />
      <Text>Your password: </Text>
      <TextInput
        placeHolder="Your password"
        onChangeText={ password => setPassword( password ) }
        value={ password }
        style={styles.input}
        secureTextEntry
      />
      <Text>Confirm your password: </Text>
      <TextInput
        placeHolder="Confirm your password"
        onChangeText={ confPassword => setConfPassword( confPassword ) }
        value={ confPassword }
        style={styles.input}
        secureTextEntry
      />
      <Button
        title="Sign Up"
        onPress={ handleSubmit }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d3e0ea',
    alignItems:'center',
    justifyContent:'center'
  },
  mainImage: {
    width: 100,
    height: 100
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    textAlign:'center',
    borderColor:'gray'
  }
});
