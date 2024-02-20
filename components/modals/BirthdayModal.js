import React from 'react'
import { StyleSheet, View, Image, ScrollView } from 'react-native'
import Text from '../../components/typography/Text'
import colors from '../../constants/colors'
import Modal from '../modal/Modal'
import TransparentButton from '../button/TransparentButton'
import { ICONS } from '../../constants/images'
import { inject, observer } from 'mobx-react'
import Button from '../button/Button'
import { useNavigation } from '@react-navigation/native'

const BirthdayModal = (props) => {
  const navigation = useNavigation()
  const { accountStore, challengesStore } = props.store

  function open() {
    props.onRequestClose()
    
    let challenge = challengesStore.birthdayChallenge
    if (challenge) navigation.navigate('Challenge', { challenge })
    else navigation.navigate('CHALLENGES')
  }

  return (
    <Modal
      open={props.open}
      swipeDirection={null}
      borderRadius={20}
      onRequestClose={props.onRequestClose}>
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TransparentButton
            onlyIconButton
            absoluteRight
            icon={ICONS['close']}
            onPress={props.onRequestClose}
          />
            <Text style={styles.emoji}>
              🥳
            </Text>
            <Text style={styles.title}>
              It's your birthday month {accountStore.user?.handle}
            </Text>
            <Text style={styles.description}>
              On your special day, we invite you to 
              participate in our birthday celebration
              challenge
            </Text>
            <Text style={styles.description}>
              Upload a quick video of your birthday 
              celebration highlights to get a chance to win 
              exciting prizes, at the end of every month!
            </Text>
            <View style={{height: 20}}/>
            <Button
              height={49}
              width={225}
              center
              fontSize={14}
              fontWeight='bold'
              onPress={() => open()}
            >UPLOAD BIRTHDAY VIDEO</Button>
            <View style={{height: 20}}/>
            <TransparentButton
              color={colors.GOLDEN_GRASS}
              onPress={props.onRequestClose}>
              Dismiss
            </TransparentButton>
        </ScrollView> 
      </View>
    </Modal>
  )
}

export default inject('store')(observer(BirthdayModal))

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: colors.MINE_SHAFT,
    borderRadius: 11,
  },
  scroll: {
    width: "100%",
    paddingTop: 16,
    paddingBottom: 22,
    paddingLeft: 22,
    paddingRight: 22,
    display: 'flex',
  },
  emoji: {
    paddingTop: 22,
    fontSize: 70,
    alignSelf: 'center'
  },
  title: {
    marginTop: 30,
    paddingBottom: 8,
    color: colors.WHITE,
    fontSize: 22,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  image: {
    position: 'absolute',
    width: 179,
    height: 179,
    top: 5,
    left: 5,
    right: 0,
    bottom: 0,
    borderRadius: 100
  },
  description: {
    fontSize: 15,
    color: colors.WHITE,
    paddingVertical: 8,
    lineHeight: 22
  },
  buttonPosition: {
    position: 'absolute',
    top: 147,
    right: 10
  },
  avatarWrapper: {
    marginTop: 20,
    position: 'relative'
  }
})