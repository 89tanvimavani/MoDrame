import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import colors, { BACKGROUND_COLOR } from '../constants/colors'
import Channel from '../screens/Channel'
import UpdateBioChannel from '../screens/UpdateBioChannel'
import UpdateWebsiteChannel from '../screens/UpdateWebsiteChannel'
import ChannelList from '../screens/ChannelList'
import UploadChannelPost from '../screens/UploadChannelPost'

const Stack = createStackNavigator()

const ChannelStack = () => {
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
        name="Channel"
        component={Channel}
      />
      <Stack.Screen 
        name="ChannelList"
        component={ChannelList}
      />
      <Stack.Screen 
        name="UpdateBioChannel"
        component={UpdateBioChannel}
      />
      <Stack.Screen 
        name="UpdateWebsiteChannel"
        component={UpdateWebsiteChannel}
      />
      <Stack.Screen 
        name="UploadChannelPost"
        component={UploadChannelPost}
      />
    </Stack.Navigator>
  )
}

export default ChannelStack