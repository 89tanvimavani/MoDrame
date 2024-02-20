import { AppEventsLogger, AEMReporterIOS } from 'react-native-fbsdk-next'
import AsyncStorage from '@react-native-async-storage/async-storage';


function setAppLaunchTracked() {
  AsyncStorage.setItem('appLaunchTracked', 'true')
}

export async function logRegister(method) {
  try {
    const noPermission = await AsyncStorage.getItem('permissionDeclined')

    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
      [AppEventsLogger.AppEventParams.RegistrationMethod]: method,
    });

    if (noPermission)
      logEventAEM(AppEventsLogger.AppEvents.CompletedRegistration, {
        [AppEventsLogger.AppEventParams.RegistrationMethod]: method,
      })
  } catch (error) {
    return error
  }
}

export async function logEventAEM(name, parameters) {
  try {
    AEMReporterIOS.logAEMEvent(name, 0, null, parameters);
  } catch (error) {
    return error
  }
}

export async function setAEMLogging() {
  try {
    AsyncStorage.setItem('permissionDeclined', 'true')

    const appLaunchTracked = await AsyncStorage.getItem('appLaunchTracked')

    if (appLaunchTracked === null) {
      setAppLaunchTracked()
      logEventAEM('fb_mobile_first_app_launch', {type: 'ios', _implicitlyLogged: 1})
      return true
    }
    return false
  } catch (error) {
    return false
  }
}
