import React, { useRef, useEffect, useState } from 'react'
import {
  View, 
  StyleSheet,
  Pressable,
  Image,
  Text,
  Animated
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from '../../constants/colors'
import { ICONS } from '../../constants/images'

const icons = [
  ICONS['home'],
  ICONS['notifications'],
  ICONS['challenge-bolt'],
  ICONS['search']
]

const MIN_TIME = 8000
const ADD_TIME = 10000

const TabBar = (props) => {
  let interval = useRef()
  const insets = useSafeAreaInsets()

  const avatarPlaceholder = ICONS['avatar']
  let selectedAnim = useRef(new Animated.Value(1)).current
  let opacity = useRef(new Animated.Value(1)).current

  const [ error, setError ] = useState(false)

  useEffect(() => {
    clearTimeout(interval.current)
    if (props.state.index !== 2) {
      interval.current = setTimeout(animate, getRandomInterval())
    }
  }, [props.state.index])

  const animate = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(selectedAnim, {
          toValue: 1.6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(selectedAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(selectedAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(selectedAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ]).start(() => {
      interval.current = setTimeout(animate, getRandomInterval())
    })
  }

  function getRandomInterval() {
    return Math.round(Math.floor(Math.random() * ADD_TIME) + MIN_TIME)
  }

  function getIcon(i) {
    return icons[i]
  }

  return (
    <View style={[
      styles.wrapper,
      {
        paddingBottom: insets.bottom + 6
      }
    ]}>
      <View style={styles.bar}>
        { props.state.routes.map((r, i) => (
            <Pressable 
              onPress={() => {
                if (r.name === 'PROFILE') {
                  props.navigation.navigate(r.name, {
                    screen: 'Profile'
                  })
                } else {
                  props.navigation.navigate(r.name)
                }    
              }}
              key={r.key} 
              style={styles.tab}
            >
              <View 
                style={
                  [ styles.iconWrap,
                    i === 2 && styles.centered,
                    i === props.state.index && styles.active ]}
              >
                { i < 4 ? 
                  <>
                   { i === 2 && !props.seenChallengesScreen ?
                      <Animated.Image
                        style={{
                          opacity: 1,
                          tintColor: colors.LIGHTNING_YELLOW,
                          transform: [{ scale: selectedAnim }],
                          position: 'absolute'
                        }}
                        source={getIcon(i)}
                      /> : null
                    }
                    <Animated.Image 
                      style={{
                        opacity: i === 2 && !props.seenChallengesScreen ? opacity : 1,
                        tintColor: i !== props.state.index && i === 2 ? colors.BLACK : colors.WHITE,
                        transform: i === 2 && !props.seenChallengesScreen ? [{ scale: selectedAnim }] : []
                      }}
                      source={getIcon(i)}
                    /> 
                  </>:
                  <Image 
                    style={(props.avatar && !error)? styles.avatar : styles.placeholder}
                    source={(props.avatar && !error) ? {uri: props.avatar} : avatarPlaceholder}
                    onError={() => setError(true)}
                    onSuccess={() => setError(false)}
                  /> }
              </View>
              <Text style={[
                styles.label,
                i === 2 && styles.centeredLabel,
                i === props.state.index && styles.activeLabel
              ]}>
                {props.descriptors[r.key].options.tabBarLabel}
              </Text>
            </Pressable>
        ))}
      </View>
    </View>
  )
}

export default TabBar

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.BLACK
  },
  bar: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tab: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    paddingTop: 4,
    width: '20%',
  },
  iconWrap: {
    height: 32, 
    width: 32,
    backgroundColor: colors.BLACK,
    borderRadius: 64,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    height: 52, 
    width: 52,
    backgroundColor: colors.WHITE,
    position: 'relative',
    bottom: 22
  },
  active: {
    backgroundColor: colors.LIGHTNING_YELLOW,
  },
  centeredLabel: {
    position: 'relative',
    bottom: 20
  },
  label: {
    color: colors.WHITE,
    fontSize: 10,
    fontWeight: '500',
  },
  activeLabel: {
    color: colors.LIGHTNING_YELLOW
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50
  },
  placeholder: {
    height: "57%",
    width: "63%"
  }
})