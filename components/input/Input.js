import React, { useState, useEffect } from 'react'
import { TextInput, StyleSheet, View, ActivityIndicator, Image, Pressable, Text } from 'react-native'
import colors from '../../constants/colors'
import { textStyles } from '../../styles-main/texts'
import { ICONS } from '../../constants/images'
import { PRIMARY_FONT_LIGHT } from '../../constants/constants'

const Input = props => {
  const [ touched, setTouched ] = useState(false)
  const [ focused, setFocused ] = useState(false)

  function onFocus() {
    setTouched(true)
    setFocused(true)
  }

  function onBlur() {
    setFocused(false)
  }

  useEffect(() => {
    if (props.submitted) setTouched(true)
    else setTouched(false)
  }, [props.submitted])

  return (
    <Pressable
      onPress={props.onPress}
    >
      <View style={[
        styles.labelWrap,
        props.searchBar && { display: 'none' }
      ]}>
        {props.label && (props.value !== '' || focused) &&
          <Text style={textStyles.inputLabel}>{props.label}</Text>
        }
        {props.required && (props.value !== '' || focused) &&
          <Text style={textStyles.required}> (required)</Text>
        }
      </View>
      { props.onPress || props.uneditable ?
        <Text 
          numberOfLines={1}
          style={[
            props.searchBar ? styles.newInput : styles.input,
            props.searchBar && { paddingLeft: 35, paddingRight: 40 },
            {
            borderBottomWidth: props.borderBottomWidth,
            maxWidth: props.maxWidth
          }]}>
          {props.value}
        </Text> :
        <>
          { props.searchBar && 
            <Image style={styles.leftImage} source={ICONS['search']}/> }
          <TextInput 
            {...props}
            placeholder={props.label && focused ? '' : props.placeholder}
            style={[
              props.searchBar ? styles.newInput : styles.input,
              props.searchBar && { paddingLeft: 35, paddingRight: 40 },
              props.value && props.value !== '' && !props.searchBar ,
              {
                borderBottomWidth: props.borderBottomWidth,
                maxWidth: props.maxWidth,
                marginBottom: props.bottomMargin,
                borderColor: props.fontColor ? props.fontColor : colors.WHITE,
                color: props.fontColor ? props.fontColor : colors.WHITE
              }
            ]}
            autoCapitalize='none'
            autoCorrect={false}
            multiline={props.multiLine}
            placeholderTextColor={props.fontColor ? props.fontColor : colors.WHITE}
            caretHidden={false}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {props.searchBar && props.query && 
            <Pressable
              style={styles.image} 
              onPress={props.clearSearch}>
              <Image source={ICONS['close-search']}/>
            </Pressable>
          }
        </>
      }
      
      { props.info && !props.error && !props.loading && 
        <Text style={textStyles.inputInfo}>{props.info}</Text> }
      { props.error && touched && !props.loading && 
        <Text style={textStyles.inputError}>{props.error}</Text> }
      { props.loading && 
        <View style={styles.infoLoading}>
          <ActivityIndicator
            color={colors.SCORPION}
          />
          <Text style={[
            textStyles.inputInfo, 
            { marginLeft: 5 }
          ]}>Verifying...</Text>
        </View>
      }

      </Pressable>
  )
}

export default Input

Input.defaultProps = {
  borderBottomWidth: 1,
  paddingLeft: 0
}


const styles = StyleSheet.create({
  input: {
    paddingTop: 3,
    fontFamily: PRIMARY_FONT_LIGHT,
    fontSize: 16,
    overflow: 'hidden',
    margin: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: 0,
    paddingBottom: 12,
    marginBottom: 5
  },
  newInput: {
    paddingTop: 3,
    fontSize: 16,
    ...Platform.select({
      ios: {
        paddingBottom: 6
      },
      android: {
        paddingBottom: 2
      }
    })
  },
  labelWrap: {
    height: 16,
    display: 'flex',
    flexDirection: 'row'
  },
  infoLoading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    position: 'absolute',
    bottom: 7,
    right: 7,
    zIndex: 2000
  },
  leftImage: {
    position: 'absolute',
    bottom: 7,
    left: 7,
    zIndex: 2000
  }
})