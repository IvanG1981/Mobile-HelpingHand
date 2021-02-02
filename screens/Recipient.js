import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Button,
  StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



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


  useEffect(()=> {
    AsyncStorage.getItem('token')
                                .then(token => {
                                  if(!token){
                                    navigation.navigate('Home')
                                  }
                                })
                                .catch(err => {
                                  setError(true);
                                })
  }, [])

  useEffect(()=> {
    axios({
      method: 'GET',
      baseURL:`http://localhost:8000/recipients/`,
      url:`/${route.params.id}`
    })
      .then(( response )  => {
        const { data } = response.data;
        setRecipient(data)
      })
      .then(() => setLoading(false))
      .catch(err => {
        console.log(err);
      })
  }, [])

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

