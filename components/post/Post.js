import React from 'react'
import { useRef, useState, useEffect, memo } from 'react';
import { View, StyleSheet, Platform, Image, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../constants/colors';
import { WIDTH } from '../../constants/mesures';
import Button from '../button/Button';
import Emojis from '../emojis/Emojis';
import ShareButton from '../button/ShareButton';
import { ICONS } from '../../constants/images';
import MiniTag from '../mini-tag/MiniTag';
import ReportPost from '../report-post/ReportPost';
import ReportModal from '../modals/ReportModal'
import ProfileInfo from './sub-components/ProfileInfo'
import Gradient from './sub-components/Gradient'
import ChallengeButton from './sub-components/ChallengeButton'
import Winner from './sub-components/Winner'
import PostImage from './sub-components/PostImage';
import { ResizeMode, Audio, Video as ExpoVideo } from 'expo-av';
import VisibilityCheck from '../list-view/visibility-check/VisibilityCheck'
import { useIsFocused } from '@react-navigation/native'
import Border from './sub-components/Border'
import { color } from 'react-native-reanimated';
import Text from '../typography/Text';

let viewTimeout = null
const TIMEOUT_DURATION = 2000

const Post = React.forwardRef((props, ref) => {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()
  const video = useRef()

  const [secondsLeft, setSecondsLeft] = useState(-1)
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => { 
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true }); 
  }, [])

  useEffect(() => {
    if (visible || props.active) countView()
    else {
      if (viewTimeout) 
        clearTimeout(viewTimeout)
      setSecondsLeft(-1)
    }
  }, [visible, props.active])

  useEffect(() => {
    return onUnmount
  }, [])

  const onUnmount = () => {
    if (video?.current) 
      video.current.unloadAsync()
  };

  const countView = () => {
    viewTimeout = setTimeout(() => {
      props.onView(props.id)
    }, TIMEOUT_DURATION)
  }

  const pauseVideo = () => {
    if (video?.current)
      video.current.pauseAsync()
  };

  const playVideo = () => {
    if (video?.current) {
      video.current.setStatusAsync({ progressUpdateIntervalMillis: 500 })
      video.current.playAsync()
    }
  };

  const handlePlaying = isVisible => {
    setVisible(isVisible)
    isVisible ? playVideo() : pauseVideo()
  };

  const onProgress = (e) => {
    if (props.firstDrama && props.firstDrama(props.id)) 
      props.setLoaded(e.isLoaded, props.id) 

    setPlaying(e.isPlaying)
    setBuffering(e.isBuffering)

    let sL
    if (!props.duration) return setSecondsLeft(-1)

    sL = (e.durationMillis - e.positionMillis)/1000
    sL = parseInt(sL)
    if (sL < 0) sL = 0
    setSecondsLeft(sL)
  }
  
  // DIFFERENT BASED ON LISTVIEW COMPONENT
  const videoPlayer = () => {

    if (Platform.OS === 'ios')
      return <ExpoVideo 
        ref={video}
        source={{
          uri: props.uri
        }}
        positionMillis={0}
        isLooping
        shouldPlay={props.active}
        isMuted={!props.active || props.user?.blocked}
        posterSource={{ uri: props.poster }}
        resizeMode={ResizeMode.COVER}
        style={{ height: props.height, width: WIDTH}}
        onPlaybackStatusUpdate={status => props.active && onProgress(status)}
      />
    else return <VisibilityCheck
        style={{flex: 1}}
        onUnmount={onUnmount}
        onChange={handlePlaying}>
        <ExpoVideo 
          ref={video}
          source={{
            uri: props.uri
          }}
          positionMillis={0}
          isLooping
          rate={1.0}
          volume={1.0}
          isMuted={!isFocused || props.user?.blocked}
          posterSource={{ uri: props.poster }}
          resizeMode={ResizeMode.COVER}
          style={{ height: props.height, width: WIDTH}}
          onPlaybackStatusUpdate={status => visible && onProgress(status)}
        />
      </VisibilityCheck>
  }

  return (
    <View 
      ref={ref}
      style={{
        ...styles.wrapper,
        height: props.height
      }}>
      
      { props.poster && <PostImage poster={props.poster}/> }
      
      {videoPlayer()}

      {props.user?.blocked ? <View style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: colors.BLACK,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }}>
        <Text
          style={{
            fontSize: 16,
            color: colors.WHITE,
            textAlign: 'center',
            maxWidth: 200
          }}
        >You blocked this user. You are not able to view their content.</Text>
      </View>: null}
      
      { props.border ?
      <Border 
        topBorder={props.user?.topFrame}
        bottomBorder={props.user?.bottomFrame}
        large/>
      : null }

      <View style={{...styles.contentWrapper, height: props.height}}>
        <View>

          <View style={{
            ...styles.head, 
            ...Platform.select({
                ios: {
                  paddingTop: insets.top
                },
                android: {
                  paddingTop: 10
                }
              })
          }}>
            <View style={styles.tags}>
              { props.icon && !props.winner ?
                <Image 
                style={styles.zodiacIcon}
                source={ICONS['placeholder']}
              /> : null }
              { props.views && !props.icon ?
                <>
                  <MiniTag
                    icon={ICONS['third-eye']}>
                    {props.views}
                  </MiniTag>
                  <View style={{ width: 5 }}/>
                </> : null
              }
              
              {secondsLeft > -1 && !props.icon && <MiniTag>{secondsLeft}s</MiniTag>}
              
              {buffering && !playing && !props.icon &&
                <View style={styles.buffering}>
                  <ActivityIndicator color={colors.LIGHTNING_YELLOW} />
                </View>
              }

            </View>
            <View style={styles.center}>
              { props.challenge && !props.challenge?.isPast ? 
                <ChallengeButton
                  animate={props.animateButton && props.active || props.animateButton && visible}
                  onPress={() => props.challengePress(props.challenge)}
                /> : null
              }
              { props.winner && <Winner insetsTop={insets.top}/>}
            </View>
          </View>
        </View>

        <Gradient height={'30%'}/>
        <View>
          <View style={{
            ...props.fullScreen && !props.reportVisible && {
              ...Platform.select({
                ios: {
                  paddingBottom: insets.bottom
                },
                android: {
                  paddingBottom: insets.bottom + 15
                }
              })
              
            }
          }}>
            <View style={{ paddingBottom: props.channel ? 40 : props.fullScreen ? insets.bottom : 10}}>
              <View style={styles.bottom}>
                <View>
                  { !props.channel && props.challenge ? 
                    <Button
                      backgroundColor={colors.NAVY_BLUE}
                      color={colors.WHITE}
                      onPress={() => props.challengePress(props.challenge)}
                      fontSize={12}
                      icon={ICONS['lightning']}
                      maxWidth={WIDTH - 80}
                    > 
                      {props.challenge?.title}
                    </Button> : props.channel ?
                    <Button
                      backgroundColor={colors.TORY_BLUE}
                      onPress={() => props.goBack()}
                      color={colors.WHITE}
                      fontSize={15}
                      fontWeight='bold'
                      icon={ICONS['back-button']}
                      width={50}
                      height={24}
                    > 
                      BACK
                    </Button> : null
                  }
                  <ProfileInfo
                    onPress={() => props.profilePress(props.user?.id)}
                    src={props.user?.avatar?.url}
                    handle={props.user?.handle}
                    description={props.description}
                    tags={props.tags}
                  />
                </View>
                <View style={styles.emojis}>
                  { !props.channel ?
                  <ShareButton 
                    dramaId={props.hashId}
                    dramaPreview={props.poster}
                    dramaDescription={props.description}/> : null }
                  <Emojis 
                    onReactionPress={(reactionType, add) => 
                      props.react(reactionType, add, props.id)}
                    reactions={props.reactions}
                    numberOfReactions={props.numberOfReactions}
                    reactionId={props.reactionId}
                    id={props.id}
                  />
                </View>
              </View>
              { props.reportVisible && (props.channel || props.profile) && 
                <>
                  <ReportPost 
                    onPress={() => {
                      setOpen(true)
                      props.onLockClose ? props.onLockClose() : null
                    }}
                  />
                  <ReportModal 
                    dramaId={props.id}
                    open={open}
                    onRequestClose={() => {
                      setOpen(false)
                      props.onUnlockClose ? props.onUnlockClose() : null
                    }}
                  />
                </>
              }
            </View>
          </View>
        </View>
      </View>
    </View>
  )
})

function propsAreEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default memo(Post, propsAreEqual)

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  contentWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'space-between',
  },
  head: {
    zIndex: 1,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    padding: 10
  },
  bottom: {
    paddingBottom: 10,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  emojis: {
    alignItems: 'center',
  },
  image: {
    marginRight: 4,
    tintColor: colors.WHITE
  },
  winner: {
    position: 'absolute',
    top: 0,
    left: 16,
    zIndex: 100
  },
  tags: {
    display: 'flex',
    flexDirection: 'row'
  },
  zodiacIcon: {
    height: 60,
    width: 60,
    marginLeft: 20
  },
  buffering: {
    marginLeft: 5
  },
  button: {
    backgroundColor: colors.LIGHTNING_YELLOW,
    borderRadius: 28,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: 'bold'
  },
  infoText: {
    fontSize: 10,
    color: colors.WHITE,
    marginTop: 2
  },
  poster: {
    zIndex: 5
  },
  center: {
    display: 'flex',
    alignItems: 'flex-end'
  }
})