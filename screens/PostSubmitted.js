import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Image, BackHandler } from 'react-native'
import { inject, observer } from 'mobx-react'
import TransparentButton from '../components/button/TransparentButton'
import colors from '../constants/colors'
import Text from '../components/typography/Text'
import ShareButton from '../components/button/ShareButton'
import Loading from '../components/placeholders/Loading'
import { ICONS } from '../constants/images'
import { useIsFocused } from '@react-navigation/native'
import VideoPreview from '../components/video/VideoPreview'

const PostSubmitted = (props) => {
  const isFocused = useIsFocused()

  const { publishDramaStore, dramasFactory } = props.store
  const { dramaId } = props.route.params

  const [ drama, setDrama ] = useState()

  useEffect(() => {
    function fetchDrama() {
      setTimeout(function() {
        dramasFactory.fetch(dramaId)
          .then(res => {
            if (res.video?.thumbnail === null) fetchDrama()
            if (res) {
              setDrama(res)
            } 
          })
        }, 5000)
      }

    fetchDrama()

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () =>
      subscription.remove()
  }, [])
  
  async function goToHomeScreen() {
    props.navigation.navigate('HOME', {
      scrollTop: true
    })
  }

  return (
    <>
      <VideoPreview
        hide={!isFocused}
        src={publishDramaStore.video?.url}
      />
      <View style={styles.wrapper}>
        <Image source={ICONS['check-mark-button']}/>
        <Text style={styles.title}>
          Your challenge has been Successfully Submitted!
        </Text>
        <Text style={styles.description}>
          Don't forget to share your entry with friends. View count and reactions increase your search
        </Text>
        <View style={styles.buttons}>
          { drama && drama.video?.thumbnail !== null ? 
          <ShareButton 
            submittedScreen
            dramaId={drama.hashId}
            disabled={false}
            dramaPreview={drama.video?.thumbnail}
            dramaDescription={drama.description}/> :
          <>
            <Loading iconOnly/>
            <View style={{height: 20}}/>
            <ShareButton 
              submittedScreen
              disabled={true}/>
          </> 
          }
          <View style={{height: 30}}/>
          <TransparentButton
            onPress={goToHomeScreen}>
            Dismiss
          </TransparentButton>
        </View>
      </View> 
    </>
  )
}

export default inject('store')(observer(PostSubmitted))

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
    alignItems: 'center',
    paddingTop: 70,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
    backgroundColor: colors.BLACK_OPACITY_8
  },
  buttons: {
    marginTop: 20,
    width: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    marginTop: 30,
    color: colors.WHITE,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  description: {
    marginTop: 20,
    color: colors.WHITE,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20
  }
})