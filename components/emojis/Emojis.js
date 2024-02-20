import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import colors from '../../constants/colors'
import Emoji from './Emoji'
import { REACTION_TYPES } from '../../constants/types'
import { REACTIONS } from '../../constants/images'
import { find } from 'lodash'

const Emojis = props => {
  const [ state, updateState ] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])
  
  function activate(reaction) {
    let currentlyActive = find(props.reactions, r => r.liked)?.type
    let id = props.reactionId(reaction.type)
    let likedId = props.reactionId(currentlyActive)
    
    let add; 
    if (likedId > -1) {
      if (likedId === id) add = -1
      else add = 0
    } else add = 1

    props.reactions[id].set('liked', !props.reactions[id].liked)
    if (reaction.liked) {
      props.reactions[id].set('counter', props.reactions[id].counter+1)
      if (currentlyActive) {
        props.reactions[likedId].set('counter', props.reactions[likedId].counter > 0 ? props.reactions[likedId].counter-1 : 0)
        props.reactions[likedId].set('liked', false)
      }
    } else {
      props.reactions[id].set('counter', props.reactions[id].counter > 0 ? props.reactions[id].counter-1 : 0)
    }
    
    props.onReactionPress(reaction.type, add)
    forceUpdate()
  }

  function getEmojiSource(type) {
    switch (type) {
      case REACTION_TYPES.NICE:
        return REACTIONS.smile
      case REACTION_TYPES.SAD:
        return REACTIONS.cry
      case REACTION_TYPES.OH:
        return REACTIONS.confused
      case REACTION_TYPES.ANGRY:
        return REACTIONS.angry
    }
  }

  function getActiveSource(type) {
    switch (type) {
      case REACTION_TYPES.NICE:
        return REACTIONS['smile-active']
      case REACTION_TYPES.SAD:
        return REACTIONS['cry-active']
      case REACTION_TYPES.OH:
        return REACTIONS['confused-active']
      case REACTION_TYPES.ANGRY:
        return REACTIONS['confused-active']
    }
  }

  return (
    <View style={[
        styles.wrapper,
        props.channelReactions && styles.channelReactions
      ]}>
      { props.reactions?.map((reaction, i) => (
          <Emoji 
            channelReactions={props.channelReactions}
            key={reaction.type}
            source={getEmojiSource(reaction.type)} 
            activeSource={getActiveSource(reaction.type)}
            counter={reaction.counter} 
            onPress={() => activate(reaction, i)}
            active={reaction.liked}
          />
        ))
      }
      <Text style={styles.reactions}>
        {props.numberOfReactions}
      </Text>
    </View>
  )
}

export default Emojis

const styles = StyleSheet.create({
  wrapper: {
    width: 46,
    borderRadius: 31,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10
  },
  channelReactions: { 
    backgroundColor: colors.WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 9,
    paddingTop: 10,
    height: 45,
    width: 165
  },
  height: {
    height: 10
  },
  reactions: {
    color: colors.WHITE,
    paddingTop: 8
  }
})