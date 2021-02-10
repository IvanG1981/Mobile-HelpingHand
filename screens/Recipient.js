import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { helpinghandServer } from '../utils/apihelpinghand';
import { Card, Icon, Button, Avatar } from 'react-native-elements';
import  ProgressBar from 'react-native-progress/Bar';




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
      const { data } = response.data
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

  useFocusEffect(
    React.useCallback(() => {
      recipientRequest()
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
    const sackPercent = ((recipient.accumulated * 100) / recipient.need ).toFixed(1);
    const progressPercent = (sackPercent/100).toFixed(1);
    let flagColor;
    if( sackPercent < 25 ){
      flagColor = '#dc4444'
    }
    else if( sackPercent >= 25 && sackPercent < 50 ) {
      flagColor = '#f5a855'
    }
    else if( sackPercent >= 50 && sackPercent < 90 ) {
      flagColor = '#f4e557'
    }
    else {
      flagColor = '#a1dd70'
    }
    return (
      <View style={ styles.container }>
        {recipient && (
          <Card containerStyle={ styles.recipient }>
            <Card.FeaturedTitle
              style={{
                color: 'black',
                textAlign: 'center'
              }}
            >
              { recipient.name }
            </Card.FeaturedTitle>
            <Card.Divider/>
            { recipient.profileImage ?
              <Card.Image
                source={{ uri: recipient.profileImage }}
                PlaceholderContent={<ActivityIndicator size='large' color='#eb5e0b' />}
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

            <Card.Divider/>
              <Text style={{ marginBottom: 10 }}>
                { recipient.bio }
              </Text>
              <Card.Divider/>
                <Text style={ styles.goal }> Our goal is ${ recipient.need }</Text>
              <Card.Divider/>
              <View style={ styles.progressContainer }>
                <Text style= {{ padding: 5, paddingRight: 15 }} >0</Text>
                <ProgressBar
                  progress={ +progressPercent }
                  style={ styles.progress }
                />
                <Text style= {{ padding: 5, paddingLeft: 15 }} >100%  </Text>
              </View>
              <View style={ styles.accumulatedContainer }>
                <Text style={{ fontSize: 30 }}> { sackPercent } </Text>
                <Icon
                  name='percent-outline'
                  type='material-community'
                  color= { flagColor }
                  reverse
                />
              </View>
              <Card.Divider/>
              { sackPercent < 95 ?
                <Button
                  buttonStyle={ { borderRadius: 20 } }
                  type='outline'
                  raised
                  title='Contribute'
                  onPress={
                    () => navigation.navigate('Contribute', { id: recipient._id })
                  }
                />
                :
                <Card.FeaturedTitle style= { styles.goal } >
                  We have reached our goal to help { recipient.name }
                </Card.FeaturedTitle>
              }

          </Card>
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
    justifyContent:'center'
  },
  avatarContainer: {
    backgroundColor: '#aaaaaa',
    marginLeft: 90,
    marginBottom: 16,
  },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 20

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
  progressContainer: {
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row'
  },
  accumulatedContainer: {
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row',
    marginBottom: 16
  },
  progress: {
    marginBottom: 16,
    marginTop: 16,
  },
  goal: {
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: {width:-1, height:1},
    textShadowRadius: 10,
    marginBottom: 16,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#eb5e0b',
    letterSpacing: 2.5,

  }
});

