import React from 'react'
import {
  View, 
  StyleSheet,
  Image
} from 'react-native'
import colors from '../../constants/colors'
import { ICONS } from '../../constants/images'
import { WIDTH } from '../../constants/mesures'
import Link from '../typography/Link'
import Text from '../typography/Text'

const EmptyPlaceholder = (props) => {
  return (
    <View style={styles.wrapper}>
      <Image 
        source={ICONS['empty']}
      />
      <Text style={styles.title}>{props.title}</Text>
      {!props.onPress && 
        <Text style={styles.description}>
          {props.description}
        </Text>
      }
      { props.onPress && 
        <Link
          underline
          color={colors.CANDLELIGHT}
          onPress={props.onPress}
          customStyle={styles.link}
        >{props.description}</Link>
      }
    </View>
  )
}

export default EmptyPlaceholder

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: colors.SILVER_CHALICE,
    fontSize: 14,
    marginTop: 13,
    marginBottom: 5,
    maxWidth: WIDTH - 32,
    textAlign: 'center'
  },
  description: {
    color: colors.WHITE,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: WIDTH - 32,
  },
  link: {
    maxWidth: WIDTH - 32,
    textAlign: 'center'
  }
})