import React, { memo } from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import colors from '../../../constants/colors';
import { WIDTH } from '../../../constants/mesures';
import Avatar from '../../avatar/Avatar';
import Text from '../../typography/Text';

const ProfileInfo = (props) => {
  return (
    <Pressable 
      style={styles.profileView}
      onPress={props.onPress}
    >
      <Avatar 
        src={props.src}
      />
      <View style={styles.infoWrap}>
        <Text style={styles.handle}>@{props.handle}</Text>
        <Text style={styles.info}>
          {props.description}
        </Text>
        <Text style={styles.info}>
          {props.tags?.map(t => `#${t} `)}
        </Text>
      </View>
    </Pressable>
  )
}

function propsAreEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default memo(ProfileInfo, propsAreEqual)

const styles = StyleSheet.create({
  handle: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.WHITE,
    marginBottom: 7
  },
  infoWrap: {
    marginLeft: 10
  },  
  info: {
    maxWidth: WIDTH - 44 - 10 - 7 - 70 - 40,
    fontSize: 12,
    color: colors.WHITE,
  },
  profileView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
  }
})