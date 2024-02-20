import React from 'react'
import { View, StyleSheet } from 'react-native'
import { HEIGHT, WIDTH } from '../../constants/mesures'
import EmptyPlaceholder from './EmptyPlaceholder'
import Loading from './Loading'
import Button from '../../components/button/Button'

const EmptyList = (props) => {
  return (
    <View style={styles.wrapper}>
      {
        props.loading ? 
          <Loading /> 
        : 
          <>
            <EmptyPlaceholder 
              title={props.title}
              description={props.description}
              onPress={props.onPress}
            />
            { props.challenges &&
              <Button
                style={{marginTop: 30}}
                height={50}
                center
                width={WIDTH - 64}
                onPress={props.openModal}>CREATE MY FIRST CHALLENGE</Button>
            }
          </>
      }
    </View>
  )
}

export default EmptyList

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: HEIGHT - 200,
    width: WIDTH
  }
})  