import React from 'react'
import { ScrollView, StyleSheet, View, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '../components/typography/Text'
import colors from '../constants/colors'
import GifPreview from '../components/video/GifPreview'
import Button from '../components/button/Button'
import { BADGES } from '../constants/images'
import { HEIGHT } from '../constants/mesures'


const RewardClaimed = (props) => {
  const insets = useSafeAreaInsets()

  const { drama } = props.route.params

  function goHome() {
    props.navigation.navigate('HOME')
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ minHeight: HEIGHT }}
    >
      <View 
        style={[
          styles.wrapper,
          {
            paddingTop: insets.top + 100,
            paddingBottom: insets.bottom + 40,
          }
        ]}
      >
        <View style={styles.inner}>
          <View style={styles.previewWrap}>
            <View style={styles.winner}>
              <Image 
                source={BADGES['big-winner']}/>
            </View>
            <GifPreview 
              gif={drama?.video?.gif}
              noIcon
            />
          </View>
          <Text style={styles.title}>
            Reward claimed!
          </Text>
          <Text style={styles.description}>
            We will send the reward towards you in next days. Thank you for taking a part in Challenge. You are awesome.
          </Text>
        </View>

        <View style={styles.buttons}>
          <Button
            width={151}
            onPress={() => goHome()}>
            Close
          </Button>
        </View>
      </View>
    </ScrollView>
  )
}

export default RewardClaimed

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  winner: {
    position: 'absolute',
    top: -35,
    left: -35,
    zIndex: 1
  },
  container: {
    display: 'flex'
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 32,
    paddingRight: 32
  }, 
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.CANDLELIGHT,
    marginBottom: 20
  },
  description: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.WHITE,
    maxWidth: 300
  },
  buttons: {
    marginTop: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewWrap: {
    position: 'relative',
    marginBottom: 40,
  },
  inner: {
    display: 'flex',
    alignItems: 'center'
  }
})