import React from 'react'
import {RefreshControl} from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { FlatList } from 'react-native'
import EmptyPost from '../../placeholders/EmptyPost'
import colors from '../../../constants/colors'
import Post from '../../post/Post'
import { X_POST, NUMBER_OF_ANIMATIONS } from '../../../constants/globals'

const FlatListView = React.forwardRef((props, ref) => {
  const isFocused = useIsFocused()

  const animateButton = (index) => {
    return index % X_POST === 0 && index < NUMBER_OF_ANIMATIONS * X_POST && props.activateButton
  }
  
  const getItemLayout = (_, index) => ({
    length: props.height,
    offset: props.height * (index),
    index
  })

  const renderItem = ({item, index}) => {
    return <Post
      height={props.height}
      channel={props.channel}
      animateButton={animateButton(index)}
      id={item?.id}
      hashId={item?.hashId}
      reportVisible={!item.mine}
      uri={item?.video?.src}
      poster={item?.video?.thumbnail}
      duration={item?.video?.duration}
      description={item?.description}
      reactions={item?.reactions}
      numberOfReactions={item?.numberOfReactions}
      challenge={item?.challenge}
      user={item?.user}
      icon={item?.icon}
      border={item?.frame}
      tags={item?.tags}
      winner={item?.winner}
      views={item?.formattedViews}
      reactionId={item?.reactionId}
      active={
        index === props.activeScreen 
        && isFocused
      }
      profilePress={props.profilePress && props.profilePress}
      challengePress={props.challengePress}
      react={props.react}
      onView={props.onView}
      goBack={props.goBack ? props.goBack : null}
      setLoaded={props.firstDrama && props.firstDrama(item?.id) ? props.setLoaded : null}
      firstDrama={props.firstDrama && props.firstDrama(item?.id) ? props.firstDrama : null}
    />
  }

  return (
    <FlatList
      ref={ref}
      contentContainerStyle={{ paddingTop: props.refreshing ? 40 : null}}
      refreshControl={
        <RefreshControl 
          refreshing={props.refreshing}
          progressViewOffset={40}
          onRefresh={props.onRefresh}
          tintColor={colors.LIGHTNING_YELLOW}
        />
      }
      maxToRenderPerBatch={5}
      initialNumToRender={3}
      windowSize={9}
      initialScrollIndex={props.initialScrollIndex}
      removeClippedSubviews={true}
      getItemLayout={getItemLayout}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      ListFooterComponent={props.footerComponent}
      onEndReached={props.onEndReached}
      onEndReachedThreshold={3}
      onScroll={props.onScroll}
      data={props.posts}
      extraData={{
        update: props.update,
        loading: props.loading
      }}
      keyExtractor={item => `${item.id}`}
      pagingEnabled
      ListEmptyComponent={() => <EmptyPost 
        loading={props.loading}
      />}
      renderItem={renderItem}
    />
)})

export default FlatListView