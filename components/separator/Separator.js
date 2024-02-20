import React from 'react'
import { View } from 'react-native'

const Separator = (props) => {
  return (
    <View
    style={[
      {
        width: props.width,
        height: props.height
      },
      props.style
    ]}
    />
  )
}

export default Separator 

Separator.defaultProps = {
  height: 0,
  width: 0,
  style: {}
}