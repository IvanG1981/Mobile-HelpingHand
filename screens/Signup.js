import React, { useState } from 'react';
import { TextInput, Button, StyleSheet, View } from 'react-native';


export function Signup(){
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confPassword, setConfPassword ] = useState('');

  const handleSubmit = () => {
    console.log(email, password);
  }
  return(
    <View style={ styles.container }>
      <TextInput
        placeholder="Your email"
        onChangeText={ email => setEmail( email ) }
        value={ email }
        style={styles.input}
      />
      <TextInput
        placeHolder="Your password"
        onChangeText={ password => setPassword( password ) }
        value={ password }
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeHolder="Your password"
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
