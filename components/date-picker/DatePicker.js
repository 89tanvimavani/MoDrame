import React, { useState } from 'react'
import { StyleSheet, Pressable, Text } from 'react-native'
import DatePicker from 'react-native-date-picker'
import colors from '../../constants/colors'
import { textStyles } from '../../styles-main/texts'
import TransparentButton from '../button/TransparentButton'
import { ICONS } from '../../constants/images'

const DatePicker_ = props => {
  const [date, setDate] = useState(props.date ? new Date(props.date) : new Date())

  const confirmDate = (date) => {
    setDate(date)
    props.confirmDate(date)
  }

  const deleteDate = () => {
    setDate(new Date())
    props.confirmDate('')
  }

  return (
    <>
      { props.showInput ?
        <>
        <Text style={textStyles.inputLabel}>{props.label}</Text>
        <Pressable 
          onPress={() => props.openDatePicker()}
          style={styles.wrapper}>
          <Text
            style={{
              ...styles.text,
              color: props.date ? colors.WHITE : colors.GRAY
            }}>
              {`${date?.getDate()?.toString()} ${(date?.toLocaleString('default', { month: 'long' }))}  ${date?.getFullYear()?.toString()}`}
          </Text>
          { props.date && props.enableDelete ? 
            <TransparentButton
              onlyIconButton
              icon={ICONS['close']}
              onPress={deleteDate}
            /> 
          : null }
        </Pressable>
        </> 
      : null }
      <DatePicker
          modal
          maximumDate={new Date()}
          mode="date"
          open={props.open}
          date={date}
          onConfirm={confirmDate}
          onCancel={() => {
            props.closeDatePicker()
          }}
        />
      { props.info && !props.error && !props.loading && 
        <Text style={textStyles.inputInfo}>{props.info}</Text> }
    </>
  )
}

export default DatePicker_

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.WHITE,
    borderBottomWidth: 1,
    paddingBottom: 12,
    paddingTop: 8
  },

})