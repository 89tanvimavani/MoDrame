import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Verification from '../screens/Verification'
import PasswordReset from '../screens/PasswordReset'
import PasswordResetSendCode from '../screens/PasswordResetSendCode'
import Welcome from '../screens/Welcome'
import colors, { BACKGROUND_COLOR } from '../constants/colors'

const Stack = createStackNavigator()

const OnboardingStack = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: {
          backgroundColor: BACKGROUND_COLOR
        }     
      }}
    >
      <Stack.Screen 
        name="Welcome"
        component={Welcome}
      />
      <Stack.Screen 
        name="Register"
        component={Register}
      />
      <Stack.Screen 
        name="Login"
        component={Login}
      />
      <Stack.Screen 
        name="Verification"
        component={Verification}
      />
      <Stack.Screen 
        name="PasswordResetSendCode"
        component={PasswordResetSendCode}
      />
      <Stack.Screen 
        name="PasswordReset"
        component={PasswordReset}
      />
    </Stack.Navigator>
  )
}

export default OnboardingStack