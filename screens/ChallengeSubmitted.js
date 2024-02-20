import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { inject, observer } from 'mobx-react'
import colors from '../constants/colors'
import Text from '../components/typography/Text'
import { ICONS } from '../constants/images'
import Button from '../components/button/Button'
import { useIsFocused } from '@react-navigation/native'
import VideoPreview from '../components/video/VideoPreview'

const ChallengeSubmitted = (props) => {
  const isFocused = useIsFocused()

  const { createChallengeStore } = props.store
  
  async function goToHomeScreen() {
    createChallengeStore.clear()
    props.navigation.navigate('HOME', {
        scrollTop: true
    })
  }

  return (
    <>
      <VideoPreview
        hide={!isFocused}
        src={createChallengeStore.video?.url}
      />
      <View style={styles.wrapper}>
        <Image 
          source={ICONS['check-mark-button']} 
          style={styles.center}/>
        <Text style={styles.title}>
          Your challenge has been Successfully Submitted for review!
        </Text>
        <Text style={styles.description}>
          Your challenge is now under review, 
          we will get back you in less than 72 hrs 
          to let you know if you have won and if 
          your challenge will be published on Versuz.
        </Text>
        <View style={styles.buttons}>
          <View style={{height: 30}}/>
          <Button
            height={50}
            width={162}
            onPress={goToHomeScreen}>
            DISMISS
          </Button>
        </View>
      </View> 
    </>
  )
}

export default inject('store')(observer(ChallengeSubmitted))

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  wrapper: {
    minHeight: "100%",
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 70,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
    backgroundColor: colors.BLACK_OPACITY_8
  },
  buttons: {
    marginTop: 20,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    marginTop: 30,
    color: colors.WHITE,
    fontSize: 22,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 20,
    color: colors.WHITE,
    fontSize: 16,
    lineHeight: 20
  },
  center: { 
    alignSelf: 'center' 
  }
})