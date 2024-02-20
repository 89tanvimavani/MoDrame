import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, Image, Text, Pressable } from 'react-native'
import colors from '../../constants/colors'
import { REACTIONS } from '../../constants/images'
import { WIDTH } from '../../constants/mesures'
import Emoji from '../emojis/Emoji'
import AnimatedLinearGradient from 'react-native-animated-linear-gradient'
import FastImage from 'react-native-fast-image'
import { REACTION_TYPES } from '../../constants/types'
import ReactionsModal from '../modals/ReactionsModal'

const ChannelPost = React.forwardRef((props, ref) => {
  const [ openReactions, setOpenReactions ] = useState(false)
  const [ px, setPx ] = useState(false)
  const [ py, setPy ] = useState(false)
  const reactions = useRef()

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

  function react() {
    reactions?.current?.measure((fx, fy, width, height, px, py) => {
      setPx(px)
      setPy(py)
      setOpenReactions(true)
    })
  }

  return (
    <View
      ref={ref}
      style={styles.wrapper}>
      <Pressable 
        style={styles.imageWrapper}
        onPress={props.onPress}>
        { props.gif ? 
          <FastImage 
            style={styles.image}
            source={{ uri: props.gif }}/> : 
          <Image 
            style={styles.image} 
            source={{ uri: props.poster }}/>
          }
        { !props.poster && !props.gif ?
          <AnimatedLinearGradient 
            style={styles.loading}
            customColors={[
              '#1F1F1F',
              '#1F1F1F',
              '#1F1F1F',
              '#000000',
            ]} 
            speed={1500}
          /> : null
        }
      </Pressable>
      <View style={styles.textWrapper}>
        <Pressable onPress={props.onPress}>
          <Text 
            numberOfLines={1} 
            ellipsizeMode='tail' 
            style={styles.title}>
          {props.description}</Text>
          <Text style={styles.description}>{props.description}</Text>
          <Text style={styles.views}>{props.views} Views</Text>
        </Pressable>
        <View style={styles.reactionsWrap}>
          <View ref={reactions} style={styles.react}>
          { props.reactionTypes.length === 0 ? 
            <Emoji 
              channelReactions
              source={REACTIONS.smile} 
              onPress={() => react()}/> :
              props.reactionTypes?.map((r, id) => 
              <Emoji 
                key={id}
                channelReactions
                left={id*16}
                source={getEmojiSource(r.type)}
                onPress={() => react()}/>
            )}
            <Pressable
              style={{
                  position: 'absolute',
                  left: 16 * props.reactionTypes.length + 20,
                  marginLeft: props.reactionTypes.length === 0 ? 16 : 0
                }}
              onPress={() => react()}>
            <Text style={styles.reactions}>Reactions</Text>
            </Pressable>
          </View>
          <Text style={styles.views}>{props.reactionNumber}</Text>
        </View>
      </View>
      <ReactionsModal
        top={py}
        left={px}
        open={openReactions}
        react={(reactionType, add) => {
          props.react(reactionType, add, props.id)
          setOpenReactions(false)
        }}
        reactions={props.reactions}
        reactionId={props.reactionId}
        id={props.id}
        onRequestClose={() => setOpenReactions(false)}
      />
    </View>
  )
})

export default ChannelPost

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: WIDTH - 30,
  },
  imageWrapper: {
    position: 'relative',
    backgroundColor: colors.TUATARA,
    overflow: 'hidden',
    borderRadius: 8
  },
  image: {
    width: 105,
    height: 145,
    backgroundColor: colors.TUATARA
  },
  loading: {
    position: 'absolute',
  },
  textWrapper: { 
    paddingLeft: 14,
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
    marginTop: 5,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: colors.WHITE,
    maxWidth: WIDTH - 30 - 105,
    paddingBottom: 6
  },
  title: {
    color: colors.WHITE,
    fontWeight: 'bold',
    fontSize: 15,
    paddingBottom: 8,
    maxWidth: WIDTH - 30 - 105
  },
  views: {
    color: colors.GRAY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  reactions: {
    color: colors.GRAY,
    fontSize: 16, 
    paddingLeft: 8,
  },
  react: {
    display: 'flex', 
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 3
  },
  reactionsWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  absoluteReactions: {
    position: 'absolute',
    left: 15,
    bottom: 15,
    zIndex: 3
  }
})