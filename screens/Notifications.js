import { inject, observer } from 'mobx-react'
import React from 'react'
import { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Notification from '../components/notification/Notification'
import EmptyList from '../components/placeholders/EmptyList'
import Text from '../components/typography/Text'
import colors from '../constants/colors'
import { NOTIFICATION_TYPES } from '../constants/types'
import { titleStyles } from '../styles-main/texts'
import GrandPrize from '../components/modals/GrandPrize'
import { useIsFocused } from '@react-navigation/native'
import Loading from '../components/placeholders/Loading'

const Notifications = (props) => {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()

  const [refreshing, setRefreshing] = useState(false)

  const { notificationsStore, homeStore, guiStore } = props.store

  useEffect(() => {
    if (isFocused) 
      notificationsStore.getNotifications(true)
  }, [isFocused])

  function onRefresh() {
    setRefreshing(true)

    notificationsStore.getNotifications(true)
      .then(() => setRefreshing(false))
  }

  function onEndReached() {
    if (notificationsStore.empty) return null
    if (notificationsStore.loading) return null
    notificationsStore.nextPage()
  }

  const footerComponent = () => (
    notificationsStore.loading && notificationsStore.notifications.length !== 0 ? 
      <Loading iconOnly/> : null
  )

  function openNotification(item) {
    switch (item.type) {
      case NOTIFICATION_TYPES.NEW_RESPONSE:
      case NOTIFICATION_TYPES.BIRTHDAY_WINNER:
        openDrama(item.dataId)
        break;
      case NOTIFICATION_TYPES.BIRTHDAY_CHALLENGE:
      case NOTIFICATION_TYPES.NEW_CHALLENGE:
      case NOTIFICATION_TYPES.CH_ACK:
      case NOTIFICATION_TYPES.CH_NOT_CONSIDERING:
      case NOTIFICATION_TYPES.CH_DECLINED:
      case NOTIFICATION_TYPES.CMS_ADMIN_NEW_CHALLENGE:
        openChallenge(item.dataId)
        break;
      case NOTIFICATION_TYPES.CMS_ADMIN_GRANDPRIZE:
        openGrandPrize()
        props.navigation.navigate('NOTIFICATIONS')
        break;
      case NOTIFICATION_TYPES.NEW_VIDEO:
      case NOTIFICATION_TYPES.CMS_ADMIN_NEW_CHANNEL:
      case NOTIFICATION_TYPES.NEW_CHANNEL:
        openChannel(item.dataId)
        break;
      case NOTIFICATION_TYPES.NEW_WIN:
        props.store.accountStore.getWinningDramas()
        openChallenge(item.dataId)
        break;
      default:
        props.navigation.navigate('NOTIFICATIONS')
    }
  }

  function openDrama(dramaId) {
    props.navigation.navigate('SinglePost', {
      dramaId
    })
  }

  function openChallenge(challengeId) {
    props.navigation.navigate('Challenge', { challenge: {
      id: challengeId
    } })
  }

  function openChannel(channelId) {
    props.navigation.navigate('ChannelStack', {
      screen: 'Channel',
      params: { channelId: channelId },
    });
  }

  function openGrandPrize() {
    homeStore.getGrandPrize().then(res =>
      guiStore.setShowGrandPrizeNotif())
  }

  function deleteNotification(notifId) {
    notificationsStore.deleteNotification(notifId)
  }

  const listEmptyComponent = () => (
    <EmptyList 
      loading={notificationsStore.loading}
      title="No notifications yet"
      description="Enter challenges and recieve notifications"
      onPress={() => props.navigation.navigate('CHALLENGES')}
    />
  )

  const renderItem = ({ item }) => (
    <Notification 
      id={item.id}
      title={`${item.notifTitle}`}
      description={item.message}
      date={item.createdAt}
      deleteNotification={() => deleteNotification(item.id)}
      // seen={item.seen}
      seen={true}
      noButton={item.type === NOTIFICATION_TYPES.CMS_GENERAL_NOTIFICATION}
      onPress={() => openNotification(item)}
    />
  )

  return (
    <>
      <View style={[
        styles.wrapper
      ]}>
        <View style={[
          styles.head,
          {
            paddingTop: insets.top + 14
          }
        ]}>
          <Text style={titleStyles.title}>Notifications</Text>
        </View>

        <FlatList 
          data={notificationsStore.notifications}
          scrollIndicatorInsets={{ right: 1 }}
          keyExtractor={item => `${item?.id}`}
          onEndReached={onEndReached}
          ListEmptyComponent={listEmptyComponent}
          renderItem={renderItem}
          ListHeaderComponent={() => <View style={{ height: 16 }}/>}
          ListFooterComponent={footerComponent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.LIGHTNING_YELLOW}
            />
          }
          ItemSeparatorComponent={() => (
            <View style={styles.itemSeparator} />
          )}
          extraData={{
            len: notificationsStore.notifications?.length,
            loading: notificationsStore.loading
          }}
        />

      </View>
      <GrandPrize
        open={guiStore.showGrandPrizeNotif}
        onRequestClose={() => guiStore.setShowGrandPrizeNotif()}
      />
    </>
  )
}

export default inject('store')(observer(Notifications))

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  head: {
    paddingLeft: 16,
    paddingRight: 16
  },
  itemSeparator: { 
    borderColor: colors.DOVE_GRAY, 
    borderBottomWidth: 1, 
    marginHorizontal: 16
  }
})