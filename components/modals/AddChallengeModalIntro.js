import { inject, observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { Pressable, StyleSheet, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Image, Linking} from 'react-native'
import Text from '../typography/Text'
import colors from '../../constants/colors'
import Modal from '../modal/Modal'
import Button from '../button/Button'
import Link from '../typography/Link'
import { ICONS } from '../../constants/images'
import TransparentButton from '../button/TransparentButton'

const AddChallengeModalIntro = (props) => {
  const { createChallengeStore } = props.store

  useEffect(() => {
    createChallengeStore.set('termsError', false)
  }, [])
  
  function continueCreating() {
    if (!createChallengeStore.termsAgreement)
      createChallengeStore.set('termsError', true)
    else {
      createChallengeStore.set('termsError', false)
      props.onRequestClose()
      setTimeout(() => {props.openUploadModal()}, 500);
    }
  }

  return (
    <Modal
      noMargin
      open={props.open}
      onRequestClose={props.onRequestClose}>
      <View style={styles.wrapper}>
        <ScrollView style={styles.scrollView}>
          <TouchableOpacity>
            <TouchableWithoutFeedback>
              <View style={styles.content}>
                <TransparentButton
                  onlyIconButton
                  absoluteRight
                  icon={ICONS['close']}
                  onPress={props.onRequestClose}
                />
                <Text 
                  style={styles.p}>
                  “Create Challenge” on Versuz helps you 
                  create your own challenge and submit it 
                  to the Versuz team, if your challenge is 
                  creative enough you’ll get a chance to win 
                  exciting gifts (
                    <Text style={{ fontWeight: 'bold' }}>worth $100 or more</Text>
                  ) and your challenge will be shared on the 
                  Versuz for others to accept
                </Text>
                <Pressable
                  style={styles.termsWrapper}
                  onPress={() => Linking.openURL('https://versuz.app/terms-of-use.html')}>
                  <Text style={styles.terms}>Terms &amp; Conditions</Text>
                </Pressable>
                <View style={styles.termsFlex}>
                  <Pressable 
                    style={[ 
                      styles.tick,
                      createChallengeStore.termsError && { borderColor: colors.SUNSET_ORANGE },
                      createChallengeStore.termsAgreement && { backgroundColor: colors.WHITE }
                    ]}
                    onPress={() => createChallengeStore.set('termsAgreement', !createChallengeStore.termsAgreement)}>
                      <Image source={ICONS['check']}/>
                  </Pressable>
                  <View>
                    <Text style={[
                      styles.p, 
                      { paddingTop: 0, paddingBottom: 4}
                    ]}>
                      Have read and agree to the above terms and conditions
                    </Text>
                    { createChallengeStore.termsError && 
                      <Text style={[
                        styles.p, 
                        { color: colors.SUNSET_ORANGE, paddingTop: 0}
                      ]}>
                        Please agree to the terms and conditions to continue
                      </Text>
                    }
                  </View>
                </View>

                <View style={styles.buttonWrap}>
                  <Button
                    height={50}
                    width={162}
                    onPress={() => continueCreating()}
                    >CONTINUE</Button>
                </View>
                <View style={styles.buttonWrap}>
                  <Link
                    center
                    onPress={props.onRequestClose}
                    >CANCEL</Link>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </ScrollView>
      </View> 
    </Modal>
  )
}

export default inject('store')(observer(AddChallengeModalIntro))

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 70,
    backgroundColor: colors.MINE_SHAFT,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  content: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 35
  },
  p: {
    color: colors.WHITE,
    fontSize: 15,
    padding: 16,
    lineHeight: 22
  },
  disclaimer: {
    backgroundColor: colors.TUNDORA,
    borderRadius: 4
  },
  termsWrapper: { 
    alignSelf: 'flex-start', 
    paddingLeft: 5 
  },
  terms: {
    fontWeight: 'bold',
    color: colors.MARINER,
    textDecorationLine: 'underline',
    paddingTop: 16,
    paddingBottom: 16
  },
  termsFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 16
  },
  tick: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.WHITE,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24
  },
  buttonWrap: {
    padding: 20
  }
})