import React, { useState } from 'react'
import { Platform } from 'react-native'
import ListView from './list-components/ListView'
import FlatListView from './list-components/FlatListView'

const List = React.forwardRef((props, ref) => {
  const [activeScreen, setActiveScreen] = useState(0)

  function onScroll(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;
    let pageNum = Math.floor((contentOffset.y + viewSize.height/2 )/ viewSize.height)
    let overflow = Math.ceil((contentOffset.y + viewSize.height)/ viewSize.height)
    
    if (pageNum === 3 && props.setShowChallengeTutorial) 
      props.setShowChallengeTutorial(true)
    if (pageNum !== activeScreen) setActiveScreen(pageNum)
    if (overflow === props.postLength+1 && props.setShowFooter) props.setShowFooter()
  }

  return (
    Platform.OS === 'ios' ?
      <FlatListView
        ref={ref}
        channel={props.channel}
        goBack={props.goBack}
        initialScrollIndex={props.initialScrollIndex}
        activateButton={props.activateButton}
        onRefresh={props.onRefresh}
        refreshing={props.refreshing}
        height={props.height}
        footerComponent={props.footerComponent}
        onEndReached={props.onEndReached}
        onScroll={onScroll}
        activeScreen={activeScreen}
        posts={props.posts}
        update={props.update}
        loading={props.loading}
        profilePress={props.profilePress}
        challengePress={props.challengePress}
        react={props.react}
        onView={props.onView}
        setLoaded={props.setLoaded}
        firstDrama={props.firstDrama}
        footerComponent={props.footerComponent}
      /> :
      <ListView
        ref={ref}
        channel={props.channel}
        goBack={props.goBack}
        initialScrollIndex={props.initialScrollIndex}
        activateButton={props.activateButton}
        postLength={props.postLength}
        posts={props.posts}
        onRefresh={props.onRefresh}
        refreshing={props.refreshing}
        footerComponent={props.footerComponent}
        onEndReached={props.onEndReached}
        mine={props.mine}
        onScroll={onScroll}
        height={props.height}
        update={props.update}
        loading={props.loading}
        setShowChallengeTutorial={props.setShowChallengeTutorial}
        profilePress={props.profilePress}
        challengePress={props.challengePress}
        react={props.react}
        onView={props.onView}
        setLoaded={props.setLoaded}
        firstDrama={props.firstDrama}
        footerComponent={props.footerComponent}
      />
)})

export default List