
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import './rn-deprecated-features'
import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Store from './context/store';
import { Provider } from 'mobx-react'
import { persist } from 'mst-persist'
import MainStack from './navigation/MainStack';
import { BACKGROUND_COLOR } from './constants/colors';
import Toast from 'react-native-toast-message';
import Error from './components/toast/Error';
import Info from './components/toast/Info';
import NotificationHandler from './components/notification-handler/NotificationHandler';
import DynamicLinkHandler from './components/dynamiclink-handler/DynamicLinkHandler';
import AppStateListener from './components/app-state-listener/AppStateListener';
import { env } from './config';
import SplashScreen from 'react-native-splash-screen'
import { navigationRef } from './navigation/RootNavigation';
import GuiOverlays from './components/gui-overlays/GuiOverlays';
import { Settings } from 'react-native-fbsdk-next';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const store = Store.create({})

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, [])

  useEffect(() => {
    persist(`modrama-strg-${env.ENV}`, store, {
      storage: AsyncStorage,
      jsonify: true,
      blacklist: ['onboardingStore', 'guiStore']
    }).then(() => {
      store.set('hydrated', true)
      Settings.initializeSDK()
      store.authStore.set('loading', false)
      if(store.authStore.authenticated) {
        store.getInitialData()
      }

      SplashScreen.hide()
    })
  }, [store])

  const toastConfig = {
    error: ({ text1, text2, props, ...rest }) => 
      <Error 
        text1={text1}
        text2={text2}
      />,
    info: ({ text1, text2, props, ...rest }) => 
      <Info 
        text1={text1}
        text2={text2}
      />
  }

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <SafeAreaProvider>
        <StatusBar 
          barStyle="light-content"
          backgroundColor={BACKGROUND_COLOR}
        />
        <Provider store={store}>
          <NavigationContainer ref={navigationRef}>
            <GuiOverlays />
            <MainStack />
            <Toast 
              config={toastConfig}
              ref={(ref) => Toast.setRef(ref)} 
            />
            <AppStateListener />
            <NotificationHandler />
            <DynamicLinkHandler />
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>
    </View>
  );
};


export default App;
