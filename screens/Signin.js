import React, { useState } from 'react';
import { TextInput, Button, StyleSheet, View } from 'react-native';


export function Signin(){
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = () => {
    console.log(email, password);

  }
  const handleForgotPassword = () => {
    console.log("HERE");
  }
  return(
    <View style={ styles.container }>
      <TextInput
        placeholder="Your email"
        onChangeText={ email => setEmail( email ) }
        autoCapitalize="none"
        value={ email }
        textContentType= "emailAddress"
        style={ styles.input }
      />
      <TextInput
        placeHolder="Password"
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
    flex: 3,
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
