import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Image, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from '../components/button/Button'
import Input from '../components/input/Input'
import UploadingStatus from '../components/uploading-status/UploadingStatus'
import colors from '../constants/colors'
import { inject, observer } from 'mobx-react'
import TagsInput from '../components/input/TagsInput'
import { useIsFocused } from '@react-navigation/native'
import VideoPreview from '../components/video/VideoPreview'
import KeyboardAvoidingScroll from '../components/layout/KeyboardAvoidingScroll'
import { HEIGHT } from '../constants/mesures'
import { ICONS } from '../constants/images'
import Toast from 'react-native-toast-message'
import TransparentButton from '../components/button/TransparentButton'
import UploadingStatusFinished from '../components/uploading-status/UploadingStatusFinished'
import Play from '../assets/svg/Play'
import VideoPlayer from '../components/modals/VideoPlayer'

const PostVideo = (props) => {
  const isFocused = useIsFocused()
  const insets = useSafeAreaInsets()

  const { publishDramaStore, challengeStore } = props.store

  const [ error, setError ] = useState(null)
  const [ open, setOpen ] = useState(false)
  const [ publishing, setPublishing ] = useState(false)

  async function enterChallenge() {
    if (challengeStore.challenge?.birthday) {
      return props.navigation.navigate('AddBorderToPost', { 
        dramaId: publishDramaStore.dramaId
      })
    } else {
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
  }

  function onTagsChange(tags) {
    try {
      publishDramaStore.set('tags', tags)
    } catch (err) {
    }
  }

  function onDisabledEnterChallengePress() {
    if (!publishDramaStore.video.loading)
      return Toast.show({
        type: 'error',
        text1: 'Add some description to drama',
        visibilityTime: 1500
      })
    else 
      return Toast.show({
        type: 'error',
        text1: `I'm still uploading... ${publishDramaStore.video.progress}%`,
        visibilityTime: 1500
      })
  }

  return (
    <View style={styles.wrapper}>
      <KeyboardAvoidingScroll>
        <View style={[
          styles.inner,
          {
            minHeight: HEIGHT - insets.bottom,
          }
        ]}>
          <TransparentButton
            onlyIconButton
            absoluteRight
            screen
            icon={ICONS['close']}
            onPress={() => props.navigation.goBack()}
          />
          <View style={styles.preview}>
            <VideoPreview
              hide={!isFocused || open}
              src={publishDramaStore.video?.localUrl}
              onPlay={() => setOpen(true)}/>
            { publishDramaStore.uploadingError && <Image source={ICONS['empty-eyes']}/> }
            <View style={styles.status}>
              { publishDramaStore.uploadingVideo ? 
                <UploadingStatus 
                  progress={publishDramaStore.video.progress}
                /> : null
              }
              { !publishDramaStore.uploadingVideo ? 
                <>
                { publishDramaStore.video.uploaded ?
                  <UploadingStatusFinished
                    error={false}
                    text='Successfully added'
                  /> :
                  <UploadingStatusFinished 
                    error={true}
                    text='Error uploading video'
                  />
                }
                </> : null
              }
            </View>
            
            {publishDramaStore.video.uploaded &&
              !publishDramaStore.video.loading ?
              <Play/> : null
            }
          </View> 
          
          <View style={[styles.inputWrap]}>
            <Input 
              label="DESCRIPTION"
              placeholder={challengeStore.challenge?.birthday ? "My birthday description" : "Description"}
              info="Share a short explanation of what the video is about, including relevant keywords."
              value={publishDramaStore.description}
              onChangeText={val => publishDramaStore.set('description', val)}
            />
          </View>
          <View style={styles.inputWrap}>
            <TagsInput
              onChange={(tags) => onTagsChange(tags)}
              info="Press space to add tag"
            />
          </View>

          <View style={styles.buttonSection}>
            {!publishDramaStore.uploadingError ?
              <Button
                center
                height={50}
                width={120}
                onPress={enterChallenge}
                disabled={!publishDramaStore.validPublish || publishing}
                loading={publishing}
                onDisabledPress={onDisabledEnterChallengePress}
                next
              >Enter challenge</Button>
              :
              <Button 
                center
                height={50}
                width={120}
                onPress={() => props.navigation.goBack()}>
                Reupload
              </Button>
            }
            <View style={{height: 30}}/>
            <TransparentButton
              onPress={() => props.navigation.goBack()}>
              Dismiss
            </TransparentButton>
          </View>
        </View>
      </KeyboardAvoidingScroll>
      <VideoPlayer 
        open={open}
        looping={true}
        onRequestClose={() => setOpen(false)}
        src={publishDramaStore.video?.localUrl}
        thumbnail={publishDramaStore.video?.thumbnail}
      />
    </View>
  )
}

export default inject('store')(observer(PostVideo))

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    display: 'flex',
    flex: 1,
  },
  inner: {
    display: 'flex',
    alignItems: 'center'
  },  
  preview: {
    width: "100%",
    height: 260,
    backgroundColor: colors.WHITE,
    marginBottom: 30,
    position: 'relative',
    backgroundColor: colors.BLACK,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.LIGHTNING_YELLOW,
    marginBottom: 10
  },
  close: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 20
  },
  date: {
    marginTop: 16,
    marginBottom: 16,
    color: colors.LIGHTNING_YELLOW,
    fontWeight: "bold"
  },
  description: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.WHITE
  },
  inputWrap: {
    width: '100%',
    padding: 30
  },
  status: {
    position: 'absolute',
    bottom: -12,
  },
  buttonSection: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    display: 'flex'
  }
})