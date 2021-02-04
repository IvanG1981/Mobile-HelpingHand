import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Button,
  StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { helpinghandServer } from '../utils/apihelpinghand';



export function Recipient( { navigation, route }){
  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(false)
  const [ recipient, setRecipient ] = useState(null)

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

  const recipientRequest = async () => {
    try {
      const response = await helpinghandServer({
        method: 'GET',
        url:`/recipients/${route.params.id}`
      })
      const { data } = response.data;
      setRecipient(data);
      setLoading(false);
    }
    catch(err) {
      setError(true);
    }
  }

  useEffect(()=> {
    verifyToken();
  }, [])

  useEffect(()=> {
    recipientRequest();
  },[])


  if(error) return (<Text>Something went wrong</Text>)
  if(loading) return (<ActivityIndicator size='large' color='#0000ff' />)

  return (
    <View style={ styles.container }>
      {recipient && (
        <View style={ styles.recipient }>
          <Text>{recipient.name}</Text>
          <Text>{recipient.bio}</Text>
          <Text>{recipient.need}</Text>
        </View>
      )}
      <StatusBar style="auto"/>
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
  recipient:{
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 5,
    borderWidth:1,
    borderColor: "gray",
    margin: 5,
    padding: 25
  }
});

