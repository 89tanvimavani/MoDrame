import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import colors from '../../../constants/colors'
import Text from '../../typography/Text'
import { WIDTH } from '../../../constants/mesures'

const GrandPrize = (props) => {
  return (
    <View style={styles.wrapper}>
      <Image source={{ uri: props.asset }} style={styles.image}/>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.description}>{props.description}</Text>
      </View>
    </View>
  )
}

export default GrandPrize

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginTop: 8,
    marginBottom: 15,
    backgroundColor: colors.COD_SHAFT,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 6
  },
  textWrapper: {
    padding: 20,
    maxWidth: '75%'
  },
  image: {
    height: '100%',
    minHeight: 100,
    width: 90,
    objectFit: 'cover',
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.WHITE,
    paddingBottom: 8
  },
  description: {
    fontSize: 13,
    color: colors.WHITE
  }
})