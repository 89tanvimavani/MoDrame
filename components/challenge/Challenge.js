import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import colors from '../../constants/colors'
import { WIDTH } from '../../constants/mesures'
import Text from '../typography/Text'
import { DateTime } from 'luxon'
import WinningStatus from './sub-components/WinningStatus'
import { Shadow } from 'react-native-shadow-2'
import { PRIMARY_FONT_BOLD } from '../../constants/constants'
import Button from '../button/Button'
import Border from '../post/sub-components/Border'

const Challenge = (props) => {
  return (
    <Pressable 
      style={styles.wrapper}
      onPress={!props.inReview ? props.onPress : null}
    >
      <Shadow>
        <FastImage
          style={styles.image}
          source={{ uri: props.gif }}
        />
      </Shadow>
      <View style={styles.body}>
        <View>
        <View style={styles.row}>
          {props.won && 
            <WinningStatus 
              status={props.won.reward?.status}
            />
          }
        </View>
        <Text style={styles.title} numberOfLines={1}>{props.title}</Text>
        <Text style={styles.description}>{props.description}</Text>
        { !props.inReview ?
          <>
            { props.isPast ?
                <Text style={styles.date} numberOfLines={1}>Challenge is over</Text> :
                <Text style={styles.date} numberOfLines={1}>
                  Active until {props.dueDateStr}
                </Text>
            }
          </> :
            <Text style={styles.date}>{props.status}</Text>
        }
        </View>
        { !props.disabled && 
          <Button
            onPress={props.onPress}
            height={34}
            textShadow
            width={95}
            fontSize={12}>
            PARTICIPATE
          </Button>
        }
      </View>
    </Pressable>
  )
}

export default Challenge

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16
  },
  image: {
    height: 177,
    width: 130,
    borderRadius: 15,
    backgroundColor:'#d9d9d9'
  },
  body: {
    paddingLeft: 12,
    paddingRight: 6,
    display: 'flex',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    color: colors.WHITE,
    marginTop: 6,
    marginBottom: 6,
    width: WIDTH - 134 - 12 - 6 - 24
  },
  description: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 19,
    color: colors.WHITE,
    width: WIDTH - 134 - 12 - 6 - 24
  },
  date: {
    fontSize: 14,
    fontFamily: PRIMARY_FONT_BOLD,
    letterSpacing: 0,
    color: colors.LIGHTNING_YELLOW,
    marginTop: 15,
    width: WIDTH - 134 - 12 - 6 - 24
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  }
})