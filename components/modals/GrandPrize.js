import React from 'react'
import { StyleSheet, View, Image, ScrollView } from 'react-native'
import Text from '../../components/typography/Text'
import colors from '../../constants/colors'
import Modal from '../modal/Modal'
import TransparentButton from '../button/TransparentButton'
import { ICONS } from '../../constants/images'
import { inject, observer } from 'mobx-react'
import Button from '../button/Button'
import { useNavigation } from '@react-navigation/native'

const GrandPrize = (props) => {
  const navigation = useNavigation()
  const { homeStore } = props.store

  function open() {
    props.onRequestClose()
    navigation.navigate('CHALLENGES')
  }

  return (
    <Modal
      open={props.open}
      swipeDirection={null}
      borderRadius={20}
      onRequestClose={props.onRequestClose}>
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TransparentButton
            onlyIconButton
            absoluteRight
            icon={ICONS['close']}
            onPress={props.onRequestClose}
          />
            { homeStore?.grandPrize?.photo?.url ?
              <View style={styles.avatarWrapper}>
                <Image source={ICONS['grand-background']}/>
                <Image 
                  style={styles.image} 
                  source={{uri: homeStore.grandPrize?.photo?.url}}/>
                <View style={styles.buttonPosition}>
                  <Image source={ICONS['grandprize']}/>
                </View>
              </View> : null
            }
            <Text style={styles.description}>
              {homeStore.grandPrize?.descrption}
            </Text>
            <Button
              height={49}
              width={170}
              center
              fontSize={14}
              fontWeight='bold'
              onPress={() => open()}
            >PARTICIPATE & WIN</Button>
            <View style={{height: 20}}/>
            <TransparentButton
              color={colors.GOLDEN_GRASS}
              onPress={props.onRequestClose}>
              Dismiss
            </TransparentButton>
        </ScrollView> 
      </View>
    </Modal>
  )
}

export default inject('store')(observer(GrandPrize))

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: colors.MINE_SHAFT,
    borderRadius: 11,
  },
  scroll: {
    width: "100%",
    paddingTop: 16,
    paddingBottom: 22,
    paddingLeft: 22,
    paddingRight: 22,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    width: 179,
    height: 179,
    top: 5,
    left: 5,
    right: 0,
    bottom: 0,
    borderRadius: 100
  },
  description: {
    fontSize: 15,
    color: colors.WHITE,
    paddingBottom: 16,
    paddingTop: 22,
    lineHeight: 22
  },
  buttonPosition: {
    position: 'absolute',
    top: 147,
    right: 10
  },
  avatarWrapper: {
    marginTop: 20,
    position: 'relative'
  }
})