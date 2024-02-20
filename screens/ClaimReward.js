import { inject, observer } from 'mobx-react'
import React from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import Button from '../components/button/Button'
import Input from '../components/input/Input'
import KeyboardAvoidingScroll from '../components/layout/KeyboardAvoidingScroll'
import Text from '../components/typography/Text'
import { titleStyles } from '../styles-main/texts'

const ClaimReward = (props) => {
  const insets = useSafeAreaInsets()

  const {accountStore} = props.store
  const {challenge} = props.route.params

  function claimPrize() {
    accountStore.claimPrize(
      challenge.winningDrama.id
    ).then(res => {
      if (res.error) return
      props.navigation.navigate('RewardClaimed', { 
        drama: challenge.winningDrama 
      })
    })
  }

  function showToast() {
    Toast.show({
      type: 'info',
      text1: 'All data is required.',
      text2: `Please fill out all fields, we won't share your data with anyone.`
    })
  }

  return (
    <KeyboardAvoidingScroll>
      <View style={[styles.wrapper, 
      {
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom === 0 ? 20 : insets.bottom
      }]}>
        <Text style={titleStyles.title}>Claim your prize</Text>
        
        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <Input 
              placeholder="First and Last name"
              label="FIRST & LAST NAME"
              onChangeText={val => accountStore.set('name', val)}
              value={accountStore.name || ''}
            />
          </View>
          <View style={styles.inputWrap}>
            <Input 
              placeholder="Address"
              label="ADDRESS"
              onChangeText={val => accountStore.set('address', val)}
              value={accountStore.address || ''}
              info="Street, number, building"
            />
          </View>
          <View style={styles.inputWrap}>
            <Input 
              placeholder="City"
              label="CITY"
              onChangeText={val => accountStore.set('city', val)}
              value={accountStore.city || ''}
              info="We won't show this publicly"
            />
          </View>
          <View style={styles.inputWrap}>
            <Input 
              placeholder="State/Province"
              label="STATE/PROVINCE"
              onChangeText={val => accountStore.set('state', val)}
              value={accountStore.state || ''}
              info="We won't show this publicly"
            />
          </View>
          <View style={styles.inputWrap}>
            <Input 
              placeholder="Country"
              label="COUNTRY"
              onChangeText={val => accountStore.set('country', val)}
              value={accountStore.country || ''}
            />
          </View>
          <View style={styles.inputWrap}>
            <Input 
              placeholder="Post code"
              label="POST CODE"
              onChangeText={val => accountStore.set('post', val)}
              value={accountStore.post || ''}
            />
          </View>
          <View style={styles.inputWrap}>
            <Input 
              placeholder="Phone number"
              label="PHONE NUMBER"
              onChangeText={val => accountStore.set('phone', val)}
              value={accountStore.phone || ''}
              info="This is only shown to you."
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputWrap}>
            <Input 
              placeholder="Email"
              label="EMAIL"
              onChangeText={val => accountStore.set('email', val)}
              value={accountStore.email || ''}
              info="This is only shown to you."
              keyboardType="email-address" 
            />
          </View>
        </View>

        <View style={styles.buttons}>
          <Button
            center
            width={151}
            height={50}
            onPress={claimPrize}
            disabled={!accountStore.validRewardClaim}
            onDisabledPress={() => showToast()}
            loading={accountStore.loading}
          >Claim Prize</Button>
        </View>
      </View>
    </KeyboardAvoidingScroll>
  )
}

export default inject('store')(observer(ClaimReward))

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  inputWrap: {
    marginBottom: 15
  },
  form: {
    marginTop: 20
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  }
})