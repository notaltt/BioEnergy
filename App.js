import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './screens/Dashboard';
import History from './screens/History';
import Permission from './screens/Permission';
import CustomIconButton from './component/customButton';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Permission" component={Permission} />
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard} 
          options={({ navigation }) => ({
            headerRight: () => (
              <CustomIconButton onPress={() => navigation.navigate('History')} />
            ),
            headerBackVisible: false
          })}
        />
        <Stack.Screen name="History" component={History} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
