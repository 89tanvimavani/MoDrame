import React, { useState, useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  View,
  StyleSheet,
  Image,
  Linking,
  Pressable,
  RefreshControl
} from 'react-native'
import { inject, observer } from 'mobx-react'
import colors from '../constants/colors'
import { useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native'
import ProfileAvatar from '../components/avatar/ProfileAvatar'
import Text from '../components/typography/Text'
import { WIDTH } from '../constants/mesures'
import Loading from '../components/placeholders/Loading'
import { ICONS } from '../constants/images'
import Button from '../components/button/Button'
import ChannelPost from '../components/channel/ChannelPost'
import TransparentButton from '../components/button/TransparentButton'
import FyiCard from '../components/fyi-card/FyiCard'
import { FlashList } from "@shopify/flash-list";

const Channel = props => {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()  

  const { channelStore, reactionStore, accountStore } = props.store

  const [ refreshing, setRefreshing ] = useState(false)
  const [ hideCard, setHideCard ] = useState(false)

  let channelId = props.route?.params?.channelId

  useEffect(() => {
    if (isFocused && channelId) {
      channelStore.set('loading', true)
      channelStore.setChannel(channelId).then(
        res => channelStore.getPosts(true)
      )
    }
  }, [])

  function openPost(post) {
    props.navigation.navigate('ChannelList', { postId: post })
  }

  function updateBio() {
    props.navigation.navigate('UpdateBioChannel')
  }

  function updateWebpage() {
    props.navigation.navigate('UpdateWebsiteChannel')
  }

  function uploadVideo() {
    props.navigation.navigate('UploadChannelPost')
  }

  function follow() {
    channelStore.follow()
  }

  const react = useCallback(
    (reactionType, add, dramaId) => {
      reactionStore.createReaction(
        reactionType,
        dramaId,
        add).then(res => channelStore.updateFlatListData())
      }, [])

  function onRefresh() {
    setRefreshing(true)
    channelStore.getPosts(true)
      .then(() => {
        setRefreshing(false)
      })
  }

  function onEndReached() {
    if (channelStore.empty && channelStore.loading && 
      channelStore.channel.dramas.length !== 0) return null
    channelStore.nextPage()
  }

  function openLink() {
    let url = channelStore?.channel?.websiteLink
    if (!(url.includes('https://') ||  url.includes('http://'))) 
      url = 'https://'.concat(url)
    
    Linking.openURL(url)
           .catch(err => { alert('Oops, failed to open page!') })
  }

  const listEmptyComponent = (loading) => {
    return (!channelStore.loading ?
      !channelStore.channel?.mine ? 
        <View style={styles.emptyWrapper}>
          <Text style={styles.description}>This channel has no posts.</Text>
        </View> :
        <View style={styles.emptyWrapper}>
          <Image source={ICONS['upload-icon']}/>
          <Text style={styles.description}>Start uploading your videos here to grow your followers and get reactions.</Text>
          <Button
            onPress={() => uploadVideo()}
            height={49}
            width={188}
            center
            fontSize={14}>
            UPLOAD VIDEO
          </Button>
        </View> : null
    )}

  const renderItem = ({ item, index }) => {
    return <View 
      style={styles.dramas}
      key={index}>
      <ChannelPost
        key={index}
        item={item}
        id={item?.id}
        uri={item?.video?.src}
        poster={item?.video?.poster}
        description={item?.description}
        reactionTypes={item?.reactionTypes}
        reactions={item?.reactions}
        reactionNumber={item?.numberOfReactions}
        views={item?.views}
        gif={item?.video?.gif}
        reactionId={item?.reactionId}
        react={react}
        onPress={() => openPost(index)}
      />
    </View>
  }
  
  if (!channelStore.channel) return null
  return (
    <>
      <>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TransparentButton
            onlyIconButton
            icon={ICONS['back-channel']}
            onPress={() => props.navigation.goBack()}
          />
        </View>

        <View style={styles.profileHead}>
          <View style={styles.avatarSection}>
            <View>
              <ProfileAvatar
                src={channelStore?.channel?.user?.avatar?.url}
              />
              { channelStore?.channel?.user?.country ?
                <View style={styles.flagPosition}>
                  <Image 
                    style={styles.image}
                    source={{uri: channelStore?.channel?.user?.countryLink}}/> 
                </View>  : null
              }
            </View>
            <View style={{marginLeft: 27}}>
              <Text style={styles.name}>{channelStore?.channel?.name}</Text>
              <Text style={styles.handle}>@{channelStore?.channel?.user?.handle}</Text>
              { channelStore?.channel?.mine ? 
                <Text style={styles.followers}>
                  {channelStore?.channel?.channelFollowers} Followers
                </Text> :
                channelStore.channel?.isFollowing ? 
                  <Button
                    onPress={() => follow()}
                    height={24}
                    width={90}
                    color={colors.GOLDEN_GRASS}
                    borderColor={colors.GOLDEN_GRASS}
                    fontWeight='bold'
                    backgroundColor={colors.TRANSPARENT}
                    fontSize={12}>FOLLOWING</Button> :
                  <Button
                    onPress={() => follow()}
                    height={24}
                    width={75}
                    fontSize={12}>FOLLOW</Button>
              }
            </View>
          </View>
          { channelStore.channel?.description || channelStore.channel?.websiteLink || 
            channelStore.mine ?
            <View style={styles.stats}>
              <View style={styles.inline}>
                { channelStore?.channel?.description ?
                  <Text style={styles.bio}>{channelStore?.channel?.description}</Text> :
                  channelStore.channel?.mine ?
                  <Text style={[styles.bio, styles.underlined]}>
                    Add channel description here
                  </Text> : null
                }
                { channelStore.mine ? 
                  <TransparentButton 
                    onlyIconButton icon={ICONS['edit']} 
                    onPress={() => updateBio()}/> : null }
              </View>
              { channelStore.mine && !channelStore.channel?.description && !hideCard && 
                <FyiCard 
                  text="Adding a description about your channel helps your followers learn about the type
                  of content you create, you can also use this space to add links to your personal website,
                  and other social media platforms."
                  onClose={() => setHideCard(true)}/> 
              }
              <View style={styles.inline}>
                { channelStore?.channel?.websiteLink ?
                  <Pressable onPress={() => openLink()}>
                    <Text style={styles.website} numberOfLines={1}>
                      {channelStore?.channel?.websiteLink}
                    </Text>
                  </Pressable> :
                  channelStore.channel?.mine ?
                  <Text style={[styles.bio, styles.underlined]}>
                    Add channel website here</Text> 
                  : null
                }
                { channelStore.mine ? 
                  <TransparentButton 
                    onlyIconButton icon={ICONS['edit']} 
                    onPress={() => updateWebpage()}/> : null }
              </View>
            </View> : null 
          }
        </View>
        <FlashList
          estimatedItemSize={157}
          scrollIndicatorInsets={{ right: 1 }}
          showsVerticalScrollIndicator={false}
          data={channelStore.channel?.dramas.slice()}
          ListEmptyComponent={listEmptyComponent(channelStore.loading)}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={3}
          extraData={{
            update: channelStore.update
          }}
          ItemSeparatorComponent={() => (
            <View style={{ height: 15 }} />
          )}
          ListFooterComponent={() => (
            channelStore.loading && 
            channelStore.channel?.dramas.length !== channelStore.postsLength ? 
            <Loading iconOnly/> : 
            <View style={{ height: 15 }} />
          )}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.LIGHTNING_YELLOW}
            />
          }
        />
        { channelStore.mine && channelStore.channel.dramas.length !== 0 ?
          <View style={styles.floatingButton}>
            <TransparentButton
              width={59}
              height={59}
              onlyIconButton
              onPress={() => uploadVideo()}
              icon={ICONS['channel-post']}/>
          </View> : null }
      </>
    </>
)}

