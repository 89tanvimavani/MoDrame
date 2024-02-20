import React, { useRef, useEffect } from 'react'
import {
  View, 
  StyleSheet
} from 'react-native'
import Select from '../select/Select'
import Text from '../typography/Text'
import {COUNTRYCODES} from '../../data/areacodes'
import { WIDTH } from '../../constants/mesures'
import colors from '../../constants/colors'

const CountryPicker = (props) => {
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
  })

  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>COUNTRY</Text>
      <Select
        countryPicker
        height={35}
        fontSize={16}
        width={WIDTH/3}
        onChange={e => { 
          if (!firstRender.current) props.onCountryChange(e)
        }}
        options={COUNTRYCODES}
        value={props.country ? props.country : null}
      />
    </View>
  )
}

export default CountryPicker

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH - 64
  },
  inputLabel: {
    color: colors.DOVE_GRAY,
    fontSize: 14,
    width: "45%"
  }
})