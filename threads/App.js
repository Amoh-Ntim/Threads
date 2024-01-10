import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NewThread from './components/NewThread';
import ViewThreads from './components/ViewThreads';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DeleteThread from './components/DeleteThread';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
    <Tab.Navigator screenOptions={{
          headerShown: false,  // This line hides the header
        }}>
      <Tab.Screen 
        name="NewThread" 
        component={NewThread} 
        options={{
          tabBarIcon: ({ size }) => (
            <Image 
              style={{ width: size, height: size }} 
              source={require('../threads/assets/Write.png')} 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="ViewThreads" 
        component={ViewThreads} 
        options={{
          tabBarIcon: ({ size, focused, color }) => (
            <Image 
              style={{ width: size, height: size}} 
              source={require('../threads/assets/Activity.png')} 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="DeleteThread" 
        component={DeleteThread} 
      />
    </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;