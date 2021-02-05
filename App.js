
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Home } from './screens/Home';
import { Signin } from './screens/Signin';
import { Signup } from './screens/Signup';
import { Recipients } from './screens/Recipients';
import { Recipient } from './screens/Recipient';
import { Contribute } from './screens/Contribute';


const Stack = createStackNavigator();

export default function App( ) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Recipients"component={Recipients}/>
        <Stack.Screen name="Recipient"component={Recipient}/>
        <Stack.Screen name="Contribute"component={Contribute}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}





