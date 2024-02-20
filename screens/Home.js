import { useIsFocused } from '@react-navigation/native'
import { inject, observer } from 'mobx-react';
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import List from '../components/list-view/List';
import Tutorial from '../components/tutorial/Tutorial';
import { TUTORIAL_SCREEN } from '../constants/types';
import Loading from '../components/placeholders/Loading';
import GrandPrize from '../components/modals/GrandPrize';
import ChannelLaunch from '../components/modals/ChannelLaunch';
import BirthdayModal from '../components/modals/BirthdayModal';

const Home = props => {
  const flatlist = useRef()
  const isFocused = useIsFocused()

  const { homeStore, reactionStore, 
    accountStore, tutorialStore, guiStore } = props.store

  const [ height, setHeight ] = useState(0)
  const [showChallengeTutorial, setShowChallengeTutorial] = useState(false)

  useEffect(() => {
    if (!guiStore.background || isFocused)
      homeStore.getDramas(true)
  }, [isFocused, guiStore.background])

  useEffect(() => {
    homeStore.increaseAppOpen()
    homeStore.getGrandPrize()
    homeStore.getNewChannels()
  }, [])

  useEffect(() => {
    const scrollTop = props.route?.params?.scrollTop

    if (scrollTop && flatlist.current) 
      flatlist.current.scrollToOffset({ offset: 0 })
  }, [isFocused, flatlist])

  const profilePress = useCallback(
    (userId) => props.navigation.navigate('PublicProfile', {
      userId
    }),[])

  const react = useCallback(
    (reactionType, add, dramaId) => reactionStore.createReaction(
      reactionType,
      dramaId,
      add
    ).then(res => homeStore.updateFlatListData()), [])

  const challengePress = useCallback(
    (challenge) => {
      props.navigation.navigate('Challenge', { challenge })
      homeStore.set('seenChallengePress', true)
    }, [])

  const onView = useCallback(
    (dramaId) => accountStore.pushView(dramaId), [])

  const firstDrama = useCallback(
    (dramaId) => homeStore.firstDrama(dramaId), [])

  const setLoaded = useCallback(
    (value, dramaId) => homeStore.setLoaded(value, dramaId), [])

  function onRefresh() {
    homeStore.getDramas(true)
  }

  function onEndReached() {
    if (homeStore.empty) return null
    if (homeStore.loading) return null
    homeStore.nextPage()
  }

  const footerComponent = () => (
    homeStore.loading ? 
      <Loading height={props.height} iconOnly/> : null
  )

  return (
    <View 
      style={styles.container} 
      onLayout={e => setHeight(e.nativeEvent.layout.height)}
    >
      { height !== 0 ?
        <>
          { tutorialStore.introTutorial &&
            <Tutorial 
              dismiss={() => tutorialStore.seenIntroTutorial()}
              screen={TUTORIAL_SCREEN.INTRO}
            />
          }
          { tutorialStore.homeChallengeTutorial && showChallengeTutorial &&
            <Tutorial 
              dismiss={() => tutorialStore.seenHomeChallengeTutorial()}
              screen={TUTORIAL_SCREEN.HOME_CHALLENGE}
            />
          }
          { isFocused ? <List
            ref={flatlist}
            activateButton={homeStore.activateButtonAnimation}
            postLength={homeStore.dramas.length}
            posts={homeStore.dramas}
            onRefresh={onRefresh}
            refreshing={homeStore.refreshing}
            onEndReached={onEndReached}
            height={height}
            update={homeStore.update}
            loading={homeStore.loading}
            setShowChallengeTutorial={(props) => setShowChallengeTutorial(props)}
            setActiveScreen={(props) => setActiveScreen(props)}
            profilePress={profilePress}
            challengePress={challengePress}
            footerComponent={footerComponent}
            react={react}
            onView={onView}
            setLoaded={setLoaded}
            firstDrama={firstDrama}
          /> : null }
        </> : null
      }
      <GrandPrize
        open={guiStore.grandPrizeModal}
        onRequestClose={() => guiStore.setGrandPrizeModal()}/>
      <BirthdayModal
        open={accountStore.birthdayModalOpen}
        onRequestClose={() => accountStore.closeBirthdayModal()}/>
      <ChannelLaunch
        open={guiStore.channelLaunchModal}
        addToSeenChannelModal={(id) => accountStore.addSeenChannelModal(id)}
        onRequestClose={() => guiStore.setChannelLaunchModal()}/>
    </View>
  )
}

export default inject('store')(observer(Home))


const styles = StyleSheet.create({
  container: {
    flex: 1
  },  
  wrapper: {
    position: 'relative'
  },
  video: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
})

