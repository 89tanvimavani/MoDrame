import React, {useRef, useState} from 'react'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'
import { RNCamera } from 'react-native-camera'
import { inject, observer } from 'mobx-react'
import { HEIGHT, WIDTH } from '../constants/mesures'
import Text from '../components/typography/Text'
import colors from '../constants/colors'
import { textStyles } from '../styles-main/texts'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SnapButton from '../components/button/SnapButton'
import Link from '../components/typography/Link'
import { ICONS } from '../constants/images'
import ImagePicker from 'react-native-image-crop-picker'
import UploadingStatus from '../components/uploading-status/UploadingStatus'
import { useIsFocused } from '@react-navigation/native'
import { useEffect } from 'react'
import Toast from 'react-native-toast-message'


const ProfilePicture = props => {
  const insets = useSafeAreaInsets()
  const camera = useRef(null)
  const isFocused = useIsFocused()

  const [preview, setPreview] = useState(null)

  const { authStore, accountStore } = props.store

  useEffect(() => {
    if (isFocused) accountStore.set('tempAvatar', {})
  }, [isFocused])

  function next() {
    authStore.set('onboardingStatus', null)
    props.navigation.navigate('Tabs')
  }

  function retake() {
    accountStore.set('tempAvatar', {})
    setPreview(null)
    camera.current.resumePreview()
  }

  async function onSnap() {
    if (preview) return next()

    const picture = await camera.current.takePictureAsync({
      pauseAfterCapture: true,
      mirrorImage: false,
      forceUpOrientation: true
    })
    accountStore.changeAvatar(picture)
    setPreview(picture.uri)
  }

  function pick() {
    ImagePicker.openPicker({
      multiple: false,
      width: 300,
      height: 300,
      cropping: true
    }).then(image => {
      let file = {
        fileName: image.filename,
        fileSize: image.size,
        height: image.height,
        width: image.width,
        type: image.mime,
        uri: image.path
      }
      if (image.mime === 'image/gif')
        return Toast.show({
          type: 'error',
          text1: 'File type not allowed',
          text2: "You can't use GIFs as your profile photo"
        })
      accountStore.changeAvatar(file)
        .then(res => {
          if (res.error) setPreview(null)
        })
      setPreview(image.path)
    });
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.head}>
        <View style={styles.cameraWrap}>
          <View
            style={{
              position: 'absolute',
              right: 16,
              top: insets.top,
              zIndex: 10
            }}
          >
            { !preview && 
              <Link height={50} onPress={() => next()}>Skip</Link>
            }
          </View>
          <RNCamera 
            ref={camera}
            captureAudio={false}
            style={styles.camera}
            type="front"
          />
          {preview && <Image style={styles.image} source={{ uri: preview }} />}
          <View style={styles.status}>
            {accountStore.uploadingAvatar && 
              <UploadingStatus 
                progress={accountStore.tempAvatar.progress}
              />
            }
          </View>
        </View>
        <Text style={styles.title}>Take a profile picture or</Text>
        <TouchableOpacity activeOpacity={.8} onPress={pick}>
          <Text style={[styles.subtitle, textStyles.underline]}>upload it from gallery</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.bottom, { paddingBottom: insets.bottom }]}>
        <View style={styles.row}>
          <SnapButton 
            onPress={onSnap}
            disabled={accountStore.uploadingAvatar}
          >
            {accountStore.tempAvatar.uploaded && 
              <Image 
                source={ICONS['done-mini']}
                style={{ tintColor: colors.WHITE }}
              />
            }
          </SnapButton>
          {preview &&
            <TouchableOpacity 
              activeOpacity={.8}
              style={[
                styles.retake
              ]} 
              onPress={retake}
            >
              <Image style={styles.retakeIcon} source={ICONS['retake']}/>
              <Link
                height={70}
                onPress={retake}
              >
                Retake
              </Link>
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  )
}

export default inject('store')(observer(ProfilePicture))

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1
  },
  camera: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  cameraWrap: {
    width: WIDTH,
    height: HEIGHT/2,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: HEIGHT/4,
    borderBottomRightRadius: HEIGHT/4,
    display: 'flex',
    alignItems: 'center'
  },
  head: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    color: colors.WHITE,
    fontSize: 32,
    fontWeight: '600',
    maxWidth: 280,
    textAlign: 'center',
    marginTop: 20
  },
  subtitle: {
    color: colors.FLIRT,
    fontSize: 24,
    fontWeight: '600'
  },
  bottom: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  row: {
    display: 'flex',
    width: WIDTH/2 + 39,
    flexDirection: 'row',
    alignItems: 'center'
  },
  retake: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  retakeIcon: {
    marginLeft: 20,
    marginRight: 8
  },
  image: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  status: {
    position: 'absolute',
    bottom: 25
  }
})