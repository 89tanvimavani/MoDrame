import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import colors, { BACKGROUND_COLOR } from '../constants/colors'
import ProfilePicture from '../screens/ProfilePicture'

const Stack = createStackNavigator()

const FollowupOnboardingStack = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{ cardStyle: {backgroundColor: BACKGROUND_COLOR} }}
    >
      <Stack.Screen 
        name="ProfilePicture"
        component={ProfilePicture}
      />
    </Stack.Navigator>
  )
}

export default FollowupOnboardingStack