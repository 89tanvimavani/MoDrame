import React from 'react'
import {
  StyleSheet,
  Text,
  Pressable,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from '../../constants/colors'
import { titleStyles } from '../../styles-main/texts'
import { WIDTH } from '../../constants/mesures'
import { PRIMARY_FONT_BOLD, PRIMARY_FONT_LIGHT } from '../../constants/constants'

const TopTabBar = (props) => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[
      styles.header,
      { paddingTop: insets.top +  7 }
    ]}>
      <Text style={titleStyles.title}>Challenges</Text>
        <View style={styles.navigation}>
        { props.state.routes.map((r, i) => (
            <Pressable 
              onPress={() => props.navigation.navigate(r.name) }
              style={[
                styles.navItem,
                i !== props.state.index && { borderBottomWidth: 0 }
              ]}
              key={r.key}
            >
              <Text 
                style={[
                  styles.text,
                  i !== props.state.index && { fontSize: 16, color: colors.BOULDER },
                  i === props.state.index && { fontFamily: PRIMARY_FONT_BOLD }
                ]}>
                {props.descriptors[r.key].options.tabBarLabel}
              </Text>
            </Pressable>
          ))
        }
        </View>
    </View>
  )
}

export default TopTabBar

const styles = StyleSheet.create({
  header: {
    paddingLeft: 16,
    paddingRight: 16
  },
  navigation: {
    display: 'flex',
    flexDirection: 'row',
    width: WIDTH - 32,
    justifyContent: 'space-around'
  },
  navItem: {
    flex: 2,
    marginTop: 16,
    borderBottomColor: colors.WHITE,
    borderBottomWidth: 1
  },
  text: {
    textAlign: 'center',
    paddingBottom: 8,
    fontSize: 19,
    color: colors.WHITE,
    fontFamily: PRIMARY_FONT_LIGHT
  },
})