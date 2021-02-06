import React, {useState} from 'react';
import { Text, View, StyleSheet, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { helpinghandServer } from '../utils/apihelpinghand';
import TextInput from '../components/TextInput';
import CustomButton from '../components/CustomButton';

import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(2,'Too Short!')
    .max(10, 'Too Long!')
    .required('Required')
})

export function Signin( { navigation }){
  const [ isAdmin, setIsAdmin ] = useState(false)
  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched
  } = useFormik({
    validationSchema: LoginSchema,
    initialValues: { email: '', password: '' },
    onSubmit: values => handleSignin( values.email, values.password )
  });

  const handleSignin = async ( email, password ) => {
    if(!isAdmin) {
      try {
        const response = await helpinghandServer({
          method:'POST',
          url:`/sponsors/signin`,
          data: { email, password }
        })
        const { token } = response.data;
        await AsyncStorage.setItem('token', token );
        navigation.navigate('Recipients', { isAdmin } )
      }
      catch(err){
        Alert.alert('Please sign in with a registered email address')
        await AsyncStorage.removeItem('token')
        navigation.navigate('Home')
      }
    }
    else {
      try {
        const response = await helpinghandServer({
          method:'POST',
          url:`/admins/signin`,
          data: { email, password }
        })
        const { token } = response.data;
        await AsyncStorage.setItem('token', token );
        navigation.navigate('Recipients', { isAdmin } )
      }
      catch(err){
        Alert.alert('Please sign in with a registered email address')
        await AsyncStorage.removeItem('token')
        navigation.navigate('Home')
      }
    }
  }

  const handleForgotPassword = () => {
    console.log("Forget password under construction");
    console.log('Admin state', isAdmin );
  }
  return(
    <View style={ styles.container }>
      <Text style={ styles.label }>Login</Text>
      <View style={ styles.input }>
        <TextInput
          icon='mail'
          placeholder='Enter your email'
          autoCapitalize='none'
          autoCompleteType='email'
          keyboardType='email-address'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={ handleChange('email') }
          onBlur={ handleBlur('email') }
          error={ errors.email }
          touched={ touched.email }
        />
      </View>
      <View style={ styles.input }>
        <TextInput
          icon='key'
          placeholder='Enter your password'
          secureTextEntry
          autoCompleteType='password'
          autoCapitalize='none'
          keyboardAppearance='dark'
          returnKeyType='go'
          returnKeyType='go'
          onChangeText={ handleChange('password') }
          onBlur={ handleBlur('password') }
          error={ errors.password }
          touched={ touched.password }
        />
      </View>
      <Text style={ styles.label }>Are you the Administrator?</Text>
      <View style= { styles.switchContainer } >
        <Text style={{ padding: 5, paddingRight: 10 }}>No</Text>
        <Switch
          onValueChange={() => setIsAdmin(prevIsAdmin => !prevIsAdmin) }
          value={isAdmin}
        />
        <Text style={{ padding: 5, paddingLeft: 10 }}>Yes</Text>
      </View>
            <CustomButton label='Login' onPress={ handleSubmit }/>
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
  switchContainer:  {
    // flex: 2,
    flexDirection: 'row',
    textAlign: 'center',
  },
  label: {
    color: '#5eaaa8',
    fontSize: 20,
    marginBottom: 16
  },
  input: {
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%',
  }
});
