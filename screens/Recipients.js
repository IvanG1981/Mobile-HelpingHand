import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Button,
  StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



export function Recipients( { navigation }){
  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(false)
  const [ recipients, setRecipients ] = useState([])

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
      const token = await AsyncStorage.getItem('token');
      if(!token){
        navigation.navigate('Home')
      }
    }
    catch(err){
      setError(true)
    }
  }

  const recipientsRequest = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: 'http://localhost:8000/recipients'
      })
      const { data } = response.data;
      setRecipients(data);
      setLoading(false);
    }
    catch(err) {
      setError(true);
    }
  }

  useEffect(() => {
    verifyToken();
  }, [])

  useEffect(() => {
    recipientsRequest();
  }, [])

  if(error) return (<Text>Something went wrong</Text>)
  if(loading) return (<ActivityIndicator size='large' color='#0000ff' />)

  return (
    <View style={ styles.container }>
      {recipients && recipients.length >0 && (
        <FlatList
          data={recipients}
          renderItem={({ item }) => (
            <View style={styles.recipient}>
              <Text> {item.name} </Text>
              <Text> {item.bio} </Text>
              <Text> {item.need} </Text>
              <Button
                title="Contribute"
                onPress={ () => navigation.navigate('Recipient',{ id: item._id })}
              />
            </View>
          )}
          keyExtractor={(item) => `${item._id}`}
        />
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

