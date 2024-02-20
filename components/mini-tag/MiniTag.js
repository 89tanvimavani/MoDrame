import React, { memo } from 'react'
import {
  View,
  StyleSheet,
  Image, 
  Platform
} from 'react-native'
import colors from '../../constants/colors'
import Text from '../typography/Text'

const MiniTag = (props) => {
  return (
    <View style={[
      styles.wrapper,
      {
        height: props.mini ? 12 : 21,
        minWidth: props.mini ? 30 : 41
      }
    ]}>
      { props.icon && <Image style={styles.icon} source={props.icon}/>}
      <Text style={[
        styles.tag, {
          fontSize: props.mini ? 10 : 17
        }
      ]}>{props.children}</Text>
    </View>
  )
}

function propsAreEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default memo(MiniTag, propsAreEqual)

MiniTag.defaultProps = {
   fontSize: 17,
   height: 21, 
   mini: false
 }

const styles = StyleSheet.create({
  wrapper: {
    height: 21,
    borderRadius: 16,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
    minWidth: 41,
    alignItems: 'center'
  },
  tag: {
    fontSize: 17,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: colors.WHITE,
    ...Platform.select({
      ios: {
        marginBottom: -2
      },
      android: {

      }
    })
  },
  icon: {
    marginRight: 3
  }
})