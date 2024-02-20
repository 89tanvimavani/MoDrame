import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from '../screens/Home'
import TabBar from '../components/tab-bar/TabBar'
import Search from '../screens/Search'
import Notifications from '../screens/Notifications'
import { BACKGROUND_COLOR } from '../constants/colors'
import ProfileStack from './ProfileStack'
import TopTabs from './TopTabs'

const Tab = createBottomTabNavigator()

const Tabs = (props) => {

  return (
    <Tab.Navigator
      tabBar={data => <TabBar {...data} {...props}/>}
      sceneContainerStyle={{backgroundColor: BACKGROUND_COLOR}}
    >
      <Tab.Screen
        name="HOME"
        component={Home}
        options={{
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen
        name="NOTIFICATIONS"
        component={Notifications}
        options={{
          tabBarLabel: 'Notifications',
        }}
      />
      <Tab.Screen
        name="CHALLENGES"
        component={TopTabs}
        options={{
          tabBarLabel: 'Challenges',
        }}
      />
      <Tab.Screen
        name="SEARCH"
        component={Search}
        options={{
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen
        name="PROFILE"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile'
        }}
      />
    </Tab.Navigator>
  )
}

export default Tabs