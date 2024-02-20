import { inject, observer } from 'mobx-react';
import {
  useEffect
} from 'react'
import OneSignal from 'react-native-onesignal';
import { NOTIFICATION_TYPES } from '../../constants/types';
import { navigate } from '../../navigation/RootNavigation';


const NotificationHandler = (props) => {
  useEffect(() => {
    OneSignal.setAppId("78095585-f884-402c-82a4-e96088b73ae1");
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    OneSignal.promptForPushNotificationsWithUserResponse(response => {});
    OneSignal.setNotificationOpenedHandler(openNotification);
    OneSignal.setInAppMessageClickHandler(event => {});
    OneSignal.addEmailSubscriptionObserver((event) => {});
    OneSignal.addSubscriptionObserver(subscriptionObserver);
    OneSignal.addPermissionObserver(permissionObserver);

    getDeviceState()
  }, [])

  function getDeviceState() {
    OneSignal.getDeviceState()
      .then(deviceState => {
        props.store.set('oneSignalId', deviceState.userId)
        props.store.accountStore.setOneSignalId()
      })
  }

  function openNotification(data) {
    const {type} = data.notification.additionalData

    switch (type) {
      case NOTIFICATION_TYPES.NEW_RESPONSE:
        openDrama(data.notification.additionalData?.dramaId)
        break;
      case NOTIFICATION_TYPES.BIRTHDAY_WINNER:
        openDrama(data.notification.additionalData?.dataId)
        break;
      case NOTIFICATION_TYPES.BIRTHDAY_CHALLENGE:
      case NOTIFICATION_TYPES.NEW_CHALLENGE:
      case NOTIFICATION_TYPES.CH_ACK:
      case NOTIFICATION_TYPES.CH_NOT_CONSIDERING:
      case NOTIFICATION_TYPES.CH_DECLINED:
      case NOTIFICATION_TYPES.CMS_ADMIN_NEW_CHALLENGE:
        openChallenge(data.notification.additionalData?.challangeId)
        break;
      case NOTIFICATION_TYPES.CMS_ADMIN_GRANDPRIZE:
        openGrandPrize()
        navigate('NOTIFICATIONS')
        break;
      case NOTIFICATION_TYPES.NEW_VIDEO:
      case NOTIFICATION_TYPES.CMS_ADMIN_NEW_CHANNEL:
      case NOTIFICATION_TYPES.NEW_CHANNEL:
        openChannel(data.notification.additionalData?.channelId)
        break;
      case NOTIFICATION_TYPES.NEW_WIN:
        props.store.accountStore.getWinningDramas()
        openChallenge(data.notification.additionalData?.challangeId)
        break;
      default:
        navigate('NOTIFICATIONS')
    }
  }

  function permissionObserver(e) {
    getDeviceState()
  }

  function subscriptionObserver(e) {
    getDeviceState()
  }

  function openDrama(dramaId) {
    navigate('SinglePost', {
      dramaId
    })
  }

  function openChallenge(challengeId) {
    navigate('Challenge', { challenge: {
      id: challengeId
    } })
  }

  function openChannel(channelId) {
    navigate('ChannelStack', {
      screen: 'Channel',
      params: { channelId: channelId },
    });
  }

  function openGrandPrize() {
    props.store.homeStore.getGrandPrize().then(res =>
      props.store.guiStore.setShowGrandPrizeNotif())
  }

  return null
}

export default inject('store')(observer(NotificationHandler))