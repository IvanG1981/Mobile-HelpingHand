import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert, Button } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { helpinghandServer } from '../utils/apihelpinghand';
import TextInput from '../components/TextInput';
import CustomButton from '../components/CustomButton';


import { useFormik } from 'formik';
import * as Yup from 'yup';

const contributeSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  number: Yup.string().min(16,'Too Short!').max(16, 'Too Long!').required('Required'),
  doc_number: Yup.string().min(8,'Too Short!').max(10,'Too Long!').required('Required'),
  exp_year: Yup.string().min(4).max(4).required('Required'),
  exp_month: Yup.string().min(2).max(2).required('Required'),
  cvc: Yup.string().min(3).max(3).required('Required'),
  amount: Yup.number().required().positive().integer().min(1000).max(200000),


})

export function Contribute( { navigation, route }){
  const [doc_type, setDoc_type] = useState('')
  const [dues, setDues] = useState('')
  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched
  } = useFormik({
    validationSchema: contributeSchema,
    initialValues: {
      name: '',
      lastName: '',
      email:'',
      number:'',
      doc_number:'',
      exp_year: '',
      exp_month: '',
      cvc:'',
      amount: 0


     },
    onSubmit: values => handleContribution(
      values.name,
      values.lastName,
      values.email,
      values.number,
      values.doc_number,
      values.exp_year,
      values.exp_month,
      values.cvc,
      values.amount,
      doc_type,
      dues
    )
  });

  const handleContribution = async (
    name,
    last_name,
    email,
    number,
    doc_number,
    exp_year,
    exp_month,
    cvc,
    value,
    doc_type,
    dues,
  ) => {
    try {
      const token = await AsyncStorage.getItem('token')
      const response = await helpinghandServer({
        method: 'POST',
        url: `/contributions/mobile/${ route.params.id }`,
        data: {
          name,
          last_name,
          email,
          number,
          doc_number,
          exp_year,
          exp_month,
          cvc,
          value,
          doc_type,
          dues,
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      navigation.navigate('Recipients')
    }
    catch(err) {
      Alert.alert('Something went wrong')
      navigation.navigate('Home')
    }
  }


  useLayoutEffect(()=> {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Log Out"
          onPress={ async ()=>
            {
              await AsyncStorage.clear()
              navigation.navigate('Home')
            }
          }
        />
      )
    })
  },[navigation]);

  useEffect(()=>{
    verifyToken();
  }, [])

  const verifyToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if(!token){
        navigation.navigate('Home')
      }
    }
    catch(err){
      setError(true)
    }
  }

  return(
    <View style={ styles.container }>
      <Text style={ styles.label }>Contributor Information</Text>
      <View style={ styles.input }>
        <TextInput
          placeholder='Enter your name'
          textContentType='name'
          autoCapitalize='none'
          autoCompleteType='name'
          keyboardAppeaance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={ handleChange('name') }
          onBlur={ handleBlur('name')}
          error={ errors.name }
          touched= { touched.name }
        />
      </View>
      <View style={ styles.input }>
        <TextInput
          placeholder='Enter your family name'
          textContentType='familyName'
          autoCapitalize='none'
          autoCompleteType='name'
          keyboardAppeaance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={ handleChange('lastName') }
          onBlur={ handleBlur('lastName')}
          error={ errors.lastName }
          touched= { touched.lastName }
        />
      </View>
      <View style={ styles.input }>
        <TextInput
            icon='email'
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
      <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: "row" }}>
        <View style={ styles.pickerContainer } >
          <RNPickerSelect
            onValueChange={(value) => setDoc_type(value)}
            placeholder={{ label:'Document Type', value: null  }}
            items={[
              { label: "CC", value: "CC"},
              { label: "CE", value: "CE"},
              { label: "PA", value: "PA"}
            ]}
          />
        </View>
        <View style={ styles.input2 }>
          <TextInput
            icon='v-card'
            placeholder='Enter your id number'
            autoCapitalize='none'
            keyboardType='number-pad'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyLabel='next'
            onChangeText={ handleChange('doc_number') }
            onBlur={ handleBlur('doc_number') }
            error={ errors.doc_number }
            touched={ touched.doc_number }
          />
        </View>
      </View>
      <Text style={ styles.label }>Credit Card Information</Text>
      <View style={ styles.input }>
        <TextInput
          icon='credit-card'
          placeholder='Enter your Credit Card Number'
          autoCapitalize='none'
          autoCompleteType='cc-number'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={ handleChange('number') }
          onBlur={ handleBlur('number') }
          error={ errors.number }
          touched={ touched.number }
        />
      </View>
      <View style={ styles.expirationDateContainer }>
        <View style={ styles.input4 }>
          <TextInput
            placeholder='YYYY'
            autoCapitalize='none'
            autoCompleteType='cc-exp-year'
            keyboardType='number-pad'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyLabel='next'
            onChangeText={ handleChange('exp_year') }
            onBlur={ handleBlur('exp_year') }
            error={ errors.exp_year }
            touched={ touched.exp_year }
          />
        </View>
        <View style={ styles.input3 }>
        <TextInput
            placeholder='MM'
            autoCapitalize='none'
            autoCompleteType='cc-exp-month'
            keyboardType='number-pad'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyLabel='next'
            onChangeText={ handleChange('exp_month') }
            onBlur={ handleBlur('exp_month') }
            error={ errors.exp_month }
            touched={ touched.exp_month }
          />
        </View>
        <View style={ styles.input3 }>
          <TextInput
            placeholder='CVC'
            autoCapitalize='none'
            autoCompleteType='cc-csc'
            keyboardType='number-pad'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyLabel='next'
            onChangeText={ handleChange('cvc') }
            onBlur={ handleBlur('cvc') }
            error={ errors.cvc }
            touched={ touched.cvc }
          />
        </View>
        <View style={ styles.duesContainer } >
          <RNPickerSelect
            onValueChange={(value) => setDues(value)}
            placeholder={{ label:'Dues', value: null  }}
            items={[
              { label: "1", value: "1"},
              { label: "2", value: "2"},
              { label: "3", value: "3"}
            ]}
          />
        </View>
      </View>
      <Text style={ styles.label }>Amount</Text>
      <View style={ styles.input }>
        <TextInput
          icon='credit'
          placeholder='Amount between $10000 and $200000'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='go'
          returnKeyLabel='go'
          onChangeText={ handleChange('amount') }
          onBlur={ handleBlur('amount') }
          error={ errors.amount }
          touched={ touched.amount }
        />
      </View>
      <CustomButton label='Send CC Info' onPress={ handleSubmit }/>
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
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#223e4b',
    borderRadius: 8,
    width: 70,
    height: 48,
    marginBottom: 14,
    marginLeft: 30

  },
  duesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    paddingRight: 20,
    paddingStart:20,
    borderWidth: 1,
    borderColor: '#223e4b',
    borderRadius: 8,
    height: 48,
    marginBottom: 14,
    marginRight: 30,


  },
  expirationDateContainer:{
    alignItems: 'center',
    justifyContent:'flex-start',
    flexDirection: 'row',
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
  },
  input2: {
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '75%',
  },
  input3: {
    flex:1,
    paddingLeft: 7,
    paddingRight: 20,
    marginBottom: 16,
  },
  input4: {
    flex:1,
    paddingHorizontal: 30,
    paddingRight: 15,
    marginBottom: 16,
  }
});
