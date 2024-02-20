import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import  Text from '../components/typography/Text'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from '../components/button/Button'
import colors from '../constants/colors'
import { inject, observer } from 'mobx-react'
import { useIsFocused } from '@react-navigation/native'
import KeyboardAvoidingScroll from '../components/layout/KeyboardAvoidingScroll'
import { HEIGHT, WIDTH } from '../constants/mesures'
import { ICONS } from '../constants/images'
import TransparentButton from '../components/button/TransparentButton'
import Border from '../components/post/sub-components/Border'
import VideoPreview from '../components/video/VideoPreview'

const AddBorderToPost = (props) => {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()

  const [ publishing, setPublishing ] = useState(false)
  const [ error, setError ] = useState(null)

  const { publishDramaStore, accountStore } = props.store

  const finishUploading = () => {
    setPublishing(true)
    publishDramaStore.updateDrama()
      .then(res => {
        setPublishing(false)
        if (!res.error) {
          return props.navigation.navigate('PostSubmitted', { 
            dramaId: publishDramaStore.dramaId
          })
        } return setError(res.data)
      })
  }

  return (
    <View style={styles.wrapper}>
      <KeyboardAvoidingScroll>
        <View style={{
          ...styles.inner,
          paddingTop: insets.top + 20
        }}>
          <Text style={styles.title}>Preview</Text>
          <View style={{
            ...styles.absolute,
            top: insets.top + 20
          }}>
            <TransparentButton
              onlyIconButton
              icon={ICONS['close']}
              onPress={() => props.navigation.navigate('HOME')}
            />
          </View>
          <View style={styles.videoWrapper}>
            <VideoPreview
              hide={!isFocused}
              src={publishDramaStore.video?.src}
            />
            { publishDramaStore.frame ?
              <Border
                bottomBorder={accountStore.user?.bottomFrame}
                topBorder={accountStore.user?.topFrame} 
                large/>
            : null }
          </View> 
          <View style={styles.descWrapper}>
            <Text style={styles.desc}>Have your birthday video standout by adding a zodiac sign frame</Text>
            <View style={styles.inline}>
              <Button
                center
                height={50}
                width={120}
                backgroundColor={publishDramaStore.frame ? colors.WHITE : colors.TRANSPARENT}
                color={publishDramaStore.frame ? colors.BLACK : colors.WHITE}
                borderColor={colors.WHITE}
                borderRadius={8}
                onPress={() => publishDramaStore.set('frame', true)}
              >Zodiac frame</Button>
              <Button
                center
                height={50}
                width={120}
                borderColor={colors.WHITE}
                backgroundColor={!publishDramaStore.frame ? colors.WHITE : colors.TRANSPARENT}
                color={!publishDramaStore.frame ? colors.BLACK : colors.WHITE}
                borderRadius={8}
                onPress={() => publishDramaStore.set('frame', false)}
              >No frame</Button>
            </View>
          </View>
          <View style={styles.buttonSection}>
            <Button
              center
              height={50}
              width={120}
              disabled={publishing}
              loading={publishing}
              onPress={finishUploading}
            >Upload video</Button>
            <View style={{height: 30}}/>
            <TransparentButton
              onPress={() => props.navigation.navigate('HOME')}>
              Cancel
            </TransparentButton>
          </View>
        </View>
      </KeyboardAvoidingScroll>
    </View>
  )
}

export default inject('store')(observer(AddBorderToPost))

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  inner: {
    display: 'flex',
    alignItems: 'center'
  },
  video: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  inline: {
    paddingTop: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  absolute: {
    position: 'absolute',
    right: 20
  }, 
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.WHITE,
    marginBottom: 10
  },
  descWrapper: {
    padding: 32
  },
  desc: {
    fontSize: 16,
    letterSpacing: 0,
    color: colors.WHITE,
    marginBottom: 10
  },
  videoWrapper: {
    height: HEIGHT/2,
    width: WIDTH - 120,
    backgroundColor: colors.DARK_GRAY,
    borderRadius: 7,
    overflow: 'hidden'
  },
  buttonSection: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    display: 'flex'
  }
})