import { Picker, PickerIOS } from '@react-native-picker/picker'
import React, { useState, useEffect, useRef } from 'react'
import { Pressable, StyleSheet, View, Platform } from 'react-native'
import Text from '../typography/Text'
import Modal from '../modal/Modal';
import colors, { BACKGROUND_COLOR } from '../../constants/colors';
import find from 'lodash/find'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TransparentButton from '../button/TransparentButton';
import { WIDTH } from '../../constants/mesures';
import { ICONS } from '../../constants/images';

const Select = props => {
  const pickerRef = useRef()
  const insets = useSafeAreaInsets()

  const [ open, setOpen ] = useState(false)

  useEffect(() => {
    if (props.options?.length > 0 && !props.value && Platform.OS === 'android') {
      props.onChange(props.options[0].value)
    }
  }, [props.options])

  useEffect(() => {
    if (open && !props.value && Platform.OS === 'ios' && props.options?.length > 0) {
      props.onChange(props.options[0].value)
    }
  }, [ open ])

  function getLabel() {
    if (!props.value) return props.placeholder
    else {
      const exists = find(props.options, opt => opt.value === props.value)
      if (exists) return exists.label
      else {
        return props.options[0].label
      }
    }
  }
  
  function openAndroidModal() {
    pickerRef.current.focus()
  }

  if (Platform.OS === 'android') {
    return (
      <View style={[
        !props.countryPicker && styles.container,
        {
          height: props.height,
          width: props.width
        },
        props.containerStyle
      ]}>
        <View style={[
          styles.wrapper,
          props.countryPicker && {
            borderWidth: 0
          }]}>
          <Text 
            numberOfLines={1}
            style={[
              styles.label,
              props.countryPicker && {left: 0}
            ]}>{getLabel()}</Text>
          {!props.disabled &&
            <Picker
              ref={pickerRef}
              selectedValue={props.value}
              onValueChange={props.onChange}
              disabled={props.disabled}
              dropdownIconColor={props.countryPicker ? BACKGROUND_COLOR : colors.WHITE }
              mode="dialog"
              style={[
                styles.wrapper, 
                styles.androidWrapper
              ]}
              placeholder={props.placeholder}
            >
              { props.options.map(opt => (
                  <Picker.Item 
                    key={opt.value} 
                    label={opt.label} 
                    value={opt.value}
                  />
                ))
              }
            </Picker>
          }
        </View>
        { props.countryPicker && 
          <View style={styles.picker}>
            <TransparentButton 
              onlyIconButton icon={ICONS['edit']} 
              onPress={() => openAndroidModal()}/> 
          </View>}
      </View>
    )
  }

  if (Platform.OS === 'ios')
    return (
      <View style={[
        styles.container,
        {
          height: props.height,
          width: props.width
        },
        props.containerStyle
      ]}>
        <View style={styles.flex}>
          <Pressable
            style={[
              styles.wrapper, 
              {
                height: props.height,
                width: props.width
              },
              props.countryPicker && styles.countryPicker
            ]}
            onPress={() => {
              if (!props.disabled && !props.countryPicker)
                setOpen(true)
            }}
          >
            <Text 
              numberOfLines={1}
              style={[
              styles.value,
              {
                marginTop: 0,
                textAlign: props.textAlign,
                fontSize: props.fontSize
              },
              !props.value && styles.placeholder
            ]}>{getLabel()}</Text>
          </Pressable>
          { props.countryPicker && 
            <TransparentButton 
              onlyIconButton icon={ICONS['edit']} 
              onPress={() => setOpen(true)}/> }
        </View>
        <Modal
          noMargin
          open={open}
          swipeDirection={null}
          onRequestClose={() => {
            setOpen(false)
          }}
        >
          <View style={styles.backdrop}>
            <Pressable style={styles.box}>
              <PickerIOS
                selectedValue={props.value}
                onValueChange={props.onChange}
                disabled={props.disabled}
                itemStyle={{
                  color: colors.WHITE
                }}
              >
                { props.options.map(opt => (
                    <Picker.Item 
                      key={opt.value} label={opt.label} 
                      value={opt.value} style={{ color: colors.WHITE }} />
                  ))
                }
              </PickerIOS>
            </Pressable>
            <View style={[
              styles.buttonSection,
              { paddingBottom: 20 + insets.bottom }
            ]}>
              <View>
                <Pressable
                  color={colors.WHITE}
                  backgroundColor={colors.BLACK}
                  onPress={() => setOpen(false)}
                  style={styles.button}
                >
                  <Text style={styles.text}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
}

Select.defaultProps = {
  textAlign: 'left',
  error: false,
  fontSize: 18.3,
}

export default Select

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    ...Platform.select({
      ios: {
        width: 64,
        minWidth: 64,
      },
      android: {
        padding: 0,
        marginBottom: -2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
    })
  },
  picker: {
    position: 'absolute',
    right: 15,
    top: 8
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    minWidth: 70,
    borderColor: colors.DUSTY_GRAY,
    height: 34,
    minHeight: 34,
    borderWidth: 1,
    borderRadius: 17,
    alignItems: 'stretch',
    paddingLeft: 10,
    ...Platform.select({
      ios: {
        paddingRight: 10,
        alignItems: 'center',
      }
    })
  },
  androidWrapper: {
    textAlign: 'center',
    fontSize: 20,
    color: colors.TRANSPARENT,
    minWidth: 85
  },
  label: {
    position: 'absolute',
    color: colors.WHITE,
    left: 10,
    paddingRight: 30
  },
  value: {
    fontWeight: 'bold',
    color: colors.WHITE
  },
  backdrop: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, .7)'
  },
  buttonSection: {
    paddingLeft: 32,
    paddingRight: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  box: {
  },
  button: {
    backgroundColor: colors.NAVY_BLUE,
    height: 52,
    width: WIDTH - 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16
  },
  text: {
    color: colors.WHITE,
    fontSize: 16
  },
  countryPicker: {
    borderWidth: 0,
    paddingLeft: 0,
    alignItems: 'flex-start'
  }
})