export default inject('store')(observer(Channel))

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'row',
    width: WIDTH - 30
  },
  profileHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
    paddingTop: 20
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.WHITE
  },
  handle: {
    fontSize: 16,
    color: colors.SCORPION,
    marginTop: 8,
    marginBottom: 16
  },
  followers: {
    fontSize: 16,
    color: colors.SCORPION,
    fontWeight: 'bold'
  },
  stats: {
    display: 'flex',
    alignItems: 'flex-start',
    width: WIDTH - 30,
    borderColor: colors.SCORPION,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'space-around',
    marginTop: 18,
    paddingTop: 10,
    paddingBottom: 10
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    width: WIDTH - 30,
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  bio: {
    color: colors.WHITE,
    fontSize: 14,
    maxWidth: WIDTH - 30 - 50,
    marginBottom: 8,
    lineHeight: 24
  },
  underlined: {
    textDecorationLine: 'underline'
  },
  website: {
    color: colors.MARINER,
    fontSize: 15,
    maxWidth: WIDTH - 30 - 50,
    overflow: 'hidden'
  },
  description: {
    maxWidth: 260,
    paddingTop: 16,
    paddingBottom: 32,
    fontSize: 15,
    lineHeight: 22,
    color: colors.GRAY
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16
  },
  emptyWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: 50
  },
  flagPosition: {
    position: 'absolute',
    top: 85,
    left: 70
  },
  dramas: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  image: {
    height: 22.5, 
    width: 30
  }
})