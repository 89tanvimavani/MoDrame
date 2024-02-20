import React from 'react'
import { Text as T } from 'react-native'
import { PRIMARY_FONT, PRIMARY_FONT_BOLD, PRIMARY_FONT_ITALIC } from '../../constants/constants'

const Text = (props) => {
  function getFontFamily() {
    if (props.style?.fontWeight === 'bold' || props.style?.fontWeight === '600')
      return PRIMARY_FONT_BOLD
    if (props.style?.fontStyle === 'italic')
      return PRIMARY_FONT_ITALIC
    return PRIMARY_FONT
  }

  return (
    <T 
      {...props}
      style={[
        { fontFamily: getFontFamily() },
        props.style
      ]}
    >
      {props.children}
    </T>
  )
}

export default Text