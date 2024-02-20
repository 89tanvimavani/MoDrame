import React, { useRef } from 'react'
import { 
  Pressable,
  View,
  StyleSheet,
  Image,
  Animated
} from 'react-native'
import colors from '../../constants/colors'
import Text from '../typography/Text'
import { DateTime } from 'luxon'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { ICONS } from '../../constants/images'

const Notification = (props) => {
  const swipeableRef = useRef(null)

  const renderRightAction = (progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [74, 0],
    });

    function deleteNotif() {
      props.deleteNotification()
    }

    return (
      <View style={{ width: 74 }}>
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <Pressable
            style={styles.rightAction}
            onPress={deleteNotif}
          >
            <Image source={ICONS.delete}/>
          </Pressable>
        </Animated.View>  
      </View>
    );
  };

  function close() {
    swipeableRef.current.close()
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightAction}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      onSwipeableClose={close}
    >
      <View 
        onPress={props.onPress} 
        style={styles.wrapper}>
        <View style={styles.head}>
          {!props.seen && <View style={styles.new}/>}
          <Text style={styles.title}>{props.title}</Text>
        </View>
        <Text style={styles.description}>
          {props.description}
        </Text>
        { !props.noButton ? 
          <Pressable onPress={props.onPress}>
            <Text style={styles.button}>OPEN</Text>
          </Pressable> 
        : null }
        <Text style={styles.date}>{DateTime.fromISO(props.date).toRelative()}</Text>
      </View>
    </Swipeable>
  )
}

export default Notification

const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 16,
    marginRight: 16,
    paddingVertical: 16,
  },
  head: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0,
    color: colors.WHITE
  },
  new: {
    height: 18,
    width: 18,
    borderRadius: 36,
    backgroundColor: colors.LIGHTNING_YELLOW,
    marginRight: 4
  },
  description: {
    fontSize: 14,
    lineHeight: 17,
    marginTop: 8,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: colors.WHITE
  },
  button: {
    paddingTop: 16, 
    color: colors.LIGHTNING_YELLOW,
    fontWeight: 'bold'
  },
  date: {
    color: colors.DOVE_GRAY,
    fontSize: 14,
    marginTop: 12
  },

  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.TUATARA,
  },
})