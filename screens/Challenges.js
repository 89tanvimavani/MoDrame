import { inject, observer } from 'mobx-react'
import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Button from '../components/button/Button'
import ChallengesList from '../components/challenges-list/ChallengesList'
import AddChallengeModalIntro from '../components/modals/AddChallengeModalIntro'
import AddChallengeModalUpload from '../components/modals/AddChallengeModalUpload'
import { ICONS } from '../constants/images'
import { CHALLENGES_SCREEN } from '../constants/types'

const Challenges = (props) => {
  const [ refreshing, setRefreshing ] = useState()
  const [ openAddChallengeIntro, setOpenAddChallengeIntro ] = useState(false)
  const [ openAddChallengeUpload, setOpenAddChallengeUpload ] = useState(false)

  const { challengesStore, createChallengeStore, homeStore } = props.store

  useEffect(() => {
    challengesStore.getChallenges()
    homeStore.set('seenChallengesScreen', true)
  }, [])

  function onRefresh() {
    try {
      setRefreshing(true)
      challengesStore.getChallenges().then(res => { setRefreshing(false) })
    } catch (err) {
      setRefreshing(false)
    }
  }

  function challengesList() {
    return props.route.name === CHALLENGES_SCREEN.VERSUZ ? 
      challengesStore.relevantChallenges : challengesStore.myChallenges
  }

  function challengesLength() {
    return props.route.name === CHALLENGES_SCREEN.VERSUZ ? 
      challengesStore.relevantChallenges.length : challengesStore.myChallenges.length
  }

  function openChallenge(challenge) {
    props.navigation.navigate('Challenge', { challenge })
  }

  function createChallenge() {
    if (!createChallengeStore.termsAgreement) setOpenAddChallengeIntro(true)
    else setOpenAddChallengeUpload(true)
  }

  return (
    <>
      <View 
        style={styles.wrapper}
      >
        <ChallengesList
          challenges={ challengesList() }
          length={ challengesLength() }
          loading={challengesStore.loading}
          onRefresh={onRefresh}
          refreshing={refreshing}
          openChallenge={openChallenge}
          openModal={() => createChallenge()}
        /> 
        { props.route.name !== CHALLENGES_SCREEN.VERSUZ ?
        <View
          style={styles.button}>
          <Button
            width={59}
            height={59}
            shadow
            iconStyle={{ marginLeft: 6 }}
            onlyIconButton
            onPress={() => createChallenge()}
            icon={ICONS['upload-challenge']}/>
        </View> : null }
      </View>

      <AddChallengeModalIntro
        open={openAddChallengeIntro}
        onRequestClose={() => setOpenAddChallengeIntro(false)}
        openUploadModal={() => setOpenAddChallengeUpload(true)}
      />
      <AddChallengeModalUpload
        open={openAddChallengeUpload}
        onRequestClose={() => setOpenAddChallengeUpload(false)}
      />
    </>
  )
}

export default inject('store')(observer(Challenges))

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  button: {
    position: 'absolute',
    bottom: 16,
    right: 16
  }
})