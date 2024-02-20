import React, { useState } from 'react'
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native'
import PostTile from '../components/post-tile/PostTile'
import colors from '../constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { inject, observer } from 'mobx-react'
import { ICONS } from '../constants/images'
import TransparentButton from '../components/button/TransparentButton'
import { FlashList } from '@shopify/flash-list'

const Dramas = (props) => {
  const [ refreshing, setRefreshing ] = useState(false)
  const insets = useSafeAreaInsets()

  const store = props.route?.params?.store

  function onEndReached() {
    if (store.empty) return null
    if (store.loading) return null
    store.nextPage()
  }

  function onRefresh() {
    setRefreshing(true)
    store.getDramas(true)
  }

  function openDrama(drama) {
    props.navigation.navigate('Drama', { dramaId: drama.id })
  }

  const listEmptyComponent = () => (
    <View style={{ paddingTop: 70 + insets.top }}/>
  )

  const renderItem = ({ item }) => (
    <PostTile 
      gif={item.video.gif}
      thumbnail={item.video.thumbnail}
      frame={item.frame}
      topFrame={item.user?.topFrame}
      bottomFrame={item.user?.bottomFrame}
      winner={item.winner}
      onPress={() => openDrama(item)}
      views={item.formattedViews}
    />
  )

  return (
    <View style={styles.wrapper}>
      <View style={[
        styles.header,
        {
          paddingTop: insets.top,
          height: 70 + insets.top
        }
      ]}>
        <TransparentButton
          onlyIconButton
          icon={ICONS['backarrow']}
          onPress={() => props.navigation.goBack()}
        />
      </View>
      
      <FlashList 
        scrollIndicatorInsets={{ right: 1 }}
        data={store.dramas.slice()}
        estimatedItemSize={WIDTH/3*1.56}
        contentContainerStyle={styles.dramas}
        ListHeaderComponent={listEmptyComponent}
        keyExtractor={item => `${item.id}`}
        numColumns={3}
        renderItem={renderItem}
        onEndReached={onEndReached}
        ListFooterComponent={() => <View style={styles.footer}/>}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.LIGHTNING_YELLOW}
          />
        }
        extraData={{
          length: store.dramas.length,
        }}
      />
    </View>
  )
}

export default inject('store')(observer(Dramas))

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative'
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.79)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'center'
  },
  footer: { 
    height: 50 
  }
})