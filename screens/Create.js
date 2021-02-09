import React, {useEffect, useState} from 'react';
import * as Permission from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Text, View, StyleSheet, StatusBar, Button, Alert } from 'react-native';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { helpinghandServer } from '../utils/apihelpinghand';
import TextInput from '../components/TextInput';
import CustomButton from '../components/CustomButton';

// import { useFormik } from 'formik';
// import * as Yup from 'yup';

// const createProfileSchema = Yup.object().shape({
//   name: Yup.string().email('Invalid email').required('Required'),
//   bio: Yup.string().min(10).max(240).required(),
//   need: Yup.number().required().positive().integer().min(10000).max(200000)
// })

export function Create( { navigation }){
  const [ mediaLibraryPermission, setMediaLibraryPermission ] = useState('denied');
  const [ cameraPermission, setCameraPermission ] = useState(false);
  const [ profileImage, setProfileImage ] = useState(null);
  const [ name, setName ] = useState('');
  const [ bio, setBio ] = useState('');
  const [ need, setNeed ] = useState('');
  // const {
  //   handleChange,
  //   handleSubmit,
  //   handleBlur,
  //   values,
  //   errors,
  //   touched
  // } = useFormik({
  //   validationSchema: createProfileSchema,
  //   initialValues: { name: '', bio:'', need: 0 },
  //   onSubmit: values => handleCreateProfile(
  //     values.name,
  //     values.bio,
  //     values.need,
  //   )
  // });


  useEffect(() => {
    Permission
      .askAsync(Permission.MEDIA_LIBRARY)
      .then(( { status } ) => setMediaLibraryPermission(status))
    Permission
      .askAsync(Permission.CAMERA)
      .then(( { status } ) =>  setCameraPermission(status === 'granted'))
  }, [])

  async function pickImage(){
    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    })

    setProfileImage(response);


  }
  async function takeImage(){
    const data = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1
    })

    setProfileImage(data)
  }
  const handleCreateProfile = async () => {
    console.log('HERE HANDLECREATEPROFILE');
    try {
      const token = await AsyncStorage.getItem('token')
      const source= {
        ...profileImage,
        name: 'Profile.jpg'
      }
      console.log('source', source);
      const data = new FormData();
      data.append('name', name);
      data.append('bio', bio);
      data.append('need', need);
      if(profileImage) {
          data.append('profileImage', source )
      }
      const response = await helpinghandServer({
        method: 'POST',
        url: '/recipients',
        data,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      navigation.navigate('Recipients');
    }
    catch(err) {
      Alert.alert('Something went wrong')
      navigation.navigate('Home')
    }
  }

  if( mediaLibraryPermission === 'denied' && !cameraPermission ){
    return (
      <View style={ styles.container }>
        <Text>You don't have permissions</Text>
        <StatusBar style="auto"/>
      </View>
    )
  }
  return (
    <View style={ styles.container }>
        <Text style={ styles.label }> Profile Information </Text>
        <View style={ styles.input }>
          <TextInput
            icon='alphabetical-variant'
            placeholder="Enter profile name"
            textContentType='name'
            autoCapitalize='none'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyType='next'
            onChangeText={ text => setName(text) }
            value={name}
            // onBlur={ handleBlur('name') }
            // errors={ errors.name }
            // touched={ touched.name }
          />
        </View>
        <View style={ styles.input2 }>
          <TextInput
            icon='bio'
            placeholder="Enter profile biography"
            textContentType='none'
            autoCapitalize='none'
            autoCompleteType='off'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyLabel='next'
            onChangeText={ text => setBio(text) }
            value={bio}
            // onBlur={ handleBlur('bio') }
            // error={ errors.bio }
            // touched={ touched.bio }
          />
        </View>
        <View style={ styles.input }>
          <TextInput
            icon='creditsack-percent'
            placeholder="Enter contributions goal"
            autoCapitalize='none'
            autoCompleteType='off'
            keyBoardType='number-pad'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyLabel='next'
            onChangeText={ num => setNeed(num) }
            value={need}
            // onBlur={ handleBlur('need') }
            // error={ errors.need }
            // touched={ touched.need }
          />
        </View>
        <Button
          title="Open camera"
          onPress={ takeImage }
        />
        {profileImage && (
          <Image
            style={ styles.image }
            source={{ uri: profileImage.uri}}
          />
        )}
        <Button
          title="Add Image to profile"
          onPress={ pickImage }
        />
        <CustomButton
          label="Create Profile"
          onPress={ handleCreateProfile }
        />
        <StatusBar style="auto"/>
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
  label: {
    color: '#5eaaa8',
    fontSize: 20,
    marginBottom: 16
  },
  image: {
    width: 200,
    height: 100
  },
  input: {
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%'
  },
  input2: {
    paddingHorizontal: 32,
    paddingVertical:50,
    marginBottom: 16,
    width: '100%'
  }
});

