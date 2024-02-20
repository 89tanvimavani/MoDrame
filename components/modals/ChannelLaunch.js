import React, { useEffect } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import Text from '../../components/typography/Text'
import colors from '../../constants/colors'
import Modal from '../modal/Modal'
import TransparentButton from '../button/TransparentButton'
import { ICONS } from '../../constants/images'
import { inject, observer } from 'mobx-react'
import ProfileAvatar from '../avatar/ProfileAvatar'
import Button from '../button/Button'
import FyiCard from '../fyi-card/FyiCard'
import { useNavigation } from '@react-navigation/native'

const ChannelLaunch = (props) => {
  const navigation = useNavigation()
  const { homeStore } = props.store

  function openChannel() {
    navigation.navigate('ChannelStack', {
      screen: 'Channel',
      params: { channelId: homeStore?.newChannel.id },
    });
    dismiss()
  }

  function dismiss() {
    props.onRequestClose()
    props.addToSeenChannelModal(homeStore?.newChannel?.id)
  }

  return (
    <Modal
      open={props.open}
      swipeDirection={null}
      borderRadius={20}
      onRequestClose={() => dismiss()}>
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TransparentButton
            onlyIconButton
            absoluteRight
            icon={ICONS['close']}
            onPress={() => dismiss()}
          />
          <View style={styles.avatarWrapper}>
            <ProfileAvatar
              src={homeStore?.newChannel?.user?.avatar?.url}
            />
            <View style={styles.buttonPosition}>
              <TransparentButton 
                width={50} height={50}
                onlyIconButton
                icon={ICONS['channel-icon']}
                onPress={() => openChannel()}/>
            </View>
          </View>
          <Text style={styles.description}>
            <Text style={styles.bold}>{homeStore?.newChannel?.user.name} (@{homeStore?.newChannel?.user.handle}) </Text>
            has launched a channel, check it out to stay up to date with the exclusive content this user shares on Versuz.
          </Text>
          <FyiCard
            text="Launching a channel is exclusive for selected members of Versuz, if you
            wish to share content via your channel please contact us at info@versuz.app"/>
          <View style={{height: 20}}/>
          <Button
            height={49}
            width={170}
            center
            fontSize={14}
            fontWeight='bold'
            onPress={() => openChannel()}
          >VIEW CHANNEL</Button>
          <View style={{height: 36}}/>
          <TransparentButton
            color={colors.GOLDEN_GRASS}
            onPress={() => dismiss()}>
            Dismiss
          </TransparentButton>
        </ScrollView> 
      </View>
    </Modal>
  )
}

export default inject('store')(observer(ChannelLaunch))

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: colors.MINE_SHAFT,
    borderRadius: 11,
    paddingBottom: 16
  },
  scroll: {
    width: "100%",
    paddingTop: 16,
    paddingBottom: 22,
    paddingLeft: 22,
    paddingRight: 22,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: colors.WHITE,
    margin: 20,
    paddingTop: 20
  },
  description: {
    fontSize: 15,
    color: colors.WHITE,
    paddingBottom: 16,
    paddingTop: 22,
    lineHeight: 22,
  },
  scroll: {
    width: "100%",
    paddingLeft: 30,
    paddingRight: 30
  },
  buttonPosition: {
    position: 'absolute',
    top: 85,
    left: -18
  },
  avatarWrapper: {
    paddingTop: 20,
    alignSelf: 'center'
  },
  bold: {
    fontWeight: 'bold'
  }
})