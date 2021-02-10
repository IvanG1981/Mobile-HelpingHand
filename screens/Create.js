import React, {useEffect, useState} from 'react';
import * as Permission from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Text, View, StyleSheet, StatusBar, Button, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { helpinghandServer } from '../utils/apihelpinghand';
import TextInput from '../components/TextInput';
import LargeTextInput from '../components/LargeTextInput';
import CustomButton from '../components/CustomButton';



export function Create( { navigation }){
  const [ mediaLibraryPermission, setMediaLibraryPermission ] = useState('denied');
  const [ cameraPermission, setCameraPermission ] = useState(false);
  const [ profileImage, setProfileImage ] = useState(null);
  const [ name, setName ] = useState('');
  const [ bio, setBio ] = useState('');
  const [ need, setNeed ] = useState('');
  const [ isUpdating, setIsUpdating ] = useState(false);

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
    const response = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1
    })

    setProfileImage(response)
  }
  const handleCreateProfile = async () => {
    setIsUpdating(true)
    try {
      const token = await AsyncStorage.getItem('token')
      const source= {
        ...profileImage,
        name: 'Profile.jpg'
      }
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
  if(isUpdating){
    return (
      <View style={ styles.container }>
        <ActivityIndicator size='large' color='#eb5e0b' style={{ marginBottom: 16 }} />
        <Text style={ styles.label }>...we are creating this new profile </Text>
      </View>
    )
  }
  return (
    <View style={ styles.container }>
        <Text style={ styles.label }> Profile Information </Text>
        <View style={ styles.input }>
          <TextInput
            icon='add-user'
            placeholder="Enter profile name"
            textContentType='name'
            autoCapitalize='none'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyType='next'
            onChangeText={ text => setName(text) }
            value={name}
          />
        </View>
        <View style={ styles.input2 }>
          <LargeTextInput
            icon='text'
            placeholder="Enter profile biography"
            textContentType='none'
            autoCapitalize='none'
            autoCompleteType='off'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyLabel='next'
            onChangeText={ text => setBio(text) }
            value={bio}
            multiline= {true}
            textAlignVertical='top'
            maxLength={150}
          />
        </View>
        <View style={ styles.input }>
          <TextInput
            icon='credit'
            placeholder="Enter contributions goal"
            autoCapitalize='none'
            autoCompleteType='off'
            keyBoardType='number-pad'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyLabel='next'
            onChangeText={ num => setNeed(num) }
            value={need}
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
    width: '100%',
  }
});

