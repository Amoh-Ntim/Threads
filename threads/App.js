import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NewThread from './components/NewThread';
import ViewThreads from './components/ViewThreads';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="NewThread"
          component={NewThread}
          options={{title: 'New Thread'}}
        />
        <Stack.Screen name="ViewThreads" component={ViewThreads} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 

export default App;