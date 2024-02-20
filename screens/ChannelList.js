import { useIsFocused } from '@react-navigation/native'
import { inject, observer } from 'mobx-react'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Loading from '../components/placeholders/Loading'
import EndOfChannel from '../components/channel/sub-components/EndOfChannel'
import { HEIGHT, WIDTH } from '../constants/mesures'
import List from '../components/list-view/List'

const ChannelList = props => {
  const flatlist = useRef()
  const isFocused = useIsFocused()

  const { reactionStore, channelStore,
    accountStore } = props.store

  const [ height, setHeight ] = useState(0)
  const [ showFooter, setShowFooter ] = useState(false)

  useEffect(() => {
    if (showFooter) {
      setTimeout(() => {
        setShowFooter(false)
      }, 3000)
    }
  }, [showFooter])

  const profilePress = useCallback(
    (channelId) => props.navigation.navigate('ChannelStack', {
      screen: 'Channel',
      params: { channelId: channelId },
    }),[])

  const react = useCallback(
    (reactionType, add, dramaId) => reactionStore.createReaction(
      reactionType,
      dramaId,
      add
    ).then(res => channelStore.updateFlatListData()), [])

  const onView = useCallback(
    (dramaId) => accountStore.pushView(dramaId), [])

  const goBack = useCallback(
    () => props.navigation.goBack(), [])

  function onRefresh() {
    channelStore.getPosts(true)
  }

  function onEndReached() {
    if (channelStore.empty) return null
    if (channelStore.loading) return null
    channelStore.nextPage()
  }

  const footerComponent = () => {
    return showFooter && channelStore.channel?.dramas.length === channelStore.postsLength ? 
      <View style={styles.absoluteCenter}>
        <EndOfChannel/>
      </View> : channelStore.loading ? <Loading iconOnly height={height}/> : null
  }

  return ( 
    <View 
      style={styles.container} 
      onLayout={e => setHeight(e.nativeEvent.layout.height)}
    >
      {isFocused ? <List
        ref={flatlist}
        postLength={channelStore.postsLength}
        posts={channelStore.channel?.dramas}
        onRefresh={onRefresh}
        footerComponent={footerComponent}
        refreshing={channelStore.refreshing}
        onEndReached={onEndReached}
        height={HEIGHT}
        update={channelStore.update}
        loading={channelStore.loading}
        initialScrollIndex={props.route?.params?.postId}
        profilePress={profilePress}
        setShowFooter={() => setShowFooter(true)}
        goBack={goBack}
        react={react}
        onView={onView}
        channel
      /> : null }
    </View>
  )
}

export default inject('store')(observer(ChannelList))


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
  absoluteCenter: {
    position: 'absolute',
    bottom: 65,
    width: WIDTH,
    display: 'flex',
    alignItems: 'center'
  }
})

