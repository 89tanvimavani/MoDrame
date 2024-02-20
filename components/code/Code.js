import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Pressable
} from 'react-native'
import colors from '../../constants/colors'
import { useEffect } from 'react'
import { ICONS } from '../../constants/images'
import Text from '../typography/Text'
import { textStyles } from '../../styles-main/texts'
import OTPInputView from '@twotalltotems/react-native-otp-input'

const Code = (props) => {
  const [ clearInput, setClearInput ] = useState(false)
  const [code, setCode] = useState('')
  const [ resent, setResent ] = useState(false)

  function runOnChange() {
    props.onChange(code.split(''))
  }

  useEffect(() => {
    if (code.length === 6) runOnChange()
  }, [code])

  function resend() {
    if (resent) return
    reset()
    props.resend()
    setResent(true)
    setTimeout(() => {
      setResent(false)
    }, 20000)
  }

  function reset() {
    setCode('')
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={textStyles.inputLabel}>VERIFICATION CODE</Text>
        <View style={styles.inputWrap}>
          <OTPInputView 
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            style={styles.input}
            clearInputs={clearInput}
            pinCount={6} 
            onCodeChanged={val => setCode(val)}/>
        </View>
        { props.error && 
          <Text style={[textStyles.inputError, {textAlign: 'center'}]}>
            {props.error}
          </Text>
        }
      </View>
      <Pressable 
        onPress={resend} 
        style={[
          styles.resend, 
          resent && { opacity: .2 }
        ]}>
        <Image 
          style={[
            styles.resendIcon,
            { tintColor: colors.WHITE }
          ]} 
          source={ICONS['retake']}/>
        <Text 
          style={[
            styles.resendText,
            { color: colors.WHITE }
          ]}>{resent ? 'Code resent' : 'Resend'}</Text>
      </Pressable>
    </View>
  )
}

export default Code

const styles = StyleSheet.create({
  wrapper: {

  },
  inputWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    height: 100,
    marginTop: 2
  },
  label: {
    color: colors.WHITE
  },  
  input: {
    zIndex: 1,
  },
  underlineStyleBase: {
    borderRadius: 8,
    height: 60,
    backgroundColor: colors.SCORPION,
    borderWidth: 1,
    borderColor: colors.DUSTY_GRAY,
    textAlign: 'center',
    fontSize: 32,
    margin: 4,
    fontWeight: 'bold',
    color: colors.WHITE,
  },
  underlineStyleHighLighted: {
    borderColor: colors.LIGHTNING_YELLOW,
  },
  row: {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    width: 270,
  },
  resend: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16
  },
  resendText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.WHITE,
    marginLeft: 8,
    marginBottom: -4
  }
})