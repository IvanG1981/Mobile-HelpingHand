import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  // Button,
  StatusBar,
  TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { helpinghandServer } from '../utils/apihelpinghand';
import CustomButton from '../components/CustomButton';
import { Card, Icon, Button } from 'react-native-elements';




export function Recipient( { navigation, route }){
  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(false)
  const [ recipient, setRecipient ] = useState(null)

  useLayoutEffect(()=> {
    navigation.setOptions({
      headerRight: () => (
        <Button
          type='clear'
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
        <Card containerStyle={ styles.recipient }>
          <Card.Title>{ recipient.name } </Card.Title>
          <Card.Divider/>
            <Text style={{marginBottom: 10}}>
              { recipient.bio }
            </Text>
            <Card.Divider/>
            <Button
              type='clear'
              title='Contribute'
              onPress={
                () => navigation.navigate('Contribute', { id: recipient._id })
              }
            />
        </Card>
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
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "gray",
    backgroundColor: '#dddddd',
    margin: 5,
    padding: 25
  }
});

