import { createStackNavigator } from '@react-navigation/stack';
import { inject, observer} from 'mobx-react';
import React from 'react'
import { BACKGROUND_COLOR } from '../constants/colors';
import Challenge from '../screens/Challenge';
import ClaimReward from '../screens/ClaimReward';
import RewardClaimed from '../screens/RewardClaimed';
import SinglePost from '../screens/SinglePost';
import Posts from '../screens/Posts';
import Profile from '../screens/Profile';
import PostVideo from '../screens/PostVideo';
import PostSubmitted from '../screens/PostSubmitted';
import AddBorderToPost from '../screens/AddBorderToPost';
import FollowupOnboardingStack from './FollowupOnboardingStack';
import OnboardingStack from './OnboardingStack';
import ChallengeSubmitted from '../screens/ChallengeSubmitted';
import Verification from '../screens/Verification';
import Tabs from './Tabs';
import ChannelStack from './ChannelStack';
import UpdateApp from '../screens/UpdateApp';
import Rules from '../screens/Rules';

const Stack = createStackNavigator();

const MainStack = (props) => {
  const { authStore, accountStore, homeStore, guiStore } = props.store

  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{ cardStyle: {backgroundColor: BACKGROUND_COLOR} }}
    >
      { guiStore.outdatedApp ?
        <Stack.Screen 
          name="UpdateApp"
          component={UpdateApp}
        /> 
      : authStore.authenticated ?
        <>    
          {authStore.followupOnboarding &&
            <Stack.Screen 
              name="FollowupOnboarding"
              component={FollowupOnboardingStack}
            />
          }
          <Stack.Screen 
            name="Tabs">
            { props => 
              <Tabs 
                {...props} 
                seenChallengesScreen={homeStore.seenChallengesScreen}
                avatar={accountStore.user?.avatar?.url}/>
            }
          </Stack.Screen>
          <Stack.Screen 
            name="Verification"
            component={Verification}
          />
          <Stack.Screen 
            name="PublicProfile"
            component={Profile}
          />
          <Stack.Screen 
            name="Challenge"
            component={Challenge}
          />
          <Stack.Screen 
            name="PostVideo"
            component={PostVideo}
          />
          <Stack.Screen 
            name="SinglePost"
            component={SinglePost}
          />
          <Stack.Screen 
            name="Posts"
            component={Posts}
          />
          <Stack.Screen 
            name="ClaimReward"
            component={ClaimReward}
          />
          <Stack.Screen 
            name="RewardClaimed"
            component={RewardClaimed}
          />
          <Stack.Screen 
            name="PostSubmitted"
            component={PostSubmitted}
          />
          <Stack.Screen 
            name="AddBorderToPost"
            component={AddBorderToPost}
          />
          <Stack.Screen 
            name="ChallengeSubmitted"
            component={ChallengeSubmitted}
          />
          <Stack.Screen 
            name="ChannelStack"
            component={ChannelStack}
          />
          <Stack.Screen 
            name="Rules"
            component={Rules}
          />
        </>
      :
        <Stack.Screen 
          name="Onboarding"
          component={OnboardingStack}

        />
      }
    </Stack.Navigator>
  )
}

export default inject('store')(observer(MainStack))