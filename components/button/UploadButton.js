import React, { useState } from 'react'
import {
  Pressable, 
  StyleSheet,
  Image,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native'
import colors from '../../constants/colors'
import { ICONS } from '../../constants/images'
import Text from '../typography/Text'
import {launchImageLibrary} from 'react-native-image-picker';
import { v4 as uuid } from 'uuid'
import MediaMeta from 'rn-media-meta';
import Toast from 'react-native-toast-message'
import RNFS from 'react-native-fs'
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient'

const UploadButton = props => {

  const [ loading, setLoading ] = useState(false)

  async function videoUrlCopy(uri, fileName) {
    const destPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
    await RNFS.copyFile(uri, destPath);
    await RNFS.stat(destPath);
    return destPath;
  }

  function upload() {
    setLoading(true)
    props.resetStore()
    launchImageLibrary({
      mediaType: 'video',
      durationLimit: 60
    }, async file => {
      if (file.didCancel) 
        return setLoading(false)
      
      let f = file?.assets[0]
      try {

        let uri;
        let path;

        if (Platform.OS === 'android')
          path  = await videoUrlCopy(f.uri, uuid())


        if (Platform.OS === 'ios')
          uri = f.uri.replace('file://', '')
        else uri = path

        const res = await MediaMeta.get(uri)

        if (res.duration > 60000) {
          setLoading(false)
          if (!props.challenge)
            return Toast.show({
              type: 'error',
              text1: 'Video too long',
              text2: 'Upload 60s or less.',
            })
        }
        if (!res.duration || res.duration === '0') {
          setLoading(false)
          if (!props.challenge)
            return Toast.show({
              type: 'error',
              text1: 'Not a video file',
              text2: 'You should upload a video file here',
            })
        }
        
        props.upload({
          ...f, 
          duration: parseInt(res.duration ? res.duration : 0)
        })

        return setLoading(false)
      } catch (err) {
        if (!props.challenge)
          Toast.show({
            type: 'error',
            text1: 'Could not pick your video',
            text2: 'Sorry, this was unexpected, try again? Are you sure video is shorter than 60s?'
          })
        return setLoading(false)
      } 
    }, err => {
      setLoading(false)
      if (!props.challenge)
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Sorry, this was unexpected, try again?'
        })
    })
  }

  if ((loading || props.loading) && !props.challenge) return (
      <View>
        <LottieView 
          style={{ height: 50, width: 50}}
          source={require('../../animations/loading.json')} 
          autoPlay 
          loop
        />
      </View>
  )

  return (
  !props.roundIconButton ? 
    <Pressable
      onPress={upload}
      style={styles.button}
    >
      <LinearGradient
        start={{ x: 0.0, y: 0.5 }}
        end={{ x: 1.0, y: 0.5 }}
        locations={[0.35,0.7]}
        style={styles.gradient}
        colors={[colors.LIGHTNING_YELLOW, colors.GOLDEN_GRASS]}
      >
        <Image 
          source={ICONS['upload']}
          style={{
            height: 24,
            width: 24,
            marginBottom: 3
          }}/>
        <Text style={styles.text}>Upload video</Text>
      </LinearGradient>
    </Pressable> :

    <TouchableOpacity
      onPress={upload}
      style={styles.roundIconButton}
    >
      <Image source={ICONS['upload']}/>
    </TouchableOpacity> 
  )
}

export default UploadButton

const styles = StyleSheet.create({
  button: {
    width: 175,
    height: 64,
    borderRadius: 32,
  },
  roundIconButton: {
    width: 52,
    height: 52,
    backgroundColor: colors.ALTO,
    borderRadius: 26,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gradient: {
    height: "100%",
    borderRadius: 32,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: colors.BLACK,
    marginLeft: 5,
    fontSize: 15,
  }
})