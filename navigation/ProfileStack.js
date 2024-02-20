import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import colors, { BACKGROUND_COLOR } from '../constants/colors'
import Profile from '../screens/Profile'
import Settings from '../screens/Settings'
import UpdateName from '../screens/UpdateName'
import UpdateUsername from '../screens/UpdateUsername'
import UpdatePhone from '../screens/UpdatePhone'
import UpdateEmail from '../screens/UpdateEmail'
import UpdateBio from '../screens/UpdateBio'
import UpdateWebsite from '../screens/UpdateWebsite'

const Stack = createStackNavigator()

const ProfileStack = () => {
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
        name="Profile"
        component={Profile}
      />
      <Stack.Screen 
        name="Settings"
        component={Settings}
      />
      <Stack.Screen 
        name="UpdateName"
        component={UpdateName}
      />
      <Stack.Screen 
        name="UpdateUsername"
        component={UpdateUsername}
      />
      <Stack.Screen 
        name="UpdatePhone"
        component={UpdatePhone}
      />
      <Stack.Screen 
        name="UpdateEmail"
        component={UpdateEmail}
      />
      <Stack.Screen 
        name="UpdateBio"
        component={UpdateBio}
      />
      <Stack.Screen 
        name="UpdateWebsite"
        component={UpdateWebsite}
      />
    </Stack.Navigator>
  )
}

export default ProfileStack