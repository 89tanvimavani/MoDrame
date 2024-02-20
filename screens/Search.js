import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '../components/typography/Text'
import { inject, observer } from 'mobx-react'
import colors from '../constants/colors'
import PostTile from '../components/post-tile/PostTile'
import Input from '../components/input/Input'
import User from '../components/search-components/User'
import { useIsFocused } from '@react-navigation/native'
import EmptyPlaceholder from '../components/placeholders/EmptyPlaceholder'
import Loading from '../components/placeholders/Loading'

const Search = (props) => {
  const { searchStore } = props.store

  const isFocused = useIsFocused()
  const insets = useSafeAreaInsets()

  const [ refreshing, setRefreshing ] = useState(false)

  useEffect(() => {
    if (isFocused) {
      searchStore.set("searchQuery", "")
      searchStore.set('dramas', [])
      searchStore.getWinningDramas()
    }
  }, [isFocused])

  function onRefresh() {
    setRefreshing(true)
    searchStore.getWinningDramas(true)
      .then(() => {
        setRefreshing(false)
      })
  }

  function search() {
    if (searchStore.searchQuery?.length !== 0)
      searchStore.search()
  }

  function userPress(userId) {
    props.navigation.navigate('PublicProfile', {
      userId
    })
  }

  function openDrama(drama) {
    props.navigation.navigate('SinglePost', { dramaId: drama.id })
  }
  
  return (
    <View style={{...styles.wrapper, paddingTop: insets.top }}>
      <View style={styles.search}>
        <Input
          label="SEARCH"
          placeholder="Search for people"
          onChangeText={a => {
            searchStore.set('searchQuery', a)
            search()
          }}
          searchBar
          fontColor={colors.DUSTY_GRAY}
          query={searchStore.searchQuery?.length !== 0}
          clearSearch={() => searchStore.set('searchQuery', '') }
          value={searchStore.searchQuery}
          autoCapitalize="none"/>
        { searchStore.searchQuery?.length !== 0 && 
          <View>
            <ScrollView 
              style={styles.results}
              scrollEnabled={true}
              contentContainerStyle={{ flexGrow: 1 }}>
              { searchStore.users?.length > 0 ?
                searchStore.users?.map(user => (
                    <User 
                      key={user.id}
                      avatar={user.avatar?.url}
                      handle={user.handle}
                      name={user.name}
                      onProfile={() => userPress(user.id)}
                    />
                )) :
                searchStore.searchQuery?.length !== 0 && !searchStore.searchLoading && 
                  <Text style={styles.text}>No results found</Text> 
              }
            </ScrollView> 
          </View> 
        }
      </View>
      <Text style={styles.title}>Winners of this month</Text>
      { searchStore.dramas.length !== 0 ?
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap' }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.LIGHTNING_YELLOW}
            />
          }
          style={styles.winningDramas}>
          { searchStore.dramas?.map(drama => (
              <PostTile 
                winnersPage
                key={drama.id}
                id={drama.id}
                frame={drama.frame}
                topFrame={drama.user?.topFrame}
                bottomFrame={drama.user?.bottomFrame}
                gif={drama.video.gif}
                thumbnail={drama.video?.thumbnail}
                winner={drama.winner}
                views={drama.formattedViews}
                onPress={() => openDrama(drama)}
              />
            ))}
        </ScrollView> :
        searchStore.loading ? 
          <View style={styles.row}>
            <Loading height={300} iconOnly/>
          </View>
        :
          <View style={styles.emptyWrapper}>
            <EmptyPlaceholder 
              title="There aren't any winning dramas for this month yet."
              underline
            /> 
          </View>
    }
    </View>
  )
}

export default inject('store')(observer(Search))

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  search: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 50,
    zIndex: 3
  },
  results: {
    position: 'absolute',
    width: "100%",
    maxHeight: 300,
    backgroundColor: colors.COD_SHAFT,
    zIndex: 5
  },
  text: {
    paddingLeft: 10,
    fontSize: 21,
    color: colors.WHITE,
    fontWeight: 'bold',
    color: colors.DUSTY_GRAY,
    textAlign: 'center',
    margin: 20
  },
  searchText: {
    paddingLeft: 10,
    color: colors.DOVE_GRAY,
  },
  title: {
    padding: 15,
    paddingBottom: 5,
    paddingTop: 30,
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '600'
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  winningDramas: {
    marginLeft: 7
  },
  emptyWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: 15
  },
})