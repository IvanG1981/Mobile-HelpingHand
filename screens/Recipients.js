import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { helpinghandServer } from '../utils/apihelpinghand';

import { Card, Icon, Button, Avatar } from 'react-native-elements';



export function Recipients( { navigation, route }){
  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(false)
  const [ recipients, setRecipients ] = useState([])

  useLayoutEffect(()=> {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Log Out"
          type='clear'
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
      const response = await helpinghandServer({
        method: 'GET',
        url:`/recipients`
      })
      const { data } = response.data;
      setRecipients(data);
      setLoading(false);
    }
    catch(err) {
      setError(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    verifyToken();
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      recipientsRequest()
    }, [])
  )

  if(error) return (<Text>Something went wrong</Text>)
  if(loading) {
    return (
      <View style={ styles.container }>
        <ActivityIndicator size='large' color='#eb5e0b' />
      </View>
    )
  }
  else {
    return (
      <View style={ styles.container }>

        <Button
          title="Create new profile"
          type='clear'
          onPress={ () => navigation.navigate('Create') }
          disabled={!route.params.isAdmin}
        />
        {recipients && recipients.length >0 && (
          <FlatList
            data={recipients}
            renderItem={({ item }) => (
              <>
                <Card containerStyle={ styles.recipient }>
                  <Card.FeaturedTitle
                    style={{
                      color: 'black',
                      textAlign: 'center'
                    }}
                  >
                    { item.name }
                  </Card.FeaturedTitle>

                  <Card.Divider />

                  {
                    item.profileImage ?
                      <Card.Image
                        source={{ uri: item.profileImage }}
                        PlaceholderContent={ <ActivityIndicator size='large' color='#eb5e0b' />}
                        containerStyle={ styles.imageContainer }
                      />
                      :
                      <Avatar
                        rounded
                        size='xlarge'
                        icon={{ name:'user', type: 'font-awesome' }}
                        containerStyle={ styles.avatarContainer }
                      />
                  }

                  <Card.Divider />

                  <Text
                    ellipsizeMode='tail'
                    numberOfLines={1}
                  > {item.bio} </Text>
                  <Button
                    title='View More'
                    type='clear'
                    onPress={ () => navigation.navigate('Recipient',{ id: item._id })}
                  />
                </Card>
              </>
            )}
            keyExtractor={(item) => `${item._id}`}
          />
        )}
        <StatusBar style="auto"/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f9f9',
    alignItems:'center',
    justifyContent:'center',
    width:'100%'
  },
  recipient:{
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'column',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "gray",
    backgroundColor: '#f8f1f1',
    margin: 5,
    padding: 25,
  },
  avatarContainer: {
    backgroundColor: '#aaaaaa',
    marginLeft: 100,
    marginBottom: 16,

  },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 20,
  }
});

