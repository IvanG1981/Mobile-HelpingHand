import React ,{useState} from 'react';
import { Text, View, StyleSheet, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { helpinghandServer } from '../utils/apihelpinghand';
import TextInput from '../components/TextInput';
import CustomButton from '../components/CustomButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is Required'),
  password: Yup.string()
    .min(2,'Too Short!')
    .max(10,'Too Long!')
    .required('Password is Required'),
  confPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match' )
    .required('Required')
});



export function Signup( { navigation }){
  const [isAdmin, setIsAdmin ] = useState(false)
  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched
  } = useFormik({
    validationSchema: SignupSchema,
    initialValues: { email: '', password: '', confiPassword: '' },
    onSubmit: values => handleSignup( values.email, values.password )
  });

  const handleSignup = async ( email, password ) => {
    const userType = isAdmin ? 'admins' : 'sponsors'
    try {
      const response = await helpinghandServer({
        method:'POST',
        url:`/${userType}/signup`,
        data: { email, password }
      })
      const { token } = response.data;
      await AsyncStorage.setItem('token', token );
      navigation.navigate('Recipients', {isAdmin});
    }
    catch(err){
      console.log(err);
      Alert.alert(err.message)
      await AsyncStorage.removeItem('token')
      navigation.navigate('Home')
    }
  }

  return(
    <View style={ styles.container }>
      <Text style={ styles.label }>Sign Up</Text>
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
          autoCapitalize='none'
          autoCompleteType='password'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={ handleChange('password') }
          onBlur={ handleBlur('password') }
          error={ errors.password }
          touched={ touched.password }
          secureTextEntry
        />
      </View>
      <View style={ styles.input }>
        <TextInput
          icon='key'
          placeholder='Confirm your password'
          autoCapitalize='none'
          autoCompleteType='password'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={ handleChange('confPassword') }
          onBlur={ handleBlur('confPassword') }
          error={ errors.confPassword }
          touched={ touched.confPassword }
          secureTextEntry
        />
      </View>
      <Text style={ styles.label }>Are you Signing up as Administrator?</Text>
      <View style= { styles.switchContainer } >
        <Text style={{ padding: 5, paddingRight: 10 }}>No</Text>
        <Switch
          onValueChange={() => setIsAdmin(prevIsAdmin => !prevIsAdmin) }
          value={isAdmin}
        />
        <Text style={{ padding: 5, paddingLeft: 10 }}>Yes</Text>
      </View>
      <CustomButton label='Signup' onPress={ handleSubmit }/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f9f9',
    alignItems:'center',
    justifyContent:'center'
  },
  switchContainer:  {
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
