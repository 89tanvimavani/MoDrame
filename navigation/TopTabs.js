import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import TopTabBar from '../components/tab-bar/TopTabBar'
import Challenges from '../screens/Challenges'
import { BACKGROUND_COLOR } from '../constants/colors'

const Tab = createMaterialTopTabNavigator()

const TopTabs = (props) => {

  return (
    <Tab.Navigator
      tabBar={data => <TopTabBar {...data} {...props}/>}
      sceneContainerStyle={{backgroundColor: BACKGROUND_COLOR}}
    >
      <Tab.Screen
        name="VERSUZ"
        component={Challenges}
        options={{
          tabBarLabel: 'Versuz challenges',
        }}
      />
      <Tab.Screen
        name="YOUR_CHALLENGES"
        component={Challenges}
        options={{
          tabBarLabel: 'Your challenges',
        }}
      />
    </Tab.Navigator>
  )
}

export default TopTabs