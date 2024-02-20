import { inject, observer } from 'mobx-react'
import React, {useEffect} from 'react'
import { AppState } from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import {PERMISSIONS, RESULTS, request, check} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAEMLogging } from '../../services/log-event-service';
import { Settings } from 'react-native-fbsdk-next';

const AppStateListener = (props) => {

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange)
    const unsubscribe = NetInfo.addEventListener(handleNetInfoChange);

    return () => {
      subscription.remove()
      unsubscribe()
    }
  }, [])

  function handleAppStateChange(change) {
    updateStoreState(change)
    handlePermissions(change)
  }

  function handlePermissions(change) {
    if (change === 'active' && Platform.OS === 'ios') {
      AsyncStorage.setItem('permissionDeclined', 'true')
      check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
      .then(res => {
        if (res === RESULTS.DENIED) {
          request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
          .then(res => {
            if (res === RESULTS.GRANTED) {
              Settings.setAdvertiserTrackingEnabled(true).then(() => {
                Settings.initializeSDK()
                Settings.setAutoLogAppEventsEnabled(true)
              });
              AsyncStorage.setItem('permissionDeclined', 'false')
            } else return setAEMLogging()
          }).catch(err => {
            throw err
          })
        } else if (res !== RESULTS.BLOCKED && res !== RESULTS.DENIED) {
          Settings.setAdvertiserTrackingEnabled(true).then(() => {
            Settings.initializeSDK()
            Settings.setAutoLogAppEventsEnabled(true)
          });
        } else if (res === RESULTS.DENIED || res === RESULTS.BLOCKED) {
          Settings.setAdvertiserTrackingEnabled(false)
          Settings.setAutoLogAppEventsEnabled(false)
        }
      })
    } else if (Platform.OS === 'android') {
      AsyncStorage.setItem('permissionDeclined', 'false')
      Settings.initializeSDK()
      Settings.setAdvertiserTrackingEnabled(true)
      Settings.setAutoLogAppEventsEnabled(true)
    }
  }

  function updateStoreState(change) {
    switch(change) {
      case 'background':
        triggerBackground()
        break;
      case 'active':
        triggerActive()
        break;
    }
  }

  function triggerBackground() {
    props.store.guiStore.set('background', true)
    props.store.accountStore.postViews()
  }

  function triggerActive() {
    props.store.guiStore.set('background', false)
    props.store.accountStore.getWinningDramas()
    props.store.settingsStore.checkSupported()
    props.store.guiStore.set('connected', true)
  }

  function handleNetInfoChange(state) {
    props.store.guiStore.set('connected', state.isConnected)
  } 

  return null
}

export default inject('store')(observer(AppStateListener))