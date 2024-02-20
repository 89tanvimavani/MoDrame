import React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import { HEIGHT, WIDTH } from '../../constants/mesures'
import EmptyPlaceholder from './EmptyPlaceholder'
import Loading from './Loading';

const EmptyPost = (props) => {
  return (
    <View style={styles.wrapper}>
      {props.loading ?
        <Loading />
        :
        <EmptyPlaceholder 
          title="Could not load feed"
          description="Pull down to refresh"
        />
      }
    </View>
  )
}

export default EmptyPost

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: HEIGHT, 
    width: WIDTH
  }
})