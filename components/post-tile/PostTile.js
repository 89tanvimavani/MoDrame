import React from 'react'
import { Pressable, StyleSheet, View, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import colors from '../../constants/colors'
import { BADGES, ICONS } from '../../constants/images'
import { WIDTH } from '../../constants/mesures'
import MiniTag from '../mini-tag/MiniTag'
import Text from '../typography/Text'
import LottieView from 'lottie-react-native'
import Border from '../post/sub-components/Border'

const PostTile = (props) => {
  function onGifLoad() {}

  return (
    <Pressable
      style={props.winnersPage ? styles.winnersWrapper : styles.wrapper}
      onPress={props.onPress}
    >

      {props.views ?
        <View style={{
          ...styles.views,
          right: props.frame ? 15 : 5,
          top: props.frame ? 20 : 5
        }}>
          <MiniTag
            mini
            icon={ICONS['third-eye']}
          >{props.views}</MiniTag>
        </View> : null
      }

      {props.winner && 
        <View style={styles.winner}>
          <Image 
            style={styles.badge}
            source={BADGES['winner-badge']}
          />
          <Image 
            style={styles.badge}
            source={ICONS['crown']}
          />
        </View>
      }
      <FastImage 
        style={styles.gif}
        source={{
          uri: props.thumbnail
        }}
      />
      <FastImage 
        style={styles.gif}
        onLoadEnd={onGifLoad}
        source={{
          uri: props.gif
        }}
      />
      {!props.gif && !props.thumbnail &&
        <LinearGradient 
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          style={styles.processing}
          colors={['#1F1F1F', '#000']}
        >
          <LottieView 
            style={styles.lottie}
            source={require('../../animations/loading.json')} 
            autoPlay 
            loop
          />
          <Text style={styles.processingText}>Processing video</Text>
        </LinearGradient>
      }

      { props.frame ?
        <Border 
          topBorder={props.topFrame}
          bottomBorder={props.bottomFrame}/> 
      : null }
    </Pressable>
  )
}

export default PostTile

const styles = StyleSheet.create({
  wrapper: {
    width: WIDTH/3,
    height: WIDTH/3*1.56,
    position: 'relative'
  },
  winnersWrapper: {
    width: (WIDTH-14)/3 - 14,
    height: ((WIDTH-14)/3 - 14)*1.56,
    position: 'relative',
    margin: 7,
    borderRadius: 6,
    overflow: 'hidden'
  },
  gif: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  winner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.69)',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  badge: {
    position: 'absolute'
  },
  views: {
    position: 'absolute',
    zIndex: 10
  },
  processing: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  },
  processingText: {
    color: colors.WHITE,
    textAlign: 'center',
    marginTop: 5
  },
  borderRadius: {
    borderRadius: 6
  },
  lottie: { 
    height: 30, 
    width: 30
  }
})