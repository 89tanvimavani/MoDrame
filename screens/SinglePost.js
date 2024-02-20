import { useIsFocused } from '@react-navigation/native'
import { inject, observer } from 'mobx-react'
import React, { useEffect, useState, useCallback } from 'react'
import {
  View, 
  StyleSheet
} from 'react-native'
import Post from '../components/post/Post'
import PullClose from '../components/pull-close/PullClose'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SinglePost = (props) => {
  const isFocused = useIsFocused()
  const insets = useSafeAreaInsets()

  const [ drama, setDrama ] = useState(null)
  const [ height, setHeight ] = useState(0)
  const [ lockPull, setLockPull ] = useState(false)

  const { dramasFactory, accountStore, reactionStore } = props.store
  let dramaId = props.route?.params?.dramaId

  useEffect(() => {
    if (isFocused) {
      dramasFactory.getDrama(dramaId)
        .then(res => {
          if (!res) {
            props.navigation.navigate('NOTIFICATIONS')
          } else if (res.error) {
            return props.navigation.goBack()
          }

          reactionStore.getReactionsById([dramaId]).then(() => {
            setDrama(res)
          })
        })
    }
  }, [isFocused])

  const profilePress = useCallback(
    (userId) => props.navigation.navigate('PublicProfile', {
      userId
    }),[]
  )

  const challengePress = useCallback(
    (challenge) => props.navigation.navigate('Challenge', { challenge }), []
  )

  const react = useCallback(
    (reactionType, add, dramaId) => reactionStore.createReaction(
      reactionType,
      dramaId,
      add
    ), []
  )

  const onView = useCallback(
    (dramaId) => accountStore.pushView(dramaId), []
  )

  if (!drama) return null
  return (
    <View 
      style={{
        ...styles.wrapper,
        paddingBottom: insets.bottom
      }}
      onLayout={e => setHeight(e.nativeEvent.layout.height)}
    >
      <PullClose
        onAction={() => props.navigation.goBack()}
        lock={lockPull}
      >
        <Post 
          id={drama.id}
          hashId={drama.hashId}
          uri={drama.video?.src}
          poster={drama.video?.thumbnail}
          duration={drama.video?.duration}
          description={drama.description}
          winner={drama.winner}
          border={drama.frame} //TO DO: {drama.border}
          icon={drama.icon}
          views={drama.formattedViews}
          tags={drama.tags}
          user={drama.user}
          challenge={drama.challenge}
          reactions={drama.reactions}
          numberOfReactions={drama.numberOfReactions}
          reactionId={drama?.reactionId}
          active={true}
          height={height}
          fullScreen
          profile
          reportVisible={!drama.mine}
          goBack={() => props.navigation.goBack()}
          onLockClose={() => setLockPull(true)}
          onUnlockClose={() => setLockPull(false)}
          profilePress={profilePress}
          challengePress={challengePress}
          react={react}
          onView={onView}
        />
      </PullClose>
    </View>
  )
}

export default inject('store')(observer(SinglePost))

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  }
})