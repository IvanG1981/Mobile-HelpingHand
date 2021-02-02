import React, { useState } from 'react';
import {
  TextInput,
  Text,
  Button,
  StyleSheet,
  View,
  Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export function Signin( { navigation }){
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url:`http://localhost:8000/sponsors/signin`,
        data: { email, password }
      });
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
  const handleForgotPassword = () => {
    console.log("Forget password under construction");
  }
  return(
    <View style={ styles.container }>
      <Text>Your Email: </Text>
      <TextInput
        placeholder="john@doe.com"
        onChangeText={ email => setEmail( email ) }
        autoCapitalize="none"
        value={ email }
        textContentType= "emailAddress"
        style={ styles.input }
      />
      <Text>Your Password: </Text>
      <TextInput
        onChangeText={ password => setPassword( password ) }
        textContentType="password"
        value={ password }
        style={ styles.input }
        secureTextEntry
      />

      <Button
        title="Sign In"
        onPress={ handleSubmit }
      />
      <Button
        title="Forgot your password?"
        onPress={ handleForgotPassword }
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
    // margin: 5,
    // padding: 20,
    borderWidth: 1,
    borderRadius: 5,
    textAlign:'center',
    borderColor:'gray'
  }
});
