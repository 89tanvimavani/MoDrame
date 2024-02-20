import React from 'react'
import { 
  Pressable, 
  StyleSheet, 
  View
} from 'react-native'
import colors from '../../constants/colors'
import ImagePicker from 'react-native-image-crop-picker'
import ProfileAvatar from '../avatar/ProfileAvatar'
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message'
import Button from './Button'

const UploadAvatar = (props) => {
  function onPress() {
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
      props.onChange(file)
    });
  }

  return (
    <Pressable
      style={styles.wrapper}
      onPress={onPress}
    >
      <View style={styles.relative}>
        <ProfileAvatar 
          src={props.src}
        />
        <View style={styles.buttonPosition}>
          { !props.loading &&
            <Button
              height={25}
              shadow
              fontSize={12}
              onPress={onPress}
              >EDIT PICTURE</Button> }
        </View>
        <View style={styles.loadingPosition}>
          { props.loading && 
            <LottieView 
              style={{ height: 47, width: 47}}
              source={require('../../animations/loading.json')} 
              autoPlay 
              loop
            /> }
        </View>
      </View>
      {/*
      <View style={styles.body}>
        <View style={styles.row}>
          <View style={styles.camera}>
            <Image source={ICONS['camera']}/>
          </View>
          {props.loading ? 
            <Text style={styles.title}>Uploading...</Text>
          :
            <Text style={styles.title}>Upload new</Text>
          }
        </View>
        {props.loading ?
          <Text style={textStyles.inputInfo}>{props.progress}%</Text>
          :
          <Text style={textStyles.inputInfo}>Profile picture</Text>
        } 
      </View> */}
    </Pressable>
  )
}

export default UploadAvatar


const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  body: {
    marginLeft: 10
  },
  camera: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    width: 24,
    borderRadius: 48,
    backgroundColor: colors.WHITE
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    color: colors.WHITE,
    textDecorationLine: 'underline',
    marginLeft: 4
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  relative: {
    width: "100%",
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    position: 'absolute'
  },
  buttonPosition: {
    position: 'relative',
    left: 55,
    top: -35
  },
  loadingPosition: {
    position: 'relative',
    left: 0,
    top: -80
  }
})