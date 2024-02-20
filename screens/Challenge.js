import React, { useState, useEffect, useRef } from 'react'
import { Platform, ScrollView, StyleSheet, View, Image, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import UploadButton from '../components/button/UploadButton'
import Text from '../components/typography/Text'
import colors from '../constants/colors'
import { inject, observer } from 'mobx-react'
import { useIsFocused } from '@react-navigation/native';
import GifPreview from '../components/video/GifPreview'
import VideoPlayer from '../components/modals/VideoPlayer'
import { HEIGHT, WIDTH } from '../constants/mesures'
import Status from '../components/challenge/sub-components/Status'
import Prize from '../components/challenge/sub-components/Prize'
import Button from '../components/button/Button'
import { TUTORIAL_SCREEN } from '../constants/types'
import LottieView from 'lottie-react-native';
import WinningStatus from '../components/challenge/sub-components/WinningStatus'
import { ICONS } from '../constants/images'
import Loading from '../components/placeholders/Loading'
import Tutorial from '../components/tutorial/Tutorial'
import Expiry from '../components/challenge/sub-components/Expiry'
import FyiCard from '../components/fyi-card/FyiCard'
import TransparentButton from '../components/button/TransparentButton'
import GrandPrize from '../components/challenge/sub-components/GrandPrize'
import RewardInfoModal from '../components/modals/RewardInfoModal'

const ANIMATION_DURATION = 3000

const Challenge = (props) => {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()
  const animation = useRef()

  const [ showAnimation, setShowAnimation ] = useState(false)
  const [ open, setOpen ] = useState(false)
  const [ rewardInfo, setRewardInfo ] = useState(false)

  const { homeStore, guiStore, challengeStore, challengesFactory,
    tutorialStore, publishDramaStore } = props.store
  const { challenge } = props.route.params
  
  useEffect(() => {
    if (isFocused) {
      challengesFactory.fetch(challenge.id)
        .then(res => {
          if (!res) return props.navigation.goBack()
          challengeStore.set('challenge', res.data.id)
        })
    }
  }, [ isFocused, guiStore.background ])

  useEffect(() => {
    if (challengeStore?.challenge?.winningDrama && 
      challenge.id === challengeStore.challenge.id) iAmWinner()
  }, [ challengeStore?.challenge?.winningDrama ])

  if (!props.route.params?.challenge) {
    return props.navigation.goBack()
  }

  function startedUploading(url) {
    publishDramaStore.upload(url, challengeStore.challenge.id)
    props.navigation.navigate('PostVideo')
  }

  function resetStore() {
    publishDramaStore.removeVideo()
  }
  
  function onPlay() {
    setOpen(true)
  }

  function iAmWinner() {
    // play confetti
    setShowAnimation(true)
    setTimeout(() => {
      if (animation.current)
        animation.current.play()
    })
    setTimeout(() => {
      setShowAnimation(false)
    }, ANIMATION_DURATION)
  }

  function claimReward() {
    props.navigation.navigate('ClaimReward', { challenge: challengeStore.challenge })
  }

  if (!challengeStore) return null
  return (
    <View style={styles.wrapper}>
      { tutorialStore.challengeScreenTutorial && 
        <Tutorial 
          screen={TUTORIAL_SCREEN.CHALLENGE_SCREEN}
          dismiss={() => tutorialStore.seenChallengeScreenTutorial()}
        />
      }

      <ScrollView
        scrollIndicatorInsets={{ right: 1 }}
        contentContainerStyle={[
          props.container,
          { 
            ...Platform.select({
              ios: {
                paddingBottom: insets.bottom + 22
              },
              android: {
                paddingBottom: 22
              }
            })
          }
        ]}
      >
      { showAnimation &&
        <View style={styles.confetti}>
          <LottieView 
            style={{ height: HEIGHT, width: WIDTH}}
            source={require('../animations/confetti.json')} 
            loop={false}
            duration={ANIMATION_DURATION}
            ref={animation}
          />
        </View>
      }
        <TransparentButton
          onlyIconButton
          absoluteRight
          screen
          icon={ICONS['close']}
          onPress={() => props.navigation.goBack()}
        />
        <View style={styles.header}>
          <View style={styles.previewWrap}>
            <GifPreview 
              gif={challengeStore.challenge?.video?.gif}
              onPlay={onPlay}
            />
            <View style={styles.statusWrap}>
              <View style={styles.status}>
                <Status 
                  status={challengeStore.challenge?.challengeStatus}
                />
                <View style={{ width: 4 }} />
                { challengeStore.challenge?.winningDrama &&
                  <WinningStatus 
                    status={challengeStore.challenge?.winningDrama.reward?.status}
                  />
                }
              </View>
              { !challengeStore.challenge?.inReview &&
                <Expiry 
                  dueDate={challengeStore.challenge?.dueDateStr}
                  isPast={challengeStore.challenge?.isPast}
                />
              }
            </View>
          </View>
        </View>

        <View style={styles.inner}>
          <Text style={styles.title}>
            {challengeStore.challenge?.title}
          </Text>
          <Text style={styles.description}>
            {challengeStore.challenge?.description}
          </Text>

          { challengeStore.challenge?.prizes.length > 0 &&
            <>
              <View style={styles.rewardWrap}>
                <Image source={ICONS['reward']}/>
                <View style={styles.rewardTitle}>
                  <View style={styles.flex}>
                    <Text style={styles.rewardText}>Rewards</Text>
                    <Pressable 
                      onPress={() => setRewardInfo(true)}>
                      <Image source={ICONS['info']}/>
                    </Pressable>
                  </View>
                  <View style={styles.line}/>
                </View>
              </View>
              <View style={{ paddingLeft: 3 }}>
                { challengeStore.challenge?.prizesByOrder.map(prize => (
                  <Prize
                    key={prize.id}
                  >{prize.numberOfPrizes}x {prize.title}</Prize>
                ))}
              </View>
            </>
          }
          { homeStore.hasGrandPrize ? 
            <View>
              <View style={styles.rewardWrap}>
                <Image source={ICONS['reward']}/>
                <Text style={[ 
                  styles.rewardText,
                  { marginLeft: 10 }
                  ]}>Grand prize</Text>
              </View> 
              <GrandPrize
                asset={homeStore.grandPrize?.photo?.url}
                title={homeStore.grandPrize?.title}
                description={homeStore.grandPrize?.descrption}/>
            </View> 
          : null }

          <View style={styles.centered}>
            <FyiCard 
              text="Get a chance to WIN the above prizes when you PARTICIPATE in this challenge."
              openInfo={() => setRewardInfo(true)}
              onRules={() => props.navigation.navigate("Rules")}
            />
            { challengeStore.challenge?.iWon ?
              challengeStore.challenge?.iWon?.reward?.status === 'COLLECTED' ? null :
              <Button
                width={151}
                height={50}
                center
                onPress={claimReward}
              >
                Claim reward
              </Button>
              :
              challengeStore.challenge?.disableParticipate ? null : 
              <UploadButton 
                resetStore={resetStore}
                upload={startedUploading}
              />
            }
            <View style={{height: 30}}/>
            <TransparentButton
              onPress={() => props.navigation.goBack()}>
              Dismiss
            </TransparentButton>
          </View>
        </View>
      </ScrollView>

      <VideoPlayer 
        open={open}
        onRequestClose={() => setOpen(false)}
        looping={true}
        src={challengeStore.challenge?.video?.src}
        thumbnail={challengeStore.challenge?.video?.thumbnail}
      />
      <RewardInfoModal 
        open={rewardInfo}
        onRequestClose={() => setRewardInfo(false)}
      />
    </View>
  )
}

export default inject('store')(observer(Challenge))

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  screenLoad: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.91)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  confetti: {
    position: 'absolute',
    zIndex: 100
  },
  container: {
    display: 'flex'
  },
  inner: {
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 32
  }, 
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontStyle: "normal",
    textTransform: 'uppercase',
    letterSpacing: 0,
    paddingBottom: 8,
    color: colors.WHITE
  },
  date: {
    marginTop: 16,
    marginBottom: 16,
    color: colors.LIGHTNING_YELLOW,
    fontWeight: "bold"
  },
  description: {
    fontSize: 14,
    lineHeight: 15,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: colors.WHITE,
    textTransform: 'capitalize',
    paddingBottom: 16
  },
  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dramas: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 40
  },
  header: {
    width: WIDTH,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  previewWrap: {
    width: '100%'
  },
  statusWrap: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: -15,
  },
  status: {
    display: 'flex',
    flexDirection: 'row',
  },
  rewardWrap: {
    marginTop: 20,
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  rewardTitle: {
    paddingLeft: 10,
    width: '90%'
  },
  rewardText: {
    fontWeight: "bold",
    color: colors.WHITE,
    marginRight: 10,
    fontSize: 18
  }, 
  line: {
    marginTop: 8,
    borderBottomColor: colors.DOVE_GRAY,
    borderBottomWidth: 1
  },
  allDramas: {
    marginTop: 34,
    width: WIDTH,
    display: 'flex',
    alignItems: 'center'
  },
  loader: {
    flex: 1,
    backgroundColor: colors.DUSTY_GRAY
  },
  flex: { 
    display: 'flex', 
    flexDirection: 'row' 
  }
})