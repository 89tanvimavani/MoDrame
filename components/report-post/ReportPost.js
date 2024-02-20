import React, { memo } from 'react'
import {
  View, 
  StyleSheet
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from '../../constants/colors'
import Link from '../typography/Link'

const ReportPost = (props) => {
  const insets = useSafeAreaInsets()

  return (
    <>
      <View style={styles.wrapper}>
        <Link
          underline
          height={20}
          fontSize={14}
          onPress={props.onPress}
        >Report this Video</Link>
      </View>
    </>
  )
}

function propsAreEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default memo(ReportPost, propsAreEqual)

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.TRANSPARENT,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
})